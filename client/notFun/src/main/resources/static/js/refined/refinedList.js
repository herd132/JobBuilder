// Mock data
var mockSubcategories = {};
var mockMinorCategories = {};
const categorySelections = {
  category1: [], // 대분류 1
  category11: [], // 대분류 1 전체선택
  category2: [], // 대분류 2
  category22: [], // 대분류 2전체선택
  category3: [], // 대분류 3
  category33: [], // 대분류 3
  category4: [],  // 대분류 4
  category44: []  // 대분류 4
};

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

    const categoryMappings = [
      {
        refinedSub: data.refinedAddress1,
        refinedMinor: data.refinedAddress2,
        mainCategory: 1,
        parentKey: "workcondAddressTypeInfo",
        childKey: "workcondAddressTypeNo", 
      },
      {
        refinedSub: data.refineJob1,
        refinedMinor: data.refineJob2,
        mainCategory: 2,
        parentKey: "worktypeCategory",  
        childKey: "worktypeNo"
      },
    ];

    categoryMappings.forEach((mapping) => {
      const { refinedSub, refinedMinor, mainCategory, parentKey, childKey } = mapping;

      // 중분류 생성
      if (refinedSub) {
        refinedSub.forEach((item) => {
          if (!item[parentKey]) {
            console.warn(`중분류 ${parentKey}가 정의되지 않음:`, item);
          } else {
            if (!mockSubcategories[mainCategory]) {
              mockSubcategories[mainCategory] = [];
            }
            mockSubcategories[mainCategory].push(item[parentKey]); // 중분류 이름 추가
          }
        });
      }

      // 소분류 생성
      if (refinedMinor) {
        refinedMinor.forEach((item) => {
          const parentName = refinedSub.find(
            (parent) =>
              parent[childKey]?.slice(0, 2) === item[childKey]?.slice(0, 2)
          )?.[parentKey];

          if (!parentName) {
            console.warn(
              `소분류 ${parentKey}에 대한 부모를 찾을 수 없음:`,
              item
            );
          } else {
            if (!mockMinorCategories[parentName]) {
              mockMinorCategories[parentName] = [];
            }
            mockMinorCategories[parentName].push(item[parentKey]); // 소분류 이름 추가
          }
        });
      }
    });

    console.log("생성된 mockSubcategories:", mockSubcategories);
    console.log("생성된 mockMinorCategories:", mockMinorCategories);

    // UI 초기화 실행
    init(); // 데이터를 가져온 뒤 초기화
  } catch (error) {
    console.error("요청 오류:", error);
  }
};


// 실행
ca();


// 상태 변수
let selectedMinorCategories = {};
let currentCategory = null; // 현재 선택된 대분류

// 대분류 변경
function changeMainCategory(categoryId) {
  currentCategory = categoryId;

  // UI 업데이트
  renderSubcategories(categoryId);
  renderMinorCategories(categoryId);

  // 기존 선택 상태를 유지한 채로 선택 목록 갱신
  updateSelectedList();
}

// 중분류 렌더링
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

// 소분류 렌더링
function renderMinorCategories(categoryId, subcategory = null) {
  const minorcategoriesList = document.getElementById("minorcategories-list");
  minorcategoriesList.innerHTML = "";

  (mockMinorCategories[subcategory] || []).forEach((minorCategory) => {
    const li = document.createElement("li");
    li.textContent = minorCategory;
    li.dataset.id = minorCategory;

    // 이미 선택된 소분류는 활성화
    if (selectedMinorCategories[minorCategory]) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => toggleMinorCategory(minorCategory, li));
    minorcategoriesList.appendChild(li);
  });
}

// 소분류 선택/해제 처리
function toggleMinorCategory(minorCategory, li) {
  if (selectedMinorCategories[minorCategory]) {
    // 선택 해제
    delete selectedMinorCategories[minorCategory];
    li.classList.remove("active");
  } else if (Object.keys(selectedMinorCategories).length < 10) {
    // 선택 추가
    selectedMinorCategories[minorCategory] = { category: currentCategory };
    li.classList.add("active");
  } else {
    alert("최대 10개까지 선택 가능합니다.");
    return;
  }

  // UI 업데이트
  updateSelectedList();

  // 서버 요청 추가
  changeServer(); // 선택 변경 시 서버와 동기화
}

// 선택된 항목을 대분류별로 그룹화하여 렌더링
function updateSelectedList() {
  const selectedList = document.getElementById("selected-list");
  selectedList.innerHTML = "";

  // 고정된 categorySelections 배열 초기화
  Object.keys(categorySelections).forEach((key) => {
    categorySelections[key] = [];
  });

  // 선택된 항목을 categorySelections에 추가
  Object.keys(selectedMinorCategories).forEach((minorCategory) => {
    const category = selectedMinorCategories[minorCategory].category;

    if (categorySelections[`category${category}`]) {
      categorySelections[`category${category}`].push(minorCategory);
    }
  });

  // UI에 선택된 항목을 대분류별로 렌더링
  Object.entries(categorySelections).forEach(([category, minorCategories]) => {
    const groupDiv = document.createElement("div");
    groupDiv.classList.add("category-group");
    groupDiv.dataset.category = category;
    
    const ul = document.createElement("ul");
    minorCategories.forEach((minorCategory) => {
      const li = document.createElement("li");
      li.textContent = `${minorCategory} X`;
      li.dataset.id = minorCategory;

      // 선택 해제 이벤트
      li.addEventListener("click", () => {
        delete selectedMinorCategories[minorCategory];
        document.querySelector(`[data-id="${minorCategory}"]`)?.classList.remove("active");
        updateSelectedList();
        changeServer(); // 선택 해제 시 서버와 동기화
      });

      ul.appendChild(li);
    });

    if (minorCategories.length > 0) {
      groupDiv.appendChild(ul);
      selectedList.appendChild(groupDiv);
    }
  });

  console.log("현재 categorySelections 상태:", categorySelections);
  updateCount();
}

// UI 카운트 업데이트
function updateCount() {
  const count = Object.keys(selectedMinorCategories).length;
  document.getElementById("selection-count").textContent = `${count}/10`;

  const categoryCounts = {};
  Object.keys(selectedMinorCategories).forEach((minorCategory) => {
    const category = selectedMinorCategories[minorCategory].category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  document.querySelectorAll(".category-btn").forEach((btn) => {
    const category = parseInt(btn.dataset.category, 10);
    const countBadge = btn.querySelector(".count-badge");

    // 카운트가 있으면 보이게, 없으면 숨기기
    if (categoryCounts[category]) {
      countBadge.textContent = categoryCounts[category];
      countBadge.classList.add("visible");
    } else {
      countBadge.textContent = '';
      countBadge.classList.remove("visible");
    }
  });
}

// 초기화 버튼 처리
function resetFilters() {
  selectedMinorCategories = {};
  document.querySelectorAll(".active").forEach((el) => el.classList.remove("active"));
  updateSelectedList();
  defaultServer(); // 초기화 시 서버와 동기화
}

// 초기화
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



