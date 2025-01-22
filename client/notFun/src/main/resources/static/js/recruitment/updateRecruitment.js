// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};

/* ********** select 태그에 기존 값 넣기 ********** */
const originalValue = () => {

  // 모집인원
  const numOfRecruitmentName = document.querySelector("#numOfRecruitmentName");
  const originalNumOfRecruitmentName = document.querySelector("#originalNumOfRecruitmentName");
  numOfRecruitmentName.value = originalNumOfRecruitmentName.value;

  // 근무형태
  const originalJobTypeNo = document.querySelector("#originalJobTypeNo");
  const jobtypeRadios = document.getElementsByName("jobtypeNo");
  jobtypeRadios.forEach(radio => {
    if(radio.value == originalJobTypeNo.value) radio.checked = true;
  })

  // 학력조건
  const originalGradeNo = document.querySelector("#originalGradeNo");
  const gradeNo = document.querySelector("#gradeNo");
  gradeNo.value = originalGradeNo.value;

  // 급여조건
  const originalSalaryNo = document.querySelector("#originalSalaryNo");
  const salaryNo = document.querySelector("#salaryNo");
  salaryNo.value = originalSalaryNo.value;

  // 근무기간
  const originalPeriodNo = document.querySelector("#originalPeriodNo");
  const periodNo = document.querySelector("#periodNo");
  periodNo.value = originalPeriodNo.value;

  // 근무요일
  const originalDaysNo = document.querySelector("#originalDaysNo");
  const daysNo = document.querySelector("#daysNo");
  daysNo.value = originalDaysNo.value;

  // 근무시간
  const originalTimeNo = document.querySelector("#originalTimeNo");
  const timeNo = document.querySelector("#timeNo");
  timeNo.value = originalTimeNo.value;
}

originalValue();

/* ********** 급여조건 관련 ********** */

// 초기 로딩 시에도 기존 값에 맞게 처리
const initialSalaryValue = document.querySelector("#salaryNo").value;
const initialSalaryMountInput = document.querySelector("#salaryMount");

if (initialSalaryValue == "3" || initialSalaryValue == "4") {
  initialSalaryMountInput.type = "hidden";
  initialSalaryMountInput.value = "0";
} else {
  initialSalaryMountInput.type = "number";
  initialSalaryMountInput.value = document.querySelector("#originalSalaryMount").value;
}

const salaryNoSelect = document.querySelector("#salaryNo");         // select 태그

salaryNoSelect.addEventListener("change", () => {
  const salaryMountInput = document.querySelector("#salaryMount");  // input 태그
  const selectValue = salaryNoSelect.value;

  if(selectValue == 3 || selectValue == 4){
    salaryMountInput.type = "hidden";
    salaryMountInput.value = "0";

  } else {
    salaryMountInput.type = "number";
    salaryMountInput.value = document.querySelector("#originalSalaryMount").value;
  }
});

/* ********** 선호조건 관련 ********** */
const selectedPreferredArea = document.querySelector(".selected-preferred-area");

const addPreferred = (preferredCategory) => {

  const selectPreferred = document.querySelectorAll(".select-preferred");

  if(selectPreferred.length >= 5){
    alert("선호조건 선택은 최대 5개만 가능합니다");
    return;
  }

  for(let i=0; i<selectPreferred.length; i++){
    if (selectPreferred[i].value == preferredCategory){
      alert("동일한 선호조건이 있습니다");
      return;
    }
  }

  const selectedDiv = document.createElement("div");
  const recruitmentPreferred = newEl(
    "input",
    {type: "text", name: "recruitmentPrefers", readOnly: true, value: preferredCategory},
    ["select-preferred"]
  );

  const deleteBtn = newEl("span", {}, ["preferred-delete"]);
  deleteBtn.innerHTML = " &times";
  deleteBtn.style.cursor = "pointer";

  selectedDiv.append(recruitmentPreferred, deleteBtn);
  selectedPreferredArea.append(selectedDiv);

  document.querySelectorAll(".preferred-delete").forEach(deletePreferred => {
    deletePreferred.addEventListener("click", () => {
      deletePreferred.parentElement.remove();
    })
  })
}

/* ********** 복리후생 관련 ********** */
const subSupport = async (supportNo) => {

  const subSupportUl = document.querySelector("#subSupportUl");
  subSupportUl.innerHTML = "";
  
  const resp = await fetch(`/recruitment/selectSubSupport/${supportNo}`);
  const result = await resp.json();

  for(let subSupport of result){

    const liSubSupportLi = document.createElement("li");

    liSubSupportLi.innerText = subSupport.supportCategory;
    liSubSupportLi.id = subSupport.supportNo;
    liSubSupportLi.style.cursor = "pointer";

    subSupportUl.appendChild(liSubSupportLi);

    liSubSupportLi.addEventListener("click", (e) => {
      addSubSupport(e.target);
    })
  }
}

const selectedSupportArea = document.querySelector(".selected-support-area");

const addSubSupport = (liSubSupportLi) => {

  const selectSupportInputList = document.querySelectorAll(".select-support");

  for(let i=0; i<selectSupportInputList.length; i++){
    if(selectSupportInputList[i].value == liSubSupportLi.innerText){
      alert("동일한 복리후생이 있습니다");
      return;
    }
  }

  const selectedDiv = document.createElement("div");
  const recruitmentSupport = newEl(
    "input",
    {type: "text", name: "recruitmentSupports", readOnly: true, value: liSubSupportLi.innerText},
    ["select-support"]
  );

  const deleteBtn = newEl("span", {}, ["support-delete"]);
  deleteBtn.innerHTML = " &times";
  deleteBtn.style.cursor = "pointer";

  selectedDiv.append(recruitmentSupport, deleteBtn);
  selectedSupportArea.append(selectedDiv);

  document.querySelectorAll(".support-delete").forEach(deleteSupport => {
    deleteSupport.addEventListener("click", () => {
      deleteSupport.parentElement.remove();
    })
  })

}

const backToRecruitmentDetail = () => {
  location.href = location.pathname.replace("update", "detail") + location.search;
}


/* ********** 제출 시 ********** */
const updateRecruitmentForm = document.querySelector("#updateRecruitmentForm");
updateRecruitmentForm.addEventListener("submit", e => {

  const salaryMount = document.querySelector("#salaryMount");
  if(salaryMount.value == "" || isNaN(salaryMount.value)){
    alert("금액을 입력해주세요");
    salaryMount.focus();
    e.preventDefault();
    return;
  }
})