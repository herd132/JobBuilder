document.addEventListener("DOMContentLoaded", () => {
    let globalMembershipList = []; // 글로벌 상태로 데이터 저장

    // 모든 버튼 초기화 함수
    const resetStatus = () => {
        const resetButtons = document.querySelectorAll('[name="gradeStatus"]');
        resetButtons.forEach((button) => {
            button.classList.remove("payments-btn-now", "payments-btn-after");
            button.classList.add("payments-btn-after");
            button.innerHTML = "시작하기";
        });
    };

    // employerNo 가져오기
    const employerNoMeta = document.querySelector('meta[name="employerNo"]');
    const employerNo = employerNoMeta?.content || null;

    // 맴버십 정보 초기화
    const initializeMembershipStatus = () => {
        if (!employerNo) {
            resetStatus();
            return;
        }

        fetch(`/payments/details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employerNo: employerNo }),
        })
            .then((response) => response.json())
            .then((data) => {
                const membershipList = data.membershipDetails;
                if (!membershipList || !Array.isArray(membershipList)) return;

                globalMembershipList = membershipList; // 글로벌 상태에 저장
                updateMembershipUI(membershipList);
            })
            .catch((error) => console.error("Error fetching membership details:", error));
    };



    // 맴버십 UI 업데이트
    const updateMembershipUI = (membershipList) => {
        resetStatus();
        membershipList.forEach((membership) => {
            const { membershipType, remainingDays } = membership;

            if (membershipType == 2) {
                const goldElement = document.querySelector("#gold");
                goldElement.classList.add("payments-btn-after");
                goldElement.innerHTML = `${remainingDays} 남음`;
            } else if (membershipType == 3) {
                const goldElement = document.querySelector("#gold");
                goldElement.classList.add("payments-btn-now");
                goldElement.innerHTML = "이미 적용중인 혜택";

                const goldContainer = document.querySelector("#goldMembershipContainer");
                if (goldContainer) {
                    goldContainer.style.pointerEvents = "none";
                }

                const platinumElement = document.querySelector("#platinum");
                platinumElement.classList.add("payments-btn-after");
                platinumElement.innerHTML = `${remainingDays} 남음`;
            } else if (membershipType == 4) {
                const plus1Element = document.querySelector("#plus1");
                plus1Element.classList.add("payments-btn-after");
                plus1Element.innerHTML = `${remainingDays} 남음`;
            } else if (membershipType == 5) {
                const plus2Element = document.querySelector("#plus2");
                plus2Element.classList.add("payments-btn-after");
                plus2Element.innerHTML = `${remainingDays} 남음`;
            }
        });
    };

    // 초기 맴버십 상태 초기화
    initializeMembershipStatus();

    // 클릭 이벤트 처리 
    document.querySelectorAll('[name="paymentsClick"]').forEach((element) => {
        element.addEventListener("click", () => {
            const membershipType = element.getAttribute("data-membership-type");
            if (membershipType) {
                payment(Number(membershipType));
            } else {
                console.error("Membership type not found for clicked element.");
            }
        });
    });

    // payment 함수
    const payment = (membershipType) => {
        // `employerNo`가 없으면 데이터 초기화 없이 페이지를 렌더링
        if (!employerNo) {
            renderPaymentPage(membershipType, null);
            return;
        }

        // 기존 데이터가 없는 경우 패치 요청
        if (!globalMembershipList.length) {
            fetch(`/payments/details`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ employerNo }),
            })
                .then((response) => response.json())
                .then((data) => {
                    globalMembershipList = data.membershipDetails || [];
                    renderPaymentPage(membershipType, globalMembershipList);
                })
                .catch((error) => console.error("Error fetching membership details:", error));
        } else {
            renderPaymentPage(membershipType, globalMembershipList);
        }
    };

    // 결제 페이지 렌더링 함수
    const generateMembershipDetailsHtml = (membershipList, count) => {
        if (membershipList.length !== 0 || count !== null) {
            return membershipList
                .map(
                    (membership) => `
                    <div class="test3">
                        <div class="test4">
                            <p>맴버십: ${membership.membershipType}</p>
                            <p>${membership.membershipContent || "정보 없음"}</p>
                        </div>
                        <p>남은 기간: ${membership.remainingDays || "정보 없음"}</p>
                    </div>
                    
                   `
                )
                .join("");
        } else {
            return `
                <div class="afteremembership">
                    ✔ 공고 일일 30건 등록<br>
                    ✔ 이력서 열람 100건<br>
                    ✔ 키워드 이력서 검색<br>
                    ✔ 이력서 상세 정보 열람
                </div>
            `;
        }
    };
    
    const renderPaymentPage = (membershipType) => {
     
        const backgroundElement = document.querySelector("#background");
    
        const count = globalMembershipList.find((num) => num === 1);
        const membershipDetailsHtml = generateMembershipDetailsHtml(globalMembershipList, count);

        console.log(globalMembershipList);

        backgroundElement.innerHTML = `
            <h1 class="payments-t-title">결제 서비스
                <hr>
            </h1>
    
            <h3 class="payments-t-subtitle">상품 정보
                <hr>
            </h3>
            <div id="product-addpart" class="product-addpart"></div>
            <div class="btn-area">
            <button id="add-product-btn" class="add-product-btn"> + </button>
            </div>

            <h3 class="payments-t-subtitle">변경 되는 정보
                <hr>
            </h3>
            <div class="details-container">
                <div>
                    <p>기존</p><br>
                    <div class="afteremembership">
                        ${membershipDetailsHtml}
                    </div>
                </div>
    →
                <div>
                    <p>변경</p><br>
                    <div class="beforemembership" id="beforemembership">
                    
                    </div>
                </div>
            </div>
    
            <h3 class="payments-t-subtitle">최종 결제 금액
                <hr>
            </h3>
            <div class="payments-t-inside">
                <div class="payments-t-inside-middle-item">
                    <button id="goldBtn" class="payments-t-btn-after">결제하기</button>
                </div>
                <div class="payments-t-inside-middle-item">
                    <button id="platinumBtn" class="payments-t-btn-after" onclick="location.href='/payments';"
                        style="cursor:pointer;">취소하기</button>
                </div>
            </div>
        `;
    
        // 초기 상품 추가
        const productContainer = document.querySelector("#product-addpart");
        const productGroup = document.createElement("div");
        productGroup.classList.add("product-addpart");
        productGroup.id = `div-${membershipType}`;
        productGroup.innerHTML = `
            <div class="item">
                <form>
                    <select id="productTitle-${count}" class="test4">
                        <option value="none">=== 선택 ===</option>
                        <option value="2" ${membershipType == 2 ? "selected" : ""}>골드</option>
                        <option value="3" ${membershipType == 3 ? "selected" : ""}>플레티넘</option>
                        <option value="4" ${membershipType == 4 ? "selected" : ""}>아이템 : 급구</option>
                        <option value="5" ${membershipType == 5 ? "selected" : ""}>아이템 : Hot</option>
                    </select>
                </form>
                <form>
                    <select name="productDate">
                        <option value="none">=== 선택 ===</option>
                        ${Array.from(
                          { length: 12 },
                          (_, i) =>
                            `<option value="${i + 1}" ${
                              i + 1 === 1 ? "selected" : ""
                            }>${i + 1}개월</option>`
                        ).join("")}
                    </select>
                </form>
                <button data-id="${membershipType}" class="delete-btn">-</button>
            </div>`;
        productContainer.appendChild(productGroup);
    
        handleDynamicButtons();
    };
    
    

    // 동적 버튼 연결 처리 함수
    const handleDynamicButtons = () => {
    const productContainer = document.querySelector("#product-addpart");

    // 재료 추가 버튼 동작
    document.querySelector("#add-product-btn").addEventListener("click", () => {
        const count = document.querySelectorAll(".product-addpart .item").length + 1;

        const productGroup = document.createElement("div");
        productGroup.classList.add("product-addpart");
        productGroup.id = `div-${count}`;
        productGroup.innerHTML = `
            <div class="item">
                <form>
                    <select id="productTitle-${count}" class="test4">
                        <option value="none" selected>=== 선택 ===</option>
                        <option value="2">골드</option>
                        <option value="3">플레티넘</option>
                        <option value="4">아이템 : 급구</option>
                        <option value="5">아이템 : Hot</option>
                    </select>
                </form>
                <form>
                    <select id="productDate-${count}">
                        <option value="none">=== 선택 ===</option>
                        ${Array.from(
                          { length: 12 },
                          (_, i) =>
                            `<option value="${i + 1}" ${
                              i + 1 === 1 ? "selected" : ""
                            }>${i + 1}개월</option>`
                        ).join("")}
                    </select>
                </form>
                <button data-id="${count}" class="delete-btn">-</button>
            </div>`;
        productContainer.appendChild(productGroup);
    });

    // 삭제 버튼 이벤트 처리
    productContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const id = event.target.getAttribute("data-id");
            const targetDiv = document.getElementById(`div-${id}`);
            if (targetDiv) {
                targetDiv.remove();
            }
        }
    });




    // 중복 선택 방지 이벤트 처리
    productContainer.addEventListener("change", (event) => {
        if (event.target.classList.contains("test4")) {
            const selectedValue = event.target.value;

            // 현재 select를 제외한 다른 select 값 확인
            const otherSelects = document.querySelectorAll("select.test4");
            let isDuplicate = false;

            otherSelects.forEach((select) => {
                if (select !== event.target && select.value === selectedValue && selectedValue !== "none") {
                    isDuplicate = true;
                }
            });

            if (isDuplicate) {
                alert("중복 선택은 허용되지 않습니다.");
                // 이전 값으로 되돌리기
                event.target.value = "none";
            }


        
                    // beforemembership 요소 선택
                    const beforeMembershipContainer = document.querySelector(".beforemembership");
        
                    // 값이 변경될 때 기존 추가된 항목 제거
                    beforeMembershipContainer.innerHTML = "";
        
                    // 선택된 값에 따라 div 추가
                    let newDiv = document.createElement("div");
                    newDiv.classList.add("beforemembership");
        
                    switch (selectedValue) {
                        case "2":
                            newDiv.innerHTML = `<div class="test3">
                                                    <div class="test4">
                                                        <p>맴버십: 2</p>
                                                        <p>✔ 공고 일일 100건 등록<br>
                                                           ✔ 이력서 열람 300건<br>
                                                           ✔ 키워드 이력서 검색<br>
                                                           ✔ 이력서 상세 정보 열람</p>
                                                    </div>
                                                    <p>남은 기간: </p>
                                                </div>`;
                            break;
                        case "3":
                            newDiv.innerHTML = `<div class="test3">
                                                    <div class="test4">
                                                        <p>맴버십: 3</p>
                                                        <p>✔ 공고 일일 300건 등록<br>
                                                           ✔ 이력서 열람 무제한<br>
                                                           ✔ 키워드 이력서 검색<br>
                                                           ✔ 이력서 상세 정보 열람<br>
                                                           ✔ 공고 즉시 등록<br>
                                                           ✔ 이력서 추천 기능</p>
                                                    </div>
                                                    <p>남은 기간: </p>
                                                </div>`;
                            break;
                        case "4":
                            newDiv.innerHTML = `<p>아이템 : 급구</p>
                                                    급구 알바 페이지 상단 노출<br>
                                                    공고 즉시 게시<br>
                                                    7일 이상 구매 시 20% 할인</p>`;
                            break;
                        case "5":
                            newDiv.innerHTML = `<p>아이템 : Hot</p>
                                                <ul>
                                                    <li>혜택 1: Hot 태그 추가</li>
                                                    <li>혜택 2: 추천 리스트 포함</li>
                                                </ul>`;
                            break;
                        default:
                            newDiv.innerHTML = `<p>선택된 멤버십이 없습니다.</p>`;
                            break;
                    }
        
                    // beforemembership에 새 div 추가
                    beforeMembershipContainer.appendChild(newDiv);


        }
    });
};
















    
});

