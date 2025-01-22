/************************************************
 * 섹션 상태 관리
 ************************************************/
function parseStorageState() {
  const state = sessionStorage.getItem("categoryState");
  if (state) {
    try {
      const parsedState = JSON.parse(state);
      Object.assign(selectedMinorCategories, parsedState.selectedMinorCategories || {});
      Object.assign(currentSubcategoryMap, parsedState.currentSubcategoryMap || {});
    } catch (error) {
      console.error("상태 복원 실패:", error);
    }
  }
}

function updateStorageState() {
  const state = {
    selectedMinorCategories,
    currentSubcategoryMap,
  };

  try {
    // 상태를 JSON 문자열로 저장
    sessionStorage.setItem("categoryState", JSON.stringify(state));
  } catch (error) {
    console.error("상태 저장 실패:", error);
  }
}


/************************************************
* 전역 데이터 구조
************************************************/
let mockSubcategories = {};
let mockMinorCategories = {};

const categorySelections = {
category1: [],
category11: [],
category2: [],
category22: [],
// 대분류3
category31: [],
category32: [],
category33: [],
// 대분류4
category41: [],
category42: [],
category43: [],
category44: [],
// 대분류5
category51: [],
category52: {}, // 배열에서 객체로 변경
};

let selectedMinorCategories = {};

let subCatNameToCodeMap = {
1: {},
2: {},
3: {},
4: {},
5: {},
};

let currentSubcategoryMap = {};
let currentCategory = 1;

// 대분류별 최대 선택 수
const categoryLimits = {
category1: 10, // 대분류1: 최대 10개 (요청에 따라 변경 가능)
category2: 10, // 대분류2: 최대 10개
category3: 10, // 대분류3: 최대 10개
category4: 10, // 대분류4: 최대 10개
category5: 1, // 대분류5: 최대 1개
};

/************************************************
* 숫자 포맷 함수
************************************************/
function formatNumber(n) {
return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/************************************************
* 데이터 가져오기
************************************************/
async function ca() {
try {
  // 데이터 요청 (서버와 통신)
  const response = await fetch("/refined/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();

  // 초기화
  mockSubcategories = {};
  mockMinorCategories = {};
  subCatNameToCodeMap = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };

  // 대분류1,2 처리
  const categoryMappings = [
    {
      mainCategory: 1,
      refinedSub: data.refinedAddress1,
      refinedMinor: data.refinedAddress2,
      parentKey: "workcondAddressTypeInfo",
      childKey: "workcondAddressTypeNo",
    },
    {
      mainCategory: 2,
      refinedSub: data.refineJob1,
      refinedMinor: data.refineJob2,
      parentKey: "worktypeCategory",
      childKey: "worktypeNo",
    },
  ];

  categoryMappings.forEach(
    ({ mainCategory, refinedSub, refinedMinor, parentKey, childKey }) => {
      if (!refinedSub) return;

      // 중분류
      refinedSub.forEach((item) => {
        const subName = item[parentKey];
        const subCode = item[childKey];
        if (!subName || !subCode) return;

        if (!mockSubcategories[mainCategory]) {
          mockSubcategories[mainCategory] = [];
        }
        mockSubcategories[mainCategory].push(subName);

        if (!subCatNameToCodeMap[mainCategory]) {
          subCatNameToCodeMap[mainCategory] = {};
        }
        subCatNameToCodeMap[mainCategory][subName] = subCode;
      });

      // 소분류
      if (refinedMinor) {
        refinedMinor.forEach((item) => {
          const rawMinorCode = item[childKey] || "";
          const parentCode = rawMinorCode.slice(0, 2);
          const parentObj = refinedSub.find(
            (p) => p[childKey]?.slice(0, 2) === parentCode
          );
          if (!parentObj) return;

          const parentName = parentObj[parentKey];
          if (!mockMinorCategories[parentName]) {
            mockMinorCategories[parentName] = [];
          }
          mockMinorCategories[parentName].push(item[parentKey]);
        });
      }
    }
  );

  // 대분류3
  mockSubcategories[3] = ["근무기간", "근무요일", "근무시간"];
  mockMinorCategories["근무기간"] = data.refinePeriod2.map(
    (obj) => obj.periodName
  );
  mockMinorCategories["근무요일"] = data.refineDays2.map(
    (obj) => obj.daysName
  );
  mockMinorCategories["근무시간"] = data.refineTime2.map(
    (obj) => obj.timeName
  );

  // 대분류4
  mockSubcategories[4] = ["근무형태", "학력", "복리후생", "우대사항"];
  mockMinorCategories["근무형태"] = data.refineJobType2.map(
    (obj) => obj.jobtypeName
  );
  mockMinorCategories["학력"] = data.refineGrade2.map((obj) => obj.gradeName);
  mockMinorCategories["복리후생"] = data.refineSupport2.map(
    (obj) => obj.supportCategory
  );
  mockMinorCategories["우대사항"] = data.refinePreferred2.map(
    (obj) => obj.preferredCategory
  );

  // 대분류5
  mockSubcategories[5] = ["급여형태", "직접입력"];
  mockMinorCategories["급여형태"] = data.refineSalary2.map(
    (obj) => obj.salaryName
  );
  mockMinorCategories["직접입력"] = ["시급\u00A0", "월급\u00A0"];

  parseStorageState();

  // 섹션 상태가 있으면 해당 상태로 UI 초기화 후 서버 호출
  if (Object.keys(selectedMinorCategories).length > 0 || Object.keys(currentSubcategoryMap).length > 0) {
    updateSelectedList(); // 저장된 상태로 UI 업데이트
    changeServer();       // 선택된 상태를 기반으로 서버 호출
  } else {
    defaultServer();      // 섹션 상태가 없으면 기본 서버 호출
  }

  init(); // 이벤트 핸들러와 기본 대분류 설정
} catch (error) {
  console.error("오류:", error);
}
}

/************************************************
* 초기화
************************************************/
function init() {
// 대분류 버튼 클릭 로직
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".category-btn")
      .forEach((el) => el.classList.remove("active"));
    btn.classList.add("active");
    const catId = parseInt(btn.dataset.category, 10);
    changeMainCategory(catId);
  });
});

