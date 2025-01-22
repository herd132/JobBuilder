let userMemberships = [];

// 특정 Membership 데이터 가져오기 (membership.js와 연동)
const getMembershipDetailsByType = (type) => {
  return globalMembershipList.find(
    (membership) => membership.membershipType === type
  );
};


var sumResult = 0;
var newMemberships = [];
var oldMemberships = [];
var memberships = []; // 멤버십 세부 정보를 담을 배열
var validMembershipNumbers = []; // 기존 멤버십 번호
var emptyMembershipCount  = 0;
var calculatedPrice = 0; //상품정보 리스트
var paymentProduct = "";
var encodedCustomData = "";

// defaultType을 반환하는 함수
const getDefaultTypeValue = (defaultType, selectedValue) => {
  return defaultType ?? selectedValue ?? "none";
};

const membershipOptions = [
  {
    value: "2",
    label: "골드 이용권",
    content:
      "✔ 공고 일일 100건 등록<br>✔ 이력서 열람 300건<br>✔ 키워드 이력서 검색<br>✔ 이력서 상세 정보 열람<br>✔ 공고 상단 등록",
    price: 30000,
  },
  {
    value: "3",
    label: "플래티넘 이용권",
    content:
      "✔ 공고 일일 300건 등록<br>✔ 이력서 열람 무제한<br>✔ 키워드 이력서 검색<br>✔ 이력서 상세 정보 열람<br>✔ 공고 최상단 등록<br>✔ 이력서 추천 기능",
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

      // 스크롤을 최상단으로 이동
      window.scrollTo({
        top: 0,
        behavior: "auto", 
      });
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
      .map((membership) => {
        // membershipOptions에서 현재 membershipType과 일치하는 옵션 가져오기
        const matchedOption = membershipOptions.find(
          (option) => option.value === String(membership.membershipType)
        );

        return `
        <div class="membership-item3">
          <h3>${membership.membershipName}</h3>
          <p>${matchedOption ? matchedOption.content : "내용 없음"}</p>
          <p>남은 기간: ${membership.remainingDays}일</p>
        </div>`;
      })
      .join("")
  : `<p>✔ 공고 일일 30건 등록<br>✔ 이력서 열람 100건<br>✔ 키워드 이력서 검색<br>✔ 이력서 상세 정보 열람</p>`;

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
              <div class="afteremembership" id="after-membership">
                  ${membershipDetailsHtml} <!-- 로그인된 사용자 정보 -->
              </div>
          </div>
          →
          <div>
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

  // **1. productTitleElement의 값을 명시적으로 설정**
  if (defaultType !== null && defaultType !== "none") {
    productTitleElement.value = String(defaultType);
  }

  // **2. change 이벤트 핸들러 설정**
  const addCustomInput = (productDateElement, productTitleElement, id) => {
    const customInputId = `custom-date-${id}`;
    const existingCustomInput = productGroup.querySelector(`#${customInputId}`);

    if (productDateElement.value === "custom" && !existingCustomInput) {
      const customInput = document.createElement("input");
      customInput.type = "number";
      customInput.placeholder =
        Number(productTitleElement.value) >= 4 ? "직접 입력 (일)" : "직접 입력 (개월)";
      customInput.id = customInputId;
      customInput.setAttribute("data-id", id);

      customInput.addEventListener("input", () => {
        const value = customInput.value ? Number(customInput.value) : 0;
        productDateElement.setAttribute("data-custom-value", value);
        updateMembershipContainer(); // 실시간 상태 업데이트
      });

      customInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault(); // 기본 동작 방지
          updateMembershipContainer(); // 상태 즉시 반영
        }
      });

      productDateElement.parentNode.appendChild(customInput);
    } else if (productDateElement.value !== "custom" && existingCustomInput) {
      existingCustomInput.remove();
      productDateElement.removeAttribute("data-custom-value"); // 기존 값 초기화
    }
  };

  productDateElement.addEventListener("change", () => {
    addCustomInput(productDateElement, productTitleElement, id); // 직접입력 추가 처리
    updateMembershipContainer(); // 상태 업데이트
  });

  productTitleElement.addEventListener("change", () => {
    const selectedValue = Number(productTitleElement.value);

    if (!productTitleElement.value || productTitleElement.value === "none") {
      // 상품이 선택되지 않은 경우 기본 개월수 옵션으로 설정
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
      addCustomInput(productDateElement, productTitleElement, id);
      updateMembershipContainer();
      return;
    }

    if (selectedValue >= 4) {
      // 일수 옵션으로 변경
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
    } else if (selectedValue >= 2 && selectedValue <= 3) {
      // 개월수 옵션으로 변경
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
    } else {
      // 기본 선택으로 리셋
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

    // 직접입력 옵션 처리
    addCustomInput(productDateElement, productTitleElement, id);
    updateMembershipContainer(); // 상태 업데이트
  });

  // **3. change 이벤트 트리거**
  if (defaultType !== null && defaultType !== "none") {
    // setTimeout을 사용하여 이벤트가 제대로 트리거되도록 약간의 지연을 추가
    setTimeout(() => {
      productTitleElement.dispatchEvent(new Event('change'));
    }, 0);
  }

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
        alert("멤버십 상품은 1개만 선택해야 합니다.");
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
memberships = []; // 초기화
newMemberships = [];
oldMemberships = [];
validMembershipNumbers = [];
emptyMembershipCount = 0;
paymentProduct = "";

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

  if (selectedValue !== "none") {
    const membershipDetail = getMembershipDetailsByType(Number(selectedValue));
    let answer = "";
    const value = Number(selectedValue); // 타입 명시적 변환

    switch (value) {
      case 1:
        answer = "기본";
        break;
      case 2:
        answer = "골드 이용권";
        break;
      case 3:
        answer = "플래티넘 이용권";
        break;
      case 4:
        answer = "급구 이용권";
        break;
      case 5:
        answer = "Hot 이용권";
        break;
      default:
        answer = "Unknown"; // 예상치 못한 값 처리
        break;
    }

    // 공통 데이터 생성
    const membershipData = {
      membershipType: value,
      membershipDateValue: selectedDuration,
      durationUnit: value >= 4 ? "DAY" : "MONTH",
      membershipProduct: answer,
      membershipAmount: membership.price * selectedDuration,
      membershipCount: productDateElement,
    };

    // 조건에 따라 oldMemberships 또는 newMemberships에 푸쉬
    if (membershipDetail) {
      validMembershipNumbers.push(membershipDetail.membershipNo); // 기존 멤버십
      oldMemberships.push(membershipData); // 기존 멤버십 데이터 추가
    } else {
      emptyMembershipCount++; // 빈 슬롯 카운트 증가
      newMemberships.push(membershipData); // 새로운 멤버십 데이터 추가
    }

    // 공통 memberships 배열에 추가
    memberships.push(membershipData);

    // paymentProduct 설정
    if (memberships && memberships.length > 0) {
      const firstProduct = memberships[0].membershipProduct;
      paymentProduct =
        memberships.length > 1
          ? `${firstProduct} 외 ${memberships.length - 1}건`
          : firstProduct;
    }
  }

  return { membership, selectedValue, selectedDuration };
});


  // 정렬: defaultType 기준 오름차순
  membershipList.sort(
    (a, b) => Number(a.selectedValue) - Number(b.selectedValue)
  );

  sumResult = 0; // 금액 합산 변수

  membershipList.forEach(({ membership, selectedValue, selectedDuration }) => {
    if (selectedValue === "none" || selectedDuration <= 0) return;

    calculatedPrice = 0;
    calculatedPrice = membership.price * selectedDuration;
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
    container.classList.add("membership-item3");

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
      const checkmembershipDateValue = memberships.some(
        (membership) => membership.membershipDateValue === 0
      );

      if (checkmembershipDateValue) {
        alert("기간 입력을 확인 해주세요.");
        return; 
      }

      if (!employerNo || employerNo === 0) {
        alert("로그인된 사업주만 결제 가능합니다.");
        return;
      }


        IMP.request_pay(
          {
            storeId: "store-5b5cb483-ddb0-4a3b-a99f-eb4f7b4f4568",
            channelKey: "channel-key-9babdf46-a539-436f-a27c-2be22501c94c",
            currency: "CURRENCY_KRW",
            pay_method: "card",
            amount: sumResult, // 최종 결제 금액
            name: paymentProduct,
            merchant_uid: `merchant_${new Date().getTime()}`, // 고유 주문 ID
            custom_data: JSON.stringify({
              employerNo: Number(employerNo),
              validMembershipNumbers: validMembershipNumbers,
              emptyMembershipCount: Number(emptyMembershipCount),
              newMemberships: newMemberships,
              oldMemberships: oldMemberships,
              paymentProduct: paymentProduct,
            }),
          },
          function (rsp) {
            // callback
            console.log(rsp);
            if (rsp.success) {
              // 결제성공시 로직
              
              const data = {
                  imp_uid: rsp.imp_uid,
                  merchantUid: rsp.merchant_uid,
                  amount: Math.round(rsp.paid_amount),
                  paymentProduct: rsp.name,
                  employerNo: Number(employerNo),
                  customData: JSON.stringify(rsp.custom_data),
                  cardName: rsp.card_name,
                  cardNumber: rsp.card_number,
                  pgProvider: rsp.pg_provider,
              };

              //결제 검증
              $.ajax({
                type: "POST",
                url: "/payments/complete",
                data: JSON.stringify(data),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                  initializeMembershipData(employerNo);
                },
                error: function (result) {
                  alert(result.responseText);
                  setTimeout(() => {
                    // 다음 로직 실행
                }, 3000); // 3초 대기
                },
              });
            } else {
              // 결제 실패 시 로직
              alert("결제 실패");
              setTimeout(() => {
                // 다음 로직 실행
            }, 3000); // 3초 대기

            }
          }
        );
      }; //requestPay

      onClickPay();
    }
  });
});



