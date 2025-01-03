// 데이터를 캐싱할 전역 변수
let globalMembershipList = [];

// employerNo 가져오기
const getEmployerNo = () => {
  const employerNoMeta = document.querySelector('meta[name="employerNo"]');
  return employerNoMeta?.content || null;
};

const employerNo = getEmployerNo();

const resultElement = document.querySelector("#resultp");

// 데이터 캐싱 함수
async function fetchAndCacheMembershipData(employerNo) {
  try {
    // 서버에서 데이터 가져오기
    const response = await fetch(`/payments/paymentlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employerNo }),
    });

    if (!response.ok) {
      throw new Error("데이터를 가져오는 데 실패했습니다.");
    }

    // JSON 변환 후 글로벌 변수에 저장
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
  if (globalMembershipList.length > 0) {

    const firstMembership = globalMembershipList[0];

    // 결제금액 포맷팅 (1000단위 쉼표 추가)
    const formattedPaymentAmount = firstMembership.paymentAmount
      ? firstMembership.paymentAmount.toLocaleString()
      : "N/A";

    // HTML 업데이트
    resultElement.innerHTML = `
    <div class="payment-summary-content">
      <p class="payment-summary-item"><span class="payment-label">결제일:</span> ${firstMembership.paymentDate || "N/A"}</p>
      <p class="payment-summary-item"><span class="payment-label">상품명:</span> ${firstMembership.paymentProduct || "N/A"}</p>
      <p class="payment-summary-item"><span class="payment-label">결제금액:</span> ${formattedPaymentAmount}원</p>
      <p class="payment-summary-item"><span class="payment-label">결제상태:</span> ${firstMembership.paymentStatus || "N/A"}</p>
    </div>
    `;
  } else {
    resultElement.innerHTML = "<p>맴버십 데이터가 없습니다.</p>";
  }
};



// 데이터를 초기화하고 UI를 업데이트하는 함수
async function initializeMembershipData() {
  
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


