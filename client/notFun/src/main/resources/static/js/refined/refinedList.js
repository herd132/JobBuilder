// 중분류/소분류를 화면에 그려줄 때 쓰는 Mock
let mockSubcategories = {};
let mockMinorCategories = {};

// 대분류별 “일반/전체” 선택 상태를 담는 객체
// 예: category1 / category11, category2 / category22 ...
const categorySelections = {
  category1: [],  // 대분류 1 (일반 소분류)
  category11: [], // 대분류 1 (전체)
  category2: [],  // 대분류 2 (일반 소분류)
  category22: [], // 대분류 2 (전체)
  category3: [],
  category33: [],
  category4: [],
  category44: []
  // 새로운 대분류가 필요하면 category5, category55 식으로 확장
};

// selectedMinorCategories는 “배열에 담기 전 임시 관리”를 위한 객체.
//  - key: 실제 표시되는 소분류명 or “전체” 임시 구분값
//  - value: { category, isEntire, displayName, codeForServer, … } 등
let selectedMinorCategories = {};

// ‘중분류 이름 → 코드’ 매핑 (대분류별 관리)
const subCatNameToCodeMap = {};

/************************************
 * 서버 연동
 ************************************/
const ca = async () => {
  try {
    const response = await fetch("/refined/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log("서버에서 받은 데이터:", data);

    // 초기화
    mockSubcategories = {};
    mockMinorCategories = {};
    for (const key in subCatNameToCodeMap) {
      delete subCatNameToCodeMap[key];
    }

    // 대분류 별 세팅
    const categoryMappings = [
      {
        refinedSub: data.refinedAddress1,
        refinedMinor: data.refinedAddress2,
        mainCategory: 1,
        parentKey: "workcondAddressTypeInfo",
        childKey: "workcondAddressTypeNo"
      },
      {
        refinedSub: data.refineJob1,
        refinedMinor: data.refineJob2,
        mainCategory: 2,
        parentKey: "worktypeCategory",
        childKey: "worktypeNo"
      },
    ];

    // mockSubcategories, mockMinorCategories 구성
    categoryMappings.forEach(({ refinedSub, refinedMinor, mainCategory, parentKey, childKey }) => {
      // 대분류별 subCatNameToCodeMap 초기화
      if (!subCatNameToCodeMap[mainCategory]) {
        subCatNameToCodeMap[mainCategory] = {};
      }

      // 1) 중분류
      if (refinedSub) {
        refinedSub.forEach((item) => {
          const subName = item[parentKey];  // 예: "서울"
          const subCode = item[childKey];   // 예: "0100"
          if (!subName || !subCode) return;

          if (!mockSubcategories[mainCategory]) {
            mockSubcategories[mainCategory] = [];
          }
          mockSubcategories[mainCategory].push(subName);

          subCatNameToCodeMap[mainCategory][subName] = subCode;
        });
      }

      // 2) 소분류
      if (refinedMinor && refinedSub) {
        refinedMinor.forEach((item) => {
          const rawMinorCode = item[childKey] || "";
          const parent2 = rawMinorCode.slice(0, 2); // 앞2자리
          // 해당 parentCode를 갖는 중분류를 찾아 subName 얻기
          const parentName = refinedSub.find((p) => p[childKey]?.slice(0,2) === parent2)?.[parentKey];
          if (!parentName) return;

          if (!mockMinorCategories[parentName]) {
            mockMinorCategories[parentName] = [];
          }
          mockMinorCategories[parentName].push(item[parentKey]); // 예: "강남구"
        });
      }
    });

    console.log("mockSubcategories:", mockSubcategories);
    console.log("mockMinorCategories:", mockMinorCategories);
    console.log("subCatNameToCodeMap:", subCatNameToCodeMap);

    // UI 초기화
    init();
  } catch (error) {
    console.error("요청 오류:", error);
  }
};

// 실행
ca();

// 현재 선택된 대분류
let currentCategory = null;

// 대분류 변경

function changeMainCategory(categoryId) {
  currentCategory = categoryId;
  renderSubcategories(categoryId);
  renderMinorCategories(categoryId);

  // 기존 선택 상태 UI 갱신
  updateSelectedList();
}

// 중분류 목록 렌더링
function renderSubcategories(categoryId) {
  const subcategoriesList = document.getElementById("subcategories-list");
  subcategoriesList.innerHTML = "";

  (mockSubcategories[categoryId] || []).forEach((subcategory) => {
    const li = document.createElement("li");
    li.textContent = subcategory;
    li.dataset.id = subcategory;

    li.addEventListener("click", () => {
      document.querySelectorAll("#subcategories-list li").forEach((el) => el.classList.remove("active"));
      li.classList.add("active");
      renderMinorCategories(categoryId, subcategory);
    });

    subcategoriesList.appendChild(li);
  });
}

//소분류 목록 렌더링
function renderMinorCategories(categoryId, subcategory = null) {
  const minorcategoriesList = document.getElementById("minorcategories-list");
  minorcategoriesList.innerHTML = "";

  if (!subcategory) return;

  // 1) '전체' 항목
  const entireLi = document.createElement("li");
  entireLi.textContent = `${subcategory} 전체`;
  entireLi.dataset.id = `${subcategory}_entire`;

  // 이미 선택된 상태라면 active
  // -> selectedMinorCategories에서 key를 찾되, isEntire = true && category = categoryId
  const entireKey = getEntireKey(categoryId, subcategory);
  if (selectedMinorCategories[entireKey]) {
    entireLi.classList.add("active");
  }

  entireLi.addEventListener("click", () => {
    toggleEntire(categoryId, subcategory);
  });
  minorcategoriesList.appendChild(entireLi);

  // 2) 개별 소분류
  (mockMinorCategories[subcategory] || []).forEach((minorCategory) => {
    const li = document.createElement("li");
    li.textContent = minorCategory;
    li.dataset.id = minorCategory;

    // 이미 선택되었다면 active
    // -> selectedMinorCategories에 "minorCategory" key가 있고, category 일치하는지
    if (selectedMinorCategories[minorCategory] && 
        selectedMinorCategories[minorCategory].category === categoryId) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      toggleMinorCategory(categoryId, minorCategory, subcategory);
    });
    minorcategoriesList.appendChild(li);
  });
}

