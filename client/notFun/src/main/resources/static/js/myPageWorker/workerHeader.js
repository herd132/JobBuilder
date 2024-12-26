const hamburgerBtn = document.querySelector(".hamburger");
const menu = document.querySelector(".nav-mypagemenu");


// 메뉴바 클릭 시 메뉴 토글
hamburgerBtn.addEventListener('click', function(event) {
  // 클릭 이벤트의 전파를 막기 위해
  event.stopPropagation();

  // 메뉴가 펼쳐져 있으면 닫고, 닫혀 있으면 펼치기
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
});

// 메뉴 외부 클릭 시 메뉴 닫기
document.addEventListener('click', function(event) {
  // 클릭된 곳이 메뉴바나 메뉴 아이콘이 아니면 메뉴 닫기
  if (!menu.contains(event.target) && event.target !== menu) {
    menu.style.display = 'none';
  }
});