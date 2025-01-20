/* ***** 댓글 목록 조회(ajax) ***** */

/* 전역 변수로 현재 페이지 번호 관리 */
let currentPage = 1;

/* ***** 댓글 목록 조회(ajax) ***** */
const selectoneTalkList = (cp = 1) => {
  currentPage = cp;

  fetch(`/oneTalk/select?cp=${cp}`)
    .then((response) => response.json())
    .then((map) => {
      const ul = document.querySelector("#oneTalkList");
      ul.innerHTML = "";

      const oneTalkList = map.oneTalkList;
      const pagination = map.pagination;
      // 댓글 목록 처리
      for (let oneTalk of oneTalkList) {
        const oneTalkRow = document.createElement("li");
        oneTalkRow.classList.add("oneTalk-row");

        if (oneTalk.parentOneTalkNo != 0)
          oneTalkRow.classList.add("child-oneTalk");

        if (oneTalk.oneTalkDelFl == "Y")
          oneTalkRow.innerText = "삭제된 글 입니다";
        else {
          // ... (기존 댓글 렌더링 코드는 동일하게 유지)
          const oneTalkWriter = document.createElement("p");
          const nickname = document.createElement("span");
          if (oneTalk.workerNickname != null) {
            nickname.innerText = oneTalk.workerNickname;
          } else {
            nickname.innerText = oneTalk.memberName;
          }

          const oneTalkDate = document.createElement("span");
          oneTalkDate.classList.add("oneTalk-date");
          oneTalkDate.innerText = oneTalk.oneTalkWriteDate;

          oneTalkWriter.append(nickname, oneTalkDate);
          oneTalkRow.append(oneTalkWriter);

          const content = document.createElement("p");
          content.classList.add("oneTalk-content");
          content.innerText = oneTalk.oneTalkContent;

          oneTalkRow.append(content);

          // 버튼 영역 생성 (기존과 동일)
          const oneTalkBtnArea = document.createElement("div");
          oneTalkBtnArea.classList.add("oneTalk-btn-area");

          if(loginEmployerNo != null || loginWorkerNo != null){
            const childoneTalkBtn = document.createElement("button");
            childoneTalkBtn.classList.add("createBtn")
            childoneTalkBtn.innerText = "답글";
            childoneTalkBtn.setAttribute(
              "onclick",
              `showInsertoneTalk(${oneTalk.oneTalkNo}, this)`
            );
  
            oneTalkBtnArea.append(childoneTalkBtn);            
          };


          if (
            (loginWorkerNo != null && loginWorkerNo == oneTalk.memberNo) ||
            (loginEmployerNo != null && loginEmployerNo == oneTalk.memberNo)
          ) {
            const updateBtn = document.createElement("button");
            updateBtn.classList.add("updateBtn")
            updateBtn.innerText = "수정";
            updateBtn.setAttribute(
              "onclick",
              `showUpdateoneTalk(${oneTalk.oneTalkNo}, this)`
            );

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("deleteBtn");
            deleteBtn.innerText = "삭제";
            deleteBtn.setAttribute(
              "onclick",
              `deleteoneTalk(${oneTalk.oneTalkNo})`
            );

            oneTalkBtnArea.append(updateBtn, deleteBtn);
          }

          oneTalkRow.append(oneTalkBtnArea);
        }

        ul.append(oneTalkRow);
      }

      // 페이지네이션 렌더링
      updatePagination(pagination);
    });
};

