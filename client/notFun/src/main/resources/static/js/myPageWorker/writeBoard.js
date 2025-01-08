let currentPage = 1; // 현재 페이지
let isLoading = false; // 데이터 로딩 중인지 여부
let hasMoreData = true; // 데이터가 더 있는지 여부

const boardContainer = document.querySelector('.board-container');

// 비동기 함수로 글 목록을 불러오는 함수
const fetchRequest = async () => {
  if (isLoading || !hasMoreData) return; // 로딩 중이거나 더 이상 데이터가 없으면 종료
  isLoading = true; // 로딩 시작
  try {
    // 페이지 번호를 쿼리 파라미터로 전달하여 데이터를 요청
    const resp = await fetch(`/myPageWorkee/writeView?cp=${currentPage}`);
    const boardTitles = await resp.json(); // JSON 형식의 데이터 받기

    if (boardTitles.length > 0) {
      // 받은 데이터로 테이블을 업데이트
      makeBoardList(boardTitles);
      currentPage++; // 페이지 번호 증가

    } else {
      hasMoreData = false; // 더 이상 로드할 데이터가 없으면 `hasMoreData`를 false로 설정
      console.log("더 이상 로드할 데이터가 없습니다.");
    }
  } catch (err) {
    console.error("데이터를 가져오는 중 오류가 발생했습니다: ", err);
  } finally {
    isLoading = false; // 로딩 상태를 false로 설정
  }
  
};
  function onScroll() {
    const scrollPosition = boardContainer.scrollTop + boardContainer.clientHeight;  // 현재 스크롤 위치
    const pageHeight = boardContainer.scrollHeight;  // 전체 페이지 높이
    
    // 페이지 하단에 가까워졌을 때 추가 데이터를 요청
    if (scrollPosition >= pageHeight - 5) {  // 5px 여유를 두고 하단 감지
      fetchRequest();
    }
  }
// 초기화
const init = () => {
  fetchRequest(); // 첫 페이지 로드
  boardContainer.addEventListener("scroll", onScroll);
};

// 함수 호출
init();



function makeBoardList(boardTitles) {
  const tbody = document.querySelector(".boardList");

  // 기존 데이터를 비우고 새로 추가
  // `tbody.innerHTML = '';`로 기존 데이터를 삭제 후 새 데이터를 추가
  // 단, 첫 로딩 시에만 비우고, 이후에는 추가만 하도록 하는 방식
  if (currentPage === 1) {
    tbody.innerHTML = '';  // 첫 로딩 시에는 기존 내용을 비움
  }

  boardTitles.forEach(board => {
    const row = document.createElement("tr");

    // 글번호
    const idCell = document.createElement("td");
    idCell.textContent = board.boardNo;  // boardNo

    // 제목
    const titleCell = document.createElement("td");
    titleCell.textContent = board.boardTitle;  // boardTitle

    // 작성일 (String 형식 날짜 처리)
    const dateCell = document.createElement("td");
    dateCell.textContent = board.boardWriteDate.split(" ")[0];  // boardWriteDate (날짜 부분만)

    // 조회수
    const viewCountCell = document.createElement("td");
    viewCountCell.textContent = board.boardReadCount;  // boardReadCount

    // 행에 각 셀 추가
    row.appendChild(idCell);
    row.appendChild(titleCell);
    row.appendChild(dateCell);
    row.appendChild(viewCountCell);

    // tbody에 행 추가
    tbody.appendChild(row);
  });
}

fetchRequest();
