/************************************************
 * 전역 데이터 구조
 ************************************************/
// (1) 서버에서 받아온 데이터(대분류1,2) + JS에서 임의(대분류3,4)
let mockSubcategories = {};
let mockMinorCategories = {};

// (2) 최종 선택 배열 (대분류마다 구분)
//  - 대분류1 → category1, category11
//  - 대분류2 → category2, category22
//  - 대분류3 → category31, category32, category33 ...
//  - 대분류4 → category41, category42, category43 ...
const categorySelections = {
  category1: [],
  category11: [],
  category2: [],
  category22: [],
  // 대분류3: 중분류가 여러 개라면 category31, category32 등으로 구분
  category31: [],
  category32: [],
  category33: [],
  // 대분류4도 필요 시 확장
  category41: [],
  category42: [],
  category43: []
};

// (3) 선택 상태(배열 넣기 전)
let selectedMinorCategories = {};

// (4) 대분류1,2에서 쓰이는 "중분류이름 -> 코드" 맵
let subCatNameToCodeMap = {
  1: {}, // 대분류1
  2: {}, // 대분류2
  // 대분류3,4는 슬라이스/코드처리가 없으므로 굳이 맵 없이도 가능
};

// (5) "현재 어떤 중분류가 활성화되어 있는지" (UI)
let currentSubcategoryMap = {};

// (6) 현재 선택된 대분류
let currentCategory = 1;

/************************************************
 * 서버 통신 예시
 ************************************************/
async function ca() {
  try {
    const response = await fetch("/refined/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    console.log("서버에서 받은 데이터:", data);

    // 1) 초기화
    mockSubcategories = {};
    mockMinorCategories = {};
    subCatNameToCodeMap = {
      1: {}, 
      2: {},
      // 대분류3,4는 슬라이스 쓰지 않으므로 굳이 map이 필요 없지만,
      // 혹시 대비해 남겨둬도 됨
      3: {},
      4: {}
    };

    // 2) 대분류1,2 기존 방식 처리
    const categoryMappings = [
      {
        mainCategory: 1,
        refinedSub: data.refinedAddress1,    // ex) [{ workcondAddressTypeInfo: "서울", ... }, ...]
        refinedMinor: data.refinedAddress2,  // ex) [{ workcondAddressTypeInfo: "강남구", ... }, ...]
        parentKey: "workcondAddressTypeInfo",
        childKey: "workcondAddressTypeNo"
      },
      {
        mainCategory: 2,
        refinedSub: data.refineJob1,
        refinedMinor: data.refineJob2,
        parentKey: "worktypeCategory",
        childKey: "worktypeNo"
      }
    ];

    categoryMappings.forEach(({ mainCategory, refinedSub, refinedMinor, parentKey, childKey }) => {
      if (!refinedSub) return;

      // 중분류 (대분류1,2)
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
          // ex) "0101" -> parent code "01"
          const parentCode = rawMinorCode.slice(0, 2);

          // 중분류 배열에서 parentCode와 맞는 항목 찾기
          const parentObj = refinedSub.find((p) => p[childKey]?.slice(0, 2) === parentCode);
          if (!parentObj) return;

          const parentName = parentObj[parentKey];
          if (!mockMinorCategories[parentName]) {
            mockMinorCategories[parentName] = [];
          }
          mockMinorCategories[parentName].push(item[parentKey]); 
          // ex) "강남구"
        });
      }
    });

    // 3) 대분류3,4: 중분류는 하드코딩 or 가공
    //    (예: "근무기간", "근무요일" / "근무패턴" 등)
    //    여기서는 '전체' 버튼/슬라이스 없음

    // 대분류3: 중분류 예시 - "근무기간", "근무요일"
    mockSubcategories[3] = ["근무기간", "근무요일","테스트"];
    // - "근무기간" 소분류: 서버에서 받은 data.refinePeriod2 연결
    //   ex) data.refinePeriod2 = [{ periodName: "3개월", periodCode: "P01" }, ...]
    //   사용자가 원하는 key(예: "periodName")를 매핑해 아래 push

    mockMinorCategories["근무기간"] = data.refinePeriod2.map((obj) => obj.periodName);
  
    // - "근무요일" 소분류: 임시 하드코딩 (필요에 맞게 수정)
    mockMinorCategories["근무요일"] = data.refineDays2.map((obj) => obj.daysName);

    // 대분류4: 중분류 예시 - "근무패턴" 등
    mockSubcategories[4] = ["근무패턴"];
    // - "근무패턴" 소분류: 서버에서 받을 수도 있고, 하드코딩도 가능
    //   지금은 주석 예시
    // mockMinorCategories["근무패턴"] = data.refineEtc3.map((obj) => obj.etcMinorName);
    // TODO: 필요시 다른 소분류 추가
    mockMinorCategories["근무패턴"] = ["3교대", "주말근무", "격주휴무"]; 
    // ↑ 임의 하드코딩 예시

    console.log("mockSubcategories:", mockSubcategories);
    console.log("mockMinorCategories:", mockMinorCategories);
    console.log("subCatNameToCodeMap:", subCatNameToCodeMap);

    // 4) UI 초기화 실행
    init();
  } catch (error) {
    console.error("요청 오류:", error);
  }
}