// 페이지네이션 UI 업데이트 함수
const updatePagination = (pagination) => {
  const paginationArea = document.querySelector(".pagination");
  if (!paginationArea) return;

  paginationArea.innerHTML = "";

  // 처음 페이지로 이동
  const firstPage = document.createElement("li");
  firstPage.classList.add("arrow-item");
  firstPage.innerHTML = `<a onclick="selectoneTalkList(1)" class="arrow-icon">&#8249;&#8249;</a>`;
  paginationArea.append(firstPage);

  // 이전 목록으로 이동
  const prevPage = document.createElement("li");
  prevPage.classList.add("arrow-item");
  prevPage.innerHTML = `<a onclick="selectoneTalkList(${pagination.prevPage})" class="arrow-icon">&#8249;</a>`;
  paginationArea.append(prevPage);

  // 페이지 번호 생성
  for (let i = pagination.startPage; i <= pagination.endPage; i++) {
    const pageNum = document.createElement("li");
    if (i === pagination.currentPage) {
      pageNum.innerHTML = `<a class="current">${i}</a>`;
    } else {
      pageNum.innerHTML = `<a onclick="selectoneTalkList(${i})">${i}</a>`;
    }
    paginationArea.append(pageNum);
  }

  // 다음 목록으로 이동
  const nextPage = document.createElement("li");
  nextPage.classList.add("arrow-item");
  nextPage.innerHTML = `<a onclick="selectoneTalkList(${pagination.nextPage})" class="arrow-icon">&#8250;</a>`;
  paginationArea.append(nextPage);

  // 마지막 페이지로 이동
  const maxPage = document.createElement("li");
  maxPage.classList.add("arrow-item");
  maxPage.innerHTML = `<a onclick="selectoneTalkList(${pagination.maxPage})" class="arrow-icon">&#8250;&#8250;</a>`;
  paginationArea.append(maxPage);
};

// 페이지 로드 시 첫 페이지 조회
selectoneTalkList();


// -----------------------------------------------------------------------

/* ***** 댓글 등록(ajax) ***** */

const addContent = document.querySelector("#addoneTalk"); // button
const oneTalkContent = document.querySelector("#oneTalkContent"); // textarea

// 댓글 등록 버튼 클릭 시
addContent.addEventListener("click", (e) => {

  // 로그인이 되어있지 않은 경우
  if (loginWorkerNo == null && loginEmployerNo == null) {
    alert("로그인 후 이용해 주세요");
    return; // early return;
  }

  // 댓글 내용이 작성되지 않은 경우
  if (oneTalkContent.value.trim().length == 0) {
    alert("내용 작성 후 등록 버튼을 클릭해 주세요");
    oneTalkContent.focus();
    return;
  }
  const data = {
    oneTalkContent: oneTalkContent.value,
    memberNo: loginMemberNo, // 또는 Session 회원 번호 이용도 가능
  };
  if (loginWorkerNo != null) {
    // ajax를 이용해 댓글 등록 요청
    data.memberNo = loginWorkerNo;

  } else {
    data.memberNo = loginEmployerNo;
  }

  fetch("/oneTalk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // data 객체를 JSON 문자열로 변환
  })
    .then((response) => response.text())
    .then((result) => {
      if (result > 0) {
        alert("댓글이 등록 되었습니다");
        oneTalkContent.value = ""; // 작성한 댓글 내용 지우기
        selectoneTalkList(); // 댓글 목록을 다시 조회해서 화면에 출력
      } else {
        alert("댓글 등록 실패");
      }
    })
    .catch((err) => console.log(err));
});

/** 답글 작성 화면 추가
 * @param {*} parentoneTalkNo
 * @param {*} btn
 */
const showInsertoneTalk = (parentOneTalkNo, btn) => {
  // ** 답글 작성 textarea가 한 개만 열릴 수 있도록 만들기 **
  const temp = document.getElementsByClassName("oneTalkInsertContent");
  // 로그인이 되어있지 않은 경우
  if (loginWorkerNo == null && loginEmployerNo == null) {
    alert("로그인 후 이용해 주세요");
    return; // early return;
  }
  if (temp.length > 0) {
    // 답글 작성 textara가 이미 화면에 존재하는 경우

    if (
      confirm(
        "다른 답글을 작성 중입니다. 현재 댓글에 답글을 작성 하시겠습니까?"
      )
    ) {
      temp[0].nextElementSibling.remove(); // 버튼 영역부터 삭제
      temp[0].remove(); // textara 삭제 (기준점은 마지막에 삭제해야 된다!)
    } else {
      return; // 함수를 종료시켜 답글이 생성되지 않게함.
    }
  }

  // 답글을 작성할 textarea 요소 생성
  const textarea = document.createElement("textarea");
  textarea.classList.add("oneTalkInsertContent");

  // 답글 버튼의 부모의 뒤쪽에 textarea 추가
  // after(요소) : 뒤쪽에 추가
  btn.parentElement.after(textarea);

  // 답글 버튼 영역 + 등록/취소 버튼 생성 및 추가
  const oneTalkBtnArea = document.createElement("div");
  oneTalkBtnArea.classList.add("oneTalk-btn-area");

  const insertBtn = document.createElement("button");
  insertBtn.classList.add("createBtn");
  insertBtn.innerText = "등록";
  insertBtn.setAttribute(
    "onclick",
    "insertChildoneTalk(" + parentOneTalkNo + ", this)"
  );

  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("deleteBtn");
  cancelBtn.innerText = "취소";
  cancelBtn.setAttribute("onclick", "insertCancel(this)");

  // 답글 버튼 영역의 자식으로 등록/취소 버튼 추가
  oneTalkBtnArea.append(insertBtn, cancelBtn);

  // 답글 버튼 영역을 화면에 추가된 textarea 뒤쪽에 추가
  textarea.after(oneTalkBtnArea);
};

