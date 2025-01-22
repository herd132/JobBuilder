// 전역함수 선언
let resumeData = {};
let careerInfoData = {};
let resumeDaysTimeData = {};
let resumeJobTypeListData = {};
let resumeWorkTypeData = {};
let workcondAddressTypeInfoData = {};
let careerInfoList = [];

// 경력 변환
const formatCareer = (totalCareer, career) => {
  if (career == 0) return "신입";
  const totalMonths = Math.floor(totalCareer / 30);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (!years) return "1개월 미만";
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
const updateUI = (
  resume,
  careerInfo,
  resumeDaysTime,
  resumeJobTypeList,
  resumeWorkType,
  workcondAddressTypeInfo
) => {
  const writetime = resume.modificationDate
    ? resume.modificationDate
    : resume.registrationDate;
  document.getElementById("writetime").innerHTML = `${formatTime(writetime)}`;

  const resumeTitle = resume.resumeTitle; // 서버에서 가져온 제목
  document.getElementById("resumeTitle").innerHTML = `${resumeTitle}`;

  const profileImg = resume.profileImg; // 서버에서 가져온 이미지경로
  document.getElementById("profileImg").src = profileImg;

  const defaultProfileImg = "/images/user.png";

  if(profileImg == null) {
    document.getElementById("profileImg").src = defaultProfileImg;
  };

  const workerBirthDate = resume.workerBirthDate; // 서버에서 가져온 근무자 생년
  const age = resume.age; // 서버에서 가져온 나이
  document.getElementById(
    "workerBirthDate"
  ).innerHTML = `${workerBirthDate}년 (만 ${age}세)`;

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

  if (careerInfo.length > 0) {
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
    const content = `경력 : ${formatCareer(
      resume.totalCareer,
      careerInfo.length
    )}`;
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
      periodCell.innerHTML = `${career.startDate} ~<br> ${career.endDate ? career.endDate : "현재 재직 중"}`;

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

  // 근무지역 배열
  const workcondAddressTypeList = document.getElementById(
    "workcondAddressTypeInfo"
  );
  workcondAddressTypeInfo.forEach((item) => {
    const span = document.createElement("span");
    span.textContent = item; // 텍스트 내용 설정
    span.classList.add("subitem"); // CSS 클래스 추가
    workcondAddressTypeList.appendChild(span);
  });

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

  

  // 기존 코드 제거하고 새로운 로직 추가
resumeDaysTime.forEach((item, index) => {
  // 요일 span 생성
  const daySpan = document.createElement("span");
  daySpan.textContent = item.daysName;
  daySpan.classList.add("subitem");
  
  // 시간 span 생성
  const timeSpan = document.createElement("span");
  timeSpan.textContent = item.timeName;
  timeSpan.classList.add("subitem");
  
  // 줄바꿈을 위한 div 생성
  const container = document.createElement("div");
  container.classList.add("day-time");
  container.appendChild(daySpan);
  container.appendChild(timeSpan);
  
  dayList.appendChild(container);
});

  //급여
  const salary = formatSalary(
    resume.salaryNo,
    resume.salaryAmount,
    resume.salaryName
  );
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
    

    // 데이터 분해
    const {
      resume,
      careerInfo,
      resumeDaysTime,
      resumeJobTypeList,
      resumeWorkType,
      workcondAddressTypeInfo,
    } = data;

    // 전역함수에 넣기
    resumeData = resume;
    careerInfoData = careerInfo;
    resumeDaysTimeData = resumeDaysTime;
    resumeJobTypeListData = resumeJobTypeList;
    resumeWorkTypeData = resumeWorkType;
    workcondAddressTypeInfoData = workcondAddressTypeInfo;

    // UI 업데이트 호출
    updateUI(
      resume,
      careerInfo,
      resumeDaysTime,
      resumeJobTypeList,
      resumeWorkType,
      workcondAddressTypeInfo
    );
  })
  .catch((error) => {
    console.error("요청 오류:", error);
  });

//////////////////////// 카테고리 수정

const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) {
    el.setAttribute(key, attr[key]); // 요소에 속성 추가
    if (key == "value") el.innerText = attr[key];
  }
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

const newAdd = (tag, attr, cls) => {
  const add = document.createElement(tag);
  for (let key in attr) {
    add.setAttribute(key, attr[key]);
    if (key == "value") add.innerText = attr[key];
  }
  for (let className of cls) add.classList.add(className);

  return add;
};