document.getElementById("reset-btn").addEventListener("click", resetFilters);

// 기본 대분류=1
currentCategory = 1;
changeMainCategory(currentCategory);
}

/************************************************
* 대분류 변경
************************************************/
function changeMainCategory(categoryId) {
currentCategory = categoryId;
renderSubcategories(categoryId);

const storedSub = currentSubcategoryMap[categoryId];
if (storedSub) {
  renderMinorCategories(categoryId, storedSub);
  const ul = document.getElementById("subcategories-list");
  const li = Array.from(ul.querySelectorAll("li")).find(
    (x) => x.dataset.id === storedSub
  );
  if (li) li.classList.add("active");
} else {
  renderMinorCategories(categoryId, null);
}

// 대분류5일 경우 소분류를 2줄로 렌더링하기 위한 CSS 클래스 추가
if (categoryId === 5) {
  document
    .getElementById("minorcategories-list")
    .classList.add("two-columns");
} else {
  document
    .getElementById("minorcategories-list")
    .classList.remove("two-columns");
}

updateSelectedList();
}

/************************************************
* 중분류 렌더링
************************************************/
function renderSubcategories(categoryId) {
const container = document.getElementById("subcategories-list");
container.innerHTML = "";

(mockSubcategories[categoryId] || []).forEach((subName) => {
  const li = document.createElement("li");
  li.textContent = subName;
  li.dataset.id = subName;

  if (currentSubcategoryMap[categoryId] === subName) {
    li.classList.add("active");
  }

  li.addEventListener("click", () => {
    container
      .querySelectorAll("li")
      .forEach((el) => el.classList.remove("active"));
    li.classList.add("active");
    currentSubcategoryMap[categoryId] = subName;
    renderMinorCategories(categoryId, subName);
    updateStorageState();
  });

  container.appendChild(li);
});
}

