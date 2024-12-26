console.log("employerSignUp.html과 연결됨");

// 사업자 진위확인 API
const confirmBusinessBtn = document.querySelector("#confirmBusinessBtn");
confirmBusinessBtn.addEventListener("click", async () => {

  const businessRegistrationNumber = document.querySelector("#businessRegistrationNumber"); // input 태그
  const representativeName = document.querySelector("#representativeName");                 // input 태그
  const openingDate = document.querySelector("#openingDate");                               // input 태그

  const requestBody = {
    "business" : [
      {
        "b_no": businessRegistrationNumber.value,
        "start-dt": openingDate.value,
        "p_nm": representativeName.value
      }
    ]
  }

  const result = await fetch("https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=HEWaOsjZrFL5dYVD0%2B6QfWGgXcA5BAicqbDf2VdmPOvzzB10V8hCXC8MgXPM85%2BLjPr81M2CLm01jGZs8fRvrA%3D%3D", {
    method: "POST",
    headers : {"Content-Type" : "application/json"},
    body : JSON.stringify(requestBody)
  });

  console.log(result);
})

// 다음 주소 API
function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ''; // 주소 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else { // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById('postcode').value = data.zonecode;
      document.getElementById("address").value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("detailAddress").value = "";
      document.getElementById("detailAddress").focus();
    }
  }).open();
}


/* ********** 약관동의 부분 (아직 checkObj 안넣음) ********** */
const allAgree = document.querySelector("#allAgree"); // 전체동의 input(checkbox) 태그
const checkAllList = document.querySelectorAll(".checkAll"); // 약관 input(checkbox)태그

allAgree.addEventListener("click", (e) => {
  checkAllList.forEach((checkAll) => {
    checkAll.checked = e.target.checked;
  });
});

checkAllList.forEach((checkAll) => {
  checkAll.addEventListener("click", () => {
    const checked = document.querySelectorAll(".checkAll:checked");

    if (checkAllList.length === checked.length) allAgree.checked = true;
    else allAgree.checked = false;
  });
});


/* ********** 이메일 부분 ********** */
let authTimer;      // Timer 역할을 할 setInterval을 저장할 변수(인증시간 관련)
const memberEmail = document.querySelector("#memberEmail");         // input 태그
const authKey = document.querySelector("#authKey");                 // input 태그
const sendAuthKeyBtn = document.querySelector("#sendAuthKeyBtn");   // button 태그
const checkAuthKeyBtn = document.querySelector("#checkAuthKeyBtn"); // button 태그
const emailMessage = document.querySelector("#emailMessage");       // span 태그
const authKeyMessage = document.querySelector("#authKeyMessage");   // span 태그

/* ***** 이메일 유효성 검사 ***** */
memberEmail.addEventListener("input", e => {
  // checkObj.memberEmail 추가(false)해야 함
  // checkObj.authKey 추가(false)해야 함

  authKeyMessage.innerText = "";
  clearInterval(authTimer);

  const inputEmail = e.target.value;

  // 이메일을 지운 경우
  if(inputEmail.trim().length === 0){
    emailMessage.innerText = "인증받을 이메일을 입력해주세요";
    authKeyMessage.innerText = "인증번호 6자리를 입력해주세요";
    return;
  }

  // 정규식 검사
  const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if(!regExp.test(inputEmail)){
    emailMessage.innerText = "알맞은 이메일 형식을 작성해주세요";
    emailMessage.classList.add('error');
    emailMessage.classList.remove('confirm');
    return;
  }

  // 중복성 검사
  fetch("/employer/checkEmail?memberEmail=" + inputEmail)
  .then(resp => resp.text())
  .then(count => {

    if(count == 1){
      emailMessage.innerText = "이미 사용중인 이메일입니다";
      emailMessage.classList.add('error');
      emailMessage.classList.remove('confirm');
      return;
    }

    emailMessage.innerText = "사용가능한 이메일입니다";
    emailMessage.classList.add('confirm');
    emailMessage.classList.remove('error');
  })
  .catch(error => {
    console.error(error);
  });

  // checkObj.memberEmail 추가(true)해야 함
});

/* ***** 인증번호 유효성 검사 ***** */
const initTime = "05:00";
const initMin = 4;      // 타이머 초기값 (분)
const initSec = 59;     // 타이머 초기값 (초)
let min = initMin;      // 실제 줄어드는 시간 저장 변수(분)
let sec = initSec;      // 실제 줄어드는 시간 저장 변수(초)

function addZero(number) {
  if (number < 10) return "0" + number;
  else return number;
}