function addSelect() {
  // 새로운 셀렉트 태그를 생성
  var workDaySelect = document.createElement("select");
  workDaySelect.classList.add("daysNo");

  // workDay 옵션들 추가
  var options1 = [
    { value: "1", text: "무관" },
    { value: "2", text: "월~일" },
    { value: "3", text: "월~토" },
    { value: "4", text: "월~금" },
    { value: "5", text: "주말(토,일)" },
    { value: "6", text: "주6일" },
    { value: "7", text: "주5일" },
    { value: "8", text: "주4일" },
    { value: "9", text: "주3일" },
    { value: "10", text: "주2일" },
    { value: "11", text: "주1일" },
  ];

  options1.forEach(function (option) {
    var optionTag = document.createElement("option");
    optionTag.value = option.value;
    optionTag.textContent = option.text;
    workDaySelect.appendChild(optionTag);
  });

  // 두 번째 셀렉트 태그 생성 (근무 시간)
  var workPartSelect = document.createElement("select");
  workPartSelect.classList.add("timeNo");

  // workPart 옵션들 추가
  var options2 = [
    { value: "1", text: "무관" },
    { value: "2", text: "오전 파트타임(06:00~12:00)" },
    { value: "3", text: "오후 파트타임(12:00~18:00)" },
    { value: "4", text: "저녁 파트타임(18:00~24:00)" },
    { value: "5", text: "새벽 파트타임(00:00~06:00)" },
    { value: "6", text: "오전~오후 파트타임" },
    { value: "7", text: "오후~저녁 파트타임" },
    { value: "8", text: "저녁~새벽 파트타임" },
    { value: "9", text: "새벽~오전 파트타임" },
    { value: "10", text: "풀타임(8시간이상)" },
  ];

  options2.forEach(function (option) {
    var optionTag = document.createElement("option");
    optionTag.value = option.value;
    optionTag.textContent = option.text;
    workPartSelect.appendChild(optionTag);
  });

  // 삭제 버튼 추가
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "삭제";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => {
    workDaySelect.remove();
    workPartSelect.remove();
    deleteBtn.remove();
  };

  // 셀렉트들을 새로운 div에 추가
  var container = document.getElementById("select-container");
  const daysTimeSection = document.createElement("section");
  daysTimeSection.classList.add("daysTimeSection");
  daysTimeSection.appendChild(workDaySelect);
  daysTimeSection.appendChild(workPartSelect);
  daysTimeSection.appendChild(deleteBtn);
  container.appendChild(daysTimeSection);
}

const subCategory = async (workTypeNo) => {
  const subWorkType = document.querySelector("#subWorkType");
  if (!subWorkType) {
    console.error("#subWorkType element not found");
    return;
  }
  subWorkType.innerHTML = "";

  const resp = await fetch(`/resume/selectSubWorkType/${workTypeNo}`);
  const result = await resp.json();

  for (let element of result) {
    const liSubWorkTypeName = document.createElement("li");

    liSubWorkTypeName.innerText = element.worktypeCategory;
    liSubWorkTypeName.id = element.workTypeNo;
    liSubWorkTypeName.style.cursor = "pointer";

    subWorkType.appendChild(liSubWorkTypeName);

    liSubWorkTypeName.addEventListener("click", (e) => {
      addSubCategory(e.target);
    });
  }
};

// 클릭했을 때 선택한 업직종 추가하기(삭제 이벤트도 같이)
const addSubCategory = (liSubWorkTypeName) => {
  const selectCategoryUl = document.querySelector("#selectCategoryUl");
  if (!selectCategoryUl) {
    console.error("#selectCategoryUl element not found");
    return; // 에러 발생 시 함수 종료
  }

  const selectCategory = document.querySelectorAll(".select-category");
  if (!selectCategory) {
    console.error("Error: #subWorkType element not found");
    return; // 에러 발생 시 함수 종료
  }

  if (selectCategory.length >= 5) {
    alert("업직종은 최대 5개만 가능합니다");
    return;
  }

  // 이미 선택된 업직종인지 확인 (중복 체크)
  for (let selected of selectCategory) {
    if (selected.getAttribute("value") === liSubWorkTypeName.innerText) {
      alert("이미 선택된 업직종입니다.");
      return; // 중복된 업직종은 추가하지 않음
    }
  }

  const subCategory = newEl(
    "span",
    {
      name: "workTypeCategory",
      readOnly: true,
      workTypeNo: liSubWorkTypeName.id,
      value: liSubWorkTypeName.innerText,
    },
    ["select-category"]
  );

  const deleteBtn = newEl("span", {}, ["subcategory-delete"]);
  deleteBtn.innerHTML = " &times";
  deleteBtn.style.cursor = "pointer";

  const li = document.createElement("li");

  li.appendChild(subCategory);
  li.appendChild(deleteBtn);
  selectCategoryUl.appendChild(li); // 여기서 appendChild를 호출

  document
    .querySelectorAll(".subcategory-delete")
    .forEach((deleteSubcategory) => {
      deleteSubcategory.addEventListener("click", () => {
        deleteSubcategory.parentElement.remove();
      });
    });
};