const fetchAndCacheMembershipData = async (employerNo) => {
  try {
    const response = await fetch(`/payments/paymentlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: employerNo.toString(),
    });

    if (!response.ok) {
      throw new Error("데이터를 가져오는 데 실패했습니다.");
    }

    const data = await response.json();
    return data.paymentList || [];
  } catch (error) {
    console.error("에러:", error);
    return [];
  }
};

const renderMembershipUI = (data) => {
  window.scrollTo({
    top: 0,
    behavior: "auto", 
  });
  if (data.length > 0) {
    const firstMembership = data[0];
    const formattedPaymentAmount = firstMembership.paymentAmount
      ? firstMembership.paymentAmount.toLocaleString()
      : "N/A";

    return `
      <div class="payment-summary-content">
        <p class="payment-summary-item"><span class="payment-label">결제일 : </span>${firstMembership.paymentDate || "N/A"}</p>
        <p class="payment-summary-item"><span class="payment-label">상품명 : </span>${firstMembership.paymentProduct || "N/A"}</p>
        <p class="payment-summary-item"><span class="payment-label">결제금액 : </span>${formattedPaymentAmount}원</p>
        <p class="payment-summary-item"><span class="payment-label">결제상태 : </span>${firstMembership.paymentStatus || "N/A"}</p>
      </div>
    `;
    
  } else {
    return "<p>멤버십 데이터가 없습니다.</p>";
  }
};

const updateBackgroundHTML = (content) => {
  const backgroundElement = document.querySelector("#background");
  backgroundElement.innerHTML = `
    <h1 class="payments-title">결제 결과
      <hr>
    </h1>
    <div style="height: 300px;" id="finalResult">
      <div class="resultp" id="resultp">${content}</div>
      <div class="payments-t-inside-middle-item">
        <button id="cancelBtn" class="payments-t-btn-after" onclick="location.href='/payments';"
          style="cursor:pointer;">돌아가기</button>
      </div>
    </div>
  `;
};

// 실행 함수
const initializeMembershipData = async (employerNo) => {
  const resultList = await fetchAndCacheMembershipData(employerNo);
  const resultContent = renderMembershipUI(resultList);
  updateBackgroundHTML(resultContent);
};