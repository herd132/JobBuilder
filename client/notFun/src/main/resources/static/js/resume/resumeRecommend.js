// 전역 변수 및 유틸리티 함수 영역
// ----------------------------------------
let resumeData = {};
let recommendationsData = {};
let resumeDaysTimeData = {};
let resumeJobTypeListData = {};
let resumeWorkTypeData = {};
let workcondAddressTypeInfoData = {};

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
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get("cp")) || 1; // 기본값 1

  // `resumeNo`가 없는 경우 URL을 업데이트
  if (!urlParams.has("resumeNo")) {
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?resumeNo=${resumeNo}&cp=${currentPage}`
    );
  }

  // Fetch 요청 제거 후 데이터를 받아오는 로직 수정
  fetch("/resume/resumeRecommenda", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeNo: resumeNo }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("서버에서 받은 데이터:", data);

      const {
        resume,
        recommendations,
        resumeDaysTime,
        resumeJobTypeList,
        resumeWorkType,
        workcondAddressTypeInfo,
      } = data;

      // 전역 변수에 데이터 저장
      resumeData = resume;
      recommendationsData = recommendations;

      // 페이지네이션 처리 및 데이터 로드
      const itemsPerPage = 5; // 한 페이지당 항목 수
      const paginatedData = recommendations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      // UI 업데이트
      updateUI(
        resume,
        paginatedData,
        resumeDaysTime,
        resumeJobTypeList,
        resumeWorkType,
        workcondAddressTypeInfo
      );

      // 페이지네이션 로직 호출
      createPagination(recommendations, document.getElementById("pagination"));
    })
    .catch((error) => {
      console.error("요청 오류:", error);
    });
});

// 기존 UI 업데이트 함수 영역
// ----------------------------------------
const updateUI = (
  resume,
  recommendations,
  resumeDaysTime,
  resumeJobTypeList,
  resumeWorkType,
  workcondAddressTypeInfo
) => {
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

  const gradeName = resume.gradeName;
  document.getElementById("gradeName").innerHTML = `${gradeName}`;

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

  // 부모 요소 선택
  const recruitmentBody = document.getElementById("recruitmentbody");

  // 기존 내용을 초기화
  recruitmentBody.innerHTML = "";

  // 빈 배열일 경우 메시지 생성
  if (
    !recommendations ||
    !Array.isArray(recommendations) ||
    recommendations.length === 0
  ) {
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML =
      '<td><td><td></td><th colspan="7">공고가 존재하지 않습니다.</th>';
    recruitmentBody.appendChild(noDataRow);
  } else {
    // 배열 값 만큼 반복
    recommendations.forEach((item) => {
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
  }
};

// 페이지네이션 로직
const createPagination = (data, paginationContainer) => {
  if (!recommendationsData || !Array.isArray(recommendationsData) || recommendationsData.length === 0) {
    return;
  }
  const listCountElement = document.getElementById("listCount");
  listCountElement.textContent = data.length;
  const itemsPerPage = 5; // 한 페이지당 항목 수
  const pagesPerGroup = 10; // 페이지 그룹당 페이지 수
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const urlParams = new URLSearchParams(window.location.search);
  const resumeNo = urlParams.get("resumeNo");
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
    link.href = `?resumeNo=${resumeNo}&cp=${targetPage}`;
    link.className = "pagination-link"; // 공통 클래스 추가

    if (isCurrent) {
      link.classList.add("current"); // 현재 페이지일 경우 추가 클래스
    }

    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = targetPage;
      window.history.pushState({}, "", `?resumeNo=${resumeNo}&cp=${currentPage}`);
      const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
      updateUI(resumeData, paginatedData, [], [], [], []);
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


