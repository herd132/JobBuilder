const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]); // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

const viewResumesWhite = document.querySelector(".viewResumes-white");
const modal = document.getElementById("modal");
const modalDetails = document.querySelector(".modal-details");
const closeBtn = document.querySelector(".close-btn");

const viewResumes = async () => {
  viewResumesWhite.innerHTML = "";

  const resp = await fetch(`/myPageEmp/viewResumes/${memberNo}`);
  const result = await resp.json();

  console.log(result);

  for (let key in result) {
    const data = result[key];

    const resumeDiv = newEl("div", {}, ["resume-item"]);

    // 첫 번째 줄
    const firstLine = newEl("p", {}, ["line"]);
    firstLine.innerText = `공고제목: ${data.recruitmentTitle || "미제공"} / 지점: ${data.businessNickname || "미제공"} / 근무기간: ${data.periodName || "미제공"} / 근무지역: ${data.workcondAddressTypeInfo || "미제공"}`;
    resumeDiv.appendChild(firstLine);

    // 두 번째 줄
    const secondLine = newEl("p", {}, ["line"]);
    secondLine.innerText = `이력서제목: ${data.resumeTitle || "미제공"} / 희망 근무기간: ${data.hopePeriodName || "미제공"} / 경력 여부 : ${data.careerFl}`;
    resumeDiv.appendChild(secondLine);

    // 상세 보기 버튼 추가
    const detailBtn = newEl("button", {}, ["detail-btn"]);
    detailBtn.innerText = "상세보기";
    detailBtn.onclick = () => showModal(data.recruitmentNo, data.resumeNo);
    resumeDiv.appendChild(detailBtn);

    viewResumesWhite.appendChild(resumeDiv);
  }
};

const showModal = async (recruitmentNo, resumeNo) => {
  modal.style.display = "flex"; // 모달 보이기 (flex로 변경)
  modalDetails.innerHTML = "";

  const resp = await fetch(`/myPageEmp/viewRecruitResume?recruitmentNo=${recruitmentNo}&resumeNo=${resumeNo}`);
  const result = await resp.json();

  console.log(result);

  // 전화번호 포맷팅 함수 (010-1111-2222)
  const formatPhoneNumber = (phone) => {
    if (!phone) return "미제공";
    return phone.replace(/^(\d{3})(\d{4})(\d{4})$/, "$1-$2-$3");
  };

  // 급여액과 희망 급여액에 "원" 추가
  const formatSalary = (salary) => {
    return salary ? `${salary.toLocaleString()} 원` : "미제공";
  };

  // 희망 근무요일 및 시간을 ul 형식으로 변환
  const formatWorkingHours = (workingHours) => {
    if (!workingHours || workingHours.length === 0) {
      return "<ul><li>미제공</li></ul>";
    }

    return `<ul>${workingHours.map(item => `<li>${item.daysName} ${item.timeName}</li>`).join("")}</ul>`;
  };

  // 1. 고용주 정보
  const employerSection = newEl("div", {}, ["section"]);
  employerSection.innerHTML = `
    <h3>고용주 정보</h3>
    <p><strong>공고명 :</strong> ${result.recruitmentTitle}</p>
    <p><strong>지점명 :</strong> ${result.businessNickname || "미제공"}</p>
    <p><strong>사업장 전화번호 :</strong> ${formatPhoneNumber(result.businessTel)}</p>
    <p><strong>업직종 :</strong> ${result.worktypeList.map(item => item.worktypeCategory).join(", ") || "미제공"}</p>
    <p><strong>고용형태 :</strong> ${result.jobtypeName || "미제공"}</p>
    <p><strong>급여형태 :</strong> ${result.salaryName || "미제공"}</p>
    <p><strong>급여액 :</strong> ${formatSalary(result.salaryMount)}</p>
    <p><strong>근무기간 :</strong> ${result.periodName || "미제공"}</p>
    <p><strong>요구학력 :</strong> ${result.gradeName || "미제공"}</p>
    <p><strong>근무요일 :</strong> ${result.daysName || "미제공"}</p>
    <p><strong>근무시간 :</strong> ${result.timeName || "미제공"}</p>
    <p><strong>근무지역 :</strong> ${result.workcondAddressTypeInfo || "미제공"}</p>
  `;
  modalDetails.appendChild(employerSection);

  // 2. 알바생 정보
  const workerSection = newEl("div", {}, ["section"]);
  workerSection.innerHTML = `
    <h3>알바생 정보</h3>
    <p><strong>이력서 제목 :</strong> ${result.resumeTitle || "미입력"}</p>
    <p><strong>경력 여부 :</strong> ${result.careerFl}</p>
    <p><strong>알바생 전화번호 :</strong> ${formatPhoneNumber(result.memberTel)}</p>
    <p><strong>학력 :</strong> ${result.workerGradeName || "미제공"}</p>
    <p><strong>이메일 :</strong> ${result.memberEmail || "미제공"}</p>
    <p><strong>희망 고용형태 :</strong> ${result.resumeJobtypeList.join(", ") || "미제공"}</p>
    <p><strong>희망 급여형태 :</strong> ${result.hopeSalaryName || "미제공"}</p>
    <p><strong>희망 급여액 :</strong> ${formatSalary(result.hopeSalaryAmount)}</p>
    <p><strong>희망 근무기간 :</strong> ${result.hopePeriodName || "미제공"}</p>
    <p><strong>희망 근무요일 및 시간</strong> ${formatWorkingHours(result.hopeDaysTimeList)}</p>
    <p><strong>희망 근무지역 :</strong> ${result.hopeAddressList.length ? result.hopeAddressList.join(", ") : "미제공"}</p>
    <p><strong>희망 업직종 :</strong> ${result.hopeWorkTypeList.map(item => item.workTypeCategory).join(", ") || "미제공"}</p>
    <p><strong>이력서 내용 :</strong> ${result.resumeContent || "미제공"}</p>
  `;
  modalDetails.appendChild(workerSection);

  // 경력사항
  if (result.careerInfoList && result.careerInfoList.length > 0) {
    const careerSection = newEl("div", {}, []);
    careerSection.innerHTML = "<h3>경력사항</h3>";
    result.careerInfoList.forEach(career => {
      careerSection.innerHTML += `
        <p><strong>회사명:</strong> ${career.companyName}</p>
        <p><strong>근무 기간:</strong> ${career.startDate} ~ ${career.endDate || "재직 중"}</p>
        <p><strong>상세 설명:</strong> ${career.careerDescription || "미제공"}</p>
        <hr>
      `;
    });
    modalDetails.appendChild(careerSection);
  }
};

// 모달 닫기 함수
const closeModal = () => {
  modal.style.display = "none"; // 모달 숨기기
  modalDetails.innerHTML = ""; // 상세 내용 초기화
};

// x 버튼 클릭 시 모달 닫기
closeBtn.addEventListener("click", closeModal);

// esc 키를 누르면 모달 닫기
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// 어두운 배경 클릭 시 모달 닫기
modal.addEventListener("click", (event) => {
  // 모달 창 내부 클릭을 막기 위한 조건
  if (event.target === modal) {
    closeModal();
  }
});


viewResumes();