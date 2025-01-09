const inputContainer = document.querySelector(".input-container");
const expAppend = document.querySelector(".exp-append");
const formElements = inputContainer.querySelectorAll("input, textarea");
const writeResumeForm = document.querySelector("#writeResumeForm");
let careerType = "newbie"; // 초기값 신입

let workTypeList = []; // 업직종저장배열(5개까지)
let careerInfoList = []; // 경력사항배열
let daysTimeList = []; // 요일시간배열
let addressList = []; // 희망근무지역배열(5개까지)

function toggleInput() {
  var selectElement = document.querySelector('select[name="salaryNo"]');
  var inputElement = document.getElementsByName("salAmount")[0]; // 배열의 첫 번째 요소 접근
  var selectedValue = selectElement.value;

  // "추후협의(시급)" 또는 "추후협의(월급)"이 선택되면 input 비활성화
  if (selectedValue == "3" || selectedValue == "4") {
    inputElement.disabled = true;
  } else {
    inputElement.disabled = false;
  }
}

toggleInput();

function showInputs(isExperienced) {
  // inputContainer 안의 모든 폼 요소들에 대해 disabled 속성 설정
  const newbieButton = document.querySelector(".newbie");
  const expButton = document.querySelector(".exp");

  if (isExperienced) {
    // 경력 버튼 활성화
    expButton.classList.add("active");
    newbieButton.classList.remove("active");

    careerType = "exp"; // 경력 세팅
    inputContainer.style.display = "block";
    expAppend.style.display = "block";

    // 모든 폼 요소들의 disabled 속성 해제
    formElements.forEach((element) => {
      element.disabled = false;
    });
    expAppend.disabled = false;
  } else {
    // 신입 버튼 활성화
    newbieButton.classList.add("active");
    expButton.classList.remove("active");

    careerType = "newbie"; // 신입 세팅
    inputContainer.style.display = "none";

    // 모든 폼 요소들에 disabled 속성 추가
    formElements.forEach((element) => {
      element.disabled = true;
    });

    expAppend.style.display = "none";
    expAppend.disabled = true;
  }
}

/* ********** 업직종 부분 ********** */
// checkObj.worktypeList 는 등록하기 클릭 시에 입력되었는지만 확인
// 업직종 대분류 클릭 했을 때 소분류 불러오기
const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) {
    el.setAttribute(key, attr[key]); // 요소에 속성 추가
    if (key == "value") el.innerText = attr[key];
  }
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

