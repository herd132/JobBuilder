// 전역 변수
let globalResumeList = [];

// 데이터 요청 및 UI 업데이트
const initializePage = async () => {
  try {
    const response = await fetch(`/resume/resumeLista`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("데이터를 가져오는 데 실패했습니다.");

    const data = await response.json();
    if (data.error) {
      console.error("서버 오류:", data.error);
      return;
    }

    globalResumeList = data.resumeList || [];
    globalResumeList.length > 0 ? updateUI() : console.log("데이터가 없습니다.");
  } catch (error) {
    console.error("에러:", error);
  }
};

// 경력 변환
const formatCareer = (totalCareer) => {
  if (!totalCareer || totalCareer <= 0) return "신입";
  const totalMonths = Math.floor(totalCareer / 30);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  return `${years ? `${years}년 ` : ""}${months ? `${months}개월` : ""}`.trim();
};

// 시간 변환
const formatTime = (dateString) => {
  if (!dateString) return "수정된적없음";
  const diff = Math.floor((new Date() - new Date(dateString)) / 1000 / 60);
  return diff < 60
    ? `${diff}분 전`
    : diff < 1440
    ? `${Math.floor(diff / 60)}시간 전`
    : dateString;
};
const getVisibilityLabel = (hideFlag) => (hideFlag === "Y" ? "비공개" : "공개");

// 이력서 항목 생성
const createResumeItem = (item, index) => `
  <div class="resume-summary-group3">
    <div class="resume-summary-group2">
      <strong>${index + 1}</strong>
    </div>
    <div class="resume-summary-group">
      <div class="resume-summary">
        <p class="summary-line">
          <strong>이력서 제목 : ${item.resumeTitle || "선택없음"}</strong><br>
          희망지역: ${item.workcondAddressTypeInfo || "선택없음"}<br>
          작성일 : ${formatTime(item.registrationDate)}<br>
          수정일 : ${formatTime(item.modificationDate)}<br>
          공개여부 : ${getVisibilityLabel(item.resumeHideFl)}<br>
          경력 : ${formatCareer(item.totalCareer)}<br>
          맞춤알바 : ${item.recommendation || 0}건<br>
          <br><strong>${item.resumeNo}.(일단 구분용 이력서번호)</strong><br>
          <button id="Refund_${index}" class="refund-button">삭제</button>
          <button id="Public_${index}" class="public-button">공개하기</button>
        </p>
      </div>
    </div>
  </div>
`;

// UI 업데이트
const updateUI = () => {
  const container = document.getElementById("resultp");
  container.innerHTML = `
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

  container.innerHTML += globalResumeList.map(createResumeItem).join("");
  addEventListeners(container);
};

// 이벤트 리스너 추가
const addEventListeners = (container) => {
  container.addEventListener("click", async ({ target }) => {
    const index = target.id?.split("_")[1];
    const item = globalResumeList[index];
    if (!item) return console.error("이력서를 찾을 수 없습니다.");

    const actionMap = {
      "refund-button": { label: "삭제", field: "resumeDelFl", confirmMsg: "삭제하시겠습니까?" },
      "public-button": {
        label: item.resumeHideFl === "Y" ? "공개" : "비공개",
        field: "resumeHideFl",
        confirmMsg: `${item.resumeHideFl === "Y" ? "공개" : "비공개"}로 설정하시겠습니까?`,
      },
    };

    const action = Object.entries(actionMap).find(([cls]) =>
      target.classList.contains(cls)
    );
    if (!action) return;

    const [, { label, field, confirmMsg }] = action;
    const newValue = field === "resumeHideFl" ? (item.resumeHideFl === "Y" ? "N" : "Y") : "Y";

    if (!confirm(confirmMsg)) return;

    try {
      const response = await fetch("/resume/updateResumeStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeNo: item.resumeNo, field, value: newValue }),
      });

      if (!response.ok) throw new Error(`${label} 요청 실패`);

      const { success } = await response.json();
      if (success) {
        item[field] = newValue;
        updateUI(); // 상태 갱신 후 UI 업데이트
      } else {
        alert(`${label}에 실패했습니다.`);
      }
    } catch (error) {
      console.error("요청 중 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    }
  });
};



// 페이지 로드 시 데이터 요청 및 UI 업데이트 실행
initializePage();
