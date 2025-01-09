console.log("employerFindPw.js 와 연결됨");

// 찾기방식 선택 버튼(사업자 등록번호, 전화번호)
const businessRegistrationNumberBtn = document.querySelector('.businessRegistrationNumber-btn');
const memberTelBtn = document.querySelector('.memberTel-btn');

// 공통 영역 input (가입자명, 가입한 이메일)
const memberNameInput = document.getElementById('memberName');
const memberEmailInput = document.getElementById('memberEmail');

// 이메일 인증 관련 버튼 (인증번호 받기, 인증하기)
const sendAuthKeyBtn = document.getElementById('sendAuthKeyBtn');
const confirmAuthKeyBtn = document.getElementById('confirmAuthKeyBtn');
const authKeyMessage = document.querySelector("#authKeyMessage");

// 선택 영역(사업자 등록번호, 전화번호)
const businessRegistrationNumberArea = document.querySelector('.businessRegistrationNumber-area');
const memberTelArea = document.querySelector('.memberTel-area');

// 확인 버튼(사업자 등록번호, 전화번호)
const confirmByBusinessRegistrationNumberBtn = document.getElementById('confirmBybusinessRegistrationNumberBtn');
const confirmByMemberTelBtn = document.getElementById('confirmByMemberTelBtn');

// 기본상태(사업자 등록번호로 인증)
memberTelArea.style.display = 'none';
confirmByMemberTelBtn.style.display = 'none';


/* ***** 인증번호 유효성 검사 시 필요한 변수 및 함수 ***** */

const initTime = "05:00";
const initMin = 4;      // 타이머 초기값 (분)
const initSec = 59;     // 타이머 초기값 (초)
let authTimer;      // Timer 역할을 할 setInterval을 저장할 변수(인증시간 관련)
let min = initMin;      // 실제 줄어드는 시간 저장 변수(분)
let sec = initSec;      // 실제 줄어드는 시간 저장 변수(초)

function addZero(number) {
  if (number < 10) return "0" + number;
  else return number;
}

// 인증번호 받기 버튼 클릭 시
sendAuthKeyBtn.addEventListener("click", async () => {

  const inputName = memberNameInput.value;

  if(inputName.trim().length === 0){
    alert("가입자를 입력해주세요");
    memberNameInput.focus();
    return;
  }

  const inputEmail = memberEmailInput.value;
  
  if(inputEmail.trim().length === 0){
    alert("이메일을 입력해주세요");
    memberEmailInput.focus();
    return;
  }

  // 정규식 검사
  const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if(!regExp.test(inputEmail)){
    alert("알맞은 이메일 형식을 작성해주세요");
    return;
  }
  
  console.log("간단한 유효성 검사 통과");

  const resp = await fetch("/employer/checkNameEmail", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body : JSON.stringify({
      memberName : inputName,
      memberEmail : inputEmail
    })
  })

  if(resp.status === 204){
    alert("가입한 고용주가 없습니다");
    return;
  }

  authKeyMessage.innerText = "";
  min = initMin;
  sec = initSec;
  clearInterval(authTimer);
  
  // AUTH_KEY TABLE에 인증번호 DATA 생성
  fetch("/emailEmp/findPw", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: inputEmail
  })
  .then(resp => resp.text())
  .then(result => {
    if(result == 1) console.log("인증번호 발송 성공!!");
    else console.log("인증번호 발송 실패..");
  })

  authKeyMessage.innerText = initTime;
  authKeyMessage.classList.remove("confirm", "error");

  alert("인증번호가 발송되었습니다. 5분내로 인증해주세요");

  authTimer = setInterval(() => {
    authKeyMessage.innerText = `${addZero(min)}:${addZero(sec)}`;

    if (min == 0 && sec == 0) {
      clearInterval(authTimer);
      authKeyMessage.classList.add('error');
      authKeyMessage.classList.remove('confirm');
      return;
    }

    if (sec == 0) {
      sec = 60;
      min--;
    }

    sec--;
  }, 1000);
})




// 사업자 등록번호로 찾기 버튼 클릭 시
businessRegistrationNumberBtn.addEventListener('click', function() {
  businessRegistrationNumberArea.style.display = 'block';
  memberTelArea.style.display = 'none';
  confirmByBusinessRegistrationNumberBtn.style.display = 'block';
  confirmByMemberTelBtn.style.display = 'none';
});

// 전화번호로 찾기 버튼 클릭 시
memberTelBtn.addEventListener('click', function() {
  memberTelArea.style.display = 'block';
  businessRegistrationNumberArea.style.display = 'none';
  confirmByMemberTelBtn.style.display = 'block';
  confirmByBusinessRegistrationNumberBtn.style.display = 'none';
});
