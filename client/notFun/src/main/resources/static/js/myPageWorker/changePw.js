const checkObj = {
  workerCurrentPw: false,
  memberPw: false,
  memberPwConfirm: false,
};

// 현재 비밀번호 확인
const workerCurrentPw = document.querySelector("#workerCurrentPw"); // 현재 비밀번호 input
const checkCurrentPw = document.querySelector("#checkCurrentPw");

workerCurrentPw.addEventListener("input", (e) => {
  const obj = e.target.value;

  if (obj.trim().length === 0) {
    checkCurrentPw.innerText = "현재 비밀번호를 입력해 주세요";
    checkCurrentPw.classList.remove("confirm", "error");
    checkObj.workerCurrentPw = false; // 비밀번호가 유효하지 않다고 표시
    obj = ""; // 처음에 띄어쓰기 입력 못하게 하기
    e.preventDefault();
    return;
  }

  fetch("/myPageWorkee/checkPw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: obj,
  })
    .then((resp) => resp.text())
    .then((result) => {

      if (result == 0) {
        if (workerCurrentPw.value.trim().length === 0) {
          checkCurrentPw.innerText = "현재 비밀번호를 입력해 주세요";
          checkCurrentPw.classList.remove("confirm", "error");
          checkObj.workerCurrentPw = false; // 비밀번호가 유효하지 않다고 표시
          obj = ""; // 처음에 띄어쓰기 입력 못하게 하기
          e.preventDefault();
          return;
        } else {
        // 인증번호 일치 안 할 때
        checkCurrentPw.innerText = "현재 비밀번호가 일치하지 않습니다";
        checkCurrentPw.classList.add("error");
        checkCurrentPw.classList.remove("confirm");
        checkObj.workerCurrentPw = false; // 비밀번호 확인 
        return;
      }
      }

      checkCurrentPw.innerText = "현재 비밀번호가 일치합니다";
      checkCurrentPw.classList.add("confirm");
      checkCurrentPw.classList.remove("error");
      checkObj.workerCurrentPw = true;
    });
});

// 비밀번호 일치 여부, 유효성 검사
const memberPw = document.querySelector("#memberPw"); // 새로운 비밀번호 input
const memberPwConfirm = document.querySelector("#memberPwConfirm"); // 새로운 비밀번호 확인 input
const pwMessage = document.querySelector("#pwMessage"); // 현재 비밀번호 span

// 5) 비밀번호, 비밀번호확인이 같은지 검사하는 함수
const checkPw = () => {
  // 같을 경우
  if (memberPw.value === memberPwConfirm.value) {
    pwMessage.innerText = "비밀번호가 일치합니다";
    pwMessage.classList.add("confirm");
    pwMessage.classList.remove("error");
    checkObj.memberPwConfirm = true; // 비밀번호 확인 true
    return;
  }

  pwMessage.innerText = "비밀번호가 일치하지 않습니다";
  pwMessage.classList.add("error");
  pwMessage.classList.remove("confirm");
  checkObj.memberPwConfirm = false; // 비밀번호 확인 false
};

// 2) 비밀번호 유효성 검사
memberPw.addEventListener("input", (e) => {
  // 입력 받은 비밀번호 값
  const inputPw = e.target.value;

  // 3) 입력되지 않은 경우
  if (inputPw.trim().length === 0) {
    pwMessage.innerText = "신규 비밀번호를 입력해 주세요";
    pwMessage.classList.remove("confirm", "error");
    checkObj.memberPw = false; // 비밀번호가 유효하지 않다고 표시
    memberPw.value = ""; // 처음에 띄어쓰기 입력 못하게 하기
    return;
  }

  // 4) 입력 받은 비밀번호 정규식 검사
  const regExp = /^[a-zA-Z0-9!@#_-]{6,20}$/;

  if (!regExp.test(inputPw)) {
    // 유효하지 않으면
    pwMessage.innerText = "비밀번호가 유효하지 않습니다";
    pwMessage.classList.add("error");
    pwMessage.classList.remove("confirm");
    checkObj.memberPw = false;
    return;
  }

  // 유효한 경우
  pwMessage.innerText = "유효한 비밀번호 형식입니다";
  pwMessage.classList.add("confirm");
  pwMessage.classList.remove("error");
  checkObj.memberPw = true;

  // 비밀번호 입력 시 확인란의 값과 비교하는 코드 추가

  // 비밀번호 확인에 값이 작성되어 있을 때
  if (memberPwConfirm.value.length > 0) {
    checkPw();
  }
});

// 6) 비밀번호 확인 유효성 검사
// 단, 비밀번호(memberPw)가 유효할 때만 검사 수행
memberPwConfirm.addEventListener("input", () => {
  if (checkObj.memberPw) {
    // memberPw가 유효한 경우
    checkPw(); // 비교하는 함수 수행
    return;
  }

  checkObj.memberPwConfirm = false;
});

const changePwForm = document.querySelector("#changePwForm");
const formSection = document.querySelector(".formSection");

formSection.addEventListener("submit", (e) => {
  if (workerCurrentPw.value === memberPw.value) {
    e.preventDefault();
    alert("동일한 비밀번호로 변경하실 수 없습니다");
    return;
  }
  for (let key in checkObj) {
    if (!checkObj[key]) {
      console.log(key);
      alert("입력 사항을 올바르게 입력 후 눌러주세요!");
      e.preventDefault(); // 클릭 이벤트 중단

      document.getElementById(key).focus(); // 초점 이동

      return;
    }
  }
});
