// 버튼과 로그인 폼을 제어하는 함수
document.getElementById('workerSelectBtn').addEventListener('click', function() {
  // 알바생 로그인 폼 보이기, 고용주 로그인 폼 숨기기
  document.querySelector('.worker-login-container').style.display = 'block';
  document.querySelector('.employer-login-container').style.display = 'none';
  
  // 버튼 스타일 변경
  document.getElementById('workerSelectBtn').classList.add('active');
  document.getElementById('employerSelectBtn').classList.remove('active');
});

document.getElementById('employerSelectBtn').addEventListener('click', function() {
  // 고용주 로그인 폼 보이기, 알바생 로그인 폼 숨기기
  document.querySelector('.worker-login-container').style.display = 'none';
  document.querySelector('.employer-login-container').style.display = 'block';
  
  // 버튼 스타일 변경
  document.getElementById('workerSelectBtn').classList.remove('active');
  document.getElementById('employerSelectBtn').classList.add('active');
});

// 초기 페이지 로딩 시 알바생 로그인 폼을 기본으로 표시
window.onload = function() {
  document.querySelector('.worker-login-container').style.display = 'block';
  document.querySelector('.employer-login-container').style.display = 'none';
};