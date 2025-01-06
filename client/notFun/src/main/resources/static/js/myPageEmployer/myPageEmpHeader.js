const hamburger = document.querySelector(".hamburger");
const hamburgerMenu = document.querySelector(".nav-mypagemenu");
const userMenu = document.querySelector(".user-menu");
const userMenuList = document.querySelector(".nav-mypage");

// 햄버거 메뉴 토글
hamburger.addEventListener("click", function (e) {
  e.stopPropagation(); // 이벤트 버블링 방지
  hamburgerMenu.style.display =
    hamburgerMenu.style.display === "block" ? "none" : "block";
  // 다른 메뉴가 열려있다면 닫기
  userMenuList.style.display = "none";
});

// 유저 메뉴 토글
userMenu.addEventListener("click", function (e) {
  e.stopPropagation(); // 이벤트 버블링 방지
  userMenuList.style.display =
    userMenuList.style.display === "block" ? "none" : "block";
  // 다른 메뉴가 열려있다면 닫기
  hamburgerMenu.style.display = "none";
});

// 메뉴 외부 클릭시 닫기
document.addEventListener("click", function () {
  hamburgerMenu.style.display = "none";
  userMenuList.style.display = "none";
});

// 메뉴 내부 클릭시 이벤트 전파 방지
hamburgerMenu.addEventListener("click", function (e) {
  e.stopPropagation();
});

userMenuList.addEventListener("click", function (e) {
  e.stopPropagation();
});

// ESC 키 누를 때 메뉴 닫기
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    hamburgerMenu.style.display = "none";
    userMenuList.style.display = "none";
  }
});

// hover 스타일 제거를 위한 CSS 수정
const style = document.createElement("style");
style.textContent = `
      .hamburger:hover .nav-mypagemenu {
          display: none;
      }
      .user-menu:hover .nav-mypage {
          display: none;
      }
  `;
document.head.appendChild(style);