// ---------------------------------------

/** 답글 (자식 댓글) 작성 취소
 * @param {*} cancelBtn : 취소 버튼
 */
const insertCancel = (cancelBtn) => {
  // 취소 버튼 부모의 이전 요소(textarea) 삭제
  cancelBtn.parentElement.previousElementSibling.remove();

  // 취소 버튼이 존재하는 버튼영역 삭제
  cancelBtn.parentElement.remove();
};

/** 답글 (자식 댓글) 등록
 * @param {*} parentOneTalkNo : 부모 댓글 번호
 * @param {*} btn  :  클릭된 등록 버튼
 */
const insertChildoneTalk = (parentOneTalkNo, btn) => {
  // 답글 내용이 작성된 textarea
  // 로그인이 되어있지 않은 경우
  if (loginWorkerNo == null && loginEmployerNo == null) {
    alert("로그인 후 이용해 주세요");
    return; // early return;
  }
  const textarea = btn.parentElement.previousElementSibling;

  // 유효성 검사
  if (textarea.value.trim().length == 0) {
    alert("내용 작성 후 등록 버튼을 클릭해 주세요");
    textarea.focus();
    return;
  }

  // ajax를 이용해 댓글 등록 요청
  const data = {
    oneTalkContent: textarea.value,
    memberNo: loginMemberNo, // 또는 Session 회원 번호 이용도 가능
    parentOneTalkNo: parentOneTalkNo, // 부모 댓글 번호
  };

  if (loginEmployerNo != null) {
    data.memberNo = loginEmployerNo;
  };
  if (loginWorkerNo != null) {
    data.memberNo = loginWorkerNo;
  };


  fetch("/oneTalk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), // data 객체를 JSON 문자열로 변환
  })
    .then((response) => response.text())
    .then((result) => {

      // 로그인이 되어있지 않은 경우
    if (loginWorkerNo == null && loginEmployerNo == null) {
    alert("로그인 후 이용해 주세요");
    return; // early return;
    }
      
      if (result > 0) {
        alert("답글이 등록 되었습니다");
        selectoneTalkList(); // 댓글 목록을 다시 조회해서 화면에 출력
      } else {
        alert("답글 등록 실패");
      }
    })
    .catch((err) => console.log(err));
};

// --------------------------------------------------

/** 댓글 삭제
 * @param {*} oneTalkNo
 */
const deleteoneTalk = (oneTalkNo) => {
  // 취소 선택 시
  if (!confirm("삭제 하시겠습니까?")) return;

  fetch("/oneTalk", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: oneTalkNo,
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result > 0) {
        alert("삭제 되었습니다");
        selectoneTalkList(); // 다시 조회해서 화면 다시 만들기
      } else {
        alert("삭제 실패");
      }
    })
    .catch((err) => console.log(err));
};

// ----------------------------------

// 수정 취소 시 원래 댓글 형태로 돌아가기 위한 백업 변수
let beforeoneTalkRow;

/** 댓글 수정 화면 전환
 * @param {*} oneTalkNo
 * @param {*} btn
 */
