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
    wrongPwMessage.innerText = "Invalid credentials or no data found.";
    return;
  }

  const employer = await resp.json();
  
  myPageEmpInfoWhite.innerHTML = "일치한 회원입니다";
  console.log(employer);
  

}