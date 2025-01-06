// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};

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