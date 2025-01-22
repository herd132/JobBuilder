(async () => {
  window.employerNo = 0;
  window.globalMembershipList = [];
  window.memberNo = 0;
  let isModalOpen = false;

  const businessNameElement = document.getElementById("businessName");
  const employerNoInput = document.getElementById("employerNoInput");
  const changeButton = document.querySelector(".change-button");
  const listButton = document.querySelector(".list-button"); 
  const modal = document.getElementById("employerModal");
  const employerList = document.getElementById("employerList");


  listButton.value = employerNo;

// 클릭 이벤트 처리



  function createModal(data) {
    employerList.innerHTML = "";

    if (data.length === 0) {
      employerList.innerHTML = "<p>등록된 사업주가 없습니다.</p>";
      return;
    }

    data.forEach((employer) => {
      const button = document.createElement("button");
      button.textContent = employer.businessName;
      button.dataset.employerNo = employer.employerNo;
      button.dataset.memberNo = employer.memberNo;
      button.classList.add("employer-button");

      employerList.appendChild(button);
    });
  }

  function showModal() {
    if (isModalOpen) return;
    modal.style.display = "block";
    isModalOpen = true;

    employerList.addEventListener("click", (event) => {
      if (event.target.classList.contains("employer-button")) {
        const employerNo = event.target.dataset.employerNo;
        const businessName = event.target.textContent;
        const memberNo = event.target.dataset.memberNo;

        window.employerNo = employerNo;
        if (businessNameElement) {
          businessNameElement.textContent = businessName;
        }
        sessionStorage.setItem("membershipEmployerNo", employerNo);
        sessionStorage.setItem("membershipBusinessName", businessName);
        sessionStorage.setItem("membershipMemberNo", memberNo);

        
        closeModalFunc();
        renderringui(window.employerNo); // 렌더링 UI 호출
        return;
      }
    });

    const closeButton = modal.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", function (event) {
        if (businessNameElement && businessNameElement.textContent.trim() === "") {
          // 값이 없거나 비었을 경우
          event.preventDefault(); // 이벤트 막기
          alert("사업주를 먼저 선택하세요"); 
        } else {
          closeModalFunc(); // 값이 있으면 모달 닫기 함수 실행
        }
      });
    }
  }

  function closeModalFunc() {
    if (!isModalOpen) return;
    modal.style.display = "none";
    isModalOpen = false;
  }


  // **고용주 정보 초기화 함수**
  function clearEmployerInfo() {
    window.employerNo = null;
    if (employerNoInput) employerNoInput.value = '';
    if (businessNameElement) businessNameElement.textContent = '사업주 정보가 없습니다';
    sessionStorage.removeItem('membershipEmployerNo');
    sessionStorage.removeItem('membershipBusinessName');
    sessionStorage.removeItem('membershipMemberNo');

    // 변경하기 버튼 숨김
    if (changeButton) changeButton.style.display = "none";
    if (listButton) listButton.style.display = "none";
    resetStatus(); // UI 초기화
}

async function fetchEmployerData() {
  try {
      const response = await fetch("/payments/data");
      const data = await response.json();

      if (!data) {window.memberNo = data[0].memberNo || null;}
      if (data === null || data.length === 0) {
          clearEmployerInfo();
          return;
      }

      if (data.length === 1) {
          window.employerNo = data[0].employerNo;
          if (businessNameElement) {
              businessNameElement.textContent = data[0].businessName;
          }
          if (listButton) {
            listButton.style.display = "inline-block";
          }
          await renderringui(window.employerNo);
          return;
      } else if (data.length > 1) {
          if (changeButton) {
              changeButton.style.display = "inline-block";
          }
          if (listButton) {
            listButton.style.display = "inline-block";
        }

          createModal(data); 
          updateUi(data);
          return;
      }
  } catch (error) {
      console.error("고용주 데이터 요청 실패:", error);
      clearEmployerInfo();
  }
}

  async function updateUi(data) {
    const storedMemberNo = Number(sessionStorage.getItem("membershipMemberNo"));
   
    if (data[0].memberNo === storedMemberNo) {
      window.employerNo = Number(sessionStorage.getItem("membershipEmployerNo"));
      if (businessNameElement) {
        businessNameElement.textContent = sessionStorage.getItem("membershipBusinessName");
      }
      await renderringui(window.employerNo); // 렌더링 UI 호출
      return;
    } else {
      showModal();
    }
  }

  async function renderringui(employerNo) {
    if (!employerNo) {
      console.error("employerNo가 설정되지 않았습니다.");
      return;
    }

    try {
      const response = await fetch("/payments/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerNo }),
      });

      if (!response.ok) {
        throw new Error("Membership 데이터를 가져오는 데 실패했습니다.");
      }

      const data = await response.json();
      window.globalMembershipList = data.membershipDetails || [];

      updateMembershipUI();
    } catch (error) {
      console.error("Membership 데이터 요청 실패:", error);
    }
  }

  const resetStatus = () => {
    const resetButtons = document.querySelectorAll('[name="gradeStatus"]');
    resetButtons.forEach((button) => {
      button.classList.remove("payments-btn-now", "payments-btn-after");
      button.classList.add("payments-btn-after");
      button.innerHTML = "시작하기";
    });

    const goldContainer = document.querySelector("#goldMembershipContainer");
    if (goldContainer) {
      goldContainer.style.pointerEvents = "auto";
    }
  };

  const updateMembershipUI = () => {
    resetStatus();

    globalMembershipList.forEach(({ membershipType, remainingDays }) => {
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
    });
  };

  if (changeButton) {
    changeButton.addEventListener("click", showModal);
  }

  listButton.setAttribute("data-employer-no", employerNo);
  listButton.addEventListener("click", () => {
  sessionStorage.setItem('employerNo',employerNo);
  window.location.href = "/payments/history";
});

  await fetchEmployerData();
})();


