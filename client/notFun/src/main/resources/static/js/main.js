const navMypage = document.querySelector(".nav-mypage");
let selectChattingNo; // 선택한 채팅방 번호
let selectTargetNo; // 현재 채팅 대상
let selectTargetName; // 대상의 이름
let loginMemberNo;

const quickButtons = chatbotModal.querySelectorAll('.quick-buttons button'); // 빠른 상담 버튼들
const chatMessages = chatbotModal.querySelector('.chat-messages'); // 채팅 메세지 표시되는 곳
const inputField = chatbotModal.querySelector('.chat-input input');

if (navMypage !== null) {

  document.querySelector("body").addEventListener("click", e => {


    if (e.target === document.querySelector(".fa-chevron-down ") || e.target === document.querySelector(".nav-nickname")) {

      navMypage.classList.remove("hidden");

    } else if (e.target !== navMypage) {

      navMypage.classList.add("hidden");
    }
  })

}

let chattingSock = null;

document.addEventListener('DOMContentLoaded', () => {

  const chatbotModal = document.getElementById('chatbotModal');
  const closeBtn = chatbotModal.querySelector('.close-btn');
  const dragHandle = chatbotModal.querySelector('.chatbot-header'); // 상단 전체를 드래그 핸들로 변경
  const customerServiceLink = document.querySelector('.chatting-bot');

  const sendBtn = chatbotModal.querySelector('.send-btn');

  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if (customerServiceLink !== null) {
    // 고객센터 클릭 시 모달 표시
    customerServiceLink.addEventListener('click', (e) => {

      fetch("/chat/loginCheck")
        .then(resp => resp.text())
        .then(result => {

          if (result == 0) {
            alert("로그인 후 이용해 주시기 바랍니다.")
            return;
          } else {
            e.preventDefault();
            chatbotModal.classList.add('active');
            chatbotModal.style.right = '20px';
            chatbotModal.style.top = '20px'; // 초기 위치
          }

        });
    });
  }

  // 모달 닫기
  closeBtn.addEventListener('click', () => {
    if (chattingSock !== null) chattingSock.close();
    inputField.value = '';
    inputField.readOnly =true;
    chatbotModal.classList.remove('active');
  });

  // 봇 메세지 설정
  function sendBotMessage() {

    const answer = event.target.getAttribute("answer");
    console.log(answer);

    addMessage('user', answer);
    setTimeout(() => {
      addMessage('bot', answer + "에 대해 답변드리겠습니다...");
    }, 300);

  }

  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // 상담원 연결 이벤트
  const counselorConnection = () => {

    const quickButtons = chatbotModal.querySelectorAll('.quick-buttons button');

    let i = 1;

    quickButtons.forEach(button => {

      if (i == 4) return;

      button.setAttribute("test", "test<br><br><br>" + i++);
      button.removeEventListener('click', sendBotMessage);
    });

    fetch("/chat/enter")
      .then(resp => resp.json())
      .then(chattingRoom => {

        if (chattingRoom == null) {
          alert("에러발생")
          return;
        }

        chattingSock = new SockJS("/chatSock");

        addMessage('bot', "상담원 분과 연결 중에 있습니다 잠시 기다려주시기 바랍니다.");
        loginMemberNo = chattingRoom.loginMemberNo;
        selectTargetNo = chattingRoom.targetNo;
        selectChattingNo = chattingRoom.chattingRoomNo;
        inputField.disabled = null;

        // 상담원이 종료시 일어나는 이벤트
        chattingSock.onclose = (e) => {
          inputField.disabled = true;
          console.log(e.code, e.wasClean);
          addMessage('bot', '상담을 종료합니다.');
        }
    
        chattingSock.onmessage = (e) => {
    
          const msg = JSON.parse(e.data);
    
          console.log(msg);
          const type = loginMemberNo == msg.senderNo ? 'user' : 'bot' ;
          addMessage(type, msg.messageContent);
        }
      });

  }

  const counselor = document.querySelector(".counselor");

  counselor.addEventListener("click", counselorConnection);



  // 드래그 기능
  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmousemove = elementDrag;
    document.onmouseup = closeDragElement;
  }

  function elementDrag(e) {
    e.preventDefault();
    const modal = chatbotModal;

    // 새로운 위치 계산
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // 모달의 새 위치 계산
    let newTop = modal.offsetTop - pos2;
    let newLeft = modal.offsetLeft - pos1;

    // 화면 경계 확인
    const boundary = {
      top: 0,
      left: 0,
      right: window.innerWidth - modal.offsetWidth,
      bottom: window.innerHeight - modal.offsetHeight,
    };

    // 화면 밖으로 나가지 않도록 제한
    if (newTop < boundary.top) newTop = boundary.top;
    if (newLeft < boundary.left) newLeft = boundary.left;
    if (newTop > boundary.bottom) newTop = boundary.bottom;
    if (newLeft > boundary.right) newLeft = boundary.right;

    // 위치 적용
    modal.style.top = newTop + "px";
    modal.style.left = newLeft + "px";

    // transform 초기화
    modal.style.transform = 'none';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  // 드래그 이벤트 리스너 추가
  dragHandle.onmousedown = dragMouseDown;

  let i = 1;

  quickButtons.forEach(button => {

    if (i == 4) return;

    button.setAttribute("answer", "test" + i++);
    button.addEventListener('click', sendBotMessage);
  });


});

// 채팅 전송 이벤트
const sendMessage = () => {

  const inputField = chatbotModal.querySelector('.chat-input input');

  if (inputField.value.trim().length == 0) {
    alert("채팅을 입력해주세요.");
    inputField.value = "";
  } else {
    var obj = {
      "senderNo": loginMemberNo,
      "targetNo": selectTargetNo,
      "chattingRoomNo": selectChattingNo,
      "messageContent": inputField.value,
    };

    // JSON.stringify() : 자바스크립트 객체를 JSON 문자열로 변환
    chattingSock.send(JSON.stringify(obj));

    inputField.value = "";
  }
}

/** 소켓에서 응답이 있을때 상용
 * 
 * @param {*} type (user, bot) 
 * @param {*} content (입력창 내용용)
 */
function addMessage(type, content) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  const html = type === 'bot'
    ? `<div class="message-avatar"><i class="fas fa-robot"></i></div>
        <div class="message-content">${content}</div>`
    : `<div class="message-content">${content}</div>
        <div class="message-avatar"><i class="fas fa-user"></i></div>`;
  messageDiv.innerHTML = html;
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTo
  p = chatMessages.scrollHeight;
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
