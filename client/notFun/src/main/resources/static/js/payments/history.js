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
          <strong>${summary.paymentProduct}</strong> - 
          ${summary.paymentAmount.toLocaleString()}원 - 클릭시 펼쳐짐
          <button id="Refund_${index}" class="refund-button">환불</button>
        </p>
      </div>
    </div>
    </div>
  `;

// 상세 항목 컨테이너 생성 (ul 태그로 변경)
const detailList = document.createElement("ul");
detailList.className = "subitem hidden"; // 초기에는 숨김 (CSS 클래스 적용)

// 상세 항목 추가 (li 태그로 구성)
details.forEach((detail) => {
  const listItem = document.createElement("li");
  listItem.textContent = `${detail.paymentTypeProduct} - ${detail.paymentTypeAmount.toLocaleString()}원`;
  detailList.appendChild(listItem);
});

// 메인 항목 클릭 이벤트 추가 (클릭 시 펼쳐짐/숨김)
mainDiv.querySelector(".summary-line").addEventListener("click", () => {
  detailList.classList.toggle("hidden"); // 숨김 토글
});

// 환불 버튼 클릭 이벤트 추가
const refundButton = mainDiv.querySelector(`#Refund_${index}`);
if (refundButton) {
  refundButton.addEventListener("click", async (event) => {
    event.stopPropagation(); // 클릭 이벤트 전파 방지
  
    // 요청할 데이터
    const paymentNo = Number(summary.paymentNo);
  
    try {
      // POST 요청 보내기
      const response = await fetch("/payments/refund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paymentNo)
      });
  
      // 응답 처리
      if (!response.ok) {
        throw new Error("서버 응답이 실패했습니다.");
      }
  
      const result = await response.json(); // 응답 데이터를 JSON으로 파싱
      console.log("서버 응답:", result); // 결과 출력
  
      // 결과가 2일 경우
      if (result === 2) {
        alert("구매시간 24시간이 넘는 구매건\n환불 요청은 관리자에게 문의 부탁드립니다.");
      }
      // 결과가 1일 경우
      else if (result === 1) {
        const confirmRefund = confirm(
          "환불을 진행하시겠습니까?\n해당 결제건에 구입한 모든 상품이 일괄적으로 환불이 진행됩니다."
        );
        
        if (confirmRefund) {
          try {
            // 확인 선택 시 추가 패치 요청
            const response = await fetch("/payments/confirmRefund", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ paymentNo, employerNo }),
            });
        
            // 서버에서 반환된 문자열 응답 받기
            const result = await response.text();
        
            if (response.ok) {
              alert(result); // 서버에서 반환된 메시지 표시 (성공 메시지)
              window.location.href = "/payments/history"; // 리다이렉트
            } else {
              alert("환불 처리에 실패했습니다. 다시 시도해주세요.");
            }
          } catch (error) {
            console.error("서버 오류:", error);
            alert("서버와의 통신 중 오류가 발생했습니다.");
          }
        } else {
          // 취소 시 로직 (아무 작업도 하지 않음)
          alert("취소되었습니다.");
        }
        
      }
    } catch (error) {
      console.error("에러 발생:", error.message);
    }
  });
}


// 컨테이너에 추가
container.appendChild(mainDiv);
container.appendChild(detailList);

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


