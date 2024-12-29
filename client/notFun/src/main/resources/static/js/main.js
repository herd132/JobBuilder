const navMypage = document.querySelector(".nav-mypage");
let selectChattingNo; // 선택한 채팅방 번호
let selectTargetNo; // 현재 채팅 대상
let selectTargetName; // 대상의 이름
let loginMemberNo;

if( navMypage !== null ) {

  document.querySelector("body").addEventListener("click", e => {


    if (e.target === document.querySelector(".fa-chevron-down ") || e.target === document.querySelector(".nav-nickname")) {
  
      navMypage.classList.remove("hidden");
  
    } else if (e.target !== navMypage) {
      
      navMypage.classList.add("hidden");
    }
  })

}

let chattingSock;

document.addEventListener('DOMContentLoaded', () => {
  
  const chatbotModal = document.getElementById('chatbotModal');
  const closeBtn = chatbotModal.querySelector('.close-btn');
  const dragHandle = chatbotModal.querySelector('.chatbot-header'); // 상단 전체를 드래그 핸들로 변경
  const customerServiceLink = document.querySelector('.chatting-bot');

  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  if(customerServiceLink !== null ) {
      // 고객센터 클릭 시 모달 표시
      customerServiceLink.addEventListener('click', (e) => {

        fetch("/chat/loginCheck")
        .then(resp => resp.text())
        .then(result => {
          
          if( result == 0 ) {
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
      chatbotModal.classList.remove('active');
  });

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


  
  // 빠른 응답 버튼 및 메시지 전송 기능 (기존 코드 유지)
  const quickButtons = chatbotModal.querySelectorAll('.quick-buttons button');
  const chatMessages = chatbotModal.querySelector('.chat-messages');

  let i = 1;

  quickButtons.forEach(button => {

    if ( i == 4) return;
    
    button.setAttribute("test", "test" + i++);
    button.addEventListener('click', sendBotMessage);
  });
  
  // 봇 메세지 설정
  function sendBotMessage() {

    const answer = event.target.getAttribute("answer");

    addMessage('user', answer);
    setTimeout(() => {
        addMessage('bot', answer + "에 대해 답변드리겠습니다...");
    }, 500);

  }

  const sendBtn = chatbotModal.querySelector('.send-btn');
  const inputField = chatbotModal.querySelector('.chat-input input');

  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
  });

  // function botMessage() {
  //     const message = inputField.value.trim();
  //     if (message) {
  //         addMessage('user', message);
  //         inputField.value = '';
  //         setTimeout(() => {
  //             addMessage('bot', '문의하신 내용을 확인하고 있습니다...');
  //         }, 500);
  //     }
  // }


  // 상담원 연결 이벤트
  const counselorConnection = () => {
  
    const quickButtons = chatbotModal.querySelectorAll('.quick-buttons button');

    let i = 1;
  
    quickButtons.forEach(button => {
  
      if ( i == 4) return;
  
      button.setAttribute("test", "test<br><br><br>" + i++);
      button.removeEventListener('click', sendBotMessage);
    });

    fetch("/chat/enter")
    .then(resp => resp.json())
    .then(chattingRoom => {

      if( chattingRoom != null ) {
        alert("에러발생")
        return;
      }

      chattingSock = new SockJS("/chatSock");

      addMessage('bot', "상담원 분과 연결 중에 있습니다 잠시 기다려주시기 바랍니다.");
      loginMemberNo = chattingRoom.loginMemberNo;
      selectTargetNo = chattingRoom.targetNo;
      selectChattingNo = chattingRoom.chattingRoomNo;
      inputField.readOnly = null;
    });
  }

  const counselor = document.querySelector(".counselor");
  
  counselor.addEventListener("click", counselorConnection);

  /** 메세지 입력 시 이벤트
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
});

// 전송 시 이벤트
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

// 소켓에서 일어나는 메세지 송수신 이벤트
chattingSock.onmessage = function (e) {
	// 메소드를 통해 전달받은 객체값을 JSON객체로 변환해서 obj 변수에 저장.
	const msg = JSON.parse(e.data);
	console.log(msg);

	// 현재 채팅방을 보고있는 경우
	if (selectChattingNo == msg.chattingRoomNo) {
		const container = document.getElementById('messageContainer');

			container.innerHTML += `
					<div class="message ${msg.senderNo === loginMemberNo ? 'sent' : 'received'}">
							<div>${msg.messageContent}</div>
							<div class="timestamp">${msg.sendTime}</div>
					</div>`

			container.scrollTop = container.scrollHeight;

	}
}