// 전체 토글
function toggleEntire(categoryId, subName) {
  // 1) 같은 중분류 소분류 전부 해제
  (mockMinorCategories[subName] || []).forEach((minor) => {
    if (selectedMinorCategories[minor] && selectedMinorCategories[minor].category === categoryId) {
      delete selectedMinorCategories[minor];
      document.querySelector(`[data-id="${minor}"]`)?.classList.remove("active");
    }
  });

  // 2) '전체' key
  const entireKey = getEntireKey(categoryId, subName);

  // 이미 선택돼 있으면 해제
  if (selectedMinorCategories[entireKey]) {
    delete selectedMinorCategories[entireKey];
    document.querySelector(`[data-id="${subName}_entire"]`)?.classList.remove("active");
  } else {
    // 선택 가능 체크
    if (Object.keys(selectedMinorCategories).length < 10) {
      // '전체' 코드: 앞2자리 + '%'
      const rawCode = subCatNameToCodeMap[categoryId]?.[subName] || "";
      const entireCode = rawCode.slice(0,2) + "%"; 

      selectedMinorCategories[entireKey] = {
        category: categoryId,
        isEntire: true,
        displayName: `${subName} 전체`,
        codeForServer: entireCode
      };
      document.querySelector(`[data-id="${subName}_entire"]`)?.classList.add("active");
    } else {
      alert("최대 10개까지 선택 가능합니다.");
      return;
    }
  }

  updateSelectedList();
  changeServer();
}

//개별 소분류 토글
function toggleMinorCategory(categoryId, minorCategory, subName) {
  // 만약 '전체'가 선택돼 있으면 해제
  const entireKey = getEntireKey(categoryId, subName);
  if (selectedMinorCategories[entireKey]) {
    delete selectedMinorCategories[entireKey];
    document.querySelector(`[data-id="${subName}_entire"]`)?.classList.remove("active");
  }

  
  if (selectedMinorCategories[minorCategory] && 
      selectedMinorCategories[minorCategory].category === categoryId) {
    // 해제
    delete selectedMinorCategories[minorCategory];
    document.querySelector(`[data-id="${minorCategory}"]`)?.classList.remove("active");
  } else {
    // 추가
    if (Object.keys(selectedMinorCategories).length < 10) {
      selectedMinorCategories[minorCategory] = {
        category: categoryId,
        isEntire: false,
        displayName: minorCategory,
        codeForServer: minorCategory 
      };
      document.querySelector(`[data-id="${minorCategory}"]`)?.classList.add("active");
    } else {
      alert("최대 10개까지 선택 가능합니다.");
      return;
    }
  }

  updateSelectedList();
  changeServer();
}

