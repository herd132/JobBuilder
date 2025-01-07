const workerCurrentPw = document.querySelector(".input-field"); // 현재 비밀번호 input
const secessionBtn = document.querySelector(".submit-btn"); // 탈퇴하기 버튼
const agreeCheckbox = document.querySelector("#agree"); // 동의 체크박스
const checkCurrentPw = document.querySelector("#checkCurrentPw"); // 비밀번호 확인 메시지
const formField = document.querySelector(".form-field"); // 탈퇴 form

const checkObj = {
  workerCurrentPw: false,
  agreeCheckbox: false,
}; // 비밀번호 상태, 체크박스 상태 저장

// 비밀번호 입력 시 확인
workerCurrentPw.addEventListener("input", (e) => {
  const obj = e.target.value;

  if (obj.length === 0) {
    checkCurrentPw.classList.remove("confirm", "error");
    checkObj.workerCurrentPw = false;
    obj = ""; // 처음에 띄어쓰기 입력 못하게 하기
    e.preventDefault();
    return;
  }

  // 서버에서 현재 비밀번호 확인
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

agreeCheckbox.addEventListener("change", () => {
  checkObj.agreeCheckbox = agreeCheckbox.checked;
});


formField.addEventListener("submit", (e) => {
  if(checkObj.agreeCheckbox == false || checkObj.workerCurrentPw == false) {
    e.preventDefault();
    alert("현재 비밀번호와 동의사항의 체크 여부를 확인해 주세요");
    return;
  }

  if(!confirm("정말 탈퇴하시겠습니까?")) {
    e.preventDefault();
    return;
}

})


