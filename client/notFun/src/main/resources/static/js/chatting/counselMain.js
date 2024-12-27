// console.log("됨");
// // Sample data
// const chatUsers = [
//     { id: 1, name: "짱구", message: "네 그럼 상담을 종료 하..", time: "오후 22:00" },
//     { id: 2, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" },
//     { id: 3, name: "짱구", message: "그 방식으로는 답변을 드..", time: "오후 22:00" },
//     { id: 4, name: "짱구", message: "네 고객님 문의을 도..", time: "오후 22:00" },
//     { id: 5, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" },
//     { id: 5, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" },
//     { id: 5, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" },
//     { id: 5, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" },
//     { id: 5, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" },
//     { id: 5, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" }
// ];

// const chatMessages = {
//     1: [
//         { text: "회원 빌레에 대한 답변 하는중", sent: false, time: "오후 22:00" },
//         { text: "해결 되었습니다.", sent: true, time: "오후 22:00" },
//         { text: "다른 문의 사항은 없으신가요?", sent: false, time: "오후 22:00" },
//         { text: "아니 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "네 그럼 상담을 종료하도록 하겠습니다.", sent: false, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
//         { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" }
//     ],
//     2: [
//         { text: "어떤 문제가 있으신가요?", sent: false, time: "오후 22:00" },
//         { text: "이게 왜 이런건지 모르겠어요", sent: true, time: "오후 22:00" }
//     ]
// };

// let currentChatId = null;

// function renderChatUsers() {
//     const container = document.getElementById('chatUsers');
//     container.innerHTML = chatUsers.map(user => `
//         <div class="chat-item" onclick="selectChat(${user.id})">
//             <div class="chat-preview">
//                 <img src="/images/avatar.png" alt="User" class="user-avatar">
//                 <div>
//                     <div>${user.name}</div>
//                     <div style="color: #543A14; font-size: 0.9em;">${user.message}</div>
//                     <div class="timestamp">${user.time}</div>
//                 </div>
//             </div>
//         </div>
//     `).join('');
// }

// function renderMessages() {
//     const container = document.getElementById('messageContainer');

//     const messages = chatMessages[currentChatId] || [];
//     container.innerHTML = messages.map(msg => `
//         <div class="message ${msg.sent ? 'sent' : 'received'}">
//             <div>${msg.text}</div>
//             <div class="timestamp">${msg.time}</div>
//         </div>
//     `).join('');
//     container.scrollTop = container.scrollHeight;
// }

// function sendMessage() {
//     if (!currentChatId) return;
    
//     const input = document.getElementById('messageInput');
//     if (input.value.trim()) {
//         if (!chatMessages[currentChatId]) {
//             chatMessages[currentChatId] = [];
//         }
//         chatMessages[currentChatId].push({
//             text: input.value,
//             sent: false,
//             time: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true })
//         });
//         input.value = '';
//         renderMessages();
//     }
// }

// function selectChat(id) {
//     currentChatId = id;
//     document.querySelectorAll('.chat-item').forEach(item => {
//         item.classList.remove('active');
//     });
//     event.currentTarget.classList.add('active');
//     const selectedUser = chatUsers.find(user => user.id === id);
//     document.getElementById('chatTitle').textContent = `${selectedUser.name}님과의 대화`;
//     renderMessages();
// }

// renderChatUsers();
// // renderMessages();

// document.getElementById('messageInput').addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//         sendMessage();
//     }
// });

let selectChattingNo; // 선택한 채팅방 번호
let selectTargetNo; // 현재 채팅 대상
let selectTargetName; // 대상의 이름

// 채팅방 전체에 이벤트 추가
function roomListAddEvent(){
	const chattingItemList = document.getElementsByClassName("chat-item");
	
	for(let item of chattingItemList){
		item.addEventListener("click", e => {


			// 액티브 클래스 없애기
			document.querySelectorAll('.chat-item').forEach(item => {
					item.classList.remove('active');
			});

			// 액티브 클래스 추가
			e.currentTarget.classList.add('active');
			// 전역변수에 채팅방 번호, 상대 번호, 상태 프로필, 상대 이름 저장
			selectChattingNo = item.getAttribute("chat-no");
			selectTargetNo = item.getAttribute("target-no");
			selectTargetName = item.children[0].children[0].children[1].children[0].innerText;

			document.querySelector("#chatTitle").innerText = selectTargetName + "님과의 상담";

			if(item.children[0].children[1] != undefined){
				item.children[0].children[1].remove();
			}
	
			// 모든 채팅방에서 select 클래스를 제거
			for(let it of chattingItemList) it.classList.remove("select")
	
			// 현재 클릭한 채팅방에 select 클래스 추가
			item.classList.add("select");
	
			// 비동기로 메세지 목록을 조회하는 함수 호출
			selectChattingFn();
		});
	}
}


