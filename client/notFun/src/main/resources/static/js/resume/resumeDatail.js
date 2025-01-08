// 전역함수 선언
let resumeData = {};
let careerInfoData = {};
let resumeDaysTimeData = {};
let resumeJobTypeListData = {};
let resumeWorkTypeData = {};

// 경력 변환
const formatCareer = (totalCareer) => {
  if (!totalCareer || totalCareer <= 0) return "신입";
  const totalMonths = Math.floor(totalCareer / 30);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if(!years) return "1개월 미만";
  return `${years ? `${years}년 ` : ""}${months ? `${months}개월` : ""}`.trim();
};

// 시간 변환
const formatTime = (dateString) => {
  if (!dateString) return "수정된 적 없음";
  const diff = Math.floor((new Date() - new Date(dateString)) / 1000 / 60);
  return diff < 60
    ? `${diff}분 전`
    : diff < 1440
    ? `${Math.floor(diff / 60)}시간 전`
    : dateString;
};

// 숫자를 천 단위마다 콤마를 찍는 함수
const formatSalaryAmount = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 급여 변환
const formatSalary = (salaryNo, salaryAmount, salaryName = "") => {
  const formattedAmount = formatSalaryAmount(salaryAmount);

  if (salaryNo === 1 || salaryNo === 2) {
    return `${salaryName} ${formattedAmount} 원`;
  } else if (salaryNo === 3 || salaryNo === 4) {
    return `${salaryName}`;
  } else {
    return "급여 정보 없음";
  }
};


// UI 업데이트 함수
const updateUI = ( resume, careerInfo,resumeDaysTime,resumeJobTypeList,resumeWorkType ) => {

  const writetime = resume.modificationDate ? resume.modificationDate : resume.registrationDate;
  document.getElementById("writetime").innerHTML = `${formatTime(writetime)}`;  

  const resumeTitle = resume.resumeTitle; // 서버에서 가져온 제목
  document.getElementById("resumeTitle").innerHTML = `제목 : ${resumeTitle}`;

  const profileImg = resume.profileImg; // 서버에서 가져온 이미지경로
  document.getElementById("profileImg").src = profileImg;

  const workerBirthDate = resume.workerBirthDate; // 서버에서 가져온 근무자 생년
  const age = resume.age; // 서버에서 가져온 나이
  document.getElementById("workerBirthDate").innerHTML = `${workerBirthDate}년 (만 ${age}세)`;
  
  const memberName = resume.memberName; // 서버에서 가져온 회원 이름
  document.getElementById("memberName").innerHTML = memberName;
  
  const memberTel = resume.memberTel; // 서버에서 가져온 휴대폰 번호
  document.getElementById("memberTel").innerHTML = memberTel;
  
  const workerMbti = resume.workerMbti; // 서버에서 가져온 MBTI
  document.getElementById("workerMbti").innerHTML = workerMbti;
  
  const memberEmail = resume.memberEmail; // 서버에서 가져온 이메일
  document.getElementById("memberEmail").innerHTML = memberEmail;
  
  const workerAddress = resume.workerAddress; // 서버에서 가져온 주소
  document.getElementById("workerAddress").innerHTML = workerAddress;
  
  const gradeName = resume.gradeName; // 서버에서 가져온 학력 정보
  document.getElementById("gradeName").innerHTML = `학력 : ${gradeName}`;
  

  if (resume.totalCareer > 0) {
    // 경력 토글 부분 생성
    const careerSection = document.getElementById("career-section");
    const careerToggle = `
        <div class="career-toggle-exp">
            <div class="newbie">신입</div>
            <div class="exp">경력</div>
        </div>
    `;
    careerSection.insertAdjacentHTML("afterbegin", careerToggle); // 기존 구조 유지하며 추가

    // 경력 표시
    const content = `경력 : ${formatCareer(resume.totalCareer)}`;
    document.getElementById("content").innerHTML = content;

    // careerInfo 배열을 반복하여 테이블에 데이터 추가
    const careerTbody = document.getElementById("career-tbody");
    careerInfo.forEach((career) => {
        const row = document.createElement("tr");

        // 회사명
        const companyNameCell = document.createElement("td");
        companyNameCell.textContent = career.companyName;

        // 근무기간
        const periodCell = document.createElement("td");
        periodCell.innerHTML = `${career.startDate} ~ ${career.endDate}`;

        // 담당업무
        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = career.careerDescription;

        // 행에 데이터 추가
        row.appendChild(companyNameCell);
        row.appendChild(periodCell);
        row.appendChild(descriptionCell);

        // 테이블 본문에 행 추가
        careerTbody.appendChild(row);
    });
} else {
    // totalCareer가 0이거나 null인 경우 처리
    document.getElementById("career-section").innerHTML = `
        <div class="career-toggle-newbie">
            <div class="newbie">신입</div>
            <div class="exp">경력</div>
        </div>
        <h3>경력 : 신입</h3>
    `;
}

// 근무직종 배열
const workTypeList = document.getElementById("resumeWorkType");
resumeWorkType.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.workTypeCategory; // 텍스트 내용 설정
    span.classList.add("subitem"); // CSS 클래스 추가
    workTypeList.appendChild(span);
});

