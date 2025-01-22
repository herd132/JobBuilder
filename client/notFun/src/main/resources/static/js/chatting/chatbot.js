let chattingSock;
let loginMemberNo;
let selectTargetNo;
let selectChattingNo;

const chatbotModal = document.getElementById('chatbotModal');
const dragHandle = chatbotModal.querySelector('.chatbot-header'); // 상단 전체를 드래그 핸들로 변경
const sendBtn = chatbotModal.querySelector('.send-btn');

const chatMessages = chatbotModal.querySelector('.chat-messages'); // 채팅 메세지 표시되는 곳
const inputField = chatbotModal.querySelector('.chat-input input');


let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

// 봇 메세지 설정
function sendBotMessage() {
  const answer = event.target.getAttribute("answer");

  addMessage('user', event.target.innerHTML);
  setTimeout(() => {
    addMessage('bot', answer);
  }, 300);

}

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

inputField.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

// 상담원 연결 이벤트
const counselorConnection = async () => {

  

  const resp = await fetch("/chat/enter")
  const chattingRoom = await resp.json();
  
  if (chattingRoom == null) {
    alert("에러발생")
    return;
  }

  loginMemberNo = chattingRoom.loginMemberNo;
  selectTargetNo = chattingRoom.targetNo;
  selectChattingNo = chattingRoom.chattingRoomNo;
  inputField.disabled = null;

  chattingSock = new SockJS("/chatSock");

  chattingSock.onopen = (e) => {
    console.log("연결");
    var obj = {
      "senderNo": selectTargetNo,
      "targetNo": loginMemberNo,
      "chattingRoomNo": selectChattingNo,
      "messageContent": '상담원 분과 연결 중에 있습니다 잠시 기다려주시기 바랍니다. 연결 중 채팅창을 종료하거나 새로고침을 진행 할 시 연결이 끊기니 그 점에 유의해주시기 바랍니다.',
    };
    chattingSock.send(JSON.stringify(obj));

    const quickButtons = chatbotModal.querySelectorAll('.quick-buttons button'); // 빠른 상담 버튼들
    quickButtons.forEach((button, i) => {

      if (i == quickButtons.length - 1 ) return;

      button.removeEventListener('click', sendBotMessage);
    });

    
    const counselor = document.querySelector(".counselor");

    counselor.removeEventListener("click", counselorConnection);
  }
  
  // 상담원이 종료시 일어나는 이벤트
  chattingSock.onclose = (e) => {
    inputField.disabled = true;
    console.log(e.code, e.wasClean);
    addMessage('bot', '상담을 종료합니다.');
  }

  

  chattingSock.onmessage = (e) => {

    const msg = JSON.parse(e.data);

    console.log(msg);
    const type = loginMemberNo == msg.senderNo ? 'user' : 'bot';
    addMessage(type, msg.messageContent);
    
  }

  sendBtn.addEventListener('click', sendMessage);

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
  chatMessages.scrollTop = chatMessages.scrollHeight;
}


document.addEventListener("DOMContentLoaded", () => {

  // 챗봇 렌더링
  fetch("/chat/chatBotMessgeList")
  .then(resp => resp.json())
  .then(chatMessages => {
    const messageBot = document.querySelector(".message");

    let str = `
    <div class="message-avatar">
        <i class="fas fa-robot"></i>
    </div>
    <div class="message-content">
        안녕하세요! 무엇을 도와드릴까요?
        <div class="quick-buttons">
    `
    for(let message of chatMessages) {
      str += `<button answer="${message.quickAnswer}">${message.quickQuestions}</button>`
    }
    str += `<button class="counselor">상담원 연결</button>
        </div>
    </div> 
    `

    messageBot.innerHTML = str;


    const quickButtons = chatbotModal.querySelectorAll('.quick-buttons button'); // 빠른 상담 버튼들
    quickButtons.forEach((button, i) => {

      if (i == quickButtons.length - 1 ) return;

      button.addEventListener('click', sendBotMessage);
    });

    
    const counselor = document.querySelector(".counselor");

    counselor.addEventListener("click", counselorConnection);

  })
})