const selectDetailAddress = async (workcondAddressTypeNo) => {
  const subAddressType = document.querySelector("#subAddressType");
  if (!subAddressType) {
    console.error("#subAddressType element not found");
    return;
  }
  subAddressType.innerHTML = "";

  const resp = await fetch(`/resume/selectSubAddress/${workcondAddressTypeNo}`);
  const result = await resp.json();

  for (let element of result) {
    const liSubAddressName = document.createElement("li");

    liSubAddressName.innerText = element.workcondAddressTypeInfo;
    liSubAddressName.id = element.workcondAddressTypeNo;
    liSubAddressName.style.cursor = "pointer";

    subAddressType.appendChild(liSubAddressName);

    liSubAddressName.addEventListener("click", (e) => {
      addSubAddressCategory(e.target);
    });
  }
};

const addSubAddressCategory = (liSubAddressName) => {
  const selectAddressCategory = document.querySelectorAll(".select-address");

  const selectAddressCategoryUl = document.querySelector(
    "#selectAddressCategoryUl"
  );
  if (!selectAddressCategoryUl) {
    console.error("#selectAddressCategoryUl element not found");
    return; // 에러 발생 시 함수 종료
  }

  if (selectAddressCategory.length >= 5) {
    alert("희망 근무지역은 최대 5개만 선택 가능합니다");
    return;
  }

  for (let selected of selectAddressCategory) {
    if (selected.getAttribute("value") === liSubAddressName.innerText) {
      alert("이미 선택한 지역입니다.");
      return;
    }
  }

  const subAddress = newAdd(
    "span",
    {
      name: "workcondAddressTypeInfo",
      readOnly: true,
      workcondAddressTypeNo: liSubAddressName.id,
      value: liSubAddressName.innerText,
    },
    ["select-address"]
  );

  const deleteAddressBtn = newAdd("span", {}, ["subAddress-delete"]);
  deleteAddressBtn.innerHTML = " &times";
  deleteAddressBtn.style.cursor = "pointer";

  const li = document.createElement("li");

  li.appendChild(subAddress);
  li.appendChild(deleteAddressBtn);
  selectAddressCategoryUl.appendChild(li);

  document
    .querySelectorAll(".subAddress-delete")
    .forEach((deleteAddressBtn) => {
      deleteAddressBtn.addEventListener("click", () => {
        deleteAddressBtn.parentElement.remove();
      });
    });
};

// 경력사항 수정

