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
    const renderPaymentPage = (membershipType) => {
        const backgroundElement = document.querySelector("#background");
    
        let membershipDetailsHtml = "";

        // 모든 맴버십 정보를 순회하여 HTML로 생성
        if(membershipType > 2) {
           membershipDetailsHtml = globalMembershipList
            .map(
                (membership) => `
                <p>맴버십: ${membership.membershipType}</p>
                <p>남은 기간: ${membership.remainingDays || "정보 없음"}</p>
                <p>${membership.membershipContent || "정보 없음"}</p><br>
            `
            )
            .join("");
        } else {
            membershipDetailsHtml = `
                <p>멤버십 정보가 없습니다.</p>
            `;
        }
        
        backgroundElement.innerHTML = `
            <h1 class="payments-t-title">결제 서비스
                <hr>
            </h1>
    
            <h3 class="payments-t-subtitle">상품 정보
                <hr>
            </h3>
            <div id="product-addpart" class="product-addpart"></div>
            <button id="add-ingredient-btn"> + </button>
    
            <h3 class="payments-t-subtitle">변경 되는 정보
                <hr>
            </h3>
                <div class="details-container">
                    <div>
                        <p>기존</p><br>
                        <div class="beforemembership">
                            ${membershipDetailsHtml}
                        </div>
                    </div>
        
                →

                    <div>
                        <p>결제 후</p><br>
                        <div class="beforemembership">
                            ${membershipDetailsHtml}
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
    
        // 초기 재료 추가
        const productContainer = document.querySelector("#product-addpart");
        const productGroup = document.createElement("div");
        productGroup.classList.add("product-addpart");
        productGroup.id = `div-${membershipType}`;
        productGroup.innerHTML = `
            <div class="item">
                <form>
                    <select name="productTitle">
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
        document.querySelector("#add-ingredient-btn").addEventListener("click", () => {
            const count = document.querySelectorAll(".product-addpart .item").length + 1;

            const productGroup = document.createElement("div");
            productGroup.classList.add("product-addpart");
            productGroup.id = `div-${count}`;
            productGroup.innerHTML = `
                <div class="item">
                    <form>
                        <select id="productTitle">
                            <option value="none" selected>=== 선택 ===</option>
                            <option value="2">골드</option>
                            <option value="3">플레티넘</option>
                            <option value="4">아이템 : 급구</option>
                            <option value="5">아이템 : Hot</option>
                        </select>
                    </form>
                    <form>
                        <select id="productDate">
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
    };
});