/************************************************
* 소분류 렌더링
************************************************/
function renderMinorCategories(categoryId, subName = null) {
const container = document.getElementById("minorcategories-list");
container.innerHTML = "";
if (!subName) return;

// 대분류1,2 -> '전체' 버튼
if (categoryId === 1 || categoryId === 2) {
  const entireLi = document.createElement("li");
  entireLi.textContent = `${subName} 전체`;
  entireLi.dataset.id = `${subName}_entire`;
  const entireKey = getEntireKey(categoryId, subName);
  if (selectedMinorCategories[entireKey]) {
    entireLi.classList.add("active");
  }
  entireLi.addEventListener("click", () => toggleEntire(categoryId, subName));
  updateStorageState();
  container.appendChild(entireLi);
}

(mockMinorCategories[subName] || []).forEach((minor) => {
  const li = document.createElement("li");
  li.textContent = minor;
  li.dataset.id = minor;

  // 활성화 상태 확인
  if (categoryId === 5 && subName === "직접입력") {
    // 직접입력 소분류의 경우 고유 키로 활성화 상태 확인
    const uniqueKey = `${minor.trim()}_이상`;
    if (
      selectedMinorCategories[uniqueKey] &&
      selectedMinorCategories[uniqueKey].category === categoryId
    ) {
      li.classList.add("active");
    }
  } else {
    if (
      selectedMinorCategories[minor] &&
      selectedMinorCategories[minor].category === categoryId
    ) {
      li.classList.add("active");
    }
  }

  li.addEventListener("click", () => {
    toggleMinorCategory(categoryId, minor, subName);
    updateStorageState();
  });

  container.appendChild(li);
});
}

/************************************************
* '전체' 토글 (대분류1,2)
************************************************/
function toggleEntire(categoryId, subName) {
// 같은 중분류 소분류 모두 해제
(mockMinorCategories[subName] || []).forEach((m) => {
  if (
    selectedMinorCategories[m] &&
    selectedMinorCategories[m].category === categoryId
  ) {
    delete selectedMinorCategories[m];
    document.querySelector(`[data-id="${m}"]`)?.classList.remove("active");
  }
});

const entireKey = getEntireKey(categoryId, subName);
if (selectedMinorCategories[entireKey]) {
  // 해제
  delete selectedMinorCategories[entireKey];
  document
    .querySelector(`[data-id="${subName}_entire"]`)
    ?.classList.remove("active");
} else {
  // 대분류5 제외, 최대 선택 수 확인
  const countInCat = countInCategory(categoryId);
  if (countInCat >= categoryLimits[`category${categoryId}`]) {
    alert(
      `대분류${categoryId}는 최대 ${
        categoryLimits[`category${categoryId}`]
      }개까지 선택 가능합니다.`
    );
    return;
  }

  let codeForServer = "";
  if (
    subCatNameToCodeMap[categoryId] &&
    subCatNameToCodeMap[categoryId][subName]
  ) {
    const rawCode = subCatNameToCodeMap[categoryId][subName];
    codeForServer = rawCode.slice(0, 2) + "%";
  } else {
    codeForServer = subName;
  }

  selectedMinorCategories[entireKey] = {
    category: categoryId,
    isEntire: true,
    displayName: `${subName} 전체`,
    codeForServer,
    subName,
  };
  document
    .querySelector(`[data-id="${subName}_entire"]`)
    ?.classList.add("active");
}

updateSelectedList();
changeServer();
}

