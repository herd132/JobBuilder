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

    // 모달 열기 함수
    const openModal = () => {
        if (isModalOpen) return; // 이미 열려 있으면 중단
        console.log("모달 열기");
        modal.style.display = "block";
        isModalOpen = true;
    };

    // 모달 닫기 함수
    const closeModalFunc = () => {
        if (!isModalOpen) return; // 이미 닫혀 있으면 중단
        console.log("모달 닫기");
        modal.style.display = "none";
        isModalOpen = false;
    };

    // 닫기 버튼 클릭 시 모달 닫기
    closeButton.addEventListener("click", closeModalFunc);

    // 모달 외부 클릭 시 모달 닫기
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModalFunc();
        }
    });

    // membership.js 로딩 함수
    function loadMembershipScript(forceReload = false) {
        return new Promise((resolve, reject) => {
            if (window.membershipScriptLoaded && !forceReload) {
                console.log("membership.js는 이미 로드되었습니다.");
                resolve();
                return;
            }

            // 기존 스크립트 제거 (강제 재로드 시)
            if (forceReload) {
                const existingScript = document.querySelector('script[src="/js/payments/membership.js"]');
                if (existingScript) {
                    existingScript.remove();
                    console.log("기존 membership.js 스크립트 제거 완료");
                }
            }

            const script = document.createElement('script');
            script.src = '/js/payments/membership.js';
            script.async = false;
            script.onload = () => {
                console.log("membership.js 로드 완료");
                window.membershipScriptLoaded = true;
                resolve();
            };
            script.onerror = () => {
                console.error("membership.js 로드 실패");
                reject(new Error("membership.js 로드 실패"));
            };
            document.body.appendChild(script);
        });
    }

    // 고용주 정보 설정 함수
    function setEmployerInfo(employerNo, businessName, memberNo) {
        window.employerNo = employerNo;
        if (employerNoInput) employerNoInput.value = window.employerNo;
        if (businessNameElement) businessNameElement.textContent = businessName;
        sessionStorage.setItem('selectedEmployerNo', employerNo);
        sessionStorage.setItem('selectedBusinessName', businessName);
        sessionStorage.setItem('selectedMemberNo', memberNo);
        console.log("sessionStorage에 고용주 정보 저장됨:", { employerNo, businessName, memberNo });
    }

    // 고용주 정보 초기화 함수
    function clearEmployerInfo() {
        window.employerNo = null;
        if (employerNoInput) employerNoInput.value = '';
        if (businessNameElement) businessNameElement.textContent = '사업주 정보가 없습니다';
        sessionStorage.removeItem('selectedEmployerNo');
        sessionStorage.removeItem('selectedBusinessName');
        sessionStorage.removeItem('selectedMemberNo');
        if (changeButton) changeButton.style.display = "none";
        console.log("sessionStorage 초기화됨");
    }

    // 패치 요청 함수: 서버에서 고용주 데이터를 가져옴
    async function fetchEmployerData(openModalAfterFetch = false) {
        console.log("fetchEmployerData 호출됨. openModalAfterFetch:", openModalAfterFetch);
        try {
            const response = await fetch('/payments/data');
            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            console.log("서버에서 받은 데이터", data);

            const storedMemberNo = sessionStorage.getItem('selectedMemberNo');

            if (data.length === 0) {
                console.log("사업주 없음");
                clearEmployerInfo();
                await loadMembershipScript(true); // 강제로 재로드
                if (window.updateMembershipData) {
                    window.updateMembershipData(null, null);
                }
                return;
            }

            const matchedEmployer = data.find(emp => String(emp.memberNo) === String(storedMemberNo));
            if (matchedEmployer) {
                setEmployerInfo(matchedEmployer.employerNo, matchedEmployer.businessName, matchedEmployer.memberNo);
                if (changeButton) changeButton.style.display = "inline-block"; // 버튼 표시

                // membership.js 로드 및 데이터 전달
                await loadMembershipScript();
                if (window.updateMembershipData) {
                    console.log("membership.js에 데이터 전달:", {
                        employerNo: matchedEmployer.employerNo,
                        businessName: matchedEmployer.businessName,
                    });
                    window.updateMembershipData(matchedEmployer.employerNo, matchedEmployer.businessName);
                }
            } else {
                console.log("memberNo가 일치하지 않음. 모달 열기");
                clearEmployerInfo();
                if (openModalAfterFetch) {
                    await createEmployerSelectionUI(data);
                    openModal();
                }
            }
        } catch (error) {
            console.error('Error fetching employer data:', error.message);
            clearEmployerInfo();
        }
    }

    // 다중 고용주 선택 UI 생성 함수
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
                if (changeButton) changeButton.style.display = "inline-block";
                closeModalFunc();
                await loadMembershipScript(true); // 강제 재로드
                if (window.updateMembershipData) {
                    window.updateMembershipData(employer.employerNo, employer.businessName);
                }
            });
            employerList.appendChild(button);
        });

        openModal();
    }

    // "변경하기" 버튼 클릭 이벤트 핸들러
    if (changeButton) {
        changeButton.addEventListener("click", async () => {
            console.log("변경하기 버튼 클릭됨");
            const response = await fetch('/payments/data');
            const data = await response.json();
            await createEmployerSelectionUI(data);
            openModal(); // 무조건 모달 호출
        });
    }

    // 초기화 로직
    const storedMemberNo = sessionStorage.getItem('selectedMemberNo');

    if (storedMemberNo) {
        console.log("sessionStorage에서 memberNo 정보를 가져옴:", { storedMemberNo });
        await fetchEmployerData(); // 섹션 정보와 서버 데이터 비교
    } else {
        console.log("sessionStorage에 memberNo 정보가 없으므로 데이터를 패치합니다.");
        await fetchEmployerData(true);
    }

    console.log("최종 employerNo:", window.employerNo);
})();