const nowGrade = document.getElementById("nowGrade");
document.addEventListener("click", (event) => {
  if (event.target.id === "gradeBtn") {
    // 수정 버튼 클릭 시에만 동작
    if (confirm("학력 및 경력을 수정하시겠습니까?")) {
      nowGrade.remove();
      // 경력 수정 폼 활성화
      document.getElementById("gradeSection").innerHTML = `
      <form action="/resume/updateGrade" method="post" id="updateGrade">
      <div class="edit"  id="gradeSection">
                    <h2>학력 및 경력</h2>
                    <button class="grade-btn" type="submit" id="gradeBtnSave"> 저장 </button>
                    <button class="grade-btn" type="button" id="gradeBtnCancel"> 취소 </button>
      </div>
          <h3>학력</h3>
          <select name="gradeNo" id="gradeNo">
            <option value="1">비공개</option>
            <option value="2">중졸</option>
            <option value="3">고졸</option>
            <option value="4">대졸(2,3년제)</option>
            <option value="5">대졸(4년제)</option>
            <option value="6">대학원이상</option>
          </select>

          <h3>경력</h3>
          <div class="career-container">
            <section>
              <span>경력구분</span>
              <div class="career-toggle">
                <button class="newbie active" type="button">신입</button>
                <button class="exp" type="button">경력</button>
              </div>
            </section>
            <div class="input-container" style="display: none;">
              <label>
                회사명:
                <input type="text" class="company-name" placeholder="회사명을 입력하세요" maxlength="100" disabled>
              </label>
              <label>
                근무기간:
                <input type="date" class="start-date" disabled>
                <input type="date" class="end-date" disabled>
              </label>
              <label>
                담당업무:
                <textarea class="career-description" maxlength="500" placeholder="담당업무를 입력하세요" disabled></textarea>
                <div class="exp-char-counter">0 / 500자</div>
              </label>
            </div>

            <button class="exp-append" onclick="expappend()" type="button" style="display: none">경력사항 추가</button>
          </div>
          <input type="hidden" id="currentUrl" name="currentUrl" value="">
        </form>
      `;
    }

    const expTextArea = document.querySelector(".career-description"); // 담당업무
    const expCharCounter = document.querySelector(".exp-char-counter");
    expTextArea.addEventListener("input", () => {
      const currentLength = expTextArea.value.length; // 현재 입력된 글자 수
      const maxLength = expTextArea.getAttribute("maxlength"); // 최대 글자 수
    
      // 글자 수 표시 업데이트
      expCharCounter.textContent = `${currentLength} / ${maxLength}자`;
    });
  }
});

let canEdit = false; // 수정 버튼을 클릭했는지 여부를 추적하는 변수
let careerType = "newbie";

document.addEventListener("click", (event) => {
  // 수정 버튼 클릭 후에만 신입/경력 선택 및 경력사항 추가 버튼 활성화
  if (event.target.id === "gradeBtn") {
    canEdit = true; // 수정 버튼이 클릭되면 편집 가능
  }

  // 신입 버튼 클릭 시
  if (canEdit && event.target.classList.contains("newbie")) {
    showInputs(false); // 신입 입력 활성화
  }

  // 경력 버튼 클릭 시
  if (canEdit && event.target.classList.contains("exp")) {
    showInputs(true); // 경력 입력 활성화
  }
});

// showInputs 함수 정의
function showInputs(isExperienced) {
  const inputContainer = document.querySelector(".input-container");
  const expAppend = document.querySelector(".exp-append");
  const formElements = inputContainer.querySelectorAll("input, textarea");

  const newbieButton = document.querySelector(".newbie");
  const expButton = document.querySelector(".exp");

  if (isExperienced) {
    expButton.classList.add("active");
    newbieButton.classList.remove("active");

    careerType = "exp"; // 경력 세팅
    inputContainer.style.display = "block";
    expAppend.style.display = "block";

    formElements.forEach((element) => {
      element.disabled = false;
    });
    expAppend.disabled = false;
  } else {
    newbieButton.classList.add("active");
    expButton.classList.remove("active");

    careerType = "newbie"; // 신입 세팅
    inputContainer.style.display = "none";

    formElements.forEach((element) => {
      element.disabled = true;
    });

    expAppend.style.display = "none";
    expAppend.disabled = true;
  }
}

// 경력사항 추가 버튼 클릭 시 입력 필드 추가
function expappend() {
  const inputContainer = document.querySelector(".input-container");

  const newContainer = document.createElement("div");
  newContainer.className = "input-container";

  newContainer.innerHTML = `
    <label>
      회사명:
      <input type="text" class="company-name" placeholder="회사명을 입력하세요" maxlength="100">
    </label>
    <label>
      근무기간:
      <input type="date" class="start-date">
      <input type="date" class="end-date">
    </label>
    <label>
      담당업무:
      <textarea class="career-add-description" maxlength="500" placeholder="담당업무를 입력하세요"></textarea>
      <div class="exp-add-char-counter">0 / 500자</div>
    </label>
  `;

  // 삭제 버튼 추가
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "삭제";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => newContainer.remove(); // 삭제 버튼 클릭 시 해당 항목 삭제

  newContainer.appendChild(deleteBtn);

  inputContainer.appendChild(newContainer);

   // 새로 생성된 텍스트 영역과 카운터 요소 찾기
   const expAddCharCounter = newContainer.querySelector(".exp-add-char-counter");
   const expAddTextArea = newContainer.querySelector(".career-add-description");
 
   // 글자 수 업데이트 이벤트 리스너 추가
   if (expAddTextArea && expAddCharCounter) {
     expAddTextArea.addEventListener("input", () => {
       const addCurrentLength = expAddTextArea.value.length; // 현재 입력된 글자 수
       const addMaxLength = expAddTextArea.getAttribute("maxlength"); // 최대 글자 수
 
       // 글자 수 표시 업데이트
       expAddCharCounter.textContent = `${addCurrentLength} / ${addMaxLength}자`;
     });
   }
};