/************************************************
* 소분류 토글
************************************************/
function toggleMinorCategory(categoryId, minor, subName) {
// 대분류5의 소분류 처리
if (categoryId === 5) {
  // "직접입력" 소분류인 경우
  if (
    subName === "직접입력" &&
    (minor === "시급\u00A0" || minor === "월급\u00A0")
  ) {
    // 고유 키 생성 (예: 시급_이상, 월급_이상)
    const uniqueKey = `${minor.trim()}_이상`;

    if (selectedMinorCategories[uniqueKey]) {
      // 이미 선택된 경우 해제
      delete selectedMinorCategories[uniqueKey];
      document
        .querySelector(`[data-id="${minor}"]`)
        ?.classList.remove("active");
      updateSelectedList();
      changeServer();
      return;
    }

    // 최대 선택 수 확인 (대분류5는 최대 1개)
    const countInCat = countInCategory(categoryId);
    if (countInCat >= categoryLimits[`category${categoryId}`]) {
      alert(`더이상 추가할 수 없습니다.`);
      return;
    }

    // 금액 입력 받기
    let userInput = prompt(`${minor.trim()} 금액을 입력하세요 (1원 이상):`);

    if (userInput === null) {
      // 취소
      return;
    }
    userInput = userInput.trim();

    if (userInput === "") {
      alert("금액을 입력해야 합니다.");
      return;
    }

    // 천 단위 구분 기호 제거 후 숫자 변환
    const amountNum = parseInt(userInput.replace(/,/g, ""), 10);
    if (isNaN(amountNum)) {
      alert("숫자만 입력 가능합니다.");
      return;
    }
    if (amountNum < 1) {
      alert("1원 이상 입력해야 합니다.");
      return;
    }

    // 선택 영역에 표시 (1000 단위마다 , 추가)
    const displayText = `${minor.trim()} ${formatNumber(amountNum)}원 이상`;

    // codeForServer = { salaryNo: number, salaryMount: number }
    const salaryNo = minor === "시급\u00A0" ? 1 : 2;
    const codeForServer = {
      salaryNo: salaryNo, // int
      salaryMount: amountNum, // int
    };

    selectedMinorCategories[uniqueKey] = {
      category: categoryId,
      isEntire: false,
      displayName: displayText,
      codeForServer: codeForServer,
      subName,
    };
    document.querySelector(`[data-id="${minor}"]`)?.classList.add("active");

    updateSelectedList();
    changeServer();
    return;
  }

  // "급여형태" 소분류인 경우
  if (subName === "급여형태") {
    if (
      selectedMinorCategories[minor] &&
      selectedMinorCategories[minor].category === categoryId
    ) {
      // 이미 선택된 경우 해제
      delete selectedMinorCategories[minor];
      document
        .querySelector(`[data-id="${minor}"]`)
        ?.classList.remove("active");
      updateSelectedList();
      changeServer();
      return;
    }

    // 최대 선택 수 확인 (대분류5는 최대 1개)
    const countInCat = countInCategory(categoryId);
    if (countInCat >= categoryLimits[`category${categoryId}`]) {
      alert(`더이상 추가할 수 없습니다.`);
      return;
    }

    // 일반 선택
    selectedMinorCategories[minor] = {
      category: categoryId,
      isEntire: false,
      displayName: minor,
      codeForServer: minor,
      subName,
    };
    document.querySelector(`[data-id="${minor}"]`)?.classList.add("active");

    updateSelectedList();
    changeServer();
    return;
  }
} else {
  // 대분류1,2,3,4의 일반 소분류 처리

  // 이미 선택된 소분류라면 해제
  if (
    selectedMinorCategories[minor] &&
    selectedMinorCategories[minor].category === categoryId
  ) {
    delete selectedMinorCategories[minor];
    document
      .querySelector(`[data-id="${minor}"]`)
      ?.classList.remove("active");
    updateSelectedList();
    changeServer();
    return;
  }

  // 대분류1,2 -> '전체' 해제
  if (categoryId === 1 || categoryId === 2) {
    const entireKey = getEntireKey(categoryId, subName);
    if (selectedMinorCategories[entireKey]) {
      delete selectedMinorCategories[entireKey];
      document
        .querySelector(`[data-id="${subName}_entire"]`)
        ?.classList.remove("active");
    }
  }

  // 다른 대분류는 최대 선택 수 확인
  const countInCat = countInCategory(categoryId);
  if (countInCat >= categoryLimits[`category${categoryId}`]) {
    alert(`더이상 추가할 수 없습니다.`);
    return;
  }

  // 일반 선택
  let codeForServer = minor;
  selectedMinorCategories[minor] = {
    category: categoryId,
    isEntire: false,
    displayName: minor,
    codeForServer,
    subName,
  };
  document.querySelector(`[data-id="${minor}"]`)?.classList.add("active");

  updateSelectedList();
  changeServer();
}
}

