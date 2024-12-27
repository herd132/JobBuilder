let globalMembershipList = []; // 글로벌 상태로 데이터 저장

var testg = 0;

document.addEventListener("DOMContentLoaded", () => {
  
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
      .catch((error) =>
        console.error("Error fetching membership details:", error)
      );
  };

  // 맴버십 UI 업데이트
  const updateMembershipUI = (membershipList) => {
    resetStatus();
    membershipList.forEach((membership) => {
      const { membershipType, remainingDays } = membership;

      if (membershipType == 2) {
        const goldElement = document.querySelector("#gold");
        goldElement.classList.add("payments-btn-after");
        goldElement.innerHTML = `${remainingDays}일 남음`;
      } else if (membershipType == 3) {
        const goldElement = document.querySelector("#gold");
        goldElement.classList.add("payments-btn-now");
        goldElement.innerHTML = "이미 적용중인 혜택";

        const goldContainer = document.querySelector(
          "#goldMembershipContainer"
        );
        if (goldContainer) {
          goldContainer.style.pointerEvents = "none";
        }

        const platinumElement = document.querySelector("#platinum");
        platinumElement.classList.add("payments-btn-after");
        platinumElement.innerHTML = `${remainingDays}일 남음`;
      } else if (membershipType == 4) {
        const plus1Element = document.querySelector("#plus1");
        plus1Element.classList.add("payments-btn-after");
        plus1Element.innerHTML = `${remainingDays}일 남음`;
      } else if (membershipType == 5) {
        const plus2Element = document.querySelector("#plus2");
        plus2Element.classList.add("payments-btn-after");
        plus2Element.innerHTML = `${remainingDays}일 남음`;
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
      renderPaymentPage(membershipType, globalMembershipList);
  };

  // 페이지 렌더 함수
  const renderPaymentPage = (membershipType) => {
    const backgroundElement = document.querySelector("#background");

    const count = globalMembershipList.find((num) => num === 1);
    const membershipDetailsHtml = generateMembershipDetailsHtml(
      globalMembershipList,
      count
    );

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
                            ${
                                globalMembershipList.length > 0 && 
                                globalMembershipList.some(membership => membership.membershipType !== 1)
                                    ? membershipDetailsHtml
                                    : "✔ 공고 일일 30건 등록<br>✔ 이력서 열람 100건<br>✔ 키워드 이력서 검색<br>✔ 이력서 상세 정보 열람"
                                }
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

            <div id="product-addpart2" class="product-addpart2">
                  <div class="payments-expense-bgr">
                    <div class="payments-expense-center">
                      <div class="payments-expense-title">
                        <h3>상품명</h3>
                        <p>${testg}</p>
                      </div>

                      <div class="payments-expense-date">
                        <h3>기간</h3>
                        <p>1개월</p>
                      </div>

                      <div class="payments-expense-price">
                        <h3>금액</h3>
                        <p class="fst-price">30,000원</p>
                      </div>
                    </div>

                    <div class="payments-expense-result">
                      <h1>합계 : test</h1>
                    </div>
                  </div>
            </div>


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
                        <option value="2" ${
                          membershipType == 2 ? "selected" : ""
                        }>골드 이용권</option>
                        <option value="3" ${
                          membershipType == 3 ? "selected" : ""
                        }>플레티넘 이용권</option>
                        <option value="4" ${
                          membershipType == 4 ? "selected" : ""
                        }>급구 이용권</option>
                        <option value="5" ${
                          membershipType == 5 ? "selected" : ""
                        }>Hot 이용권</option>
                    </select>
                </form>
                <form>
                    <select name="productDate-${count}" class="test5">
                        <option value="none">=== 선택 ===</option>
                        ${Array.from(
                          { length: 12 },
                          (_, i) =>
                            `<option value="${i + 1}" ${
                              i + 1 === 1 ? "selected" : ""
                            }>${i + 1}개월</option>`
                        ).join("")}
                        <option value="24">24개월</option>
                        <option value="36">36개월</option>
                    </select>
                </form>
                <div style="magin-left: 10rem;">1</div>
            </div>`;
    productContainer.appendChild(productGroup);


    handleDynamicButtons();
  };
  
// 동적 버튼 연결 처리 함수
const handleDynamicButtons = () => {
   const productContainer = document.querySelector("#product-addpart");

    // beforeMembershipContainer 업데이트 함수
    const updateBeforeMembershipContainer = () => {
      const beforeMembershipContainer = document.querySelector(".beforemembership");
      beforeMembershipContainer.innerHTML = ""; // 초기화

      // 현재 product-addpart에 있는 항목을 기반으로 beforeMembershipContainer 구성
      const productItems = document.querySelectorAll(".product-addpart .item");
      productItems.forEach((item) => {
        const selectedValue = item.querySelector("select.test4").value;
        const selectedValue2 = item.querySelector("select.test5").value;
        
        
        if (selectedValue === "none") return; // 선택되지 않은 항목은 무시

        let newDiv = document.createElement("div");
        newDiv.setAttribute("data-value", selectedValue);

        let newDiv2 = document.querySelector("#product-addpart2");
        const testm = globalMembershipList.find(
          (membership) => membership.membershipType === Number(selectedValue)
        );

        testg=2;
        let result = selectedValue > 3 
              ? Number(selectedValue2) + testm.remainingDays + "일"
              : Number(selectedValue2) * 30 + testm.remainingDays + "일";
        
        if (isNaN(selectedValue2)) {result = '대기';}
            
              switch (selectedValue) {
                  case "2":
                    testg=2;
                    newDiv.innerHTML = `
                        <div class="test3">
                            <div class="test4">
                                <p>골드 맴버십 이용권</p>
                                <p>✔ 공고 일일 100건 등록<br>
                                    ✔ 이력서 열람 300건<br>
                                    ✔ 키워드 이력서 검색<br>
                                    ✔ 이력서 상세 정보 열람</p>
                            </div>
                            <p>남은 기간: ${result}</p>
                        </div>`;
                    
                        newDiv2.innerHTML = `
                        <div id="product-addpart2" class="product-addpart2">
       <div class="payments-expense-bgr">
         <div class="payments-expense-center">
           <div class="payments-expense-title">
             <h3>상품명</h3>
             <p>${testg}</p>
           </div>

           <div class="payments-expense-date">
             <h3>기간</h3>
             <p>1개월</p>
           </div>

           <div class="payments-expense-price">
             <h3>금액</h3>
             <p class="fst-price">30,000원</p>
           </div>
         </div>

         <div class="payments-expense-result">
           <h1>합계 : test</h1>
         </div>
       </div>
 </div>`;


                    break;
                  case "3":
                    testg=3;
                    newDiv.innerHTML = `
                        <div class="test3">
                            <div class="test4">
                                <p>플레티넘 맴버십 이용권</p>
                                <p>✔ 공고 일일 300건 등록<br>
                                    ✔ 이력서 열람 무제한<br>
                                    ✔ 키워드 이력서 검색<br>
                                    ✔ 이력서 상세 정보 열람<br>
                                    ✔ 공고 즉시 등록<br>
                                    ✔ 이력서 추천 기능</p>
                            </div>
                            
                            <p>남은 기간: ${result}</p>
                            </div>`;

                            newDiv2.innerHTML = `
                                   <div id="product-addpart2" class="product-addpart2">
                  <div class="payments-expense-bgr">
                    <div class="payments-expense-center">
                      <div class="payments-expense-title">
                        <h3>상품명</h3>
                        <p>${testg}</p>
                      </div>

                      <div class="payments-expense-date">
                        <h3>기간</h3>
                        <p>1개월</p>
                      </div>

                      <div class="payments-expense-price">
                        <h3>금액</h3>
                        <p class="fst-price">30,000원</p>
                      </div>
                    </div>

                    <div class="payments-expense-result">
                      <h1>합계 : test</h1>
                    </div>
                  </div>
            </div>`;


                    break;
                    
                  case "4":
                    testg=4;
                    newDiv.innerHTML = `
                                    <div class="test3">
                            <div class="test4"><p>급구 플러스 이용권</p>
                        급구 알바 페이지 상단 노출<br>
                        공고 즉시 게시<br>
                        7일 이상 구매 시 20% 할인</p>
                            </div>
                            <p>남은 기간: ${result}</p>
                            </div>`;

                            newDiv2.innerHTML = `
                            <div id="product-addpart2" class="product-addpart2">
           <div class="payments-expense-bgr">
             <div class="payments-expense-center">
               <div class="payments-expense-title">
                 <h3>상품명</h3>
                 <p>${testg}</p>
               </div>

               <div class="payments-expense-date">
                 <h3>기간</h3>
                 <p>1개월</p>
               </div>

               <div class="payments-expense-price">
                 <h3>금액</h3>
                 <p class="fst-price">30,000원</p>
               </div>
             </div>

             <div class="payments-expense-result">
               <h1>합계 : test</h1>
             </div>
           </div>
     </div>`;



                    break;
                  case "5":
                    newDiv.innerHTML = `
                                    <div class="test3">
                            <div class="test4"><p>Hot 플러스 이용권</p>
                        급구 HOT 표시를 붙여 노출<br>
                        공고 즉시 게시<br>
                        7일 이상 구매 시 20% 할인</p>
                            </div>
                            <p>남은 기간: ${result}</p>
                            </div>`;
                    break;
                  default:
                    newDiv.innerHTML = `<p>선택된 멤버십이 없습니다.</p>`;
                    break;
      
              }

              
        beforeMembershipContainer.appendChild(newDiv);
      });
    };
  
    document.querySelector("#add-product-btn").addEventListener("click", () => {
        const count = document.querySelectorAll(".product-addpart .item").length;
      
        if (count >= 3) {
          alert("더 이상 추가할 수 없습니다. 최대 3개의 상품만 선택 가능합니다.");
          return;
        }
      
        const productGroup = document.createElement("div");
        productGroup.classList.add("product-addpart");
        productGroup.id = `div-${count}`;
        productGroup.innerHTML = `
          <div class="item">
              <form>
                  <select id="productTitle-${count}" class="test4">
                      <option value="none" selected>=== 선택 ===</option>
                      <option value="2">골드 이용권</option>
                      <option value="3">플래티넘 이용권</option>
                      <option value="4">급구 이용권</option>
                      <option value="5">Hot 이용권</option>
                  </select>
              </form>
              <form>
                  <select id="productDate-${count}" class="test5">
                      <option value="none">=== 선택 ===</option>
                      ${Array.from(
                        { length: 12 },
                        (_, i) => `<option value="${i + 1}">${i + 1}개월</option>`
                      ).join("")}
                      <option value="24">24개월</option>
                      <option value="36">36개월</option>
                      <option value="custom">직접입력</option>
                  </select>
              </form>
              <button data-id="${count}" class="delete-btn">-</button>
          </div>`;
        productContainer.appendChild(productGroup);
      

        // 상품 선택 확인
        const productDateElement = document.querySelector(`#productDate-${count}`);
        productDateElement.addEventListener("change", (event) => {
            const productTitleElement = document.querySelector(`#productTitle-${count}`);
            if (!productTitleElement || productTitleElement.value === "none") {
                alert("상품을 먼저 선택하세요.");
                event.target.value = "none"; // 선택 초기화
                return;
            }
        });

        // 조건문 추가: productTitle 값이 변경될 때 처리
        document.querySelector(`#productTitle-${count}`).addEventListener("change", (event) => {
          const selectedValue = event.target.value;
          const productDateElement = document.querySelector(`#productDate-${count}`);
          const customInputId = `custom-date-${count}`;
      

          if (selectedValue >= 4) {
            // 급구 이용권 또는 Hot 이용권 선택 시 일수 옵션으로 변경
            productDateElement.innerHTML = `
              <option value="none">=== 선택 ===</option>
              ${Array.from(
                { length: 10 },
                (_, i) => `<option value="${i + 1}">${i + 1}일</option>`
              ).join("")}
              <option value="20">20일</option>
              <option value="30">30일</option>
              <option value="custom">직접입력</option>
            `;
          } else {
            // 기본 개월수 옵션으로 복구
            productDateElement.innerHTML = `
              <option value="none">=== 선택 ===</option>
              ${Array.from(
                { length: 12 },
                (_, i) => `<option value="${i + 1}">${i + 1}개월</option>`
              ).join("")}
              <option value="24">24개월</option>
              <option value="36">36개월</option>
              <option value="custom">직접입력</option>
            `;
          }
      
          // 기존에 남아있는 인풋박스 제거
          const existingCustomInput = document.querySelector(`#${customInputId}`);
          if (existingCustomInput) {
            existingCustomInput.remove();
          }
      
          // 직접입력 선택 시 동작
          productDateElement.addEventListener("change", (e) => {
            // 먼저 상품 선택 여부 확인
            const productTitleElement = document.querySelector(`#productTitle-${count}`);
            if (productTitleElement.value === "none") {
                alert("상품을 먼저 선택하세요.");
                productDateElement.value = "none"; // 선택 초기화
                return;
            }
    
            const customInput = document.querySelector(`#${customInputId}`);
            if (e.target.value === "custom") {
                if (!customInput) {
                    // 인풋박스 생성
                    const newCustomInput = document.createElement("input");
                    newCustomInput.type = "number";
                    newCustomInput.placeholder =
                        selectedValue >= 4 ? "직접 입력 (일)" : "직접 입력 (개월)";
                    newCustomInput.id = customInputId;
                    newCustomInput.setAttribute("data-id", count); // data-id 추가
                    newCustomInput.addEventListener("input", () => {
                        productDateElement.setAttribute("data-custom-value", newCustomInput.value);
                    });
    
                    e.target.parentNode.appendChild(newCustomInput);
                }
            } else {
                // 다른 옵션 선택 시 기존 `custom-date` 제거
                if (customInput) {
                    customInput.remove();
                }
            }
        });



           
        });
      
        // 삭제 버튼 동작
        productContainer.addEventListener("click", (event) => {
          if (event.target.classList.contains("delete-btn")) {
              const id = event.target.getAttribute("data-id");
              const targetDiv = document.getElementById(`div-${id}`);

              if (targetDiv) {
                  // 해당 `data-id`로 연결된 모든 요소 삭제
                  const relatedInputs = document.querySelectorAll(`[data-id="${id}"]`);
                  relatedInputs.forEach((input) => input.remove());

                  targetDiv.remove();

                  // 상태 업데이트
                  updateBeforeMembershipContainer();
              }
          }
        });
    });
      
    // 중복 선택 방지 및 변경 이벤트
    productContainer.addEventListener("change", (event) => {
        if (event.target.classList.contains("test4")) {
          const selectedValue = event.target.value;
  
          // 중복 선택 방지
          const otherSelects = document.querySelectorAll("select.test4");
          let isDuplicate = false;
  
          otherSelects.forEach((select) => {
            if (
              select !== event.target &&
              select.value === selectedValue &&
              selectedValue !== "none"
            ) {
              isDuplicate = true;
            }
          });
  
          if (isDuplicate) {
            alert("중복 선택은 허용되지 않습니다.");
            event.target.value = "none";
            return;
          }
  
          // 현재 등급보다 낮은 등급 선택 방지
          const userMembership = globalMembershipList.find(
            (membership) => membership.membershipType === 3
          ); // 3은 예시
          if (
            userMembership &&
            parseInt(selectedValue, 10) < userMembership.membershipType
          ) {
            alert(
              `현재 등급 보다 낮은 등급은 선택할 수 없습니다.`
            );
            event.target.value = "none";
            return;
          }
  
          // 골드(2)와 플래티넘(3) 동시 선택 방지
          const selectedMemberships = Array.from(otherSelects).map(
            (select) => select.value
          );
          if (
            (selectedMemberships.includes("2") && selectedValue === "3") ||
            (selectedMemberships.includes("3") && selectedValue === "2")
          ) {
            alert("맴버십 상품은 1개만 선택해야 합니다.");
            event.target.value = "none";
            return;
          }
        }








        // 해당 위치 2개 꼭 고정
        updateBeforeMembershipContainer();
    });
  
    // 추가: 페이지 초기화 시 `updateBeforeMembershipContainer` 호출
    updateBeforeMembershipContainer();
  };
});

















// 결제 페이지 렌더링 함수
const generateMembershipDetailsHtml = (membershipList, count) => {
  if (membershipList.length !== 0 || count !== null) {
    return membershipList
      .map(
        (membership) => `
                  <div class="test3">
                      <div class="test4">
                          <p>${membership.membershipName}</p>
                          <p>${
                            membership.membershipContent || "정보 없음"
                          }</p>
                      </div>
                      <p>남은 기간: ${
                        membership.remainingDays + "일" || "정보 없음"
                      }</p>
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