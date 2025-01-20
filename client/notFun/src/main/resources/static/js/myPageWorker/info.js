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


checkPwbtn.addEventListener("click", (e) => {
  const obj = currentPassword.value;

  if (!obj.trim()) {
    alert("비밀번호를 입력해주세요."); // 경고 메시지 표시
    currentPassword.focus(); // 입력 필드로 포커스 이동
    return; // 요청 차단
  }

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
    window.location.href = 'updateInfo';

});

function onGeoOkay(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  // 위도 경도 변수 선언
  console.log("You live in", lat, lng);
}

function onGeoError() {
  alert("I can't find you. No weather for you.");
}

navigator.geolocation.getCurrentPosition(onGeoOkay, onGeoError);


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log("현재 위치는 위도 " + latitude + ", 경도 " + longitude + " 입니다.");
  });
} else {
  console.log("브라우저에서 위치 정보를 가져올 수 없습니다.");
}

});
