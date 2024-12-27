console.log("login.js와 연결됨");
const loginForm = document.querySelector("#loginForm");
const loginId = document.querySelector("input[name='workerId']");
const loginPw = document.querySelector("input[name='memberPw']");

loginForm.addEventListener("submit", e => {
  if(loginId.value.trim().length === 0){
    alert("아이디를 작성해 주세요!!");
    e.preventDefault();
    loginId.focus();
    return;
  }

  if(loginPw.value.trim().length === 0){
    alert("비밀번호를 작성해 주세요!!");
    e.preventDefault();
    loginPw.focus();
    return;
  }
});

/* ********** 쿠키(이메일 저장) 활용 ********** */
const getCookie = (key) => {
  const cookies = document.cookie;
  const cookiArray = cookies.split("; ").map(el => el.split("="));
  const obj = {};

  for(let i=0; i<cookiArray.length; i++){
    const k = cookiArray[i][0];
    const v = cookiArray[i][1];
    obj[k] = v;
  }

  return obj[key];
}

const saveId = getCookie("saveId");
if(saveId != undefined){
  loginId.value = saveId;
  document.querySelector("input[name='saveId']").checked = true;
}

// 카카오톡 로그인

function loginWithKakao() {
  Kakao.Auth.authorize({
    redirectUri: 'https://developers.kakao.com/tool/demo/oauth',
  });
}

// 아래는 데모를 위한 UI 코드입니다.
displayToken()
function displayToken() {
  var token = getCookie('authorize-access-token');

  if(token) {
    Kakao.Auth.setAccessToken(token);
    Kakao.Auth.getStatusInfo()
      .then(function(res) {
        if (res.status === 'connected') {
          document.getElementById('token-result').innerText
            = 'login success, token: ' + Kakao.Auth.getAccessToken();
        }
      })
      .catch(function(err) {
        Kakao.Auth.setAccessToken(null);
      });
  }
}