// 저장 버튼 클릭 이벤트 처리
document.addEventListener("click", (e) => {
  if (e.target.id === "gradeBtnSave") {
    // 저장 전 확인
    if (confirm("저장하시겠습니까?")) {
      e.preventDefault();
      const gradeUpdateForm = document.querySelector("#updateGrade");

      const resumeNoInput = document.createElement("input");
      resumeNoInput.type = "hidden";
      resumeNoInput.name = "resumeNo";
      resumeNoInput.value = resumeNo;
      gradeUpdateForm.appendChild(resumeNoInput); // 폼에 추가

      if (gradeUpdateForm) {
        let careerInfoList = [];

        if (careerType === "newbie") {
          const hiddenInput6 = document.createElement("input");
          hiddenInput6.type = "hidden";
          hiddenInput6.name = "currentUrl";
          hiddenInput6.value = window.location.href;

          gradeUpdateForm.appendChild(hiddenInput6);
          gradeUpdateForm.submit();
        }

        if (careerType === "exp") {
          const companyNameList = document.querySelectorAll(".company-name");
          const startDateList = document.querySelectorAll(".start-date");
          const endDateList = document.querySelectorAll(".end-date");
          const careerDescriptionList = document.querySelectorAll(".career-description, .career-add-description");

          for (let i = 0; i < companyNameList.length; i++) {
            if (
              companyNameList[i].value.trim().length === 0 ||
              startDateList[i].value.trim().length === 0 ||
              careerDescriptionList[i].value.trim().length === 0
            ) {
              alert("경력사항 관련 필드는 비어있을 수 없습니다.");
              return; // 필드가 비어 있으면 바로 return
            }

            if (
              endDateList[i].value.trim() !== "" &&
              startDateList[i].value.trim() > endDateList[i].value.trim()
            ) {
              alert("입사일과 퇴사일을 올바르게 작성 해주세요");
              return; // 날짜가 잘못되었으면 return
            }

            let careerInfoObj = {};

            careerInfoObj.careerNo = i; // 순서식별용 가데이터
            careerInfoObj.companyName = companyNameList[i].value;
            careerInfoObj.startDate = startDateList[i].value;
            careerInfoObj.endDate = endDateList[i].value;
            careerInfoObj.careerDescription = careerDescriptionList[i].value;

            careerInfoList.push(careerInfoObj);
          }

          // hidden input 생성 및 추가
          const hiddenInput2 = document.createElement("input");
          hiddenInput2.type = "hidden";
          hiddenInput2.name = "careerInfoList";
          hiddenInput2.value = JSON.stringify(careerInfoList);

          gradeUpdateForm.appendChild(hiddenInput2);

          const hiddenInput6 = document.createElement("input");
          hiddenInput6.type = "hidden";
          hiddenInput6.name = "currentUrl";
          hiddenInput6.value = window.location.href;

          gradeUpdateForm.appendChild(hiddenInput6);

          // 폼 제출
          gradeUpdateForm.submit();
        }
      }
    }
  }
});

// 취소 버튼 클릭 이벤트 처리
document.addEventListener("click", (e) => {
  if (e.target.id === "gradeBtnCancel") {
    if (confirm("취소하시겠습니까?")) {
      location.reload(true); // 페이지 새로고침
    }
  }
});

