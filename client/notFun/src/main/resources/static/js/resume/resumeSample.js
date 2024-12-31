const inputContainer = document.querySelector(".input-container");
const expAppend = document.querySelector(".exp-append");
const formElements = inputContainer.querySelectorAll('input, textarea');
function showInputs(isExperienced) {
  
  // inputContainer 안의 모든 폼 요소들에 대해 disabled 속성 설정
  
  if (isExperienced) {
    inputContainer.style.display = "block";
    expAppend.style.display = "block";
    
    // 모든 폼 요소들의 disabled 속성 해제
    formElements.forEach(element => {
      element.disabled = false;
    });
    expAppend.disabled = false;
  } else {
    inputContainer.style.display = "none";
    
    // 모든 폼 요소들에 disabled 속성 추가
    formElements.forEach(element => {
      element.disabled = true;
    });

    expAppend.style.display = "none";
    expAppend.disabled = true;
  }
}

const payNoneElements = document.getElementsByName("payNone");
payNoneElements.forEach((element) => {
  element.addEventListener("click", function () {
    // 급여 입력 필드를 비활성화
    document.getElementsByName("payInput").forEach((input) => {
      input.disabled = true;
    });
  });
});

const payHourlyElements = document.getElementsByName("payHourly");
payHourlyElements.forEach((element) => {
  element.addEventListener("click", function () {
    // 급여 입력 필드를 활성화
    document.getElementsByName("payInput").forEach((input) => {
      input.disabled = false;
    });
  });
});

// 'payMonthly'에 클릭 이벤트 추가
const payMonthlyElements = document.getElementsByName("payMonthly");
payMonthlyElements.forEach((element) => {
  element.addEventListener("click", function () {
    // 급여 입력 필드를 활성화
    document.getElementsByName("payInput").forEach((input) => {
      input.disabled = false;
    });
  });
});

/* ********** 업직종 부분 ********** */
// checkObj.worktypeList 는 등록하기 클릭 시에 입력되었는지만 확인
// 업직종 대분류 클릭 했을 때 소분류 불러오기
const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]); // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

const subCategory = async (workTypeNo) => {
  const subWorkType = document.querySelector("#subWorkType"); // ul태그
  subWorkType.innerHTML = "";

  const resp = await fetch(`/myPageEmp/selectSubWorkType/${workTypeNo}`);
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
  const selectCategory = document.querySelectorAll(".select-category");
  if (selectCategory.length >= 5) {
    alert("업직종은 최대 5개만 가능합니다");
    return;
  }

  const selectCategoryUl = document.querySelector("#selectCategoryUl");

  const subCategory = newEl(
    "input",
    {
      type: "text",
      name: "subCategory",
      readOnly: true,
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
    <input type="text" name="companyName" class="company-name" placeholder="회사명을 입력하세요">
  </label>
  <label>
    근무기간:
    <input type="date" name="startDate" class="start-date">
    <input type="date" name="endDate" class="end-date">
  </label>
  <label>
    담당업무:
    <textarea placeholder="담당업무를 입력하세요"></textarea>
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
  workDaySelect.name = "workDay";

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
  workPartSelect.name = "workPart";

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
  container.appendChild(workDaySelect);
  container.appendChild(workPartSelect);
  container.appendChild(deleteBtn);
}

const formSection = document.querySelector(".form-section");


formSection.addEventListener("submit", (e) => {

if(formElements.disabled == true && expAppend.disabled == true) {
  const companyName = document.querySelector(".company-name");
  const startDate = document.querySelector(".start-date");
  const endDate = document.querySelector(".end-date");
  const jobPart = document.querySelector(".job-part");

  companyName.value = "";
  startDate.value = "";
  endDate.value = "";
  jobPart.value = "";
}

});