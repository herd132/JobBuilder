console.log("됨");
// Sample data
const chatUsers = [
    { id: 1, name: "짱구", message: "네 그럼 상담을 종료 하..", time: "오후 22:00" },
    { id: 2, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" },
    { id: 3, name: "짱구", message: "그 방식으로는 답변을 드..", time: "오후 22:00" },
    { id: 4, name: "짱구", message: "네 고객님 문의을 도..", time: "오후 22:00" },
    { id: 5, name: "짱구", message: "이게 왜 이런건...", time: "오후 22:00" }
];

const chatMessages = {
    1: [
        { text: "회원 빌레에 대한 답변 하는중", sent: false, time: "오후 22:00" },
        { text: "해결 되었습니다.", sent: true, time: "오후 22:00" },
        { text: "다른 문의 사항은 없으신가요?", sent: false, time: "오후 22:00" },
        { text: "아니 없습니다.", sent: true, time: "오후 22:00" },
        { text: "네 그럼 상담을 종료하도록 하겠습니다.", sent: false, time: "오후 22:00" },
        { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
        { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" },
        { text: "상담이 종료 되어 더이상 진행할수 없습니다.", sent: true, time: "오후 22:00" }
    ],
    2: [
        { text: "어떤 문제가 있으신가요?", sent: false, time: "오후 22:00" },
        { text: "이게 왜 이런건지 모르겠어요", sent: true, time: "오후 22:00" }
    ]
};

let currentChatId = null;

function renderChatUsers() {
    const container = document.getElementById('chatUsers');
    container.innerHTML = chatUsers.map(user => `
        <div class="chat-item" onclick="selectChat(${user.id})">
            <div class="chat-preview">
                <img src="/images/avatar.png" alt="User" class="user-avatar">
                <div></div>
                <div>
                    <div>${user.name}</div>
                    <div style="color: #543A14; font-size: 0.9em;">${user.message}</div>
                    <div class="timestamp">${user.time}</div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderMessages() {
    const container = document.getElementById('messageContainer');

    const messages = chatMessages[currentChatId] || [];
    container.innerHTML = messages.map(msg => `
        <div class="message ${msg.sent ? 'sent' : 'received'}">
            <div>${msg.text}</div>
            <div class="timestamp">${msg.time}</div>
        </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    if (!currentChatId) return;
    
    const input = document.getElementById('messageInput');
    if (input.value.trim()) {
        if (!chatMessages[currentChatId]) {
            chatMessages[currentChatId] = [];
        }
        chatMessages[currentChatId].push({
            text: input.value,
            sent: false,
            time: new Date().toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true })
        });
        input.value = '';
        renderMessages();
    }
}

function selectChat(id) {
    currentChatId = id;
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    const selectedUser = chatUsers.find(user => user.id === id);
    document.getElementById('chatTitle').textContent = `${selectedUser.name}님과의 대화`;
    renderMessages();
}

renderChatUsers();
// renderMessages();

document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});