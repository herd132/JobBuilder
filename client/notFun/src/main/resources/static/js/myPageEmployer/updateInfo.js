console.log("updateInfo.js 와 연결됨");

const myPageEmpInfoWhite = document.querySelector(".myPageEmpInfo-white");
const memberEmail = document.querySelector("#memberEmail");       // span 태그
const memberPw = document.querySelector("#memberPw");             // input 태그
const wrongPwMessage = document.querySelector("#wrongPwMessage"); // span 태그

const confirmPw = async () => {

  const obj = {"memberEmail": memberEmail.innerText, "memberPw": memberPw.value};

  const resp = await fetch("/myPageEmp/checkPw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  });

  // 응답 상태가 204 (No Content)인지 확인
  if (resp.status === 204) {
    console.log("No content returned from server.");
    wrongPwMessage.innerText = "일치하지 않는 비밀번호 입니다.";
    return;
  }

  const employer = await resp.json();
  
  myPageEmpInfoWhite.innerHTML = "일치한 회원입니다";
  console.log(employer);  
}

memberPw.addEventListener("input",()=>{
  wrongPwMessage.innerText = "";
})

document.addEventListener('keyup', function(event) {
  // Enter 키의 keyCode는 13
  if (event.key === 'Enter') {
    confirmPw(); // Enter 키에서 손을 뗄 때 confirmPw 함수 실행
  }
});