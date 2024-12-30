function showInputs(isExperienced) {
  const inputContainer = document.querySelector(".input-container");
  const expAppend = document.querySelector(".exp-append");
  if (isExperienced) {
    inputContainer.style.display = "block";
    expAppend.style.display = "block";
  } else {
    inputContainer.style.display = "none";
    expAppend.style.display = "none";
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
  const form = document.querySelector(".exp-form");

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
  form.appendChild(newContainer);
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

function submitWorkType() {
  const partTimeChecked = document.getElementById("partTime").checked;
  const fullTimeChecked = document.getElementById("fullTime").checked;

  let workTypeValue;

  if (partTimeChecked && fullTimeChecked) {
    workTypeValue = 3; // 알바와 정규직 모두 체크된 경우
  } else if (partTimeChecked) {
    workTypeValue = 1; // 알바만 체크된 경우
  } else if (fullTimeChecked) {
    workTypeValue = 2; // 정규직만 체크된 경우
  } else {
    workTypeValue = 0; // 아무것도 체크되지 않은 경우 (optional)
  }

  // 서버로 전송하는 부분 (예시로 콘솔에 출력)
  console.log("보낼 값:", workTypeValue);
}

const form = document.querySelector(".formSection");
form.addEventListener("submit", async (e) => {
  const formData = new FormData();

  const gradeNo = document.getElementById("gradeNo");
  formData.append("gradeNo", gradeNo.value);

  const subWorkType = document.getElementById("subCategory");
  formData.append("subWorkType", subWorkType.value);

  // const workTypeValue = document.getElementsByName("workType");
  // formData.append("workTypeValue", workTypeValue.value);

  const workDate = document.getElementsByName("workDate");
  formData.append("workDate", workDate.value);

  const workDay = document.getElementsByName("workDay");
  formData.append("workDay", workDay.value);

  const workPart = document.getElementsByName("workPart");
  formData.append("workPart", workPart.value);

const payType = document.getElementsByName("payType");
formData.append("payType", payType.value);

  const payInput = document.getElementsByName("payInput");
  formData.append("payInput", payInput.value);

  try {
    const resp = await fetch("/resume/writeResume", {
      method: "POST",
      body: formData,
    });

    const result = await resp.json();

    if (result > 0) {
      alert("업데이트되었습니다.");
    } else {
      alert("업데이트에 실패했습니다.");
    }
  } catch (error) {
    console.error("업데이트 중 오류 발생:", error);
    alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
  }
});


const year = document.getElementById("year");
if (!year || year === "null") {
  year = 0; // year가 null이면 기본값 0으로 설정
}