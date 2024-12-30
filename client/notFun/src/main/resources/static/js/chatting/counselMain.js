let selectChattingNo; // 선택한 채팅방 번호
let selectTargetNo; // 현재 채팅 대상
let selectTargetName; // 대상의 이름

// 채팅방 전체에 이벤트 추가
function roomListAddEvent() {
	const chattingItemList = document.getElementsByClassName("chat-item");

	for (let item of chattingItemList) {
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

			if (item.children[0].children[1] != undefined) {
				item.children[0].children[1].remove();
			}

			// 비동기로 메세지 목록을 조회하는 함수 호출
			selectChattingFn();
		});
	}
}

// 비동기로 채팅방 목록 가져오기
function selectRoomList(){

	fetch("/chat/roomList")
	.then(resp => resp.json())
	.then(roomList => {
		console.log(roomList);

		// 채팅방 목록 출력 영역 선택
		const chatUsers = document.querySelector("#chatUsers");

		// 채팅방 목록 지우기
		chatUsers.innerHTML = "";

		// 조회한 채팅방 목록을 화면에 추가
		for(let room of roomList){
			
			const chatItem = document.createElement("div");
			chatItem.classList.add("chat-item");
			chatItem.setAttribute("chat-no", room.chattingRoomNo);
			chatItem.setAttribute("target-no", room.targetNo);

			if(room.chattingRoomNo == selectChattingNo){
				chatItem.classList.add("active");
			}

			// item-header 부분
			const chatPreview = document.createElement("div");
			chatPreview.classList.add("chat-preview");

			const chatPreviewDiv = document.createElement("div");

			const userAvatar = document.createElement("img");
			userAvatar.src = "/images/avatar.png";
			userAvatar.alt = "User";
			userAvatar.classList.add("user-avatar");
			
			const chatPreviewDivDiv = document.createElement("div");
			const nameDiv = document.createElement("div");
			const contextDiv = document.createElement("div");
			const sendTimeDiv = document.createElement("div");

			nameDiv.innerText = room.targetName;
			contextDiv.innerText = room.lastMessage;
			sendTimeDiv.innerText = room.sendTime;

			contextDiv.style.fontSize =  "0.9em";
			sendTimeDiv.classList.add("timestamp");

			const chatPreviewDiv2 = document.createElement("div");
			chatPreviewDiv2.innerText = "!";

			chatUsers.append(chatItem);
			chatItem.append(chatPreview);
			chatPreview.append(chatPreviewDiv);
			chatPreviewDiv.append(userAvatar);
			chatPreviewDiv.append(chatPreviewDivDiv);
			chatPreviewDivDiv.append(nameDiv);
			chatPreviewDivDiv.append(contextDiv);
			chatPreviewDivDiv.append(sendTimeDiv);

			// 현재 채팅방을 보고있는게 아니고 읽지 않은 개수가 0개 이상인 경우 -> 읽지 않은 메세지 개수 출력
			if(room.notReadCount > 0 && room.chattingRoomNo != selectChattingNo ){ 
				const chatPreviewDiv2 = document.createElement("div");
				chatPreviewDiv2.innerText = "!";
				chatPreview.append(chatPreviewDiv2);

			}else{

				// 현재 채팅방을 보고있는 경우
				// 비동기로 해당 채팅방 글을 읽음으로 표시
				fetch("/chat/updateReadFlag",{
					method : "PUT",
					headers : {"Content-Type": "application/json"},
					body : JSON.stringify({"chattingRoomNo" : selectChattingNo, "memberNo" : loginMemberNo})
				})
				.then(resp => resp.text())
				.catch(err => console.log(err));

			}
			
		}

		roomListAddEvent();
	})
	.catch(err => console.log(err));

}


// 클릭한 해당 채팅방 불러오기
function selectChattingFn() {

	fetch("/chat/selectMessage?" + `chattingRoomNo=${selectChattingNo}&memberNo=${loginMemberNo}`)
		.then(resp => resp.json())
		.then(messageList => {

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

if (loginMemberNo != "") {
	chattingSock = new SockJS("/chatSock");
}



// 전송 시 이벤트
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

		// JSON.stringify() : 자바스크립트 객체를 JSON 문자열로 변환
		chattingSock.send(JSON.stringify(obj));

		messageInput.value = "";
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

	selectRoomList();
}

document.querySelector(".end-btn").addEventListener("click",  () => {

	var end = {
		"counselEnd": 'y',
		"targetNo": selectTargetNo,
	};

	chattingSock.send(JSON.stringify(end));
})

document.addEventListener("DOMContentLoaded", () => {

	// 채팅방 목록에 클릭 이벤트 추가
	roomListAddEvent();

	// 보내기 버튼에 이벤트 추가
	send.addEventListener("click", sendMessage);
});