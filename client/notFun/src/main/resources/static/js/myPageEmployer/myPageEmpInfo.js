// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};

const modalContainer = document.querySelector(".modal-container");

const businessDetailModal = async (employerNo) => {
  
  console.log(employerNo);    // fetch 때 써야함, String 형임

  const resp = await fetch("/myPageEmp/business?employerNo=" + employerNo);
  console.log(resp);

  if(resp.status == 200){
    const result = await resp.json();
    console.log(result);
  }
  

  modalContainer.classList.remove("hidden");

}


// 모달 탈출 1
document.addEventListener("keydown", e => {
  if(e.key === 'Escape' && !modalContainer.classList.contains("hidden")){
    modalContainer.classList.add("hidden");
  }
})

// 모달 탈출 2
document.querySelector(".back-info").addEventListener("click", () => {
  modalContainer.classList.add("hidden");
})