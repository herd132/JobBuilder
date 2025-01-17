// 전역 변수
let globalMembershipList = [];

const employerNo = sessionStorage.getItem('employerNo');

// 데이터 요청 및 캐싱
async function fetchAndCacheMembershipData() {
  try {
    const response = await fetch(`/payments/paymentlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: employerNo
    });

    if (!response.ok) {
      throw new Error("데이터를 가져오는 데 실패했습니다.");
    }

    const data = await response.json();
    globalMembershipList = data.paymentList || [];
    return [...globalMembershipList];
  } catch (error) {
    console.error("에러:", error);
    return [];
  }
}

// UI 업데이트 함수
const updateMembershipUI = () => {
  const container = document.getElementById("resultp");
  container.innerHTML = "";

  const groupedData = globalMembershipList.reduce((acc, item) => {
    const key = `${item.paymentProduct}_${item.paymentAmount}_${item.paymentDate}`;
    if (!acc[key]) {
      acc[key] = { summary: item, details: [] };
    }
    acc[key].details.push(item);
    return acc;
  }, {});

  Object.values(groupedData).forEach((group, index) => {
    const { summary, details } = group;

    // 메인 항목 생성
    const mainDiv = document.createElement("div");
    mainDiv.className = "payment-summary";
    mainDiv.innerHTML += `
    <div class="payment-summary-group3">
     <div class="payment-summary-group2">
        <strong>${index + 1}</strong>
      </div>
    <div class="payment-summary-group">
      <div class="payment-summary">
        <p class="summary-line">
          ${summary.paymentDate || "N/A"} - 
          <strong>${summary.paymentNo}. ${summary.paymentProduct}</strong> - 
          ${summary.paymentAmount.toLocaleString()}원 - 클릭시 펼쳐짐
          <button id="Refund_${index}" class="refund-button">환불</button>
        </p>
      </div>
    </div>
    </div>
  `;

    // 상세 항목 컨테이너 생성
    const detailDiv = document.createElement("div");
    detailDiv.className = "payment-details hidden"; // 초기에는 숨김
    details.forEach((detail) => {
      detailDiv.innerHTML += `
        <p>${detail.paymentTypeProduct} - ${detail.paymentTypeAmount.toLocaleString()}원</p>
      `;
    });

    // 메인 항목 클릭 이벤트 추가 (클릭시 펼쳐짐)
    mainDiv.querySelector(".summary-line").addEventListener("click", () => {
      detailDiv.classList.toggle("hidden");
    });

    // 환불 버튼 클릭 이벤트 추가
    const refundButton = mainDiv.querySelector(`#Refund_${index}`);
    refundButton.addEventListener("click", (event) => {
      event.stopPropagation(); // 클릭 이벤트 전파 방지
      alert(`환불 요청 paymentNo:${summary.paymentNo} `);
    });

    // 컨테이너에 추가
    container.appendChild(mainDiv);
    container.appendChild(detailDiv);
  });
};

// 초기화 함수
async function initializeMembershipData() {
  const data = await fetchAndCacheMembershipData(employerNo);
  if (data.length > 0) {
    updateMembershipUI();
  } else {
    console.log("데이터가 없습니다.");
  }
}

// 초기화 실행
initializeMembershipData();