/************************************************
* 대분류별 현재 선택된 항목 수
************************************************/
function countInCategory(catId) {
if (catId === 5) {
  // 대분류5는 category51.length + (category52 has selection ? 1 : 0)
  let count = categorySelections.category51.length;
  if (
    categorySelections.category52.salaryNo !== undefined &&
    categorySelections.category52.salaryMount !== undefined
  ) {
    count += 1;
  }
  return count;
}
return Object.values(selectedMinorCategories).filter(
  (v) => v.category === catId
).length;
}

/************************************************
* '전체' key
************************************************/
function getEntireKey(categoryId, subName) {
return `entire_${categoryId}_${subName}`;
}

/************************************************
* 선택 목록 UI
************************************************/
function updateSelectedList() {
const selectedList = document.getElementById("selected-list");
selectedList.innerHTML = "";

// 초기화
Object.keys(categorySelections).forEach((k) => {
  if (k === "category52") {
    categorySelections[k] = {}; // 객체로 초기화
  } else {
    categorySelections[k] = [];
  }
});

// selectedMinorCategories -> categorySelections
Object.keys(selectedMinorCategories).forEach((key) => {
  const info = selectedMinorCategories[key];
  const { category, isEntire, codeForServer, subName } = info;

  if (category === 1) {
    if (isEntire) categorySelections.category11.push(codeForServer);
    else categorySelections.category1.push(codeForServer);
  } else if (category === 2) {
    if (isEntire) categorySelections.category22.push(codeForServer);
    else categorySelections.category2.push(codeForServer);
  } else if (category === 3) {
    if (subName === "근무기간")
      categorySelections.category31.push(codeForServer);
    else if (subName === "근무요일")
      categorySelections.category32.push(codeForServer);
    else categorySelections.category33.push(codeForServer);
  } else if (category === 4) {
    if (subName === "근무형태")
      categorySelections.category41.push(codeForServer);
    else if (subName === "학력")
      categorySelections.category42.push(codeForServer);
    else if (subName === "복리후생")
      categorySelections.category43.push(codeForServer);
    else categorySelections.category44.push(codeForServer);
  }
  // 대분류5
  else if (category === 5) {
    if (subName === "급여형태") {
      // 예) "정규직" 등
      categorySelections.category51.push(codeForServer);
    } else {
      // 직접입력 => codeForServer = { salaryNo: int, salaryMount: int }
      // category52은 객체로 저장
      categorySelections.category52.salaryNo = codeForServer.salaryNo;
      categorySelections.category52.salaryMount = codeForServer.salaryMount;
    }
  }
});

// UI 그리기
const groupMap = { 1: [], 2: [], 3: [], 4: [], 5: [] };
Object.entries(selectedMinorCategories).forEach(([k, v]) => {
  const cat = v.category;
  groupMap[cat].push({ key: k, info: v });
});

Object.entries(groupMap).forEach(([catId, items]) => {
  if (!items || items.length === 0) return;
  const groupDiv = document.createElement("div");
  groupDiv.classList.add("category-group");
  groupDiv.dataset.category = catId;

  const ul = document.createElement("ul");
  items.forEach(({ key, info }) => {
    const li = document.createElement("li");
    li.textContent = info.displayName + " X";
    li.dataset.id = key;

    // X 클릭 -> 해제
    li.addEventListener("click", () => {
      delete selectedMinorCategories[key];
      document
        .querySelector(`[data-id="${key}"]`)
        ?.classList.remove("active");

      if (info.subName) {
        const stillSelected = Object.values(selectedMinorCategories).some(
          (val) =>
            val.category === info.category && val.subName === info.subName
        );
        if (
          !stillSelected &&
          currentSubcategoryMap[info.category] === info.subName
        ) {
          currentSubcategoryMap[info.category] = null;
        }
      }

      updateSelectedList();
      changeServer();
    });

    ul.appendChild(li);
  });

  if (items.length > 0) {
    groupDiv.appendChild(ul);
    selectedList.appendChild(groupDiv);
  }
});

updateCount();
}