// 근무형태 배열
const JobTypeList = document.getElementById("resumeJobTypeList");
resumeJobTypeList.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item; // 텍스트 내용 설정
    span.classList.add("subitem"); // CSS 클래스 추가
    JobTypeList.appendChild(span);
});

// 근무기간
const periodName = resume.periodName;
document.getElementById("periodName").innerHTML = `${periodName}`;

// 근무요일 배열
const dayList = document.getElementById("dayList");
resumeDaysTime.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.daysName;
    span.classList.add("subitem");
    dayList.appendChild(span);
});

// 근무시간 배열
const timeList = document.getElementById("timeList");
resumeDaysTime.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item.timeName;
    span.classList.add("subitem");
    timeList.appendChild(span);
});

//급여
const salary = formatSalary(resume.salaryNo, resume.salaryAmount, resume.salaryName);
document.getElementById("salary").innerHTML = `${salary}`;

//자기소개
const resumeContent = resume.resumeContent;
document.getElementById("resumeContent").innerHTML = resumeContent;

};

// Fetch 요청
fetch("/resume/resumeDetaila", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ resumeNo: resumeNo }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("서버에서 받은 데이터:", data);

    // 데이터 분해
    const { resume, careerInfo,resumeDaysTime,resumeJobTypeList,resumeWorkType } = data;

    // 전역함수에 넣기
    resumeData = resume;
    careerInfoData = careerInfo;
    resumeDaysTimeData = resumeDaysTime;
    resumeJobTypeListData = resumeJobTypeList;
    resumeWorkTypeData = resumeWorkType;

    // UI 업데이트 호출
    updateUI( resume, careerInfo,resumeDaysTime,resumeJobTypeList,resumeWorkType );
  })
  .catch((error) => {
    console.error("요청 오류:", error);
  });





  document.addEventListener("click", (event) => {
    // 수정 버튼 클릭 이벤트
    if (event.target.id === "selfBtn") {
        if (confirm("자기소개를 수정하시겠습니까?")) {
            // 기존 내용 가져오기
            const content = resumeData.resumeContent
            // selfArea의 innerHTML 업데이트
            document.getElementById("selfArea").innerHTML = `
                <div id="selfArea">
                    <div class="edit">
                        <h2>자기소개</h2>
                        <button class="edit-btn" type="button" id="saveBtn">저장</button>
                        <button class="edit-btn" type="button" id="canselBtn">취소</button>
                    </div>
                    <section class="form-section">
                        <textarea class="selfInfo" id="updateContent" maxlength="1500">${content}</textarea>
                    </section>
                </div>
            `;
        }
    }

    // 저장 버튼 클릭 이벤트
    if (event.target.id === "saveBtn") {
      if (confirm("저장하시겠습니까?")) {
          const updatedContent = document.getElementById("updateContent").value;
          
          // 서버로 업데이트 요청
          fetch("/resume/updateContent", { // 서버 엔드포인트 URL
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  resumeNo: resumeNo, // 필요 시 resumeNo 추가
                  resumeContent: updatedContent, // 업데이트된 자기소개 내용
              }),
          })
              .then((response) => {
                  if (!response.ok) {
                      throw new Error("서버 응답 에러");
                  }
                  return response.json(); // 서버에서 반환된 JSON 데이터
              })
              .then((data) => {
                  // 성공적으로 저장 후 UI 업데이트
                  document.getElementById("selfArea").innerHTML = `
                      <div id="selfArea">
                          <div class="edit">
                              <h2>자기소개</h2>
                              <button class="edit-btn" type="button" id="selfBtn">Edit</button>
                          </div>
                          <section class="form-section">
                              <div id="resumeContent" style="white-space: pre-wrap;">${updatedContent}</div>
                          </section>
                      </div>
                  `;
  
                  // 성공 메시지 출력
                  alert(data.message);
              })
              .catch((error) => {
                  console.error("저장 중 오류 발생:", error);
                  alert(data.message);
              });
      }
  }
  
    // 취소 버튼 클릭 이벤트
    if (event.target.id === "canselBtn") {
        if (confirm("취소하시겠습니까?")) {
            // 원래 UI 복구
            const content = resumeData.resumeContent
            document.getElementById("selfArea").innerHTML = `
                <div id="selfArea">
                    <div class="edit">
                        <h2>자기소개</h2>
                        <button class="edit-btn" type="button" id="selfBtn">Edit</button>
                    </div>
                    <section class="form-section">
                        <div id="resumeContent" style="white-space: pre-wrap;">${content}</div>
                    </section>
                </div>
            `;
        }
    }
});