/************************************************
 * 초기화
 ************************************************/
function init() {
  // 대분류 버튼(HTML) 클릭 로직
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach((el) => el.classList.remove("active"));
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
    const li = Array.from(ul.querySelectorAll("li")).find((x) => x.dataset.id === storedSub);
    if (li) li.classList.add("active");
  } else {
    renderMinorCategories(categoryId, null);
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
      container.querySelectorAll("li").forEach((el) => el.classList.remove("active"));
      li.classList.add("active");
      currentSubcategoryMap[categoryId] = subName;
      renderMinorCategories(categoryId, subName);
    });

    container.appendChild(li);
  });
}

/************************************************
 * 소분류 렌더링
 * - 대분류1,2 => '전체' 버튼 + 슬라이스
 * - 대분류3,4 => '전체' 없음, 슬라이스 없음
 ************************************************/
function renderMinorCategories(categoryId, subName = null) {
  const container = document.getElementById("minorcategories-list");
  container.innerHTML = "";
  if (!subName) return;

  // [A] 대분류1,2는 '전체' 버튼 표시
  if (categoryId === 1 || categoryId === 2) {
    const entireLi = document.createElement("li");
    entireLi.textContent = `${subName} 전체`;
    entireLi.dataset.id = `${subName}_entire`;
    const entireKey = getEntireKey(categoryId, subName);
    if (selectedMinorCategories[entireKey]) {
      entireLi.classList.add("active");
    }
    entireLi.addEventListener("click", () => toggleEntire(categoryId, subName));
    container.appendChild(entireLi);
  }
  // [B] 대분류3,4는 '전체' 버튼 생략

  // 소분류 목록
  (mockMinorCategories[subName] || []).forEach((minor) => {
    const li = document.createElement("li");
    li.textContent = minor;
    li.dataset.id = minor;

    if (selectedMinorCategories[minor] && selectedMinorCategories[minor].category === categoryId) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => toggleMinorCategory(categoryId, minor, subName));
    container.appendChild(li);
  });
}

/************************************************
 * '전체' 토글 (대분류1,2만)
 ************************************************/
function toggleEntire(categoryId, subName) {
  // 같은 중분류 소분류 모두 해제
  (mockMinorCategories[subName] || []).forEach((m) => {
    if (selectedMinorCategories[m] && selectedMinorCategories[m].category === categoryId) {
      delete selectedMinorCategories[m];
      document.querySelector(`[data-id="${m}"]`)?.classList.remove("active");
    }
  });

  const entireKey = getEntireKey(categoryId, subName);
  if (selectedMinorCategories[entireKey]) {
    // 해제
    delete selectedMinorCategories[entireKey];
    document.querySelector(`[data-id="${subName}_entire"]`)?.classList.remove("active");
  } else {
    // 최대10개 체크
    const countInCat = countInCategory(categoryId);
    if (countInCat >= 10) {
      alert("이 대분류에서 최대 10개까지 선택 가능합니다.");
      return;
    }

    // slice(0,2)+"%"
    let codeForServer = "";
    if (subCatNameToCodeMap[categoryId] && subCatNameToCodeMap[categoryId][subName]) {
      const rawCode = subCatNameToCodeMap[categoryId][subName];
      codeForServer = rawCode.slice(0,2) + "%";
    } else {
      // 예외: 혹시 없는 경우
      codeForServer = subName; 
    }

    selectedMinorCategories[entireKey] = {
      category: categoryId,
      isEntire: true,
      displayName: `${subName} 전체`,
      codeForServer,
      subName
    };
    document.querySelector(`[data-id="${subName}_entire"]`)?.classList.add("active");
  }

  updateSelectedList();
  changeServer();
}