const subCategory = async (workTypeNo) => {
  const subWorkType = document.querySelector("#subWorkType"); // ul태그
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

const selectCategoryUl = document.querySelector("#selectCategoryUl");

// 클릭했을 때 선택한 업직종 추가하기(삭제 이벤트도 같이)
const addSubCategory = (liSubWorkTypeName) => {
  const selectCategory = document.querySelectorAll(".select-category");

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
  selectCategoryUl.appendChild(li);

  document
    .querySelectorAll(".subcategory-delete")
    .forEach((deleteSubcategory) => {
      deleteSubcategory.addEventListener("click", () => {
        deleteSubcategory.parentElement.remove();
      });
    });
};

/* ********** 근무지조건 관련 ********** */

const newAdd = (tag, attr, cls) => {
  const add = document.createElement(tag);
  for (let key in attr) {
    add.setAttribute(key, attr[key]);
    if (key == "value") add.innerText = attr[key];
  }
  for (let className of cls) add.classList.add(className);

  return add;
};

const selectDetailAddress = async (workcondAddressTypeNo) => {
  const subAddressType = document.querySelector("#subAddressType");
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

const selectAddressCategoryUl = document.querySelector(
  "#selectAddressCategoryUl"
);

const addSubAddressCategory = (liSubAddressName) => {
  const selectAddressCategory = document.querySelectorAll(".select-address");

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

// 경력사항 추가 버튼 클릭 시 입력 필드 추가
function expappend() {
  const inputContainer = document.querySelector(".input-container");

  // 새로운 input-container를 생성
  const newContainer = document.createElement("div");
  newContainer.className = "input-container";

  // 회사명 입력 필드
  newContainer.innerHTML = `
  <label>
    회사명:
    <input type="text" class="company-name" placeholder="회사명을 입력하세요">
  </label>
  <label>
    근무기간:
    <input type="date" class="start-date">
    <input type="date" class="end-date">
  </label>
  <label>
    담당업무:
    <textarea class="career-description" placeholder="담당업무를 입력하세요"></textarea>
    <div class="exp-char-counter">0 / 500자</div>
  </label>
`;

  // 삭제 버튼 추가
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "삭제";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.onclick = () => newContainer.remove(); // 삭제 버튼 클릭 시 해당 항목 삭제

  // 삭제 버튼을 input-container에 추가
  newContainer.appendChild(deleteBtn);

  // 새로운 필드를 form 태그 안에 추가
  inputContainer.appendChild(newContainer);
}

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

// 자기소개 textarea와 글자 수 표시 영역 선택
const textarea = document.querySelector(".selfInfo");
const expTextArea = document.querySelector(".career-description");

const charCounter = document.querySelector(".char-counter");
const expCharCounter = document.querySelector(".exp-char-counter");

// 텍스트 입력 시 글자 수 업데이트
expTextArea.addEventListener("input", () => {
  const currentLength = expTextArea.value.length; // 현재 입력된 글자 수
  const maxLength = expTextArea.getAttribute("maxlength"); // 최대 글자 수

  // 글자 수 표시 업데이트
  expCharCounter.textContent = `${currentLength} / ${maxLength}자`;
});

textarea.addEventListener("input", () => {
  const currentLength = textarea.value.length; // 현재 입력된 글자 수
  const maxLength = textarea.getAttribute("maxlength"); // 최대 글자 수

  // 글자 수 표시 업데이트
  charCounter.textContent = `${currentLength} / ${maxLength}자`;
});

const inputTitle = document.querySelector(".inputTitle");

writeResumeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // -------------- 자기소개 필수로 변경---------------
  if (textarea.value.trim().length == 0) {
    alert("자기소개를 입력해 주세요");
    return;
  }

  // -------------- 제목 입력 필수로 변경 --------------
  if (inputTitle.value.trim().length == 0) {
    alert("제목을 입력 해주세요");
    return;
  }

  // -------------- 근무형태 관련 ------------
  const partTime = document.getElementById("partTime");
  const fullTime = document.getElementById("fullTime");
  const contractor = document.getElementById("contractor");
  if (!partTime.checked && !fullTime.checked && !contractor.checked) {
    alert("근무 형태를 선택해 주세요");
    return;
  }

  // -------------- 경력사항 관련 --------------
  // 최종 경력사항 리스트
  careerInfoList = []; // 초기화

  if (careerType == "exp") {
    // 경력자라면

    const companyNameList = document.querySelectorAll(".company-name");
    const startDateList = document.querySelectorAll(".start-date");
    const endDateList = document.querySelectorAll(".end-date");
    const careerDescriptionList = document.querySelectorAll(
      ".career-description"
    );

    for (let i = 0; i < companyNameList.length; i++) {
      if (
        companyNameList[i].value.trim().length == 0 ||
        startDateList[i].value.trim().length == 0 ||
        careerDescriptionList[i].value.trim().length == 0
      ) {
        alert("경력사항 관련 필드는 비어있을 수 없습니다.");
        // endDate 제외(아직 근무중인 경우)
        return;
      }

      if (
        endDateList[i].value.trim() !== "" &&
        startDateList[i].value.trim() > endDateList[i].value.trim()
      ) {
        alert("입사일과 퇴사일을 올바르게 작성 해주세요");
        return;
      }

      let careerInfoObj = {}; // 빈 js 객체 생성

      careerInfoObj.careerNo = i; // 순서식별용 가데이터
      careerInfoObj.companyName = companyNameList[i].value;
      careerInfoObj.startDate = startDateList[i].value;
      careerInfoObj.endDate = endDateList[i].value;
      careerInfoObj.careerDescription = careerDescriptionList[i].value;

      careerInfoList.push(careerInfoObj);
    }

    const hiddenInput2 = document.createElement("input");
    hiddenInput2.type = "hidden";
    hiddenInput2.name = "careerInfoList";
    hiddenInput2.value = JSON.stringify(careerInfoList);

    writeResumeForm.appendChild(hiddenInput2);
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

  writeResumeForm.appendChild(hiddenInput3);
  //console.log(daysTimeList);
  // -------------- 급여 관련 --------------

  // -------------- 업직종 관련 --------------
  workTypeList = []; // 초기화

  for (let element of selectCategoryUl.children) {
    workTypeList.push(element.firstChild.attributes.worktypeno.value);
  }

  if (workTypeList.length == 0) {
    alert("희망 직종을 선택 해주세요");
    hiddenInput3.remove();
    if (hiddenInput2) {
      hiddenInput2.remove();
    }
    return;
  }

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "workTypeList";
  hiddenInput.value = workTypeList;

  writeResumeForm.appendChild(hiddenInput);

  // ----------------- 희망근무지역 관련 ----------------
  addressList = []; // 초기화

  for (let element of selectAddressCategoryUl.children) {
    addressList.push(element.firstChild.attributes.workcondaddresstypeno.value);
  }

  if (addressList.length == 0) {
    alert("희망 근무지를 선택 해주세요");
    hiddenInput.remove();
    hiddenInput3.remove();
    if (hiddenInput2) {
      hiddenInput2.remove();
    }
    return;
  }

  const hiddenInput4 = document.createElement("input");
  hiddenInput4.type = "hidden";
  hiddenInput4.name = "addressList";
  hiddenInput4.value = addressList;

  writeResumeForm.appendChild(hiddenInput4);

  if (formElements.disabled == true && expAppend.disabled == true) {
    const companyName = document.querySelector(".company-name");
    const startDate = document.querySelector(".start-date");
    const endDate = document.querySelector(".end-date");
    const careerDescription = document.querySelector(".career-description");

    companyName.value = "";
    startDate.value = "";
    endDate.value = "";
    careerDescription.value = "";
  }

  writeResumeForm.submit();
});
