const workerCurrentPw = document.querySelector(".input-field"); // 현재 비밀번호 input
const secessionBtn = document.querySelector(".submit-btn"); // 탈퇴하기 버튼
const agreeCheckbox = document.querySelector("#agree"); // 동의 체크박스
const checkCurrentPw = document.querySelector("#checkCurrentPw"); // 비밀번호 확인 메시지
let checkObj = { workerCurrentPw: false }; // 비밀번호 상태 저장

// 비밀번호 입력 시 확인
workerCurrentPw.addEventListener("input", (e) => {
  const obj = e.target.value.trim(); // 비밀번호를 공백 제거하고 처리

  if (obj.length === 0) {
    checkCurrentPw.innerText = "현재 비밀번호를 입력해 주세요";
    checkCurrentPw.classList.remove("confirm", "error");
    checkObj.workerCurrentPw = false;
    secessionBtn.disabled = true; // 비밀번호 미입력 시 탈퇴 버튼 비활성화
    return;
  }

  // 서버에서 현재 비밀번호 확인
  fetch("/myPageWorkee/checkPw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: obj }), // 비밀번호를 JSON 형태로 서버에 전달
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result === "0") {
        checkCurrentPw.innerText = "현재 비밀번호가 일치하지 않습니다";
        checkCurrentPw.classList.add("error");
        checkCurrentPw.classList.remove("confirm");
        checkObj.workerCurrentPw = false;
      } else {
        checkCurrentPw.innerText = "현재 비밀번호가 일치합니다";
        checkCurrentPw.classList.add("confirm");
        checkCurrentPw.classList.remove("error");
        checkObj.workerCurrentPw = true;
      }
      toggleSecessionBtn(); // 비밀번호 입력 시 탈퇴 버튼 상태를 점검
    });
});

// 동의 체크박스 상태 변경 시
agreeCheckbox.addEventListener("change", () => {
  toggleSecessionBtn(); // 동의 여부에 따라 탈퇴 버튼 상태를 점검
});

// 탈퇴 버튼 상태 점검 함수
function toggleSecessionBtn() {
  // 비밀번호가 맞고, 동의 체크박스가 체크되었을 때만 버튼 활성화
  if (checkObj.workerCurrentPw && agreeCheckbox.checked) {
    secessionBtn.disabled = false;
  } else {
    secessionBtn.disabled = true;
  }
}

// 탈퇴 버튼 클릭 시 처리 (이 부분은 실제 탈퇴 로직에 맞게 수정 필요)
secessionBtn.addEventListener("click", () => {
  const currentPw = workerCurrentPw.value.trim();

  // 실제 탈퇴 처리 로직 (서버로 탈퇴 요청 전송 등)
  if (checkObj.workerCurrentPw && agreeCheckbox.checked) {
    alert("회원탈퇴가 완료되었습니다.");
    // 여기서 실제 서버에 탈퇴 요청을 보내는 코드 추가
    // 예: fetch("/myPageWorker/deleteAccount", { method: "POST", body: JSON.stringify({ password: currentPw }) });
  } else {
    alert("비밀번호 확인 및 동의가 필요합니다.");
  }
});