// 전역 변수 선언
let employerNo = null;
let globalMembershipList = []; // 캐싱을 위한 전역 변수

// DOM 요소 선택
const selectedBusinessDiv = document.querySelector('.selected-business');
const businessNameElement = document.getElementById('businessName');
const employerNoInput = document.getElementById('employerNoInput'); // 히든 인풋

// 패치 요청 함수
async function fetchEmployerData() {
    try {
        const response = await fetch('/payments/data'); // 서버에 GET 요청

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json(); // JSON 데이터 파싱
        console.log("Employer Data:", data); // 서버에서 받은 데이터 로그 출력

        // 데이터 처리
        if (data.length === 1) {
            const employerNoFromData = data[0]?.employerNo;
            const businessName = data[0]?.businessName;

            // 데이터 유효성 확인
            if (!employerNoFromData || !businessName) {
                throw new Error("Invalid data: Missing employerNo or businessName");
            }

            console.log('Single Employer Found:', { employerNoFromData, businessName });

            // 히든 인풋에 값을 저장
            if (employerNoInput) {
                employerNoInput.value = employerNoFromData; // 히든 인풋 값 설정
                employerNo = employerNoFromData; // 전역 변수 업데이트
            } else {
                throw new Error("Hidden input '#employerNoInput' not found.");
            }

            // businessName 업데이트 (UI 처리 예시)
            if (businessNameElement) {
                businessNameElement.textContent = businessName;
            }
        } else if (data.length > 1) {
            console.log("Multiple employers found. Allow user to select one.");
            // 여러 개의 고용주 처리 로직 추가 가능
            // 예: UI를 통해 사용자가 선택할 수 있도록 구현
        } else {
            console.log("No employer data found.");
        }
    } catch (error) {
        console.error('Error fetching employer data:', error.message);
    }
}
console.log("No emplo333.","employerNoInput.value);
// 데이터 캐싱 함수


async function fetchAndCacheMembershipData(employerNo) {
    if (globalMembershipList.length > 0) {
        // 이미 데이터가 저장되어 있다면 이를 반환
        return [...globalMembershipList];
    }

    try {
        // 서버에서 데이터 가져오기
        const response = await fetch(`/payments/details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employerNo }),
        });

        if (!response.ok) {
            throw new Error("데이터를 가져오는 데 실패했습니다.");
        }

        // JSON 변환 후 글로벌 변수에 저장
        const data = await response.json();
        globalMembershipList = data.membershipDetails || [];

        return [...globalMembershipList];
    } catch (error) {
        console.error("에러:", error);
        return [];
    }
}

// 초기화 함수
async function init() {
    await fetchEmployerData(); // 고용주 데이터 가져오기

    if (employerNo) {
        console.log("employerNo initialized:", employerNo);
        // employerNo가 필요한 다른 비동기 작업들 호출
        const membershipData = await fetchAndCacheMembershipData(employerNo);
        console.log("Membership Data:", membershipData);
        // 추가적인 초기화 작업 수행
    } else {
        console.error("employerNo가 초기화되지 않았습니다.");
        // employerNo가 없을 경우의 처리 로직
    }

    // 여기에 다른 초기화 로직을 추가할 수 있습니다.
    // 예: 이벤트 리스너 설정, UI 초기화 등
}

// 즉시 실행 함수 (IIFE)를 사용하여 초기화 시작
(async () => {
    await init();
    // 초기화가 완료된 후 실행할 추가 코드가 있다면 여기서 호출
    // 예: 다른 모듈 초기화, 사용자 인터랙션 설정 등
})();


// 모든 버튼 초기화 함수
const resetStatus = () => {
  const resetButtons = document.querySelectorAll('[name="gradeStatus"]');
  resetButtons.forEach((button) => {
    button.classList.remove("payments-btn-now", "payments-btn-after");
    button.classList.add("payments-btn-after");
    button.innerHTML = "시작하기";
  });
};

// 특정 맴버십 UI 업데이트 함수
const updateMembershipElement = (membershipType, remainingDays) => {
  const elementSelectors = {
    2: "#gold",
    3: "#platinum",
    4: "#plus1",
    5: "#plus2",
  };

  const element = document.querySelector(elementSelectors[membershipType]);
  if (!element) return;

  if (membershipType === 3) {
    const goldElement = document.querySelector("#gold");
    if (goldElement) {
      goldElement.classList.add("payments-btn-now");
      goldElement.innerHTML = "이미 적용중인 혜택";
    }
    const goldContainer = document.querySelector("#goldMembershipContainer");
    if (goldContainer) {
      goldContainer.style.pointerEvents = "none";
    }
  }

  element.classList.add("payments-btn-after");
  element.innerHTML = `${remainingDays}일 남음`;
};

// UI 업데이트 함수
const updateMembershipUI = () => {
  resetStatus();

  globalMembershipList.forEach((membership) => {
    const { membershipType, remainingDays } = membership;
    updateMembershipElement(membershipType, remainingDays);
  });
};

// 데이터를 초기화하고 UI를 업데이트하는 함수
async function initializeMembershipData() {
  
  if (!employerNo) {
    resetStatus(); // 초기화 작업
    return;
  }

  // 데이터 요청 및 캐싱
  const data = await fetchAndCacheMembershipData(employerNo);

  if (data.length >= 0) {
    console.log("가져온 맴버십 데이터:", data);
    updateMembershipUI(); // UI 업데이트
  } else {
    console.log("맴버십 데이터를 가져오는 데 실패했습니다.");
  }
}

// 초기화 실행
initializeMembershipData();


