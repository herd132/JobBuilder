let currentIndex = 0;
let autoSlideInterval;
const slideInterval = 5000; // 5초
const carousel = document.getElementById('carousel');

// 슬라이드 이동 함수
function moveSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;

    currentIndex = (currentIndex + direction + slides.length) % slides.length;
    updateCarousel();
    
    // 수동으로 슬라이드 이동 시 자동 슬라이드 타이머 재설정
    resetAutoSlide();
}

// 캐러셀 업데이트 함수
function updateCarousel() {
    if (!carousel) return;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// 자동 슬라이드 시작 함수
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        moveSlide(1); // 1은 다음 슬라이드로 이동
    }, slideInterval);
}

// 자동 슬라이드 중지 함수
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

// 자동 슬라이드 재설정 함수
function resetAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    updateCarousel();
    startAutoSlide();

    // 마우스가 캐러셀 위에 있을 때 자동 슬라이드 중지
    carousel.addEventListener('mouseenter', stopAutoSlide);
    
    // 마우스가 캐러셀을 벗어날 때 자동 슬라이드 재시작
    carousel.addEventListener('mouseleave', startAutoSlide);
});

// 페이지 벗어날 때 인터벌 정리
window.addEventListener('beforeunload', () => {
    stopAutoSlide();
});

//------------

// 탑브랜드로고 클릭 시
function fowardRecruitment(empNo) {
	const employerNo = Number(empNo);
	location.href = `/recruitment/latestTopBrandRecruitment?employerNo=${employerNo}`;
}


//-----

const navMypage = document.querySelector(".nav-mypage");
let selectChattingNo; // 선택한 채팅방 번호
let selectTargetNo; // 현재 채팅 대상
let selectTargetName; // 대상의 이름
let loginMemberNo;


if (navMypage !== null) {

  document.querySelector("body").addEventListener("click", e => {

    if (e.target === document.querySelector(".fa-chevron-down ") || e.target === document.querySelector(".nav-nickname")) {

      navMypage.classList.remove("hidden");

    } else if (e.target !== navMypage) {

      navMypage.classList.add("hidden");
    }
  })
  
}

const customerServiceLink = document.querySelector('.chatting-bot');
let popupWindow;

if (customerServiceLink !== null) {
  // 고객센터 클릭 시 모달 표시
  customerServiceLink.addEventListener('click', (e) => {
    console.log("됨");
    fetch("/chat/loginCheck")
      .then(resp => resp.text())
      .then(result => {

        if (result == 0) {

          alert("로그인 후 이용해 주시기 바랍니다.")
          return;
        } else {
          
          const url = "/chat/bot";
          const name = "chatBot";
          const options = 'width=400px, height=550px, top=50, left=50, scrollbars=yes, toolbar=no, resizable=false, location=no';
  
          // 창이 이미 열려 있다면 새로고침 방지
          if (popupWindow && !popupWindow.closed) {

              popupWindow.focus(); // 창 활성화

          } else {
              // 새 창 열기
              popupWindow = window.open(url, name, options);

          }
        }

      });
    });
}

const searchBtn = document.querySelector(".search-btn");

if( searchBtn !== null ) {
  searchBtn.addEventListener("click", () => {
    const originalPushState = history.pushState;
    originalPushState();
  });
}

// const links = document.querySelectorAll("a");

// for( let link of links) {
//   link.addEventListener("click", test)
// }

// df

// // 1:1 문의 로그인 안 했을 시 경고 이벤트
// const inquiry = document.querySelector(".inquiry");

// if( inquiry !== null ) {
//   inquiry.addEventListener("click", (e) => {
//     let test = 1;
//     fetch("/chat/loginCheck")
//     .then(resp => resp.text())
//     .then(result => {

//       if (result == 0) {
//         alert("로그인 후 이용해 주시기 바랍니다.");
        
//       }
//     });
//   });
// }


const empLogin = (email) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/employer/employerLogin';

  const inputMemberEmail = document.createElement('input');
  inputMemberEmail.type = 'hidden'; // 사용자에게 보이지 않게
  inputMemberEmail.name = 'memberEmail';
  inputMemberEmail.value = email;
  form.appendChild(inputMemberEmail);

  const inputMemberPw = document.createElement('input');
  inputMemberPw.type = 'hidden';
  inputMemberPw.name = 'memberPw';
  inputMemberPw.value = 'pass01!';
  form.appendChild(inputMemberPw);

  document.body.appendChild(form);
  form.submit();
}

const empLogin3 = () => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/worker/workerLogin';

  const inputMemberEmail = document.createElement('input');
  inputMemberEmail.type = 'hidden'; // 사용자에게 보이지 않게
  inputMemberEmail.name = 'workerId';
  inputMemberEmail.value = '123';
  form.appendChild(inputMemberEmail);

  const inputMemberPw = document.createElement('input');
  inputMemberPw.type = 'hidden';
  inputMemberPw.name = 'memberPw';
  inputMemberPw.value = '123';
  form.appendChild(inputMemberPw);

  document.body.appendChild(form);
  form.submit();
}



// 초기 화면 크기 저장
const initialWidth = window.innerWidth;
const initialHeight = window.innerHeight;
const mobileWidth = 1280;

// 크기 조정 함수
function adjustSizes() {
  const zoom = Math.min(window.innerWidth / mobileWidth, 1);

  // 비율 계산 (너비 기준)
  document.documentElement.style.zoom = `${zoom}`;
}

// 이벤트 리스너 추가 (화면 크기 변경 시 실행)
window.addEventListener('resize', adjustSizes);

// 페이지 로드 시 실행
adjustSizes();
