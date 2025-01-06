const navMypage = document.querySelector(".nav-mypage");
let selectChattingNo; // 선택한 채팅방 번호
let selectTargetNo; // 현재 채팅 대상
let selectTargetName; // 대상의 이름
let loginMemberNo;


if (navMypage !== null) {

  document.querySelector("body").addEventListener("click", e => {

    if (e.target === document.querySelector(".fa-chevron-down ") || e.target === document.querySelector(".nav-nickname")) {

      navMypage.classList.remove("hidden");

    } else if (e.target !== navMypage) {

      navMypage.classList.add("hidden");
    }
  })
  
}

const customerServiceLink = document.querySelector('.chatting-bot');
let popupWindow;

if (customerServiceLink !== null) {
  // 고객센터 클릭 시 모달 표시
  customerServiceLink.addEventListener('click', (e) => {
    console.log("됨");
    fetch("/chat/loginCheck")
      .then(resp => resp.text())
      .then(result => {

        if (result == 0) {

          alert("로그인 후 이용해 주시기 바랍니다.")
          return;
        } else {
          
          const url = "/chat/bot";
          const name = "chatBot";
          const options = 'width=400px, height=550px, top=50, left=50, scrollbars=yes, toolbar=no, resizable=false, location=no';
  
          // 창이 이미 열려 있다면 새로고침 방지
          if (popupWindow && !popupWindow.closed) {

              popupWindow.focus(); // 창 활성화

          } else {
              // 새 창 열기
              popupWindow = window.open(url, name, options);

          }
        }

      });
    });
}

const searchBtn = document.querySelector(".search-btn");

if( searchBtn !== null ) {
  searchBtn.addEventListener("click", () => {
    const originalPushState = history.pushState;
    originalPushState();
  });
}

// const links = document.querySelectorAll("a");

// for( let link of links) {
//   link.addEventListener("click", test)
// }



// // 1:1 문의 로그인 안 했을 시 경고 이벤트
// const inquiry = document.querySelector(".inquiry");

// if( inquiry !== null ) {
//   inquiry.addEventListener("click", (e) => {
//     let test = 1;
//     fetch("/chat/loginCheck")
//     .then(resp => resp.text())
//     .then(result => {

//       if (result == 0) {
//         alert("로그인 후 이용해 주시기 바랍니다.");
        
//       }
//     });
//   });
// }


const empLogin = (email) => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/employer/employerLogin';

  const inputMemberEmail = document.createElement('input');
  inputMemberEmail.type = 'hidden'; // 사용자에게 보이지 않게
  inputMemberEmail.name = 'memberEmail';
  inputMemberEmail.value = email;
  form.appendChild(inputMemberEmail);

  const inputMemberPw = document.createElement('input');
  inputMemberPw.type = 'hidden';
  inputMemberPw.name = 'memberPw';
  inputMemberPw.value = 'pass01!';
  form.appendChild(inputMemberPw);

  document.body.appendChild(form);
  form.submit();
}

const empLogin3 = () => {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/worker/workerLogin';

  const inputMemberEmail = document.createElement('input');
  inputMemberEmail.type = 'hidden'; // 사용자에게 보이지 않게
  inputMemberEmail.name = 'workerId';
  inputMemberEmail.value = '123';
  form.appendChild(inputMemberEmail);

  const inputMemberPw = document.createElement('input');
  inputMemberPw.type = 'hidden';
  inputMemberPw.name = 'memberPw';
  inputMemberPw.value = '123';
  form.appendChild(inputMemberPw);

  document.body.appendChild(form);
  form.submit();
}