const categoryBtn = document.querySelector(".category-btn");
categoryBtn.addEventListener("click", async (e) => {
  if (confirm("희망근무 조건을 수정하시겠습니까?")) {
    // 서버에서 데이터를 받아옴
    const response = await fetch("/resume/selectCategory", { method: "POST" });
    const data = await response.json(); // JSON 데이터를 받음
    const majorCategoryList = data.majorCategoryList;
    const majorAddressList = data.majorAddressList;

    document.getElementById("category-section").remove();
    document.getElementById("categoryArea").innerHTML = `
                <form action="/resume/updateCategory" method="post" id="updateCategoryForm">
                    <div class="edit">
                        <h2>희망근무 조건</h2>
                        <button class="edit-btn" type="submit" id="updateCategoryBtn">저장</button>
                        <button class="edit-btn" type="button" id="updateCategoryCancelBtn">취소</button>
                    </div>
            
            
            <h3>업직종(최대 5개 선택 가능)</h3>
            <div>
            <ul id="selectCategoryUl"> </ul>
                        ${majorCategoryList
                          .map(
                            (category) => `
                            <li class="workType" style="cursor: pointer;" 
                                   onclick="subCategory('${category.workTypeNo}')">
                                ${category.majorCategoryName}
                            </li>
                        `
                          )
                          .join("")}
                </div>
                <div>
                    <ul id="subWorkType"></ul>
                </div>
                          
                <h3>희망 근무지역 (최대 5개 선택 가능)</h3>
                <div>
                    <ul id="selectAddressCategoryUl"></ul>
                        ${majorAddressList
                          .map(
                            (address) => `
                            <li class="address-categoty" style="cursor: pointer;" 
                                onclick="selectDetailAddress('${address.workcondAddressTypeNo}')">
                                ${address.workcondAddressTypeInfo}
                            </li>
                        `
                          )
                          .join("")}
                </div>
                <div>
                    <ul id="subAddressType"></ul>
                </div>

                <h3>근무형태</h3>
                <div class="jobTypeSection">
                    <label>
                        <input type="checkbox" id="partTime" name="jobTypeNo" value="1">알바
                    </label>
                    <label>
                        <input type="checkbox" id="fullTime" name="jobTypeNo" value="2">정규직
                    </label>
                    <label>
                        <input type="checkbox" id="contractor" name="jobTypeNo" value="3">기간 계약직
                    </label>
                </div>

                <h3>근무기간</h3>
                <select name="periodNo">
                    <option value="1">무관</option>
                    <option value="2">하루</option>
                    <option value="3">1주일이하</option>
                    <option value="4">1주일 ~ 1개월</option>
                    <option value="5">1개월 ~ 3개월</option>
                    <option value="6">3개월 ~ 6개월</option>
                    <option value="7">6개월 ~ 1년</option>
                    <option value="8">1년 이상</option>
                </select>

                <h3>근무일시</h3>
                <div id="select-container">
                    <section class="daysTimeSection">
                        <select class="daysNo">
                            <option value="1">무관</option>
                            <option value="2">월~일</option>
                            <option value="3">월~토</option>
                            <option value="4">월~금</option>
                            <option value="5">주말(토,일)</option>
                            <option value="6">주6일</option>
                            <option value="7">주5일</option>
                            <option value="8">주4일</option>
                            <option value="9">주3일</option>
                            <option value="10">주2일</option>
                            <option value="11">주1일</option>
                        </select>

                        <select class="timeNo">
                            <option value="1">무관</option>
                            <option value="2">오전 파트타임(06:00~12:00)</option>
                            <option value="3">오후 파트타임(12:00~18:00)</option>
                            <option value="4">저녁 파트타임(18:00~24:00)</option>
                            <option value="5">새벽 파트타임(00:00~06:00)</option>
                            <option value="6">오전~오후 파트타임</option>
                            <option value="7">오후~저녁 파트타임</option>
                            <option value="8">저녁~새벽 파트타임</option>
                            <option value="9">새벽~오전 파트타임</option>
                            <option value="10">풀타임(8시간이상)</option>
                        </select>
                    </section>
                </div>

                <button onclick="addSelect()" type="button" class="addSelectBtn">추가</button>

                <h3>급여</h3>
                <div name="workPay">
                    <select name="salaryNo" onchange="toggleInput()">
                        <option value="1">시급</option>
                        <option value="2">월급</option>
                        <option value="3" selected>추후협의(시급)</option>
                        <option value="4">추후협의(월급)</option>
                    </select>

                    <input type="number" name="salAmount" min="0" maxlength="9">원
                </div>
                <input type="hidden" id="currentUrl" name="currentUrl" value="">
                </form>
        `;

    // selectElement, inputElement, selectedValue 재정의 후 이벤트 바인딩
    var selectElement = document.querySelector('select[name="salaryNo"]');

    // selectElement가 존재하는지 확인한 후 이벤트 리스너 추가
    if (selectElement) {
      selectElement.addEventListener("change", toggleInput);
    }

    // toggleInput 호출하여 초기 상태 반영
    toggleInput();
  }

  const updateCategoryCancelBtn = document.getElementById(
    "updateCategoryCancelBtn"
  );

  const updateCategoryForm = document.querySelector("#updateCategoryForm");

  // 제출 이벤트
  if (updateCategoryForm) {
    updateCategoryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // resumeNo를 hidden input으로 추가
      const resumeNoInput = document.createElement("input");
      resumeNoInput.type = "hidden";
      resumeNoInput.name = "resumeNo";
      resumeNoInput.value = resumeNo;
      updateCategoryForm.appendChild(resumeNoInput); // 폼에 추가

      if (confirm("저장하시겠습니까?")) {
        let workTypeList = []; // 업직종저장배열(5개까지)
        let daysTimeList = []; // 요일시간배열
        let addressList = []; // 희망근무지역배열(5개까지)
        // 근무 형태 관련
        const partTime = document.getElementById("partTime");
        const fullTime = document.getElementById("fullTime");
        const contractor = document.getElementById("contractor");
        if (!partTime.checked && !fullTime.checked && !contractor.checked) {
          alert("근무 형태를 선택해 주세요");
          return;
        }

        // -------------- 근무일시 관련 --------------
        const daysNoList = document.querySelectorAll(".daysNo");
        const timeNoList = document.querySelectorAll(".timeNo");

        daysTimeList = []; // 초기화

        for (let i = 0; i < daysNoList.length; i++) {
          let daysTimeObj = {}; // 빈 js 객체 생성

          daysTimeObj.daysTimeNo = i; // 순서식별용 가데이터
          daysTimeObj.daysNo = daysNoList[i].value;
          daysTimeObj.timeNo = timeNoList[i].value;

          for (let j = 0; j < daysTimeList.length; j++) {
            if (
              daysTimeObj.daysNo === daysTimeList[j].daysNo &&
              daysTimeObj.timeNo === daysTimeList[j].timeNo
            ) {
              alert("근무 일시가 중복되었습니다. 다른 값을 선택해주세요.");
              return; // 중복이 있을 경우 함수 종료
            }
          }

          daysTimeList.push(daysTimeObj);
        }

        const hiddenInput3 = document.createElement("input");
        hiddenInput3.type = "hidden";
        hiddenInput3.name = "daysTimeList";
        hiddenInput3.value = JSON.stringify(daysTimeList);

        updateCategoryForm.appendChild(hiddenInput3);

        // -------------- 업직종 관련 --------------
        workTypeList = []; // 초기화

        for (let element of selectCategoryUl.children) {
          workTypeList.push(element.firstChild.attributes.worktypeno.value);
        }

        if (workTypeList.length == 0) {
          alert("희망 직종을 선택 해주세요");
          hiddenInput3.remove();
          return;
        }

        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = "workTypeList";
        hiddenInput.value = workTypeList;

        updateCategoryForm.appendChild(hiddenInput);

        // ----------------- 희망근무지역 관련 ----------------
        addressList = []; // 초기화

        for (let element of selectAddressCategoryUl.children) {
          addressList.push(
            element.firstChild.attributes.workcondaddresstypeno.value
          );
        }

        if (addressList.length == 0) {
          alert("희망 근무지를 선택 해주세요");
          hiddenInput.remove();
          hiddenInput3.remove();
          return;
        }

        const hiddenInput4 = document.createElement("input");
        hiddenInput4.type = "hidden";
        hiddenInput4.name = "addressList";
        hiddenInput4.value = addressList;

        updateCategoryForm.appendChild(hiddenInput4);

        const hiddenInput5 = document.createElement("input");
        hiddenInput5.type = "hidden";
        hiddenInput5.name = "currentUrl";
        hiddenInput5.value = window.location.href; // 현재 페이지 URL

        updateCategoryForm.appendChild(hiddenInput5); // 폼에 hidden input 추가

        updateCategoryForm.submit();
        
      }
    });
  }

  // 취소 버튼 클릭 이벤트
  if (updateCategoryCancelBtn) {
    updateCategoryCancelBtn.addEventListener("click", () => {
      if (confirm("취소하시겠습니까?")) {
        location.reload(true);
      }
    });
  }
});

