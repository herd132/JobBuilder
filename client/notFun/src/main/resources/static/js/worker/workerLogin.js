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
    redirectUri: 'https://kauth.kakao.com/oauth/authorize',
  });
}


Kakao.init('420e37e2eb7b21d415137a0ef5b387a2'); //발급받은 키 중 javascript키를 사용해준다.
//console.log(Kakao.isInitialized()); // sdk초기화여부판단
//카카오로그인 시 API 이용하여 정보 받아오기 - 02.10 장재호
//naverCallback.jsp와 같은 형식이니 참조하세요
function kakaoLogin() {
    Kakao.Auth.login({
      success: function (response) {
        Kakao.API.request({
          url: '/v2/user/me',
          success: function (response) {
        	  console.log(response);
        	  const id = response.id;
        	  const nickname = response.properties.nickname;
        	  const email = response.kakao_account.email;
        	  $.ajax({
        		  type : 'post',
        		  url : 'user/kakaoLogin',
        		  data : {"id" : id, "nickname" : nickname, "email" : email},
        		  dataType : 'text',
        		  success: function(result){
        			  if(result=="ok"){
        				  var newNickname = prompt('사용하실 닉네임을 입력해주세요');
        				  if(newNickname != null){
        					  $.ajax({
        						  type : 'post',
        						  url : 'kakaoSignUp',
        						  data : {"id" : id, "nickname" : newNickname, "email": email}
        					  });
        					  alert(newNickname + "님 환영합니다.");
        					  location.href = "/video/list";
        				  }
        				  else{
        					  location.href = "/user/signin";
        				  }
        			  }
        			  else{
        				  $.ajax({
        					  url : '/user/kakaoLogins',
        					  data : {"id" : id},
        					  dataType : 'text',
        					  type : 'post',
        					  success : function(data){
        						  console.log(data);
                				  alert(data + "님 반갑습니다.")
                				  location.href = "/video/list";
        					  }
        				  })

        			  }
        		  }
        		  
        	  })
          },
          fail: function (error) {
            console.log(error)
          },
        })
      },
      fail: function (error) {
        console.log(error)
      },
    })
  }