
// 전역 변수inside
let globalMembershipList = [];

// workerNo 가져오기
const getworkerNo = () => {
  const workerNoMeta = document.querySelector('meta[name="workerNo"]');
  return workerNoMeta?.content || null;
};

const workerNo = getworkerNo();

// 데이터 요청 및 캐싱
async function fetchAndCacheMembershipData(workerNo) {
  try {
    const response = await fetch(`/resume/resumeLista`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerNo }),
    });

    if (!response.ok) {
      throw new Error("데이터를 가져오는 데 실패했습니다.");
    }

    const data = await response.json();
    globalMembershipList = data.resumeList || [];
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
    const key = `${item.resumeProduct}_${item.resumeAmount}_${item.registrationDate}`;
    if (!acc[key]) {
      acc[key] = { summary: item, details: [] };
    }
    acc[key].details.push(item);
    return acc;
  }, {});

  const mainDiv = document.createElement("div");
   mainDiv.className = "resume-summary";
     mainDiv.innerHTML = `
        <div class="resume-title"> 
            <hr>
            <div class="resume-title-font">
              <div class="resume-title-font1">이력서</div> 
              <div>최근 수정일</div>
              <div>공개 여부</div>
              <div>맞춤 알바</div> 
            </div>  
            <hr>
            
        </div>
      `;

  Object.values(groupedData).forEach((group, index) => {
    const { summary } = group;

    // 메인 항목 생성

    mainDiv.className = "resume-summary";
    
    mainDiv.innerHTML += `
    <div class="resume-summary-group3">
     <div class="resume-summary-group2">
        <strong>${index + 1}</strong>
      </div>
    <div class="resume-summary-group">
      <div class="resume-summary">
        <p class="summary-line">
          작성일 : ${summary.registrationDate || "N/A"} - 
          <strong>${summary.resumeNo}.(일단 구분용 이력서번호) : <br> 
          이력서 제목 : ${summary.resumeProduct}</strong> - 
          <button id="Refund_${index}" class="refund-button">삭제</button>
          <button id="Refund_${index}" class="refund-button">공개하기</button>
        </p>  
      </div>
    </div>
    </div>
  `;

    // 메인 항목 클릭 이벤트 추가 (클릭시 펼쳐짐)
    mainDiv.querySelector(".summary-line").addEventListener("click", () => {
      detailDiv.classList.toggle("hidden");
    });

    // 환불 버튼 클릭 이벤트 추가
    const refundButton = mainDiv.querySelector(`#Refund_${index}`);
    refundButton.addEventListener("click", (event) => {
      event.stopPropagation(); // 클릭 이벤트 전파 방지
      alert(`선택한 이력서의 번호 resumeNo:${summary.resumeNo} `);
    });

    // 컨테이너에 추가
    container.appendChild(mainDiv);
  });
};

// 초기화 함수
async function initializeMembershipData() {
  const data = await fetchAndCacheMembershipData(workerNo);
  if (data.length > 0) {
    updateMembershipUI();
  } else {
    console.log("데이터가 없습니다.");
  }
}

// 초기화 실행
initializeMembershipData();

console.log(workerNo);