function selectChattingFn() {

	fetch("/chat/selectMessage?"+`chattingRoomNo=${selectChattingNo}&memberNo=${loginMemberNo}`)
	.then(resp => resp.json())
	.then(messageList => {
		console.log(messageList);

        const container = document.getElementById('messageContainer');

		container.innerHTML = ""; // 이전 내용 지우기

			container.innerHTML = messageList.map(msg => `
					<div class="message ${msg.loginMemberNo === loginMemberNo ? 'sent' : 'received'}">
							<div>${msg.messageContent}</div>
							<div class="timestamp">${msg.sendTime}</div>
					</div>
			`).join('');

        container.scrollTop = container.scrollHeight;

	})
	.catch(err => console.log(err));

}

const send = document.querySelector(".send");

let chattingSock;

if(loginMemberNo != ""){
	chattingSock = new SockJS("/chatSock");
}

const sendMessage = () => {
	const messageInput = document.getElementById("messageInput");

	if (messageInput.value.trim().length == 0) {
		alert("채팅을 입력해주세요.");
		messageInput.value = "";
	} else {
		var obj = {
			"senderNo": loginMemberNo,
			"targetNo": selectTargetNo,
			"chattingRoomNo": selectChattingNo,
			"messageContent": messageInput.value,
		};	
		console.log(obj)

		// JSON.stringify() : 자바스크립트 객체를 JSON 문자열로 변환
		chattingSock.send(JSON.stringify(obj));

		messageInput.value = "";
	}
}

chattingSock.onmessage = function(e) {
	// 메소드를 통해 전달받은 객체값을 JSON객체로 변환해서 obj 변수에 저장.
	const msg = JSON.parse(e.data);
	console.log(msg);


	// // 현재 채팅방을 보고있는 경우
	// if(selectChattingNo == msg.chattingRoomNo){


	// 	const ul = document.querySelector(".display-chatting");
	
	// 	// 메세지 만들어서 출력하기
	// 	//<li>,  <li class="my-chat">
	// 	const li = document.createElement("li");
	
	// 	// 보낸 시간
	// 	const span = document.createElement("span");
	// 	span.classList.add("chatDate");
	// 	span.innerText = msg.sendTime;
	
	// 	// 메세지 내용
	// 	const p = document.createElement("p");
	// 	p.classList.add("chat");
	// 	p.innerHTML = msg.messageContent; // br태그 해석을 위해 innerHTML
	
	// 	// 내가 작성한 메세지인 경우
	// 	if(loginMemberNo == msg.senderNo){ 
	// 		li.classList.add("my-chat");
			
	// 		li.append(span, p);
			
	// 	}else{ // 상대가 작성한 메세지인 경우
	// 		li.classList.add("target-chat");
	
	// 		// 상대 프로필
	// 		// <img src="/resources/images/user.png">
	// 		const img = document.createElement("img");
	// 		img.setAttribute("src", selectTargetProfile);
			
	// 		const div = document.createElement("div");
	
	// 		// 상대 이름
	// 		const b = document.createElement("b");
	// 		b.innerText = selectTargetName; // 전역변수
	
	// 		const br = document.createElement("br");
	
	// 		div.append(b, br, p, span);
	// 		li.append(img,div);
	
	// 	}
	
	// 	ul.append(li)
	// 	display.scrollTop = display.scrollHeight; // 스크롤 제일 밑으로
	// }



	// selectRoomList();
}


document.addEventListener("DOMContentLoaded", ()=>{
	
	
	
	// 채팅방 목록에 클릭 이벤트 추가
	roomListAddEvent(); 

	// 보내기 버튼에 이벤트 추가
	send.addEventListener("click", sendMessage);
});