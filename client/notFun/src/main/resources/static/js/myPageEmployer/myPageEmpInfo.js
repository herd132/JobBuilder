// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};

const modalContainer = document.querySelector(".modal-container");
const modalBusinessContent = document.querySelector(".modal-business-content");
const nicknameArea = document.querySelector(".nickname-area");
const telArea = document.querySelector(".tel-area");
const addressArea = document.querySelector(".address-area");
const worktypeArea = document.querySelector(".worktype-area");

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
    console.log(result);

    if(result.businessTel == null) result.businessTel = "미입력 상태입니다.";
    if(result.businessWorktype.length == 0) result.businessWorktype = "미입력 상태입니다.";

    nicknameArea.innerHTML += result.businessNickname;
    telArea.innerHTML += result.businessTel;
    addressArea.innerHTML += result.businessAddress;
    worktypeArea.innerHTML += result.businessWorktype;
  }
  modalContainer.classList.remove("hidden");

}

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

  // 모달 외부 영역 클릭시 닫기
  modalContainer.addEventListener('click', (e) => {
      if (e.target === modalContainer) {
          modalContainer.classList.add('hidden');
      }
  });
});