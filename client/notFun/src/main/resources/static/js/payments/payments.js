let userMemberships = [];

// 특정 Membership 데이터 가져오기 (membership.js와 연동)
const getMembershipDetailsByType = (type) => {
  return globalMembershipList.find(
    (membership) => membership.membershipType === type
  );
};

let testResult = [];

// defaultType을 반환하는 함수
const getDefaultTypeValue = (defaultType, selectedValue) => {
  return defaultType ?? selectedValue ?? "none";
};

const membershipOptions = [
  {
    value: "2",
    label: "골드 이용권",
    content:
      "✔ 공고 일일 100건 등록<br>✔ 이력서 열람 300건<br>✔ 키워드 이력서 검색<br>✔ 이력서 상세 정보 열람",
    price: 30000,
  },
  {
    value: "3",
    label: "플래티넘 이용권",
    content:
      "✔ 공고 일일 300건 등록<br>✔ 이력서 열람 무제한<br>✔ 키워드 이력서 검색<br>✔ 이력서 상세 정보 열람<br>✔ 공고 즉시 등록<br>✔ 이력서 추천 기능",
    price: 50000,
  },
  {
    value: "4",
    label: "급구 이용권",
    content: "급구 알바 페이지 상단 노출<br>공고 즉시 게시",
    price: 3000,
  },
  {
    value: "5",
    label: "Hot 이용권",
    content: "공고에 HOT 표시를 붙여 노출<br>공고 즉시 게시",
    price: 3000,
  },
];

var sumResult = 0;

// 옵션 태그 생성 함수
const generateOptionTags = (defaultType) => {
  return membershipOptions
    .map(
      (option) => `
      <option value="${option.value}" ${
        getDefaultTypeValue(defaultType, null) === Number(option.value)
          ? "selected"
          : ""
      }>
        ${option.label}
      </option>`
    )
    .join("");
};

// 페이지 렌더링 초기화
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('[name="paymentsClick"]').forEach((element) => {
    element.addEventListener("click", () => {
      const defaultType = Number(element.getAttribute("data-default-type")); // 기본 타입 가져오기
      payment(defaultType); // 초기값 렌더링
    });
  });
});

// Payment 처리 함수
const payment = (defaultType) => {
  renderPaymentPage(defaultType); // 기본 타입을 기준으로 렌더링
};

// 페이지 렌더 함수
const renderPaymentPage = (defaultType) => {
  const backgroundElement = document.querySelector("#background");

  // 로그인된 사용자 Membership 정보 가져오기
  const userMemberships = globalMembershipList;

  // 로그인된 사용자 정보 HTML
  const membershipDetailsHtml = userMemberships.length
    ? userMemberships
        .map(
          (membership) => `
        <div class="membership-item">
          <h3>${membership.membershipName}</h3>
          <p>${membership.membershipContent}</p>
          <p>남은 기간: ${membership.remainingDays}일</p>
        </div>
      `
        )
        .join("")
    : `<p>로그인된 회원의 맴버십 정보를 찾을 수 없습니다.</p>`;

  // 최초 렌더링
  backgroundElement.innerHTML = `
      <h1 class="payments-t-title">결제 서비스<hr></h1>
      <h3 class="payments-t-subtitle">상품 선택<hr></h3>
      <div id="product-addpart" class="product-addpart"></div>
      <div class="btn-area">
          <button id="add-product-btn" class="add-product-btn"> + </button>
      </div>
      <h3 class="payments-t-subtitle">상세 정보<hr></h3>
      <div class="details-container">
          <div>
              <p>기존</p><br>
              <div class="afteremembership" id="after-membership">
                  ${membershipDetailsHtml} <!-- 로그인된 사용자 정보 -->
              </div>
          </div>
          →
          <div>
              <p>변경</p><br>
              <div class="beforemembership" id="beforemembership">
                  <!-- 동적으로 추가될 영역 -->
              </div>
          </div>
      </div>
      <h3 class="payments-t-subtitle">최종 결제 금액
                <hr>
            </h3>

            <div id="product-addpart2" class="product-addpart2">
                  <div class="payments-expense-bgr">
                  </div>
            </div>


            <div class="payments-t-inside">
                <div class="payments-t-inside-middle-item">
                    <button id="payBtn" class="payments-t-btn-after" style="cursor:pointer;" >결제하기</button>
                </div>
                <div class="payments-t-inside-middle-item">
                    <button id="cancelBtn" class="payments-t-btn-after" onclick="location.href='/payments';"
                        style="cursor:pointer;">취소하기</button>
                </div>
            </div>
  `;

  initializeDefaultProduct(defaultType);
  console.log("초기 렌더링 완료:", { defaultType });
  updateMembershipContainer();
};

