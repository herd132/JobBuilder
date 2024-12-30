const navMypage = document.querySelector(".nav-mypage");

if( navMypage !== null ) {

  document.querySelector("body").addEventListener("click", e => {


    if (e.target === document.querySelector(".fa-chevron-down ") || e.target === document.querySelector(".nav-nickname")) {
  
      navMypage.classList.remove("hidden");
  
    } else if (e.target !== navMypage) {
      
      navMypage.classList.add("hidden");
    }
  })

}

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
          }
        });

        e.preventDefault();
        chatbotModal.classList.add('active');
        chatbotModal.style.right = '20px';
        chatbotModal.style.top = '20px'; // 초기 위치
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

  quickButtons.forEach(button => {
      button.addEventListener('click', () => {
          addMessage('user', button.textContent);
          setTimeout(() => {
              addMessage('bot', `${button.textContent}에 대해 답변드리겠습니다...`);
          }, 500);
      });
  });

  const sendBtn = chatbotModal.querySelector('.send-btn');
  const inputField = chatbotModal.querySelector('.chat-input input');

  sendBtn.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          sendMessage();
      }
  });

  function sendMessage() {
      const message = inputField.value.trim();
      if (message) {
          addMessage('user', message);
          inputField.value = '';
          setTimeout(() => {
              addMessage('bot', '문의하신 내용을 확인하고 있습니다...');
          }, 500);
      }
  }

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