(async () => {
    // 전역 변수 선언
    window.employerNo = null;
    window.globalMembershipList = [];
    let isModalOpen = false; // 모달 상태 확인용 변수

    // DOM 요소 선택
    const businessNameElement = document.getElementById('businessName');
    const employerNoInput = document.getElementById('employerNoInput');
    const changeButton = document.querySelector('.change-button');
    const modal = document.getElementById("employerModal");
    const closeButton = modal.querySelector(".close-button");
    const employerList = document.getElementById("employerList");

    // **모달 열기/닫기 함수**
    const openModal = () => {
        if (isModalOpen) return; // 이미 열려 있으면 중단
        modal.style.display = "block";
        isModalOpen = true;
    };

    const closeModalFunc = () => {
        if (!isModalOpen) return; // 이미 닫혀 있으면 중단
        modal.style.display = "none";
        isModalOpen = false;
    };

    closeButton.addEventListener("click", closeModalFunc);

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    // **고용주 정보 설정 함수**
    function setEmployerInfo(employerNo, businessName, memberNo) {
        window.employerNo = employerNo;
        if (employerNoInput) employerNoInput.value = window.employerNo;
        if (businessNameElement) businessNameElement.textContent = businessName;
        sessionStorage.setItem('selectedEmployerNo', employerNo);
        sessionStorage.setItem('selectedBusinessName', businessName);
        sessionStorage.setItem('selectedMemberNo', memberNo);

        console.log("sessionStorage에 고용주 정보 저장됨:", { employerNo, businessName, memberNo });

        // 변경하기 버튼 표시 (고용주가 여러 개인 경우에만)
        if (changeButton) {
            // 변경하기 버튼의 표시 여부는 고용주 데이터 수에 따라 결정됨
            // 이미 fetchEmployerData에서 처리하므로 여기서는 다시 설정할 필요 없음
        }

        // 새로운 고용주 데이터로 UI 초기화
        initializeMembershipData();
    }

    // **고용주 정보 초기화 함수**
    function clearEmployerInfo() {
        window.employerNo = null;
        if (employerNoInput) employerNoInput.value = '';
        if (businessNameElement) businessNameElement.textContent = '사업주 정보가 없습니다';
        sessionStorage.removeItem('selectedEmployerNo');
        sessionStorage.removeItem('selectedBusinessName');
        sessionStorage.removeItem('selectedMemberNo');

        // 변경하기 버튼 숨김
        if (changeButton) changeButton.style.display = "none";

        console.log("sessionStorage 초기화됨");

        resetStatus(); // UI 초기화
    }
    if (businessNameElement) businessNameElement.textContent = '사업주 정보가 없습니다';
    
    // **다중 고용주 선택 UI 생성 함수**
    async function createEmployerSelectionUI(employers) {
        employerList.innerHTML = '';

        if (employers.length === 0) {
            employerList.innerHTML = '<p>등록된 사업주가 없습니다.</p>';
            return;
        }

        employers.forEach(employer => {
            const button = document.createElement('button');
            button.textContent = employer.businessName;
            button.dataset.employerNo = employer.employerNo;
            button.classList.add('employer-button');
            button.addEventListener('click', async () => {
                setEmployerInfo(employer.employerNo, employer.businessName, employer.memberNo);
                closeModalFunc();
            });
            employerList.appendChild(button);
        });

        openModal();
    }

    // **고용주 데이터 가져오기 및 UI 업데이트 함수**
    async function fetchEmployerData() {
        console.log("fetchEmployerData 호출됨.");
        try {
            const response = await fetch('/payments/data');
            const data = await response.json();

            // 데이터가 null인 경우 (로그인 정보 없음)
            if (data === null) {
                console.log("로그인 정보가 없습니다.");
                clearEmployerInfo(); // UI 초기화
                return; // 모달을 열지 않음
            }

            // 데이터가 배열이 아닌 경우 처리 (예외 처리)
            if (!Array.isArray(data)) {
                console.warn("예상치 못한 데이터 형식:", data);
                clearEmployerInfo();
                return;
            }

            const storedEmployerNo = sessionStorage.getItem('selectedEmployerNo');
            const storedMemberNo = sessionStorage.getItem('selectedMemberNo');

            if (data.length === 1) {
                const employer = data[0];
                // memberNo 비교
                if (storedMemberNo === employer.memberNo) {
                    setEmployerInfo(employer.employerNo, employer.businessName, employer.memberNo);
                } else {
                    // memberNo가 일치하지 않으면 UI를 업데이트해야 함
                    setEmployerInfo(employer.employerNo, employer.businessName, employer.memberNo);
                }
            } else if (data.length > 1) {
                // 고용주가 여러 개인 경우 변경하기 버튼을 보이게 함
                if (changeButton) changeButton.style.display = "inline-block";
                
                // 저장된 고용주 정보가 있는지 확인
                if (storedEmployerNo && storedMemberNo) {
                    const matchedEmployer = data.find(emp => emp.employerNo === storedEmployerNo && emp.memberNo === storedMemberNo);
                    if (matchedEmployer) {
                        setEmployerInfo(matchedEmployer.employerNo, matchedEmployer.businessName, matchedEmployer.memberNo);
                    } else {
                        // 일치하는 고용주가 없으면 모달을 열어 선택하게 함
                        await createEmployerSelectionUI(data);
                    }
                } else {
                    // 저장된 정보가 없으면 모달을 열어 선택하게 함
                    await createEmployerSelectionUI(data);
                }
            } else {
                // data.length === 0인 경우 (고용주 정보가 없음)
                clearEmployerInfo();
                // data.length === 0일 때는 모달을 열지 않음
            }
        } catch (error) {
            console.error("고용주 데이터 요청 실패:", error);
            // 에러 발생 시 UI 초기화 (모달을 열지 않음)
            clearEmployerInfo();
        }
    }

    // **Membership 데이터 가져오기**
    async function fetchAndCacheMembershipData(employerNo) {
        console.log("fetchAndCacheMembershipData 호출됨. employerNo:", employerNo);
        try {
            const response = await fetch(`/payments/details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employerNo }),
            });

            if (!response.ok) {
                throw new Error("Membership 데이터를 가져오는 데 실패했습니다.");
            }

            const data = await response.json();
            globalMembershipList = data.membershipDetails || [];

            return [...globalMembershipList];
        } catch (error) {
            console.error("Membership 데이터 요청 실패:", error);
            return [];
        }
    }

    // **Membership UI 업데이트 함수**
    async function initializeMembershipData() {
        if (!window.employerNo) {
            resetStatus();
            return;
        }

        const data = await fetchAndCacheMembershipData(window.employerNo);

        if (data.length >= 0) {
            console.log("가져온 맴버십 데이터:", data);
            updateMembershipUI();
        } else {
            console.log("맴버십 데이터를 가져오는 데 실패했습니다.");
        }
    }

    // **UI 초기화 함수**
    const resetStatus = () => {
        const resetButtons = document.querySelectorAll('[name="gradeStatus"]');
        resetButtons.forEach((button) => {
            button.classList.remove("payments-btn-now", "payments-btn-after");
            button.classList.add("payments-btn-after");
            button.innerHTML = "시작하기";
        });
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

    // **"변경하기" 버튼 이벤트**
    if (changeButton) {
        changeButton.style.display = "none"; // 초기 상태에서는 숨김
        changeButton.addEventListener("click", () => {
            console.log("변경하기 버튼 클릭됨");
            // 모달을 열기만 함
            fetchEmployerData(); // 필요 시 데이터를 다시 가져옴
        });
    }

    // **초기화 로직**
    await fetchEmployerData();
})();