/************************************************
* 카운트 업데이트
************************************************/
function updateCount() {
const cat1Count =
  categorySelections.category1.length + categorySelections.category11.length;
const cat2Count =
  categorySelections.category2.length + categorySelections.category22.length;
const cat3Count =
  categorySelections.category31.length +
  categorySelections.category32.length +
  categorySelections.category33.length;
const cat4Count =
  categorySelections.category41.length +
  categorySelections.category42.length +
  categorySelections.category43.length +
  categorySelections.category44.length;
const cat5Count =
  categorySelections.category51.length +
  (categorySelections.category52.salaryMount !== undefined ? 1 : 0);

// 예: <span id="selection-count-1">0/10</span>
const sc1 = document.getElementById("selection-count-1");
const sc2 = document.getElementById("selection-count-2");
const sc3 = document.getElementById("selection-count-3");
const sc4 = document.getElementById("selection-count-4");
const sc5 = document.getElementById("selection-count-5");

if (sc1) sc1.textContent = `${cat1Count}/10`;
if (sc2) sc2.textContent = `${cat2Count}/10`;
if (sc3) sc3.textContent = `${cat3Count}/10`;
if (sc4) sc4.textContent = `${cat4Count}/10`;
if (sc5) sc5.textContent = `${cat5Count}/1`;

// 버튼 배지(name="category-count") 처리
document.querySelectorAll(".category-btn").forEach((btn) => {
  const catId = parseInt(btn.dataset.category, 10);
  const badge = btn.querySelector('[name="category-count"]');
  if (!badge) return;

  let cCount = 0;
  if (catId === 1) cCount = cat1Count;
  else if (catId === 2) cCount = cat2Count;
  else if (catId === 3) cCount = cat3Count;
  else if (catId === 4) cCount = cat4Count;
  else if (catId === 5) cCount = cat5Count;

  if (cCount > 0) {
    badge.textContent = cCount;
    badge.classList.add("visible");
  } else {
    badge.textContent = "";
    badge.classList.remove("visible");
  }
});
}

/************************************************
* reset & 서버 동기화
************************************************/
function resetFilters() {
// 섹션에 저장된 상태 가져오기
const sessionState = sessionStorage.getItem("paginationState");
let updatedState = {};

if (sessionState) {
  try {
    const parsedState = JSON.parse(sessionState);
    // 기존 섹션 데이터에서 페이지와 관련된 데이터만 초기화
    updatedState = {
      ...parsedState,
      currentPage: 1, // cp 값을 1로 초기화
      selectedMinorCategories: {}, // 선택된 카테고리 초기화
      currentSubcategoryMap: {}, // 현재 소분류 초기화
    };
  } catch (error) {
    console.error("섹션 상태 복원 실패:", error);
  }
}

// 업데이트된 상태를 섹션에 저장
sessionStorage.setItem("paginationState", JSON.stringify(updatedState));

// 전역 데이터 초기화
selectedMinorCategories = {};
currentSubcategoryMap = {};

// 현재 대분류 버튼은 유지하고, 소분류 active 해제
document.querySelectorAll(".active").forEach((el) => {
  if (!el.classList.contains("category-btn")) {
    el.classList.remove("active");
  }
});

updateSelectedList();

// 디폴트 서버 호출
defaultServer();

// URL에 `cp` 파라미터를 무조건 1로 설정
window.history.replaceState({}, "", `${window.location.pathname}?&cp=1`);
}


ca(); // 데이터를 로딩한 후 init();

/************************************************
* CSS 추가 (대분류5의 소분류를 2줄로 렌더링하기 위해)
************************************************/
(function addTwoColumnsCSS() {
const style = document.createElement("style");
style.innerHTML = `
  .two-columns {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  /* 추가적인 CSS 스타일링을 원하시면 여기에 작성하세요 */
  #minorcategories-list.two-columns li {
    /* 예시: 가운데 정렬 */
    text-align: center;
  }
`;
document.head.appendChild(style);
})();

