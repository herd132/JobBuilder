let recruitmentData = [];




// Mock data
const mockSubcategories = {
  1: ["중분류1-1", "중분류1-2"],
  2: ["중분류2-1", "중분류2-2"],
  3: ["중분류3-1", "중분류3-2"],
  4: ["중분류4-1", "중분류4-2"],
};

const mockMinorCategories = {
  "중분류1-1": ["소분류1-1-1", "소분류1-1-2"],
  "중분류1-2": ["소분류1-2-1", "소분류1-2-2" , "소분류1-2-3" , "소분류1-2-4" , "소분류1-2-5"],
  "중분류2-1": ["소분류2-1-1", "소분류2-1-2" , "소분류2-1-3" , "소분류2-1-4" , "소분류2-1-5" , 
                "소분류2-1-6" , "소분류2-1-7" , "소분류2-1-8" , "소분류2-1-9"],
  "중분류2-2": ["소분류2-2-1", "소분류2-2-2" , "소분류2-2-3" , "소분류2-2-4" , "소분류2-2-5"]
};

// 상태 변수
let selectedMinorCategories = {};
let currentCategory = null; // 현재 선택된 대분류
let server = []; // 서버 상태 시뮬레이션
let serverLogIndex = 1; // 로그 인덱스
let isInitialState = "N"; // 초기 상태 (Y: 초기 상태, N: 일반 상태)

// 서버 상태를 동적으로 업데이트
function serverUpdate() {
  if (isInitialState === "Y") return; // 초기 상태일 경우 실행하지 않음
  changeServer();
  server.push([...Object.keys(selectedMinorCategories)]);
  console.log(`${serverLogIndex}:`, [...server[serverLogIndex - 1]]); // 서버 상태 출력
  serverLogIndex++;
  isInitialState = "N"; // 일반 상태로 전환
}

// 서버를 초기 상태로 리셋
function serverUpdate2() {
  if (isInitialState === "Y") return; // 이미 초기 상태면 실행하지 않음
  defaultServer()
  const initialData = ["초기값"];
  server.push(initialData);
  console.log(`${serverLogIndex}:`, initialData); // 초기값 출력
  serverLogIndex++;
  isInitialState = "Y"; // 초기 상태로 설정
}

// UI 카운트를 동적으로 업데이트
function updateCount() {
  const count = Object.keys(selectedMinorCategories).length;
  document.getElementById("selection-count").textContent = `${count}/10`;
  const elements = document.getElementsByClassName("count-badge");
  Array.from(elements).forEach((element) => {
    element.textContent = `${count}`; // count 값을 업데이트

    if (count > 0) {
      element.style.visibility = "visible"; // 1 이상일 때 보이게
    } else {
      element.style.visibility = "hidden"; // 0일 때 숨기기
    }
  });

  
  // 선택된 항목이 없으면 서버를 초기화
  if (count === 0) {
    serverUpdate2();
  } else {
    isInitialState = "N"; // 항목이 존재하면 일반 상태로 설정
  }
}

// 특정 소분류 항목의 활성/비활성 상태를 토글
function toggleActiveState(parentList, minorCategory, active) {
  parentList.querySelectorAll("li").forEach((li) => {
    if (minorCategory) {
      if (li.dataset.id === minorCategory) {
        li.classList.toggle("active", active);
      }
    } else {
      // 모든 항목 비활성화
      li.classList.remove("active");
    }
  });
}

// 특정 항목을 활성화
function toggleActive(element, parentId) {
  document.getElementById(parentId).querySelectorAll("li").forEach((el) => {
    el.classList.remove("active");
  });
  element.classList.add("active");
}

// 대분류 변경
function changeMainCategory(categoryId) {
  // 대분류 변경 시 초기화
  selectedMinorCategories = {};
  updateSelectedList();
  currentCategory = categoryId;

  // UI 업데이트
  renderSubcategories(categoryId);
  renderMinorCategories(categoryId);

  // 초기 상태에서 서버 초기화
  serverUpdate2();
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
      toggleActive(li, "subcategories-list");
      hideAllMinorCategories();
      showMinorCategories(subcategory);
    });

    subcategoriesList.appendChild(li);
  });
}