/************************************************
 * 소분류 토글
 * - 대분류1,2 => slice, '전체' 중복 해제
 * - 대분류3,4 => 그냥 추가/삭제
 ************************************************/
function toggleMinorCategory(categoryId, minor, subName) {
  // [A] 대분류1,2이면 '전체' 해제
  if (categoryId === 1 || categoryId === 2) {
    const entireKey = getEntireKey(categoryId, subName);
    if (selectedMinorCategories[entireKey]) {
      delete selectedMinorCategories[entireKey];
      document.querySelector(`[data-id="${subName}_entire"]`)?.classList.remove("active");
    }
  }

  // 이미 선택?
  if (selectedMinorCategories[minor] && selectedMinorCategories[minor].category === categoryId) {
    delete selectedMinorCategories[minor];
    document.querySelector(`[data-id="${minor}"]`)?.classList.remove("active");
  } else {
    // 최대10개 체크
    const countInCat = countInCategory(categoryId);
    if (countInCat >= 10) {
      alert("이 대분류에서 최대 10개까지 선택 가능합니다.");
      return;
    }

    // codeForServer
    // 대분류1,2 -> slice etc
    // 대분류3,4 -> 그냥 minor 그대로 or etcMinorCode
    let codeForServer = minor;
    
    // 만약 대분류1,2이고 subCatNameToCodeMap에서 rawCode를 찾을 수 있으면 slice(0,2)
    // (다만, 소분류는 parent code만 있고 minor code가 별도면 별도 처리)
    // 여기선 간단히 "minor" 자체를 전달

    selectedMinorCategories[minor] = {
      category: categoryId,
      isEntire: false,
      displayName: minor,
      codeForServer,
      subName
    };
    document.querySelector(`[data-id="${minor}"]`)?.classList.add("active");
  }

  updateSelectedList();
  changeServer();
}

/************************************************
 * 대분류별 현재 선택된 항목 수
 ************************************************/