// 초기 상품 추가 및 동적 옵션 연결
const initializeDefaultProduct = (defaultType) => {
  const productContainer = document.querySelector("#product-addpart");

  const productGroup = createProductGroup(defaultType, 0, true); // 기본 타입과 첫 번째 상품 ID
  productContainer.appendChild(productGroup);

  setupProductSelectionHandlers(0, productContainer); // 초기 상품에 핸들러 추가
  setupDynamicProductButtons();
  updateMembershipContainer();
};
// 상품 그룹 생성 함수
const createProductGroup = (defaultType, id, isDefault = false) => {
  const productGroup = document.createElement("div");
  productGroup.classList.add("product-addpart");
  productGroup.id = `div-${id}`;

  productGroup.innerHTML = `
    <div class="item" data-default="${isDefault}">
      <form>
          <select id="productTitle-${id}" class="showItem">
              <option value="none" ${
                getDefaultTypeValue(defaultType, null) === "none"
                  ? "selected"
                  : ""
              }>=== 선택 ===</option>
              ${generateOptionTags(defaultType)}
          </select>
      </form>
      <form>
          <select id="productDate-${id}" class="showDate">
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
      <button 
          data-id="${id}" 
          class="delete-btn" 
          style="opacity: ${isDefault ? "0" : "1"}; pointer-events: ${
    isDefault ? "none" : "auto"
  };">
          -
      </button>
    </div>
  `;

  const productTitleElement = productGroup.querySelector(`#productTitle-${id}`);
  const productDateElement = productGroup.querySelector(`#productDate-${id}`);

  const addCustomInput = (productDateElement, productTitleElement, id) => {
    const customInputId = `custom-date-${id}`;
    const existingCustomInput = document.querySelector(`#${customInputId}`);

    if (productDateElement.value === "custom" && !existingCustomInput) {
      const customInput = document.createElement("input");
      customInput.type = "number";
      customInput.placeholder =
        productTitleElement.value >= 4 ? "직접 입력 (일)" : "직접 입력 (개월)";
      customInput.id = customInputId;
      customInput.setAttribute("data-id", id);

      customInput.addEventListener("input", () => {
        productDateElement.setAttribute("data-custom-value", customInput.value);
      });

      // 입력값 변화 시 업데이트 및 즉시 반영
      customInput.addEventListener("input", (e) => {
        const value = e.target.value ? Number(e.target.value) : 0; // 숫자로 변환
        productDateElement.setAttribute("data-custom-value", value);
        updateMembershipContainer(); // 실시간 상태 업데이트
      });

      // Enter 키 입력 시 즉시 업데이트
      customInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // 기본 동작 방지
          updateMembershipContainer(); // 상태 즉시 반영
        }
      });

      productDateElement.parentNode.appendChild(customInput);
    } else if (productDateElement.value !== "custom" && existingCustomInput) {
      existingCustomInput.remove();
    }
  };

  productDateElement.addEventListener("change", () => {
    addCustomInput(productDateElement, productTitleElement, id); // 직접입력 추가 처리
    updateMembershipContainer(); // 상태 업데이트
  });

  productTitleElement.addEventListener("change", () => {
    updateMembershipContainer(); // 상품 변경 시 상태 업데이트
  });

  return productGroup;
};