const showUpdateoneTalk = (oneTalkNo, btn) => {
  /* 댓글 수정 화면이 1개만 열릴 수 있게 하기 */
  const temp = document.querySelector(".update-textarea");

  // .update-textarea 존재 == 열려있는 댓글 수정창이 존재
  if (temp != null) {
    if (confirm("수정 중인 댓글이 있습니다. 현재 댓글을 수정 하시겠습니까?")) {
      const oneTalkRow = temp.parentElement; // 기존 댓글 행
      oneTalkRow.after(beforeoneTalkRow); // 기존 댓글 다음에 백업 추가
      oneTalkRow.remove(); // 기존 삭제 -> 백업이 기존 행 위치로 이동
    } else {
      // 취소
      return;
    }
  };

  // -------------------------------------------

  // 1. 댓글 수정이 클릭된 행 (.oneTalk-row) 선택
  const oneTalkRow = btn.closest("li");

  // 2. 행 전체를 백업(복제)
  // 요소.cloneNode(true) : 요소 복제,
  //           매개변수 true == 하위 요소도 복제
  beforeoneTalkRow = oneTalkRow.cloneNode(true);
  // console.log(beforeoneTalkRow);

  // 3. 기존 댓글에 작성되어 있던 내용만 얻어오기
  let beforeContent = oneTalkRow.children[1].innerText;

  // 4. 댓글 행 내부를 모두 삭제
  oneTalkRow.innerHTML = "";

  // 5. textarea 생성 + 클래스 추가 + 내용 추가
  const textarea = document.createElement("textarea");
  textarea.classList.add("update-textarea");
  textarea.value = beforeContent;

  // 6. 댓글 행에 textarea 추가
  oneTalkRow.append(textarea);

  // 7. 버튼 영역 생성
  const oneTalkBtnArea = document.createElement("div");
  oneTalkBtnArea.classList.add("oneTalk-btn-area");

  // 8. 수정 버튼 생성
  const updateBtn = document.createElement("button");
  updateBtn.classList.add("updateBtn");
  updateBtn.innerText = "수정";
  updateBtn.setAttribute("onclick", `updateoneTalk(${oneTalkNo}, this)`);

  // 9. 취소 버튼 생성
  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("deleteBtn");
  cancelBtn.innerText = "취소";
  cancelBtn.setAttribute("onclick", "updateCancel(this)");

  // 10. 버튼 영역에 수정/취소 버튼 추가 후
  //     댓글 행에 버튼 영역 추가
  oneTalkBtnArea.append(updateBtn, cancelBtn);
  oneTalkRow.append(oneTalkBtnArea);
};

// --------------------------------------------------------------------

/** 댓글 수정 취소
 * @param {*} btn : 취소 버튼
 */
const updateCancel = (btn) => {
  if (confirm("취소 하시겠습니까?")) {
    const oneTalkRow = btn.closest("li"); // 기존 댓글 행
    oneTalkRow.after(beforeoneTalkRow); // 기존 댓글 다음에 백업 추가
    oneTalkRow.remove(); // 기존 삭제 -> 백업이 기존 행 위치로 이동
  }
};

// ----------------------------------------------------------

/** 댓글 수정
 * @param {*} oneTalkNo : 수정할 댓글 번호
 * @param {*} btn       : 클릭된 수정 버튼
 */
const updateoneTalk = (oneTalkNo, btn) => {
  // 수정된 내용이 작성된 textarea 얻어오기
  const textarea = btn.parentElement.previousElementSibling;

  // 유효성 검사
  if (textarea.value.trim().length == 0) {
    alert("댓글 작성 후 수정 버튼을 클릭해 주세요");
    textarea.focus();
    return;
  }

  // 댓글 수정 (ajax)
  const data = {
    oneTalkNo: oneTalkNo,
    oneTalkContent: textarea.value,
  };

  fetch("/oneTalk", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result > 0) {
        alert("댓글이 수정 되었습니다");
        selectoneTalkList();
      } else {
        alert("댓글 수정 실패");
      }
    })
    .catch((err) => console.log(err));
};