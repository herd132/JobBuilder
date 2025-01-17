let currentIndex = 0;
let autoSlideInterval;
const slideInterval = 3000; // 3초
let isTransitioning = false;

function setupInfiniteCarousel() {
	const carousel = document.getElementById('carousel');
	const slides = document.querySelectorAll('.carousel-slide');
	if (!carousel || !slides.length) return;

	// 처음과 마지막에 보이는 아이템 수만큼 복제
	const visibleItems = 10;
	for (let i = 0; i < visibleItems; i++) {
		// 앞에 마지막 아이템들 추가
		const lastItem = slides[slides.length - 1 - i].cloneNode(true);
		lastItem.classList.add('clone');
		carousel.insertBefore(lastItem, carousel.firstChild);

		// 뒤에 처음 아이템들 추가
		const firstItem = slides[i].cloneNode(true);
		firstItem.classList.add('clone');
		carousel.appendChild(firstItem);
	}

	// 초기 위치 설정
	currentIndex = visibleItems;
	updateCarousel(false);
}

function moveSlide(direction) {
	if (isTransitioning) return;

	isTransitioning = true;
	const slides = document.querySelectorAll('.carousel-slide:not(.clone)');
	const totalSlides = slides.length;

	currentIndex += direction;
	updateCarousel(true);

	// transition 종료 후 위치 조정
	setTimeout(() => {
		const visibleItems = 10;
		if (currentIndex <= visibleItems - 1) {
			// 앞쪽 끝에 도달
			currentIndex = totalSlides + (visibleItems - 1);
			updateCarousel(false);
		} else if (currentIndex >= totalSlides + visibleItems) {
			// 뒤쪽 끝에 도달
			currentIndex = visibleItems;
			updateCarousel(false);
		}
		isTransitioning = false;
	}, 300);

	resetAutoSlide();
}

function updateCarousel(withTransition = true) {
	const carousel = document.getElementById('carousel');
	if (!carousel) return;

	const slideWidth = 10; // 각 슬라이드가 20%의 너비를 차지
	carousel.style.transition = withTransition ? 'transform 0.5s ease' : 'none';
	carousel.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
}

function startAutoSlide() {
	autoSlideInterval = setInterval(() => {
		moveSlide(1);
	}, slideInterval);
}

function stopAutoSlide() {
	if (autoSlideInterval) {
		clearInterval(autoSlideInterval);
	}
}

function resetAutoSlide() {
	stopAutoSlide();
	startAutoSlide();
}

document.addEventListener('DOMContentLoaded', () => {
	setupInfiniteCarousel();
	startAutoSlide();

	const carousel = document.getElementById('carousel');
	if (carousel) {
		carousel.addEventListener('mouseenter', stopAutoSlide);
		carousel.addEventListener('mouseleave', startAutoSlide);
	}
});

window.addEventListener('resize', () => {
	updateCarousel(false);
});

window.addEventListener('beforeunload', () => {
	stopAutoSlide();
});

//------------

// 마감임박공고 클릭 시
function fetchDeadlineJob(event) {
	const query = event.target.getAttribute('data-test-no');
	location.href = `/recruitment/list?query=${query}&type=deadline`;
}

// 지역별 공고 클릭 시
function fetchRegionJob(query) {
	//const query = event.target.getAttribute('data-test-no');
	location.href = `/recruitment/list?query=${query}&type=region`;
}

//-----------------

// 탑브랜드로고 클릭 시
function fowardRecruitment(empNo) {
	const employerNo = Number(empNo);
	location.href = `/recruitment/latestTopBrandRecruitment?employerNo=${employerNo}`;
}


//-----

// 페이지 로드 시 hideTopBanner 쿠키 확인
document.addEventListener("DOMContentLoaded", () => {
	const topBanner = document.getElementById("top-banner");
	const topBannerCloseBtn = document.getElementById("top-banner-close-btn");

	if (!topBanner || !topBannerCloseBtn) {
		return;
	}

	// 쿠키 읽기
	const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
		const [key, value] = cookie.split("=");
		acc[key] = value;
		return acc;
	}, {});

	// hideTopBanner가 true이면 배너 숨기기
	if (cookies.hideTopBanner === "true") {
		topBanner.style.display = "none";
	}

	// 닫기 버튼 클릭 시 hideTopBanner 쿠키 설정
	if (topBannerCloseBtn) {
		topBannerCloseBtn.addEventListener("click", () => {
			// 1일 뒤 만료되는 쿠키 설정
			const date = new Date();
			date.setDate(date.getDate() + 1);

			document.cookie = `hideTopBanner=true; path=/; expires=${date.toUTCString()}`;
			topBanner.style.display = "none"; // 배너 숨기기
		});
	}
});

// ----------------

// Top 버튼
const topButton = document.getElementById("topButton");

// 스크롤 이벤트 리스너
if (topButton) {
	window.addEventListener("scroll", () => {
		if (window.scrollY > 200) { // 스크롤이 200px 이상 내려가면
			topButton.classList.add("show"); // 보이게 설정
		} else {
			topButton.classList.remove("show"); // 숨김 처리
		}
	});

	// 버튼 클릭 이벤트
	topButton.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth" // 부드러운 스크롤
		});
	});
}




// ----------------

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

if (searchBtn !== null) {
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