function toggleInput() {
  var selectElement = document.querySelector('select[name="salaryNo"]');
  var inputElement = document.getElementsByName("salAmount")[0];
  var selectedValue = selectElement.value;

  if (!selectElement || !inputElement || !selectedValue) {
    return; // 에러 발생 시 함수 종료
  }

  // "추후협의(시급)" 또는 "추후협의(월급)"이 선택되면 input 비활성화
  if (selectedValue == "3" || selectedValue == "4") {
    inputElement.disabled = true;
  } else {
    inputElement.disabled = false;
  }
}

document.addEventListener("click", (e) => {
  if (e.target.className === "title-btn") {
    if (confirm("제목을 수정하시겠습니까?")) {
      const title = resumeData.resumeTitle;
      document.querySelector(".edit-title").innerHTML = `
      <h2>제목 :&nbsp </h2><input class="updateTitle" id="updateTitle" maxlength="100" value="${title}"></input>
      
      &nbsp <div class="title-char-counter">0 / 100자</div>
      <button class="edit-btn" type="button" id="titleUpdateBtn"> 저장 </button>
      <button class="edit-btn" type="button" id="titleCancelBtn"> 취소 </button>
      `;
    }

    const inputTitle = document.querySelector("#updateTitle");
    const titleCharCounter = document.querySelector(".title-char-counter");

    inputTitle.addEventListener("input", () => {
      const currentTitleLength = inputTitle.value.length;
      const maxLength = inputTitle.getAttribute("maxlength");

      titleCharCounter.textContent = `${currentTitleLength} / ${maxLength}자`;
    });

    // 동적으로 생성된 요소에 대한 이벤트 리스너 등록
    document.getElementById("titleUpdateBtn").addEventListener("click", (e) => {
      if (confirm("저장하시겠습니까?")) {
        const updateTitle = document.getElementById("updateTitle").value;

        if (updateTitle.trim() == "") {
          alert("제목을 입력 해주세요");
          return;
        }
        // fetch 요청 보내기
        fetch("/resume/updateTitle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeNo: resumeNo,
            updateTitle: updateTitle,
          }),
        })
          .then((resp) => {
            if (!resp.ok) {
              throw new Error("에러");
            }
            return resp.json();
          })
          .then((data) => {
            document.querySelector(".edit-title").innerHTML = `
            <h2 id="resumeTitle">제목 : ${updateTitle}</h2>  <!-- 제목 업데이트 -->
            <button class="title-btn" type="button" id="titleBtn"> 수정 </button>
        `;
            alert(data.message); // 성공 메시지 출력
            location.reload();
          })
          .catch((error) => {
            console.error("저장 중 오류 발생:", error);
            alert(error.message); // 오류 메시지 출력
          });
      }
    });

    // 취소 버튼 처리
  }

  if (e.target.id === "titleCancelBtn") {
    if (confirm("취소하시겠습니까?")) {
      document.querySelector(".edit-title").innerHTML = `
            <h2 id="resumeTitle">제목 : ${resumeData.resumeTitle}</h2>
            <button class="title-btn" type="button" id="titleBtn"> 수정 </button>
        `;
    }
  }
});

