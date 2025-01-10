// ---------- 게시글 수정 버튼 -----------------

const updateBtn = document.querySelector("#updateBtn");

if(updateBtn != null) { // 수정 버튼 존재 시

  updateBtn.addEventListener("click", () => {

      // GET 방식
      // 현재 : /board/1/2001?cp=1
      // 목표 : /editBoard/1/2001/update?cp=1
      location.href = location.pathname.replace('board', 'editBoard')
                      + "/update"
                      + location.search;
                      
  });

}


/* 삭제(GET) */
const deleteBtn = document.querySelector("#deleteBtn");

if(deleteBtn != null){
deleteBtn.addEventListener("click", () => {
  if( !confirm("삭제 하시겠습니까?") ) {
    alert("취소됨")
    return;
  }

  const url = location.pathname.replace("board","editBoard") + "/delete"; // /editBoard/1/2000/delete
  const queryString = location.search; // ? cp=1
  location.href = url + queryString;
});
}


// ---------------------------------------------------

/* 목록으로 돌아가는 버튼 */
const goToListBtn = document.querySelector("#goToListBtn");

goToListBtn.addEventListener("click", () => {

// 상세조회 : /board/1/2011?cp=1
// 목록     : /board/1?cp=1

let url = location.pathname;
url = url.substring(0, url.lastIndexOf("/"));

location.href = url + location.search;
                      // 쿼리스트링
});