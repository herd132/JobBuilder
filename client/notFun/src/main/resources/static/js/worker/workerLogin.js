console.log("login.js와 연결됨");
const workerLoginForm = document.querySelector("#workerLoginForm");
const workerLoginId = document.querySelector("input[name='workerId']");
const workerLoginPw = document.querySelector("input[name='memberPw']");


if(workerLoginForm != null) {
  workerLoginForm.addEventListener("submit", (e) => {
    if(workerLoginId.value.trim().length === 0){
      alert("아이디를 작성해 주세요!!");
      e.preventDefault();
      workerLoginId.focus();
      return;
    }
  
    if(workerLoginPw.value.trim().length === 0){
      alert("비밀번호를 작성해 주세요!!");
      e.preventDefault();
      workerLoginPw.focus();
      return;
    }
  });
}

/* ********** 쿠키(아이디 저장) 활용 ********** */
const getCookie = (key) => {
  const cookies = document.cookie;
  console.log(cookies);
  const cookiArray = cookies.split("; ").map(el => el.split("="));
  const obj = {};

  for(let i=0; i<cookiArray.length; i++){
    const k = cookiArray[i][0];
    const v = cookiArray[i][1];
    obj[k] = v;
  }

  return obj[key];
}

if(workerLoginId != null) {
  const saveWorkerId = getCookie("saveWorkerId");

  if(saveWorkerId != undefined){
    workerLoginId.value = saveWorkerId;
    document.querySelector("input[name='saveWorkerId']").checked = true;
  };
  
}



// 카카오톡 로그인
function loginWithKakao() {
  Kakao.Auth.authorize({
    redirectUri: 'http://localhost:8080/auth/login/kakao'
  });
};