// 소분류 렌더링
function renderMinorCategories(categoryId) {
  const minorcategoriesList = document.getElementById("minorcategories-list");
  minorcategoriesList.innerHTML = "";

  (mockSubcategories[categoryId] || []).forEach((subcategory) => {
    (mockMinorCategories[subcategory] || []).forEach((minorCategory) => {
      const li = document.createElement("li");
      li.textContent = minorCategory;
      li.dataset.id = minorCategory;
      li.dataset.parent = subcategory;

      // 이미 선택된 항목이면 활성 상태 유지
      if (selectedMinorCategories[minorCategory]) {
        li.classList.add("active");
      }

      li.addEventListener("click", () => toggleMinorCategory(minorCategory, li));
      minorcategoriesList.appendChild(li);
      li.style.display = "none"; // 기본적으로 숨김 상태
    });
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
    selectedMinorCategories[minorCategory] = true;
    li.classList.add("active");
  } else {
    // 10개 초과 시 경고 메시지 출력
    alert("선택은 10개까지만 가능합니다.");
    return; // 추가하지 않음
  }

  // UI와 서버 업데이트
  updateSelectedList();
  serverUpdate();
}

// 세 번째 줄(선택된 항목) 업데이트
function updateSelectedList() {
  const selectedList = document.getElementById("selected-list");
  selectedList.innerHTML = "";

  Object.keys(selectedMinorCategories).forEach((minorCategory) => {
    const li = document.createElement("li");
    li.textContent = `${minorCategory} X`;
    li.dataset.id = minorCategory;

    li.addEventListener("click", () => {
      delete selectedMinorCategories[minorCategory];
      toggleActiveState(
        document.getElementById("minorcategories-list"),
        minorCategory,
        false
      );
      updateSelectedList();
      serverUpdate();
    });

    selectedList.appendChild(li);
  });

  updateCount();
}

// 필터 초기화
function resetFilters() {
  // 상태 및 UI 초기화
  selectedMinorCategories = {};
  updateSelectedList();
  toggleActiveState(document.getElementById("minorcategories-list"), null, false);
  renderSubcategories(currentCategory);
  hideAllMinorCategories();

  // 서버 초기화
  serverUpdate2();
}

// 오른쪽 패널의 모든 소분류 숨기기
function hideAllMinorCategories() {
  const minorcategoriesList = document.getElementById("minorcategories-list");
  minorcategoriesList.querySelectorAll("li").forEach((li) => {
    li.style.display = "none";
  });
}

// 특정 중분류에 해당하는 소분류 표시
function showMinorCategories(subcategory) {
  const minorcategoriesList = document.getElementById("minorcategories-list");
  minorcategoriesList.querySelectorAll(`[data-parent="${subcategory}"]`).forEach((li) => {
    li.style.display = "block";
  });
}

// UI 초기화
function init() {
  currentCategory = 1;
  renderSubcategories(currentCategory);
  renderMinorCategories(currentCategory);

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      changeMainCategory(btn.getAttribute("data-category"));
    });
  });

  document.getElementById("reset-btn").addEventListener("click", resetFilters);
}

// 페이지 로드 시 초기화 실행
init();


document.getElementById("test-btn").addEventListener("click", () => {
  changeServer(); // 함수 호출
});




const changeServer = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get("cp")) || 1; // 기본값 1
  
    
    // `resumeNo`가 없는 경우 URL을 업데이트
    if (!urlParams.has("cp")) {
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?&cp=${currentPage}`
      );
    }
     
  
  const recruitmentNo = 16;
    // Fetch 요청 제거 후 데이터를 받아오는 로직 수정
    fetch("/refined/listb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recruitmentNo: recruitmentNo }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("서버에서 받은 데이터:", data);
  
        const {
          /*
          resume,
          recommendations,
          resumeDaysTime,
          resumeJobTypeList,
          resumeWorkType,
          workcondAddressTypeInfo,
          */
  
          recruitment,
        } = data;
  
        // 전역 변수에 데이터 저장
      
        recruitmentData = recruitment;
        
  
        // 페이지네이션 처리 및 데이터 로드
        const itemsPerPage = 10; // 한 페이지당 항목 수
        const paginatedData = recruitment.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );
  
        // UI 업데이트
        updateUI(
          /*
          resume,
          resumeDaysTime,
          resumeJobTypeList,
          resumeWorkType,
          workcondAddressTypeInfo
          */
          recruitmentData,
          paginatedData,
        );
        // 페이지네이션 로직 호출
        createPagination(recruitment, document.getElementById("pagination"));
      })
  
   
      .catch((error) => {
        console.error("요청 오류:", error);
      });
  
   });

  };
  changeServer();

















// 전역 변수 및 유틸리티 함수 영역
// ----------------------------------------
/*
let resumeData = {};

let resumeDaysTimeData = {};
let resumeJobTypeListData = {};
let resumeWorkTypeData = {};
let workcondAddressTypeInfoData = {};

*/


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
const defaultServer = () => {
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get("cp")) || 1; // 기본값 1

  
  // `resumeNo`가 없는 경우 URL을 업데이트
  if (!urlParams.has("cp")) {
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?&cp=${currentPage}`
    );
  }
   

const recruitmentNo = 16;
  // Fetch 요청 제거 후 데이터를 받아오는 로직 수정
  fetch("/refined/lista", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recruitmentNo: recruitmentNo }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("서버에서 받은 데이터:", data);

      const {
        /*
        resume,
        recommendations,
        resumeDaysTime,
        resumeJobTypeList,
        resumeWorkType,
        workcondAddressTypeInfo,
        */

        recruitment,
      } = data;

      // 전역 변수에 데이터 저장
      recruitmentData = recruitment;
      

      // 페이지네이션 처리 및 데이터 로드
      const itemsPerPage = 10; // 한 페이지당 항목 수
      const paginatedData = recruitment.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      // UI 업데이트
      updateUI(
        /*
        resume,
        resumeDaysTime,
        resumeJobTypeList,
        resumeWorkType,
        workcondAddressTypeInfo
        */
        paginatedData,
      );

      // 페이지네이션 로직 호출
      createPagination(recruitment, document.getElementById("pagination"));
    })

 
    .catch((error) => {
      console.error("요청 오류:", error);
    });

 });

};





