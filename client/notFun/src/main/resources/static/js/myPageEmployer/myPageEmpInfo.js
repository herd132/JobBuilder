// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};

const updataInfo = () => {
  location.href= "/myPageEmp/updateInfo";
}

// 비밀번호 확인 모달 관련 요소
const passwordModalContainer = document.querySelector(".password-modal-container");
const passwordInput = document.querySelector("#memberPw");
const wrongPwMessage = document.querySelector("#wrongPwMessage");
const confirmBtn = document.querySelector(".confirm-btn");
const closeModalBtn = document.querySelector(".close-modal");

// 모달 열기
const openPasswordModal = () => {
  passwordModalContainer.classList.remove("hidden");
};

// 모달 닫기
const closePasswordModal = () => {
  passwordModalContainer.classList.add("hidden");
  wrongPwMessage.innerText = ""; // 에러 메시지 초기화
  passwordInput.value = ""; // 입력 초기화
};

// 비밀번호 확인
const confirmPassword = async () => {
  const obj = {
    "memberEmail": memberEmail, // 세션에서 이메일 가져오기
    "memberPw": passwordInput.value
  };

  const resp = await fetch("/myPageEmp/checkPw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  });

  if (resp.status === 204) {
    wrongPwMessage.innerText = "일치하지 않는 비밀번호 입니다.";
    return;
  }

  if (resp.status === 200) {
    const employer = await resp.json();
    closePasswordModal(); // 모달 닫기
    window.location.href = "/myPageEmp/updateInfo"; // 비밀번호 일치 시 이동
  }
};

// 버튼 클릭 이벤트
confirmBtn.addEventListener("click", confirmPassword);
closeModalBtn.addEventListener("click", closePasswordModal);

// Enter 키로 비밀번호 확인
document.addEventListener("keyup", (event) => {
  if (event.key === 'Enter') {
    confirmPassword();
  }
});

// 비밀번호 입력 시 에러 메시지 초기화
passwordInput.addEventListener("input", () => {
  wrongPwMessage.innerText = "";
});


const updateBusinessBtn = document.querySelector(".update-business-btn");
const deleteBusinessBtn = document.querySelector(".delete-business-btn");
const modalContainer = document.querySelector(".modal-container");
const modalBusinessContent = document.querySelector(".modal-business-content");
const nicknameArea = document.querySelector(".nickname-area");
const telArea = document.querySelector(".tel-area");
const addressArea = document.querySelector(".address-area");
const worktypeArea = document.querySelector(".worktype-area");
const modalRecruitmentContent = document.querySelector(".modal-recruitment-content");
const membershipBtn = document.querySelector(".membership-btn");

const businessDetailModal = async (employerNo) => {
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.classList.remove('hidden');
  
  nicknameArea.innerHTML = "사업장 위치 : ";
  telArea.innerHTML = "사업장 연락처 : ";
  addressArea.innerHTML = "사업장 주소 : ";
  worktypeArea.innerHTML = "업직종 : ";

  const resp = await fetch("/myPageEmp/business?employerNo=" + employerNo);

  if(resp.status == 200){

    const result = await resp.json();

    if(result.businessTel == null) result.businessTel = "미입력 상태입니다.";
    if(result.businessWorktype.length == 0) result.businessWorktype = "미입력 상태입니다.";

    nicknameArea.innerHTML += result.businessNickname;
    telArea.innerHTML += result.businessTel;
    addressArea.innerHTML += result.businessAddress;
    worktypeArea.innerHTML += result.businessWorktype;

    // 공고목록 불러와서 제목, 마감일, 인원, 완료여부 표시
    modalRecruitmentContent.innerHTML = "";

    if(result.recruitmentList.length === 0){
      const noRecruitmentDiv = document.createElement("div");
      noRecruitmentDiv.innerText = "등록된 공고가 없습니다";
      modalRecruitmentContent.append(noRecruitmentDiv);

    } else{

      const recruitmentUl = document.createElement("ul");

      const recruitNo = document.createElement("li");
      recruitNo.innerText = "공고번호";

      const titleLi = document.createElement("li");
      titleLi.innerText = "공고명";

      const deadlineLi = document.createElement("li");
      deadlineLi.innerText = "마감일";

      const numOfRecruitLi = document.createElement("li");
      numOfRecruitLi.innerText = "모집인원";

      const completLi = document.createElement("li");
      completLi.innerText = "완료여부";

      recruitmentUl.append(recruitNo, titleLi, deadlineLi, numOfRecruitLi, completLi);
      modalRecruitmentContent.append(recruitmentUl);

      for(let i=0; i<result.recruitmentList.length; i++){

        const employerRecruitmentUl = document.createElement("ul");

        const recruitmentNo = document.createElement("li");
        recruitmentNo.innerText = result.recruitmentList[i].recruitmentNo;

        const recruitmentTitleLi = document.createElement("li");
        recruitmentTitleLi.innerText = result.recruitmentList[i].recruitmentTitle;

        const recruitmentDeadlineLi = document.createElement("li");
        recruitmentDeadlineLi.innerText = result.recruitmentList[i].recruitmentDeadline;

        const numOfRecruitmentNameLi = document.createElement("li");
        numOfRecruitmentNameLi.innerText = result.recruitmentList[i].numOfRecruitmentName;

        const recruitCompleteFl = document.createElement("li");
        recruitCompleteFl.innerText = result.recruitmentList[i].recruitCompleteFl;

        employerRecruitmentUl.append(recruitmentNo, recruitmentTitleLi, recruitmentDeadlineLi, numOfRecruitmentNameLi, recruitCompleteFl);
        
        modalRecruitmentContent.append(employerRecruitmentUl);
      }
    }    
  }  
  // 버튼에 employerNo 설정
  updateBusinessBtn.setAttribute("data-employer-no", employerNo);
  deleteBusinessBtn.setAttribute("data-employer-no", employerNo);
  membershipBtn.setAttribute("data-employer-no", employerNo);
};

// 수정하기 버튼 클릭 시 수정 페이지로 이동
updateBusinessBtn.addEventListener("click", () => {
  const employerNo = updateBusinessBtn.getAttribute("data-employer-no");
  window.location.href = `updateBusiness/${employerNo}`;
});

membershipBtn.addEventListener("click", () => {
  const employerNo = membershipBtn.getAttribute("data-employer-no");
  sessionStorage.setItem('employerNo',employerNo);
  window.location.href = "/payments/testpay2";
});

deleteBusinessBtn.addEventListener("click", () => {
  const employerNo = deleteBusinessBtn.getAttribute("data-employer-no");
  if (!confirm("해당 사업장을 삭제 하시겠습니까?")) {
    alert("취소되었습니다.");
    return;
  }

  window.location.href = `deleteBusiness/${employerNo}`;
})

// 모달 영역
document.addEventListener('DOMContentLoaded', function() {
  const modalContainer = document.querySelector('.modal-container');
  const closeButton = document.querySelector('.btn-area span');

  // ESC 키로 모달 닫기
  document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
          modalContainer.classList.add('hidden');
      }
  });

  // X 버튼 클릭으로 모달 닫기 (버튼이 있는 경우)
  if(closeButton) {
      closeButton.addEventListener('click', () => {
          modalContainer.classList.add('hidden');
      });
  }

});