console.log("testpay.js 와 연결됨");

document.addEventListener("DOMContentLoaded", () => {
  const addIngredientBtn = document.querySelector("#add-ingredient-btn");
  const ingredientContainer = document.querySelector("#findrecipe-addpart");

  let Count = 1; // 재료 입력 필드 개수 추적

  addIngredientBtn.addEventListener("click", () => {
    Count++;

    const newIngredientGroup = document.createElement("div");
    newIngredientGroup.classList.add("findrecipe-addpart");
    newIngredientGroup.id = `div-${Count}`; // 동적으로 ID 설정
    newIngredientGroup.innerHTML = `
    <div class="item">
      <form>
        <select name="membership" >
          <option value="none">=== 선택 ===</option>
          <option value="gold" selected>골드</option>
          <option value="platinum">플레티넘</option>
        </select>
      </form>
      <form>
        <select name="date" >
          <option value="none">=== 선택 ===</option>
          <option value="1" selected>1개월</option>
          <option value="2">2개월</option>
          <option value="3">3개월</option>
          <option value="4">4개월</option>
          <option value="5">5개월</option>
          <option value="6">6개월</option>
          <option value="7">7개월</option>
          <option value="8">8개월</option>
          <option value="9">9개월</option>
          <option value="10">10개월</option>
          <option value="11">11개월</option>
          <option value="12">12개월</option>

        </select>
      </form>
      <button data-id="${Count}" class="delete-btn">-</button>
    </div>
    `;
    ingredientContainer.appendChild(newIngredientGroup);
  });

  // 이벤트 위임을 사용하여 삭제 버튼 동작 처리
  ingredientContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const id = event.target.getAttribute("data-id"); // 버튼의 data-id 추출
      const targetDiv = document.getElementById(`div-${id}`);
      if (targetDiv) {
        targetDiv.remove(); // 해당 div 삭제
      }
    }
  });
});





// DOM 요소 선택
const loginBtn = document.getElementById("tempLoginBtn");
const loginBtn2 = document.getElementById("tempLoginBtn2");
const logoutBtn = document.getElementById("tempLogoutBtn");
const userInfoDiv = document.getElementById("userInfo");
const errorContainer = document.getElementById("error-container");
const detailsContainer = document.getElementById("details-container");

// 임시 로그인 버튼 클릭 이벤트
loginBtn.addEventListener("click", () => {
  const loginEmployer = { employerNo: 2, employerName: "잡코리아(수동부분)",membershipType: 2 };
  sessionStorage.setItem("loginEmployer", JSON.stringify(loginEmployer));
  setSessionOnServer(loginEmployer);
  updateUI();
});

loginBtn2.addEventListener("click", () => {
  const loginEmployer = { employerNo: 3, employerName: "사람인 (수동부분)",membershipType: 3 };
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
    sessionStorage.getItem("loginEmployer")
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
  detailsContainer.innerHTML = `
    ${details.membershipContent}
    `;
}

// 페이지 로드 시 UI 초기화
document.addEventListener("DOMContentLoaded", updateUI);
