// 전역 변수
let globalResumeList = [];
let resumeCount = 0;

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
        resumeCount = globalResumeList.length;
        updateUI();
    } catch (error) {
        console.error("에러 발생:", error);
    }
};


// UI 업데이트
const updateUI = () => {
    const tbody = document.getElementById("resumeTableBody");
    const container = document.getElementById("resultp");

    if (globalResumeList.length === 0) {
        container.innerHTML = `
            <div class="no-resume-message">
                <h2>등록된 이력서가 없습니다!</h2>
                <p>이력서가 없으면 지원에 제한이 있을 수 있습니다.</p>
            </div>
        `;
        return;
    }

    tbody.innerHTML = globalResumeList.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>
                <form action="/resume/resumeDetail" method="get" style="display:inline;">
                    <input type="hidden" name="resumeNo" value="${item.resumeNo}">
                    <button type="submit" style="all: unset; cursor: pointer; color: #543A14;">
                        ${item.resumeTitle || "선택없음"}
                    </button>
                </form>
            </td>
            <td>${formatTime(item.modificationDate)}</td>
            <td>${formatCareer(item.totalCareer)}</td>
            <td>
                <div class="visibility-container">
                    <span id="visibility_${index}">${item.resumeHideFl === "Y" ? "비공개" : "공개"}</span>
                    <button class="action-button visibility-button" onclick="toggleVisibility(${index})">변경</button>
                </div>
            </td>
            <td>
                <form action="/resume/resumeRecommend" method="get" style="display:inline;">
                    <input type="hidden" name="resumeNo" value="${item.resumeNo}">
                    <button type="submit" style="all: unset; cursor: pointer; color: blue;">
                        ${item.recommendation || 0}건
                    </button>
                </form>
            </td>
            <td class="action-buttons">
                <button class="action-button delete-button" onclick="deleteResume(${index})">삭제</button>
            </td>
        </tr>
    `).join("");
};

// 공개 여부 토글
const toggleVisibility = (index) => {
    const item = globalResumeList[index];
    const newValue = item.resumeHideFl === "Y" ? "N" : "Y";
    const label = newValue === "Y" ? "비공개" : "공개";
    
    if (confirm(`${label}하시겠습니까?`)) {
        updateResumeStatus(item.resumeNo, 1, newValue, index);
    }
};

// 이력서 삭제
const deleteResume = (index) => {
    const item = globalResumeList[index];
    if (confirm("삭제하시겠습니까?")) {
        updateResumeStatus(item.resumeNo, 2, "Y", index);
    }
};

// 상태 업데이트 요청
const updateResumeStatus = async (resumeNo, updateType, value, index) => {
    try {
        const response = await fetch("/resume/updateResumeStatus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ resumeNo, updateType, value }),
        });
        
        const result = await response.json();
        if (result.success) {
            if (updateType === 1) {
                globalResumeList[index].resumeHideFl = value;
                document.getElementById(`visibility_${index}`).textContent = 
                    value === "Y" ? "비공개" : "공개";
            } else if (updateType === 2) {
                globalResumeList.splice(index, 1);
                resumeCount--;
                updateUI();
            }
            alert("상태가 성공적으로 업데이트되었습니다.");
        } else {
            alert(`상태 업데이트 실패: ${result.error || "알 수 없는 오류"}`);
        }
    } catch (error) {
        console.error("서버 요청 중 오류 발생:", error);
    }
};

// 작성하기 버튼 처리
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

// 시간 포맷팅
const formatTime = (dateString) => {
    if (!dateString) return "수정된 적 없음";
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000 / 60);
    return diff < 60
        ? `${diff}분 전`
        : diff < 1440
        ? `${Math.floor(diff / 60)}시간 전`
        : dateString;
};


// 경력 포맷팅
const formatCareer = (totalCareer) => {

    if (!totalCareer || totalCareer <= 0) return "신입";
    if (totalCareer >= 30) {
        const totalMonths = Math.floor(totalCareer / 30);
        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;
        return `${years ? `${years}년 ` : ""}${months ? `${months}개월` : ""}`.trim();
    } else {
        return "1개월 미만";
    }
};

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    handleWriteButtonState();
});