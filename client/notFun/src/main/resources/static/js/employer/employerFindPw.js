console.log("employerFindPw.js 와 연결됨");

const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]); // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

const findPasswordContainer = document.querySelector(".find-password-container");

// 찾기방식 선택 버튼(사업자 등록번호, 전화번호)
const businessRegistrationNumberBtn = document.querySelector('.businessRegistrationNumber-btn');
const memberTelBtn = document.querySelector('.memberTel-btn');

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

// 공통 영역 input (가입자명, 가입한 이메일)
const memberNameInput = document.getElementById('memberName');
const memberEmailInput = document.getElementById('memberEmail');
const authKeyInput = document.querySelector("#authKey");

// 이메일 인증 관련 버튼 (인증번호 받기, 인증하기)
const sendAuthKeyBtn = document.getElementById('sendAuthKeyBtn');
const checkAuthKeyBtn = document.getElementById('checkAuthKeyBtn');
const authKeyMessage = document.querySelector("#authKeyMessage");

// 선택 영역(사업자 등록번호, 전화번호)
const businessRegistrationNumberArea = document.querySelector('.businessRegistrationNumber-area');
const memberTelArea = document.querySelector('.memberTel-area');

const businessRegistrationFirstNoInput = document.querySelector("#firstNo");
const businessRegistrationSecondNoInput = document.querySelector("#secondNo");
const businessRegistrationThirdNoInput = document.querySelector("#thirdNo");
const memberTelInput = document.querySelector("#memberTel");

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

checkAuthKeyBtn.addEventListener("click", () => {

  if (min == 0 && sec == 0) {
    alert("인증번호 입력 제한시간을 초과하였습니다.");
    return;
  }

  if (authKeyInput.value.length < 6) {
    alert("인증번호 6자리를 입력해주세요.");
    return;
  }

  const obj = {
    "email": memberEmailInput.value,
    "authKey": authKeyInput.value
  };

  fetch("/emailEmp/checkAuthKey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj)
  })
  .then(resp => resp.text())
  .then(result => {
    if (result == 0) {
      alert("인증번호가 일치하지 않습니다. 정확한 인증번호를 입력하세요");
      return;
    }
  
    clearInterval(authTimer);
    authKeyMessage.innerText = "인증되었습니다";
    authKeyMessage.classList.add("confirm");
    authKeyMessage.classList.remove("error");

    memberNameInput.readOnly = true;
    memberEmailInput.readOnly = true;
    authKeyInput.readOnly = true;

    businessRegistrationFirstNoInput.disabled = false;
    businessRegistrationSecondNoInput.disabled = false;
    businessRegistrationThirdNoInput.disabled = false;
    memberTel.disabled = false;
  });
})

// 사업자등록번호로 확인 버튼 클릭 시
confirmByBusinessRegistrationNumberBtn.addEventListener("click", async () => {

  const firstNo = businessRegistrationFirstNoInput.value;
  const secondNo = businessRegistrationSecondNoInput.value;
  const thirdNo = businessRegistrationThirdNoInput.value;

  if(firstNo.length == 0 || secondNo.length == 0 || thirdNo.length == 0){
    alert("빈칸을 모두 채워주세요");
    return;
  }

  const businessRegistrationNumber = `${firstNo}-${secondNo}-${thirdNo}`;

  const resp = await fetch('/employer/findEmailByBusinessRegistrationNumber', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      memberName: memberNameInput.value,
      businessRegistrationNumber: businessRegistrationNumber,
    })
  })

  if(resp.status === 204){
    alert("가입자명과 매칭되는 사업자 등록번호가 아닙니다.");
    return;
  }

  const findEmail = await resp.text();

  findPasswordContainer.innerHTML = `
    <div class="success-message">해당 이메일에 대한 비밀번호를 새로 입력해주세요.</div>
    <div class="result">${findEmail}</div>
    <div>
      <span>새 비밀번호 입력 : </span>
      <input type="password" name="newPw" id="newPw">
    </div>
    <div>
      <span>새 비밀번호 확인 : </span>
      <input type="password" name="newPwConfirm" id="newPwConfirm">
    </div>
  `;

  const changePwBtn = newEl('button', {}, ['change-pw-btn', 'btn-info']);
  changePwBtn.innerText = "비밀번호 변경";
  changePwBtn.addEventListener("click", async () => {

    const newPw = document.querySelector("#newPw");
    const newPwConfirm = document.querySelector("#newPwConfirm");

    if(newPw != null && newPwConfirm != null){
      
      if(newPw.value === newPwConfirm.value){

        const resp = await fetch('/employer/changePw', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            memberEmail: findEmail,
            memberPw: newPw.value
          })
        });

        if(resp.status === 204){
          alert("변경에 실패했습니다");
          return;
        }

        alert("비밀번호 변경에 성공했습니다. 다시 로그인해 주세요");
        location.href = "/multiLogin";

      } else{
        alert("비밀번호가 일치하지 않습니다");
      }
    }
  });

  findPasswordContainer.appendChild(changePwBtn);
})

// 전화번호로 확인 버튼 클릭 시
confirmByMemberTelBtn.addEventListener("click", async () => {

  const memberTel = memberTelInput.value;

  if(memberTel.length == 0){
    alert("전화번호를 입력해주세요");
    return;
  }

  const resp = await fetch('/employer/findEmailByPhoneNumber', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      memberName: memberNameInput.value,
      memberTel: memberTel,
    })
  })

  if(resp.status === 204){
    alert("가입자명과 매칭되는 전화번호가 아닙니다.");
    return;
  }

  const findEmail = await resp.text();

  findPasswordContainer.innerHTML = `
    <div class="success-message">전화번호를 통해 찾은 이메일은 다음과 같습니다.</div>
    <div class="result">${findEmail}</div>
    <div>
      <span>새 비밀번호 입력 : </span>
      <input type="password" name="newPw" id="newPw">
    </div>
    <div>
      <span>새 비밀번호 확인 : </span>
      <input type="password" name="newPwConfirm" id="newPwConfirm">
    </div>
  `;

  const changePwBtn = newEl('button', {}, ['change-pw-btn', 'btn-info']);
  changePwBtn.innerText = "비밀번호 변경";
  changePwBtn.addEventListener("click", async () => {

    const newPw = document.querySelector("#newPw");
    const newPwConfirm = document.querySelector("#newPwConfirm");

    if(newPw != null && newPwConfirm != null){
      
      if(newPw.value === newPwConfirm.value){

        const resp = await fetch('/employer/changePw', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            memberEmail: findEmail,
            memberPw: newPw.value
          })
        });

        if(resp.status === 204){
          alert("변경에 실패했습니다");
          return;
        }

        alert("비밀번호 변경에 성공했습니다. 다시 로그인해 주세요");
        location.href = "/multiLogin";

      } else{
        alert("비밀번호가 일치하지 않습니다");
      }
    }
  });

  findPasswordContainer.appendChild(changePwBtn);
})