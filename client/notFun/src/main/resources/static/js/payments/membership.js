// 데이터를 캐싱할 전역 변수
let globalMembershipList = [];

// URL에서 employerNo 가져오기
const getEmployerNoFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('no'); // 쿼리 스트링에서 'no' 값 가져오기
};

const employerNo = getEmployerNoFromURL();

// 가져온 employerNo 확인
if (employerNo) {
  console.log(`Employer No from URL: ${employerNo}`);
} else {
  console.log("No Employer No found in URL.");
}

async function fetchEmployerData() {
  try {
      const response = await fetch('/payments/data'); // 서버에 GET 요청

      if (!response.ok) {
          throw new Error('Failed to fetch data');
      }

      const data = await response.json(); // JSON 데이터 파싱
      console.log("Employer Data:", data); // 공통적으로 데이터를 콘솔에 출력

      // URL에 쿼리 스트링이 있는지 확인
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('no')) {
         
          return; // 이미 리다이렉트된 상태, 추가 동작 안 함
      }

      // 조건 처리
      if (data.length === 1) {
        // 데이터가 1개일 경우 employerNo를 쿼리 스트링에 추가하여 리다이렉트
        const employerNo = data[0].employerNo;
        const businessName = data[0].businessName; // 서버에서 가져온 businessName
    
        console.log('아아',businessName);

        // selected-business 요소의 display 속성을 보이도록 설정
        const selectedBusinessDiv = document.querySelector('.selected-business');
        if (selectedBusinessDiv) {
          selectedBusinessDiv.style.removeProperty('display'); // display 스타일 제거
      }
        // businessName 값을 h3 태그에 추가
        const businessNameElement = document.getElementById('businessName');
        businessNameElement.textContent = businessName; // businessName 설정
    
        // 쿼리 스트링으로 리다이렉트
        const redirectUrl = `/payments?no=${employerNo}`;
        console.log(`Redirecting to: ${redirectUrl}`);
        window.location.href = redirectUrl; // 리다이렉트 실행
    } else if (data.length > 1) {
            // 데이터가 여러 개일 경우 대기
            console.log("Multiple results found. Waiting for further action.");
        }
    } catch (error) {
        console.error('Error fetching employer data:', error);
    }
}

// 페이지 로드 시 데이터 가져오기
fetchEmployerData();



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