// 기존 UI 업데이트 함수 영역
// ----------------------------------------
const updateUI = (
/*
  resume,
  resumeDaysTime,
  resumeJobTypeList,
  resumeWorkType,
  workcondAddressTypeInfo
*/
recruitmentData,
) => {

  /*
  // 작성시간
  const writetime = resume.modificationDate
    ? resume.modificationDate
    : resume.registrationDate;
  document.getElementById("writetime").innerHTML = `${formatTime(writetime)}`;

  // 근무지역 배열
  const workcondAddressTypeList = document.getElementById(
    "workcondAddressTypeInfo"
  );
  workcondAddressTypeInfo.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item; // 텍스트 내용 설정
    if (index < workcondAddressTypeInfo.length - 1) {
      span.textContent += ", ";
    }
    workcondAddressTypeList.appendChild(span);
  });

  // 근무직종 배열
  const workTypeList = document.getElementById("resumeWorkType");
  resumeWorkType.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item.workTypeCategory; // 텍스트 내용 설정
    if (index < resumeWorkType.length - 1) {
      span.textContent += ", ";
    }
    workTypeList.appendChild(span);
  });

  // 근무형태 배열
  const JobTypeList = document.getElementById("resumeJobTypeList");
  resumeJobTypeList.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item; // 텍스트 내용 설정
    if (index < resumeJobTypeList.length - 1) {
      span.textContent += ", ";
    }
    JobTypeList.appendChild(span);
  });

  // 근무기간
  const periodName = resume.periodName;
  document.getElementById("periodName").innerHTML = `${periodName}`;

  // 근무요일 배열
  const dayList = document.getElementById("dayList");
  resumeDaysTime.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item.daysName;
    if (index < resumeDaysTime.length - 1) {
      span.textContent += ", ";
    }
    dayList.appendChild(span);
  });

  // 근무시간 배열
  const timeList = document.getElementById("timeList");
  resumeDaysTime.forEach((item, index) => {
    const span = document.createElement("span");
    span.textContent = item.timeName;
    if (index < resumeDaysTime.length - 1) {
      span.textContent += ", ";
    }
    timeList.appendChild(span);
  });

  //급여
  const salary = formatSalary(
    resume.salaryNo,
    resume.salaryAmount,
    resume.salaryName
  );
  document.getElementById("salary").innerHTML = `${salary}`;
*/
  // 부모 요소 선택
  const recruitmentBody = document.getElementById("recruitmentbody");

  // 기존 내용을 초기화
  recruitmentBody.innerHTML = "";

  // 빈 배열일 경우 메시지 생성
  if (
    !recruitmentData ||
    !Array.isArray(recruitmentData) ||
    recruitmentData.length === 0
  ) {
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML =
      '<td></td><th colspan="7">공고가 존재하지 않습니다.</th>';
    recruitmentBody.appendChild(noDataRow);
  } else {
    // 배열 값 만큼 반복
    recruitmentData.forEach((recruitment) => {
      const row = document.createElement("tr");

      // 각 열(td) 생성 및 데이터 추가
      row.innerHTML = `
      <td>${recruitment.recruitmentNo || "값 없음"}</td>
      <td>${recruitment.businessAddress || "값 없음"}</td>
      <td>
        <ul recruitmentNo="${
          recruitment.recruitmentNo || "값 없음"
        }" style="cursor: pointer;" 
            onclick="location.href='/recruitment/detail/${
              recruitment.recruitmentNo
            }'">
          <li>${recruitment.recruitmentTitle || "값 없음"}</li>
          <li>${recruitment.businessName || "값 없음"}</li>
        </ul>
      </td>
      <td>
        <span>${
          formatSalaryAmount(recruitment.salaryMount) + " 원" || "값 없음"
        }</span>
        <span>${recruitment.salaryName || "값 없음"}</span>
      </td>
      <td>${recruitment.timeName || "값 없음"}</td>
      <td>${formatTime(recruitment.writeDate) || "값 없음"}</td>
      <td>${
        formatDeadline(recruitment.recruitmentDeadline) || "값 없음"
      }</td>
    `;

      // 생성된 행을 부모 요소에 추가
      recruitmentBody.appendChild(row);
    });
  }
};


// 페이지네이션 로직
const createPagination = (data, paginationContainer) => {
  if (!recruitmentData || !Array.isArray(recruitmentData) || recruitmentData.length === 0) {
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
      const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      updateUI(paginatedData);
      createPagination(data, paginationContainer); // 갱신
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




defaultServer();

changeServer();