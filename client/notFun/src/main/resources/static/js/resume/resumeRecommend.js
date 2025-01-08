// 전역함수 선언
let resumeData = {};
let recommendationsData= {};
let resumeDaysTimeData = {};
let resumeJobTypeListData = {};
let resumeWorkTypeData = {};
let workcondAddressTypeInfoData = {};

// 경력 변환
const formatCareer = (totalCareer) => {
  if (!totalCareer || totalCareer <= 0) return "신입";
  const totalMonths = Math.floor(totalCareer / 30);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
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
    : dateString.split(" ")[0]; // "2025-01-08 09:38:36" -> "2025-01-08"
};

const formatDeadline = (futureDateString) => {
  if (!futureDateString) return "마감 정보 없음";

  // 현재 시간과 입력된 미래 시간을 비교
  const now = new Date();
  const futureDate = new Date(futureDateString);

  // 남은 시간 계산 (분 단위)
  const diff = Math.floor((futureDate - now) / 1000 / 60);

  // 결과 반환
  if (diff < 0) {
    return "마감 완료"; // 미래 시간이 이미 지나갔을 경우
  } else if (diff < 60) {
    return `마감 ${diff}분 전`; // 60분 이내
  } else if (diff < 1440) {
    return `마감 ${Math.floor(diff / 60)}시간 전`; // 하루 이내
  } else {
    return futureDateString.split(" ")[0]; // "2025-01-08 09:38:36" -> "2025-01-08"
  }
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
const updateUI = ( resume,recommendations,resumeDaysTime,resumeJobTypeList,resumeWorkType,workcondAddressTypeInfo ) => {

// 부모 요소 선택
const recruitmentBody = document.getElementById('recruitmentbody');

// 기존 내용을 초기화
recruitmentBody.innerHTML = '';

// 빈 배열일 경우 메시지 생성
if (!recommendations || !Array.isArray(recommendations) || recommendations.length === 0) {
  const noDataRow = document.createElement('tr');
  noDataRow.innerHTML = '<td></td><th colspan="7">공고가 존재하지 않습니다.</th>';
  recruitmentBody.appendChild(noDataRow);
} else {
  // 배열 값 만큼 반복
  recommendations.forEach(recommendation => {
    const row = document.createElement('tr');

    // 각 열(td) 생성 및 데이터 추가
    row.innerHTML = `
      <td>${recommendation.recruitmentNo || '값 없음'}</td>
      <td>${recommendation.businessAddress || '값 없음'}</td>
      <td>
        <ul recruitmentNo="${recommendation.recruitmentNo || '값 없음'}" style="cursor: pointer;" 
            onclick="location.href='/recruitment/detail/${recommendation.recruitmentNo}'">
          <li>${recommendation.recruitmentTitle || '값 없음'}</li>
          <li>${recommendation.businessName || '값 없음'}</li>
        </ul>
      </td>
      <td>
        <span>${formatSalaryAmount(recommendation.salaryMount)+' 원' || '값 없음'}</span>
        <span>${recommendation.salaryName || '값 없음'}</span>
      </td>
      <td>${recommendation.timeName || '값 없음'}</td>
      <td>${formatTime(recommendation.writeDate) || '값 없음'}</td>
      <td>${formatDeadline(recommendation.recruitmentDeadline) || '값 없음'}</td>
    `;

    // 생성된 행을 부모 요소에 추가
    recruitmentBody.appendChild(row);
  });
}

const writetime = resume.modificationDate ? resume.modificationDate : resume.registrationDate;
document.getElementById("writetime").innerHTML = `${formatTime(writetime)}`;  

// 근무지역 배열
const workcondAddressTypeList = document.getElementById("workcondAddressTypeInfo");
workcondAddressTypeInfo.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item; // 텍스트 내용 설정
    if (index < workcondAddressTypeInfo.length - 1) {
        span.textContent += ", "; }
    workcondAddressTypeList.appendChild(span);
});

// 근무직종 배열
const workTypeList = document.getElementById("resumeWorkType");
resumeWorkType.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item.workTypeCategory; // 텍스트 내용 설정
    if (index < resumeWorkType.length - 1) {
      span.textContent += ", ";}
    workTypeList.appendChild(span);
});

// 근무형태 배열
const JobTypeList = document.getElementById("resumeJobTypeList");
resumeJobTypeList.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item; // 텍스트 내용 설정
    if (index < resumeJobTypeList.length - 1) {
      span.textContent += ", ";}
    JobTypeList.appendChild(span);
});

// 근무기간
const periodName = resume.periodName;
document.getElementById("periodName").innerHTML = `${periodName}`;

// 근무요일 배열
const dayList = document.getElementById("dayList");
resumeDaysTime.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item.daysName;
    if (index < resumeDaysTime.length - 1) {
      span.textContent += ", ";}
    dayList.appendChild(span);
});

// 근무시간 배열
const timeList = document.getElementById("timeList");
resumeDaysTime.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item.timeName;
    if (index < resumeDaysTime.length - 1) {
      span.textContent += ", ";}
    timeList.appendChild(span);
});

//급여
const salary = formatSalary(resume.salaryNo, resume.salaryAmount, resume.salaryName);
document.getElementById("salary").innerHTML = `${salary}`;

};

// Fetch 요청
fetch("/resume/resumeRecommenda", {
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
    const { resume,recommendations,resumeDaysTime,resumeJobTypeList,resumeWorkType,workcondAddressTypeInfo } = data;

    // 전역함수에 넣기
    resumeData = resume;
    recommendationsData = recommendations;
    resumeDaysTimeData = resumeDaysTime;
    resumeJobTypeListData = resumeJobTypeList;
    resumeWorkTypeData = resumeWorkType;
    workcondAddressTypeInfoData = workcondAddressTypeInfo;

    // UI 업데이트 호출
    updateUI( resume,recommendations,resumeDaysTime,resumeJobTypeList,resumeWorkType,workcondAddressTypeInfo );
  })
  .catch((error) => {
    console.error("요청 오류:", error);
  });



  let currentPage = 1; // 현재 페이지 번호 (기본값 1)
const limit = 10; // 한 페이지에 표시할 데이터 수

function fetchRecommendations(cp = 1) {
    const resumeNo = getResumeNoFromUrl(); // URL에서 resumeNo 추출

    fetch("/resume/resumeRecommenda", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeNo, cp, limit }),
    })
        .then((response) => response.json())
        .then((data) => {
            renderRecommendations(data.recommendations); // 데이터 렌더링
            renderPagination(data.totalPages, cp); // 페이지네이션 렌더링
        })
        .catch((error) => console.error("Error:", error));
}

function renderRecommendations(recommendations) {
    const container = document.getElementById("recommendationList");
    container.innerHTML = ""; // 기존 데이터 초기화

    recommendations.forEach((item) => {
        const div = document.createElement("div");
        div.textContent = `공고 제목: ${item.title}, 공고 ID: ${item.id}`;
        container.appendChild(div);
    });
}

function renderPagination(totalPages, currentPage) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // 기존 페이지네이션 초기화

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.disabled = i === currentPage; // 현재 페이지 비활성화
        button.addEventListener("click", () => fetchRecommendations(i));
        paginationContainer.appendChild(button);
    }
}

function getResumeNoFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("resumeNo");
}

// 초기 로드 시 첫 페이지 데이터 가져오기
window.onload = () => {
    fetchRecommendations(currentPage);
};