document.addEventListener("click", (event) => {
  // 수정 버튼 클릭 이벤트
  if (event.target.id === "selfBtn") {
    if (confirm("자기소개를 수정하시겠습니까?")) {
      // 기존 내용 가져오기
      const content = resumeData.resumeContent;
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
                        <div class="char-counter">0 / 1500자</div>
                    </section>
                </div>
            `;
    }
    const textarea = document.querySelector(".selfInfo"); // 자기소개
    const charCounter = document.querySelector(".char-counter");

    textarea.addEventListener("input", () => {
      const currentLength = textarea.value.length; // 현재 입력된 글자 수
      const maxLength = textarea.getAttribute("maxlength"); // 최대 글자 수
    
      // 글자 수 표시 업데이트
      charCounter.textContent = `${currentLength} / ${maxLength}자`;
    });


  }

  // 저장 버튼 클릭 이벤트
  if (event.target.id === "saveBtn") {
    if (confirm("저장하시겠습니까?")) {
      const updatedContent = document.getElementById("updateContent").value;
      if(updatedContent.trim() == ""){
        alert("자기소개를 작성 해주세요");
        return;
      }


      // 서버로 업데이트 요청
      fetch("/resume/updateContent", {
        // 서버 엔드포인트 URL
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
                              <textarea id="resumeContent" style="white-space: pre-wrap;">${updatedContent}</textarea>
                          </section>
                      </div>
                  `;

          // 성공 메시지 출력
          alert(data.message);
          location.reload();
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
      location.reload(true);
    }
  }
});