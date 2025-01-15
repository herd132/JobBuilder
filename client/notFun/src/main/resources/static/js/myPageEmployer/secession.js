const secession = document.querySelector("#secession");   // form 태그

secession.addEventListener("submit", async e => {

  e.preventDefault();

  const memberPw = document.querySelector("#memberPw");   // input 태그
  const agree = document.querySelector("#agree")          // input 태그(checkbox)

  if (memberPw.value.trim().length == 0) {    // 비밀번호 미입력 시
    alert("비밀번호를 입력해주세요.");
    memberPw.focus();
    return;
  }

  if (!agree.checked) {     // 약관 동의 체크 안됐을 때 (checkbox or radio)
    alert("약관에 동의해주세요");
    return;
  }
  
  // 탈퇴 재확인
  if (!confirm("정말 탈퇴 하시겠습니까?")) {
    alert("취소 되었습니다.");
    return;
  }

  const resp = await fetch("/myPageEmp/checkCurrentPw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPw: memberPw.value })
  });

  const count = await resp.text();
  if(count == 0){
    alert("비밀번호가 일치하지 않습니다");
    return;
  }

  secession.submit();
})