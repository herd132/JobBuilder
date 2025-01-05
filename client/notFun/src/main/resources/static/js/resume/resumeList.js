// 전역 변수
let globalResumeList = [];
let resumeCount = 0; // 현재 이력서 개수 관리

// 페이지 초기화 및 데이터 로드
const initializePage = async () => {
  try {
    const response = await fetch("/resume/resumeLista", {
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
    resumeCount = globalResumeList.length; // 이력서 개수 동기화
    updateUI(); // 데이터가 없는 경우에도 UI 초기화
  } catch (error) {
    console.error("에러 발생:", error);
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
  if (!dateString) return "수정된 적 없음";
  const diff = Math.floor((new Date() - new Date(dateString)) / 1000 / 60);
  return diff < 60
    ? `${diff}분 전`
    : diff < 1440
    ? `${Math.floor(diff / 60)}시간 전`
    : dateString;
};

// 공개 여부 라벨
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
          <strong>
          <form action="/resume/resumeDetail" method="POST" style="display:inline;">
              <input type="hidden" name="resumeNo" value="${item.resumeNo}">
              <button type="submit" style="all: unset; cursor: pointer; color: blue; text-decoration: underline;">
                  이력서 제목 : ${item.resumeTitle || "선택없음"}
              </button>
          </form>
          </strong><br>
          희망지역: ${item.workcondAddressTypeInfo || "선택없음"}<br>
          작성일 : ${formatTime(item.registrationDate)}<br>
          수정일 : ${formatTime(item.modificationDate)}<br>
          공개여부 : <span id="visibility_${index}">${getVisibilityLabel(item.resumeHideFl)}</span><br>
          경력 : ${formatCareer(item.totalCareer)}<br>
          <form action="/resume/resumeRecommend" method="POST" style="display:inline;">
            <input type="hidden" name="resumeNo" value="${item.resumeNo}">
            <button type="submit" style="all: unset; cursor: pointer; color: blue; text-decoration: underline;">
              맞춤알바 : ${item.recommendation || 0}건
            </button>
          </form><br>
          <br><strong>${item.resumeNo}.(일단 구분용 이력서번호)</strong><br>
          <button id="Refund_${index}" class="refund-button">삭제</button>
          <button id="Public_${index}" class="public-button">변경하기</button>
        </p>
      </div>
    </div>
  </div>
`;

const redirectToResumeDetail = (resumeNo) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/resume/resumeDetail";
  form.style.display = "none";

  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "resumeNo";
  input.value = resumeNo;
  form.appendChild(input);

  document.body.appendChild(form);
  form.submit();
};



// UI 업데이트
const updateUI = () => {
  const container = document.getElementById("resultp");

  // 기존 이벤트 제거를 위해 컨테이너 교체
  const newContainer = container.cloneNode(false);
  container.parentNode.replaceChild(newContainer, container);

  newContainer.innerHTML = `
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
  newContainer.innerHTML += globalResumeList.map(createResumeItem).join("");
  addEventListeners(newContainer);
};

// 상태 업데이트 요청 함수
const updateResumeStatus = async (resumeNo, updateType, value, index) => {
  try {
    const response = await fetch("/resume/updateResumeStatus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeNo, updateType, value }),
    });

    const result = await response.json();
    if (result.success) {
      alert("상태가 성공적으로 업데이트되었습니다.");

      if (updateType === 1) {
        const newVisibility = value === "Y" ? "비공개" : "공개";
        document.getElementById(`visibility_${index}`).textContent = newVisibility;
        globalResumeList[index].resumeHideFl = value;
      } else if (updateType === 2) {
        globalResumeList.splice(index, 1); // 삭제된 항목 제거
        resumeCount--; // 카운트 감소
        updateUI();
      }
    } else {
      alert(`상태 업데이트 실패: ${result.error || "알 수 없는 오류"}`);
    }
  } catch (error) {
    console.error("서버 요청 중 오류 발생:", error);
  }
};

// 작성하기 버튼 활성화/비활성화 처리
const handleWriteButtonState = () => {
  const writeButton = document.getElementById("writeBtn");

  writeButton.addEventListener("click", (e) => {
    if (resumeCount >= 3) {
      e.preventDefault();
      alert("이력서는 최대 3개까지만 작성 가능합니다.");
    } else {
      location.href = '/resume/writeResume';
    }
  });
};

// 버튼 클릭 이벤트 처리
const addEventListeners = (container) => {
  container.addEventListener("click", ({ target }) => {
    const index = target.id.split("_")[1];
    const item = globalResumeList[index];

    if (!item) {
      console.error("유효하지 않은 이력서 항목입니다.");
      return;
    }

    if (target.classList.contains("refund-button")) {
      if (confirm("삭제하시겠습니까?")) {
        updateResumeStatus(item.resumeNo, 2, "Y", index);
      }
    } else if (target.classList.contains("public-button")) {
      const newValue = item.resumeHideFl === "Y" ? "N" : "Y";
      const label = getVisibilityLabel(newValue);
      if (confirm(`${label}하시겠습니까?`)) {
        updateResumeStatus(item.resumeNo, 1, newValue, index);
      }
    }
  });
};

// 페이지 로드 시 실행
initializePage();
handleWriteButtonState();
