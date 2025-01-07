/** 띄울 사항
 * 맵<리스트(공고번호, 이력서번호), 리스트(공고이력서)>
 *
 *    공고이력서 : 공고번호, *공고제목,  *사업장닉네임(==지점명),
 *    사업장업직종(리스트), 근무기간, 근무요일, 근무시간, 이력서번호,
 *    *이력서제목, *경력여부, 희망업직종(리스트),  *희망근무기간,
 *    *희망근무시간(리스트), 소개글
 * ------------------------------------------------------
 *    * 아닌건 누르면 모달창에 띄워주기(공고번호, 이력서번호는 구분용)
 *    함수2개만들어서 1개는 *만(목록띄워주는용), 다른 1개는 전체(모달창에 띄워주는용)
 *
 */

/*
  공고제목, 지점명, 근무지역, 근무기간
  이력서제목, 경력여부,  희망근무기간
*/

const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]); // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

const viewResumesWhite = document.querySelector(".viewResumes-white");
const modal = document.getElementById("modal");
const modalDetails = document.getElementById("modal-details");
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
    secondLine.innerText = `이력서제목: ${data.resumeTitle || "미제공"} / 희망 근무기간: ${data.hopePeriodName || "미제공"}`;
    resumeDiv.appendChild(secondLine);

    // 상세 보기 버튼 추가
    const detailBtn = newEl("button", {}, ["detail-btn"]);
    detailBtn.innerText = "상세보기";
    detailBtn.onclick = () => showModal(data.recruitmentNo, data.resumeNo);
    resumeDiv.appendChild(detailBtn);

    viewResumesWhite.appendChild(resumeDiv);
  }
};

const showModal = (recruitmentNo, resumeNo) => {
  modal.style.display = "flex"; // 모달 보이기 (flex로 변경)
  modalDetails.innerHTML = `공고 번호: ${recruitmentNo} <br> 이력서 번호: ${resumeNo}`;
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