const changeServer = async () => {
const urlParams = new URLSearchParams(window.location.search);
const currentPage = parseInt(urlParams.get("cp")) || 1;

// URL에 `cp` 파라미터를 무조건 1로 설정
window.history.replaceState({}, "", `${window.location.pathname}?&cp=1`);

try {
  const response = await fetch("/refined/listb", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ categorySelections }),
  });
  const data = await response.json();

  const recruitment = data.recruitment || [];
  const itemsPerPage = 10;
  const paginatedData = recruitment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  updateUI(paginatedData);
  createPagination(recruitment, document.getElementById("pagination"));
} catch (error) {
  console.error("요청 오류:", error);
}
};

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
  : dateString.split(" ")[0];
};

// 마감 시간 변환
const formatDeadline = (futureDateString) => {
if (!futureDateString) return "마감 정보 없음";

const now = new Date();
const futureDate = new Date(futureDateString);
const diff = Math.floor((futureDate - now) / 1000 / 60);

if (diff < 0) {
  return "마감 완료";
} else if (diff < 60) {
  return `마감 ${diff}분 전`;
} else if (diff < 1440) {
  return `마감 ${Math.floor(diff / 60)}시간 전`;
} else {
  return futureDateString.split(" ")[0];
}
};

// 숫자 천 단위 콤마
const formatSalaryAmount = (amount) =>
amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

// 급여 변환
const formatSalary = (salaryNo, salaryAmount, salaryName = "") => {
const formattedAmount = formatSalaryAmount(salaryAmount);

if (salaryNo === 1 || salaryNo === 2) {
  return `${salaryName} ${formattedAmount} 원`;
} else if (salaryNo === 3 || salaryNo === 4) {
  return `${salaryName}`;
} else {
  return "";
}
};

// 기존 Fetch 요청 영역
// ----------------------------------------
const defaultServer = async () => {
// 섹션 상태 확인
const sessionState = sessionStorage.getItem("paginationState");
let currentPage = 1;

if (sessionState) {
  try {
    const parsedState = JSON.parse(sessionState);
    currentPage = parsedState.currentPage || 1; // 섹션에서 cp 값 복원
  } catch (error) {
    console.error("섹션 상태 복원 실패:", error);
  }
} else {
  // URL에서 cp 값 확인
  const urlParams = new URLSearchParams(window.location.search);
  currentPage = parseInt(urlParams.get("cp")) || 1;
}

// URL에 cp 값 반영
window.history.replaceState({}, "", `${window.location.pathname}?&cp=${currentPage}`);

try {
  // Fetch 요청
  const response = await fetch("/refined/lista", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({}), // 검색조건없는 전체조회로 바꿨기 때문에 바디로 보낼게 없어짐 (생략)
  });
  const data = await response.json();

  const recruitment = data.recruitment || [];
  const itemsPerPage = 10; // 한 페이지당 항목 수
  const paginatedData = recruitment.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // UI 업데이트
  updateUI(paginatedData);
  // 페이지네이션 로직 호출
  createPagination(recruitment, document.getElementById("pagination"));
} catch (error) {
  console.error("요청 오류:", error);
}
};


defaultServer();

