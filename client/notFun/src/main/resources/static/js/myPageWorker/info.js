const updateBtn = document.querySelector(".updateBtn");
const passwordModal = document.getElementById("passwordModal");
const closeModal = document.querySelector(".close");
const currentPassword = document.querySelector(".currentPassword");
const checkPwbtn = document.querySelector(".checkPwbtn");

updateBtn.addEventListener("click", () => {
  passwordModal.style.display = "flex"; // 모달 열기
});

closeModal.addEventListener("click", () => {
  passwordModal.style.display = "none"; // 모달 닫기
});


checkPwbtn.addEventListener("click", () => {

  const obj = currentPassword.value;

  fetch("/myPageWorkee/checkPw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: obj
})
.then(resp => resp.text())
.then(result => {
    // 1 or 0

    if (result == 0) { // 인증번호 일치 안 할 때
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    // 비밀번호 일치할 때
    window.location.href = 'http://localhost/myPageWorkee/updateInfo';

});

});