// 인증번호 받기 버튼 클릭 시
sendAuthKeyBtn.addEventListener("click", () => {
  // checkObj.authKey 추가(false)해야 함
  authKeyMessage.innerText = "";

  // if (!checkObj.memberEmail) {   // checkObj 만든 후 각주 없애기
  //   alert("유효한 이메일을 작성 후 클릭해 주세요");
  //   return;
  // }

  min = initMin;
  sec = initSec;
  clearInterval(authTimer);

  // AUTH_KEY TABLE에 인증번호 DATA 생성
  fetch("/emailEmp/signUp", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: memberEmail.value
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
      // checkObj.authKey 추가(false)해야 함
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
});

// 인증번호 확인 버튼 클릭 시
checkAuthKeyBtn.addEventListener("click", () => {

  if (min == 0 && sec == 0) {
    alert("인증번호 입력 제한시간을 초과하였습니다.");
    return;
  }

  if (authKey.value.length < 6) {
    alert("인증번호 6자리를 입력해주세요.");
    return;
  }

  const obj = {
    "email": memberEmail.value,
    "authKey": authKey.value
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
        // checkObj.authKey = false;
        return;
      }

      clearInterval(authTimer);
      authKeyMessage.innerText = "인증되었습니다";
      authKeyMessage.classList.add("confirm");
      authKeyMessage.classList.remove("error");
      memberEmail.readOnly = true;
      authKey.readOnly = true;
      // checkObj.authKey = true;
    });

});


/* ********** 비밀번호 부분 ********** */
const memberPw = document.querySelector("#memberPw");                 // input 태그
const memberPwConfirm = document.querySelector("#memberPwConfirm");   // input 태그
const pwMessage = document.querySelector("#pwMessage");               // span 태그
const pwConfirmMessage = document.querySelector("#pwConfirmMessage"); // span 태그

// 비밀번호, 비밀번호 확인 일치여부 검사 함수
const checkPw = () => {

  if(memberPw.value === memberPwConfirm.value){
    pwConfirmMessage.innerText = "비밀번호가 일치합니다";
    pwConfirmMessage.classList.add("confirm");
    pwConfirmMessage.classList.remove("error");
    // checkObj.memberPwConfirm = true;
    return;
  }

  pwConfirmMessage.innerText = "비밀번호가 일치하지 않습니다";
  pwConfirmMessage.classList.add("error");
  pwConfirmMessage.classList.remove("confirm");
  // checkObj.memberPwConfirm = false;
}

/* ***** 비밀번호 유효성 검사 ***** */
memberPw.addEventListener("input", e => {
  const inputPw = e.target.value;

  // space 입력 시
  if(inputPw.trim().length === 0){
    pwMessage.innerText = "공백없이 영어, 숫자, 특수문자(!,@,#,-,_) 포함 6~20자 입력해주세요";
    pwMessage.classList.remove("confirm", "error");
    memberPw.value = "";
    // checkObj.memberPw = false;
    return;
  }

  // 정규식 검사
  const regExp = /^[a-zA-Z0-9!@#_-]{6,20}$/;

  if(!regExp.test(inputPw)){
    pwMessage.innerText = "비밀번호가 유효하지 않습니다";
    pwMessage.classList.add("error");
    pwMessage.classList.remove("confirm");
    // checkObj.memberPw = false;
    return;
  }

  pwMessage.innerText = "유효한 비밀번호 형식입니다";
  pwMessage.classList.add("confrim");
  pwMessage.classList.remove("error");
  // checkObj.memberPw = true;
  
  // 비밀번호 확인란에 값이 있는 경우 일치여부 검사
  if(memberPwConfirm.value.length > 0) {
    checkPw();
  }
})

/* ***** 비밀번호 확인 유효성 검사 ***** */
memberPwConfirm.addEventListener("input", () => {
  
  // 비밀번호 유효성 통과한 경우만 checkPW() 수행
  // if (!checkObj.memberPw) {
  //   checkObj.memberPwConfirm = false;
  //   return;
  // }

  checkPw();
});


/* ********** 전화번호 부분 ********** */
const memberTel = document.querySelector("#memberTel");     // input 태그
const telMessage = document.querySelector("#telMessage");   // span 태그

memberTel.addEventListener("input", e => {
  // checkObj.memberTel = false;
  const inputTel = e.target.value;

  // space 입력 시
  if(inputTel.trim().length === 0){
    telMessage.innerText = "공백없이 전화번호를 입력해주세요(- 제외)";
    telMessage.classList.remove("confirm", "error");
    memberTel.value = "";
    return;
  }
  
  // 정규식 검사
  const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;

  if (!regExp.test(inputTel)) {
    telMessage.innerText = "유효하지 않은 전화번호 형식입니다.";
    telMessage.classList.add("error");
    telMessage.classList.remove("confirm");
    return;
  }

  telMessage.innerText = "유효한 전화번호 형식입니다.";
  telMessage.classList.add("confirm");
  telMessage.classList.remove("error");
  // checkObj.memberTel = true;
})


/* ********** 주소 부분 ********** */
const postcode = document.querySelector("#postcode");                   // input 태그
const address = document.querySelector("#address");                     // input 태그
const detailAddress = document.querySelector("#detailAddress");         // input 태그
const searchAddressBtn = document.querySelector("#searchAddressBtn");   // button 태그
const addressResetBtn = document.querySelector("#addressResetBtn");     // button 태그

searchAddressBtn.addEventListener("click", execDaumPostcode);
addressResetBtn.addEventListener("click", () => {
  postcode.value = "";
  address.value = "";
  detailAddress.value = "";
})


/* ********** 사업자 확인 부분 ********** */
// 인증 완료되면 수정할 수 없도록 막기(readonly)

/* ********** 회원가입 버튼 클릭 시 ********** */
// 회사명/점포명 입력안 된 경우 제출 막기
// 사업장 주소 입력안 된 경우 제출 막기