const updateUI = (recruitment) => {
const recruitmentBody = document.getElementById("recruitmentbody");

// 기존 내용을 초기화
recruitmentBody.innerHTML = "";

if (!recruitment || recruitment.length === 0) {
  const noDataRow = document.createElement("tr");
  noDataRow.innerHTML = '<td><td><td><td colspan="7">공고가 존재하지 않습니다.</td>';
  recruitmentBody.appendChild(noDataRow);
  return;
}

recruitment.forEach((item) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${item.recruitmentNo || "값 없음"}</td>
    <td>${item.businessAddress || "값 없음"}</td>
    <td>
      <ul recruitmentNo="${
        item.recruitmentNo || "값 없음"
      }" style="cursor: pointer;"
          onclick="location.href='/recruitment/detail/${
            item.recruitmentNo || "#"
          }'">
        <li>${item.recruitmentTitle || "값 없음"}</li>
        <li>${item.businessName || "값 없음"}</li>
      </ul>
    </td>
    <td>
      <span>${
        item.salaryMount ? `${formatSalaryAmount(item.salaryMount)} 원` : ""
      }</span>
      <span 
        class="${item.salaryMount !== 0 ? "salary-type-badge" : ""} ${item.salaryMount !== 0 && item.salaryName === "시급" ? "salary-hourly" : ""}">
        ${item.salaryName || "값 없음"}
      </span>
    </td>
    <td>${item.timeName || "값 없음"}</td>
    <td>${formatTime(item.writeDate) || "작성 시간 없음"}</td>
    <td>${formatDeadline(item.recruitmentDeadline) || "값 없음"}</td>
  `;

  recruitmentBody.appendChild(row);
});



};

// 페이지네이션 로직
const createPagination = (data, paginationContainer) => {
// 데이터가 없을 경우 페이지네이션 컨테이너를 비우고 종료
if (!Array.isArray(data) || data.length === 0) {
  paginationContainer.innerHTML = ""; // 기존 페이지네이션 초기화
  return;
}
const listCountElement = document.getElementById("listCount");
listCountElement.textContent = data.length;
const itemsPerPage = 10; // 한 페이지당 항목 수
const pagesPerGroup = 10; // 페이지 그룹당 페이지 수
const totalPages = Math.ceil(data.length / itemsPerPage);

// 섹션에서 현재 페이지 상태 복원
const sessionState = sessionStorage.getItem("paginationState");
let currentPage = sessionState ? JSON.parse(sessionState).currentPage : 1;

// URL 우선 -> 섹션 상태 복원
const urlParams = new URLSearchParams(window.location.search);
const urlPage = parseInt(urlParams.get("cp")) || null;
if (urlPage && urlPage !== currentPage) {
  currentPage = urlPage; // URL에서 설정된 페이지를 우선 사용
}

// 현재 그룹 계산
const currentGroup = Math.ceil(currentPage / pagesPerGroup);
const groupStartPage = (currentGroup - 1) * pagesPerGroup + 1;
const groupEndPage = Math.min(currentGroup * pagesPerGroup, totalPages);

paginationContainer.innerHTML = ""; // 기존 페이지네이션 초기화

// 공통 링크 생성 함수
const createLink = (text, targetPage, isCurrent = false) => {
  const link = document.createElement("a");
  link.textContent = text;
  link.href = `?&cp=${targetPage}`;
  link.className = "pagination-link"; // 공통 클래스 추가

  if (isCurrent) {
    link.classList.add("current"); // 현재 페이지일 경우 추가 클래스
  }

  link.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = targetPage;

    // 섹션에 현재 페이지 상태 저장
    sessionStorage.setItem("paginationState", JSON.stringify({ currentPage }));

    window.history.pushState({}, "", `?&cp=${currentPage}`);
    const paginatedData = data.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    updateUI(paginatedData); // UI 갱신
    createPagination(data, paginationContainer); // 페이지네이션 갱신
  });

  return link;
};

// << : 제일 처음으로 이동
paginationContainer.appendChild(createLink("<<", 1));

// < : 이전 그룹으로 이동
if (currentGroup > 1) {
  paginationContainer.appendChild(createLink("<", groupStartPage - 1));
}

// 현재 그룹의 페이지 번호 출력
const pageLinksContainer = document.createElement("div");
pageLinksContainer.style.margin = "0 2rem"; // 그룹 링크 감싸는 div에 마진 추가
paginationContainer.appendChild(pageLinksContainer);

for (let i = groupStartPage; i <= groupEndPage; i++) {
  pageLinksContainer.appendChild(createLink(i, i, i === currentPage));
}

// > : 다음 그룹으로 이동
if (currentGroup * pagesPerGroup < totalPages) {
  paginationContainer.appendChild(createLink(">", groupEndPage + 1));
}

// >> : 제일 마지막으로 이동
paginationContainer.appendChild(createLink(">>", totalPages));

// 현재 페이지에 해당하는 데이터 렌더링
const paginatedData = data.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);
updateUI(paginatedData);
};
