
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