function countInCategory(catId) {
  return Object.values(selectedMinorCategories).filter(v => v.category === catId).length;
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

  // (1) categorySelections 초기화
  Object.keys(categorySelections).forEach((k) => {
    categorySelections[k] = [];
  });

  // (2) selectedMinorCategories -> categorySelections
  Object.keys(selectedMinorCategories).forEach((key) => {
    const info = selectedMinorCategories[key];
    const { category, isEntire, codeForServer, subName } = info;

    // 대분류1
    if (category === 1) {
      if (isEntire) categorySelections.category11.push(codeForServer);
      else categorySelections.category1.push(codeForServer);
    }
    // 대분류2
    else if (category === 2) {
      if (isEntire) categorySelections.category22.push(codeForServer);
      else categorySelections.category2.push(codeForServer);
    }
    // 대분류3
    else if (category === 3) {
      // 예: 근무형태 -> category31, 근무요일 -> category32, ...
      // 간단히 subName으로 분기. (하드코딩 예시)
      if (subName === "근무기간") {
        categorySelections.category31.push(codeForServer);
      } 
      else if (subName === "근무요일") {
        categorySelections.category32.push(codeForServer);
      } 
      else {
        // 다른 중분류가 더 있다면 category33.. etc
        categorySelections.category33.push(codeForServer);
      }
    }
    // 대분류4
    else if (category === 4) {
      // 예: 근무패턴 -> category41 ...
      if (subName === "근무패턴") {
        categorySelections.category41.push(codeForServer);
      } 
      else {
        // 확장
        categorySelections.category42.push(codeForServer);
      }
    }
  });

  // (3) UI 그리기 (대분류별 groupMap)
  const groupMap = {
    1: [],
    2: [],
    3: [],
    4: []
  };
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
        document.querySelector(`[data-id="${key}"]`)?.classList.remove("active");

        // 중분류 활성화 해제
        if (info.subName) {
          const stillSelected = Object.values(selectedMinorCategories).some(
            (val) => val.category === info.category && val.subName === info.subName
          );
          if (!stillSelected && currentSubcategoryMap[info.category] === info.subName) {
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
  console.log("categorySelections:", categorySelections);
}

/************************************************
 * 카운트 업데이트
 ************************************************/
function updateCount() {
  // 대분류1
  const cat1Count = categorySelections.category1.length + categorySelections.category11.length;
  // 대분류2
  const cat2Count = categorySelections.category2.length + categorySelections.category22.length;
  // 대분류3 -> category31, category32, category33
  const cat3Count = categorySelections.category31.length
                  + categorySelections.category32.length
                  + categorySelections.category33.length;
  // 대분류4 -> category41, category42, category43
  const cat4Count = categorySelections.category41.length
                  + categorySelections.category42.length
                  + categorySelections.category43.length;

  // 예시로 HTML에 <span id="selection-count-1">0/10</span> 형식이라면:
  const sc1 = document.getElementById("selection-count-1");
  const sc2 = document.getElementById("selection-count-2");
  const sc3 = document.getElementById("selection-count-3");
  const sc4 = document.getElementById("selection-count-4");

  if (sc1) sc1.textContent = `${cat1Count}/10`;
  if (sc2) sc2.textContent = `${cat2Count}/10`;
  if (sc3) sc3.textContent = `${cat3Count}/10`;
  if (sc4) sc4.textContent = `${cat4Count}/10`;

  // 만약 버튼 내부 배지(name="category-count")에 표시하고 싶으면 비슷하게 적용
  document.querySelectorAll(".category-btn").forEach((btn) => {
    const catId = parseInt(btn.dataset.category, 10);
    const badge = btn.querySelector('[name="category-count"]');
    if (!badge) return;

    let cCount = 0;
    if (catId === 1) cCount = cat1Count;
    else if (catId === 2) cCount = cat2Count;
    else if (catId === 3) cCount = cat3Count;
    else if (catId === 4) cCount = cat4Count;

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
  selectedMinorCategories = {};
  currentSubcategoryMap = {};

  // 현재 대분류 버튼은 유지하고, 소분류 active 해제
  document.querySelectorAll(".active").forEach((el) => {
    if (!el.classList.contains("category-btn")) {
      el.classList.remove("active");
    }
  });

  updateSelectedList();
  defaultServer();
}


ca(); // 서버 혹은 Mock 데이터 로딩 → init();









const changeServer = async () => {
  console.log("changeServer 호출됨");
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("cp")) || 1;
 

// URL에 `cp` 파라미터를 무조건 1로 설정
window.history.replaceState(
  {},
  "",
  `${window.location.pathname}?&cp=1`
);


  try {
    const response = await fetch("/refined/listb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categorySelections }),
    });
    const data = await response.json();
    console.log("서버에서 받은 데이터:", data);

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


document.addEventListener("DOMContentLoaded", () => {
    const testButton = document.getElementById("test-btn");
  
    if (testButton) {
      testButton.addEventListener("click", () => {
        console.log("버튼 클릭됨");
        changeServer(); // changeServer 호출
      });
    } else {
      console.error("test-btn 버튼이 존재하지 않습니다.");
    }
});



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
    return "급여 정보 없음";
  }
};

// 기존 Fetch 요청 영역
// ----------------------------------------
const defaultServer = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPage = parseInt(urlParams.get("cp")) || 1;

// URL에 `cp` 파라미터를 무조건 1로 설정
window.history.replaceState(
  {},
  "",
  `${window.location.pathname}?&cp=1`
);

  try {
    // Fetch 요청
    const response = await fetch("/refined/lista", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({}), // 검색조건없는 전체조회로 바꿨기 때문에 바디로 보낼게 없어짐 (생략)
    });
    const data = await response.json();
    console.log("서버에서 받은 데이터:", data);

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
    console.log("updateUI: 빈 데이터입니다.");
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML = '<td colspan="7">공고가 존재하지 않습니다.</td>';
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
            onclick="location.href='/recruitment/detail/${item.recruitmentNo || "#"}'">
          <li>${item.recruitmentTitle || "값 없음"}</li>
          <li>${item.businessName || "값 없음"}</li>
        </ul>
      </td>
      <td>
        <span>${item.salaryMount ? `${formatSalaryAmount(item.salaryMount)} 원` : "급여 정보 없음"}</span>
        <span>${item.salaryName || "값 없음"}</span>
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
  if (!Array.isArray(data) || data.length === 0) {
    console.log("페이지네이션: 빈 데이터로 호출됨");
    return;
  }

  const itemsPerPage = 10; // 한 페이지당 항목 수
  const pagesPerGroup = 10; // 페이지 그룹당 페이지 수
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get("cp")) || 1;

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
};