/************************************
 * '전체' key 생성
 *  - categoryId + subName + "_entire" 형태로 고유화
 ************************************/
function getEntireKey(categoryId, subName) {
  return `entire_${categoryId}_${subName}`;
}

/************************************
 * 선택 목록 UI 렌더링
 *  - categorySelections에 담아주어야 함
 ************************************/
function updateSelectedList() {
  const selectedList = document.getElementById("selected-list");
  selectedList.innerHTML = "";

  // 1) categorySelections 초기화
  Object.keys(categorySelections).forEach((k) => {
    categorySelections[k] = [];
  });

  // 2) selectedMinorCategories -> categorySelections
  //    - isEntire: true -> category11,22,...
  //    - isEntire: false -> category1,2,...
  Object.keys(selectedMinorCategories).forEach((key) => {
    const info = selectedMinorCategories[key];
    const catId = info.category;
    const isEntire = info.isEntire;
    const codeForServer = info.codeForServer; // "01%" or 소분류명 등

    if (catId === 1) {
      if (isEntire) {
        // 대분류1 전체 -> category11
        categorySelections.category11.push(codeForServer);
      } else {
        // 대분류1 일반 -> category1
        categorySelections.category1.push(codeForServer);
      }
    } else if (catId === 2) {
      if (isEntire) {
        categorySelections.category22.push(codeForServer);
      } else {
        categorySelections.category2.push(codeForServer);
      }
    } 
    // 필요 시 catId 3,4도 else if 로 추가
  });

  const groupMap = {
    1: [], 2: [], 3: [], 4: []
  };

  // selectedMinorCategories를 순회하여 displayName을 분류
  Object.keys(selectedMinorCategories).forEach((k) => {
    const { category, displayName } = selectedMinorCategories[k];
    if (!groupMap[category]) {
      groupMap[category] = [];
    }
    groupMap[category].push({ key: k, displayName });
  });

  // 렌더링
  Object.entries(groupMap).forEach(([catId, items]) => {
    if (!items || items.length === 0) return;

    const groupDiv = document.createElement("div");
    groupDiv.classList.add("category-group");
    groupDiv.dataset.category = `category${catId}`;

    const ul = document.createElement("ul");
    items.forEach(({ key, displayName }) => {
      const li = document.createElement("li");
      li.textContent = `${displayName} X`;
      li.dataset.id = key;

      // X 버튼 -> 선택 해제
      li.addEventListener("click", () => {
        delete selectedMinorCategories[key];
        document.querySelector(`[data-id="${key}"]`)?.classList.remove("active");
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

  console.log("categorySelections:", categorySelections);
  updateCount();
}

//카운트 업데이트
function updateCount() {
  const count = Object.keys(selectedMinorCategories).length;
  document.getElementById("selection-count").textContent = `${count}/10`;

  // 대분류별 카운트
  const categoryCounts = {};
  Object.keys(selectedMinorCategories).forEach((k) => {
    const c = selectedMinorCategories[k].category;
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  });

  // category-btn 배지 표시
  document.querySelectorAll(".category-btn").forEach((btn) => {
    const cat = parseInt(btn.dataset.category, 10);
    const countBadge = btn.querySelector(".count-badge");
    if (categoryCounts[cat]) {
      countBadge.textContent = categoryCounts[cat];
      countBadge.classList.add("visible");
    } else {
      countBadge.textContent = "";
      countBadge.classList.remove("visible");
    }
  });
}

function resetFilters() {
  selectedMinorCategories = {};
  document.querySelectorAll(".active").forEach((el) => el.classList.remove("active"));
  updateSelectedList();
  defaultServer(); // 서버와 동기화
}

function init() {
  currentCategory = 1;
  changeMainCategory(currentCategory);

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach((el) => el.classList.remove("active"));
      btn.classList.add("active");

      changeMainCategory(parseInt(btn.dataset.category, 10));
    });
  });

  document.getElementById("reset-btn").addEventListener("click", resetFilters);
}

// 실행
init();








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