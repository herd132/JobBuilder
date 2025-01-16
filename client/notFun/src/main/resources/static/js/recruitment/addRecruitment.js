console.log("addRecruitment.js 와 연결됨");

// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};


/* ********** 근무지조건 관련 ********** */

const selectDetailAddress = async (workcondAddressTypeNo) => {

  const subAddressType = document.querySelector("#subAddressType");
  subAddressType.innerHTML = "";

  const resp = await fetch(`/recruitment/selectSubAddress/${workcondAddressTypeNo}`);
  const result = await resp.json();

  for (let element of result) {

    const liSubAddressName = document.createElement("li");

    liSubAddressName.innerText = element.workcondAddressTypeInfo;
    liSubAddressName.id = element.workcondAddressTypeNo;
    liSubAddressName.style.cursor = "pointer";

    subAddressType.appendChild(liSubAddressName);

    liSubAddressName.addEventListener("click", () => {
      const workcondAddressTypeInfo = document.querySelector("#workcondAddressTypeInfo"); // input태그
      const workcondAddressTypeNo = document.querySelector("#workcondAddressTypeNo");
      workcondAddressTypeInfo.value = element.workcondAddressTypeInfo;
      workcondAddressTypeNo.value = element.workcondAddressTypeNo;
    })

  }
}



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




const backToRecruitmentList = () => {
  location.href = "/myPageEmp/recruitmentList";
}



// salaryNo와 salaryMount 컨테이너 가져오기
const salaryNo = document.getElementById('salaryNo');
const salaryInputContainer = document.getElementById('salary-input-container');
const salaryMount = document.getElementById('salaryMount');

// salaryNo 값 변경 이벤트
salaryNo.addEventListener('change', () => {
  const selectedValue = salaryNo.value;

  // 값이 3 또는 4일 경우
  if (selectedValue === '3' || selectedValue === '4') {
    salaryMount.value = 0; // 값 초기화 (0원)
    salaryMount.disabled = true; // 입력 비활성화
    salaryInputContainer.style.visibility = 'hidden'; // 인풋 필드와 "원" 텍스트 숨기기
  } 
  // 값이 1 또는 2일 경우
  else if (selectedValue === '1' || selectedValue === '2') {
    salaryMount.disabled = false; // 입력 활성화
    salaryMount.value = ''; // 값을 비움
    salaryInputContainer.style.visibility = 'visible'; // 인풋 필드와 "원" 텍스트 보이기
  }
});