// 동적 버튼 및 조건 처리 함수
const setupDynamicProductButtons = () => {
  const productContainer = document.querySelector("#product-addpart");

  document.querySelector("#add-product-btn").addEventListener("click", () => {
    const count = productContainer.querySelectorAll(".item").length;

    if (count >= 3) {
      alert("더 이상 추가할 수 없습니다. 최대 3개의 상품만 선택 가능합니다.");
      return;
    }

    const productGroup = createProductGroup(null, count); // 추가 상품은 기본 타입 없음
    productContainer.appendChild(productGroup);

    // 수정된 핸들러 함수 호출 시 `productContainer` 전달
    setupProductSelectionHandlers(count, productContainer);
    updateMembershipContainer(); // 상태 업데이트
  });

  productContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const id = event.target.getAttribute("data-id");
      const targetDiv = document.getElementById(`div-${id}`);

      if (targetDiv) {
        targetDiv.remove();
        updateMembershipContainer(); // 상태 업데이트
      }
    }
  });
};

// 상품 선택 핸들러 설정
const setupProductSelectionHandlers = (count, productContainer) => {
  const productDateElement = document.querySelector(`#productDate-${count}`);
  const productTitleElement = document.querySelector(`#productTitle-${count}`);
  const customInputId = `custom-date-${count}`;

  // 기존 입력값 제거 함수
  const removeCustomInput = () => {
    const existingCustomInput = document.querySelector(`#${customInputId}`);
    if (existingCustomInput) {
      existingCustomInput.remove();
    }
    productDateElement.removeAttribute("data-custom-value"); // 기존 값 초기화
  };

  // 날짜 선택 변경 시 조건 처리
  productDateElement.addEventListener("change", (event) => {
    if (!productTitleElement || productTitleElement.value === "none") {
      alert("상품을 먼저 선택하세요.");
      event.target.value = "none"; // 선택 초기화
      removeCustomInput();
      return;
    }

    if (event.target.value !== "custom") {
      // 직접 입력이 아닌 경우 값 초기화
      removeCustomInput();
    }

    updateMembershipContainer();
  });

  // 상품 선택 변경 시 조건 처리
  productTitleElement.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

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

    // 옵션 변경 시 입력값 초기화
    removeCustomInput();
    updateMembershipContainer();
  });

  // 중복 선택 방지 및 변경 이벤트
  productContainer.addEventListener("change", (event) => {
    if (event.target.classList.contains("showItem")) {
      const selectedValue = event.target.value;

      // 중복 선택 방지
      const otherSelects = document.querySelectorAll("select.showItem");
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
        alert("현재 등급보다 낮은 등급은 선택할 수 없습니다.");
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

      updateMembershipContainer();
    }
  });
};

