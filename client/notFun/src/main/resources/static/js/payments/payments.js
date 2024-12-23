console.log("payments.js 와 연결됨");

// DOM 요소 선택
const loginBtn = document.getElementById("tempLoginBtn");
const loginBtn2 = document.getElementById("tempLoginBtn2");
const logoutBtn = document.getElementById("tempLogoutBtn");
const userInfoDiv = document.getElementById("userInfo");
const errorContainer = document.getElementById("error-container");
const detailsContainer = document.getElementById("details-container");

// 임시 로그인 버튼 클릭 이벤트
loginBtn.addEventListener("click", () => {
  const loginEmployer = { employerNo: 2, employerName: "잡코리아(수동부분)" };
  sessionStorage.setItem("loginEmployer", JSON.stringify(loginEmployer));
  setSessionOnServer(loginEmployer);
  updateUI();
});

loginBtn2.addEventListener("click", () => {
  const loginEmployer = { employerNo: 3, employerName: "사람인 (수동부분)" };
  sessionStorage.setItem("loginEmployer", JSON.stringify(loginEmployer));
  setSessionOnServer(loginEmployer);
  updateUI();
});

// 로그아웃 버튼 클릭 이벤트
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("loginEmployer");
  detailsContainer.innerText = "";
  updateUI();
});

// 서버에 세션 설정 요청 함수
function setSessionOnServer(loginEmployer) {
  fetch("/payments/setSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginEmployer),
  });
}

// UI 업데이트 함수
function updateUI() {
  const storedUserInfo = JSON.parse(
    sessionStorage.getItem("loginEmployer") || "{}"
  );

  if (storedUserInfo.employerNo) {
    userInfoDiv.innerText = `회원번호: ${storedUserInfo.employerNo}, 이름: ${storedUserInfo.employerName}`;
    fetchMembershipDetails();
  } else {
    userInfoDiv.innerText = "로그인 안됨";
    detailsContainer.innerText = "";
  }
}

// 맴버십 상세 정보 요청
function fetchMembershipDetails() {
  fetch("/payments/details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      renderDetails(data.membershipDetails);
    });
}

// 맴버십 상세 정보 렌더링
function renderDetails(details) {
  detailsContainer.innerText = `
        Employer No: ${details.employerNo}
        Membership Type: ${details.membershipType}
    `;
  errorContainer.innerText = "";
}

// 페이지 로드 시 UI 초기화
document.addEventListener("DOMContentLoaded", updateUI);