// 업데이트 컨테이너 정렬 및 항목 생성
const updateMembershipContainer = () => {
  const beforeMembershipContainer = document.querySelector("#beforemembership");
  const productExpenseContainer = document.querySelector("#product-addpart2"); // 새로운 영역
  const productItems = document.querySelectorAll(".product-addpart .item");

  // 기존 DOM 초기화
  beforeMembershipContainer.textContent = "";
  productExpenseContainer.textContent = ""; // 새로운 영역 초기화

  // 상품 정보 배열 생성
  const membershipList = Array.from(productItems).map((item) => {
    const selectedValue = item.querySelector(".showItem").value;
    const productDateElement = item.querySelector(".showDate");
    const customDuration = Number(
      productDateElement.getAttribute("data-custom-value")
    );
    const selectedDuration =
      customDuration || Number(productDateElement.value) || 0; // 숫자로 변환 및 기본값 처리
    const membership = membershipOptions.find(
      (option) => option.value === selectedValue
    );

    return { membership, selectedValue, selectedDuration };
  });

  // 정렬: defaultType 기준 오름차순
  membershipList.sort(
    (a, b) => Number(a.selectedValue) - Number(b.selectedValue)
  );

  sumResult = 0; // 금액 합산 변수

  membershipList.forEach(({ membership, selectedValue, selectedDuration }) => {
    if (selectedValue === "none" || selectedDuration <= 0) return;

    const calculatedPrice = membership.price * selectedDuration;
    sumResult += calculatedPrice; // 합산

    const userMembership = getMembershipDetailsByType(Number(selectedValue));
    const upgradeMembership = getMembershipDetailsByType(2); // Upgrade 조건에 사용
    const remainingDays = userMembership?.remainingDays || 0;

    // 기간 계산
    let calculatedDuration;
    if (
      upgradeMembership &&
      upgradeMembership.membershipType === 2 &&
      selectedValue === "3"
    ) {
      // Upgrade: 남은 기간 + 선택한 기간
      calculatedDuration = `${
        upgradeMembership.remainingDays + selectedDuration * 30
      }일`;
    } else if (selectedValue === "2" || selectedValue === "3") {
      // 일반 기간 연장
      calculatedDuration = `${remainingDays + selectedDuration * 30}일`;
    } else {
      // 기타
      calculatedDuration = `${remainingDays + selectedDuration}일`;
    }

    // 컨테이너 생성
    const container = document.createElement("div");
    container.classList.add("membership-item");

    // 라벨 및 내용 추가 함수
    const addContent = (labelText, showContent = false) => {
      const label = document.createElement("p");
      label.textContent = labelText;
      label.style.fontWeight = "bold";

      const title = document.createElement("h4");
      title.textContent = membership?.label || "알 수 없는 상품";

      container.appendChild(label);
      container.appendChild(title);

      if (showContent) {
        const content = document.createElement("p");
        content.innerHTML = membership?.content || "";
        container.appendChild(content);
      }

      const duration = document.createElement("p");
      duration.textContent = `기간: ${calculatedDuration}`;
      container.appendChild(duration);
    };

    // 조건에 따라 라벨 추가
    if (
      upgradeMembership &&
      upgradeMembership.membershipType === 2 &&
      selectedValue === "3"
    ) {
      addContent("Upgrade", true);
    } else if (userMembership) {
      addContent("기간연장");
    } else {
      addContent("New", true);
    }

    // 새로운 product-addpart2에 출력
    const productContainer = document.createElement("div");
    productContainer.classList.add("payments-expense-bgr");
    productContainer.innerHTML = `
      <div class="payments-expense-center">
        <div class="payments-expense-title">
          <div>${membership?.label || "알 수 없는 상품"}</div> 
        </div>
        <div class="payments-expense-date">
          <div>${selectedDuration} 개</div> 
        </div>
        <div class="payments-expense-price">
          <div><p class="fst-price">${calculatedPrice.toLocaleString()}원</p></div>
        </div>
      </div>
      
    `;

    beforeMembershipContainer.appendChild(container);
    productExpenseContainer.appendChild(productContainer);
  });

  // 최종 합산 금액 출력
  const sumContainer = document.createElement("div");
  sumContainer.classList.add("payments-expense-bgr");
  sumContainer.innerHTML = ` <h1 class="payments-expense-result">합계 : ${sumResult.toLocaleString()}원</h1>`;
  productExpenseContainer.appendChild(sumContainer);
};

document.addEventListener("DOMContentLoaded", () => {
  IMP.init("imp41253800"); // 아임포트 초기화

  document.addEventListener("click", (event) => {
    if (event.target && event.target.id === "payBtn") {
      const onClickPay = async () => {
        if (sumResult <= 0) {
          alert("결제할 금액이 없습니다.");
          return;
        }
        IMP.request_pay(
          {
            storeId: "store-5b5cb483-ddb0-4a3b-a99f-eb4f7b4f4568",
            channelKey: "channel-key-e5b8dde3-85d8-47b8-bb2a-b12187bc9dac",
            paymentId: `payment-${crypto.randomUUID()}`,
            currency: "CURRENCY_KRW",
            pay_method: "card",
            amount: sumResult / 300, // 최종 결제 금액
            name: "선택한 멤버십 상품",
            merchant_uid: `merchant_${new Date().getTime()}`, // 고유 주문 ID
          },
          function (rsp) {
            // callback
            if (rsp.success) {
              // 결제성공시 로직
              let data = {
                // request
                imp_uid: rsp.imp_uid,
                amount: rsp.paid_amount,
                reservationId: 32,
              };
              //결제 검증
              $.ajax({
                type: "POST",
                url: "/payments/vertifyIamport",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                  alert("결제 및 결제 검증이 완료되었습니다.");
                  //self.close();
                },
                error: function (result) {
                  alert(result.responseText);
                },
              });
            } else {
              // 결제 실패 시 로직
              alert("결재 실패");
              //alert(rsp.error_msg);
              //console.log(rsp);
            }
          }
        );
      }; //requestPay

      onClickPay();
    }
  });
});
