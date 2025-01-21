const updateBtn = document.querySelector(".updateBtn");
const passwordModal = document.getElementById("passwordModal");
const closeModal = document.querySelector(".close");
const currentPassword = document.querySelector(".currentPassword");
const checkPwbtn = document.querySelector(".checkPwbtn");

updateBtn.addEventListener("click", () => {
  passwordModal.style.display = "flex"; // 모달 열기
});

closeModal.addEventListener("click", () => {
  passwordModal.style.display = "none"; // 모달 닫기
});

const serviceKey ="gmb9xwHzoHg9QxlhbWNAb%2BANM0CBH5g44G7P%2BeJ%2BJRXvoOrYs7zX4vsqC9rS%2BHfkIS6P%2FUmtIoHiWcvqm0rSAg%3D%3D";
// script.js
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('reload-btn');
  
  // 날씨 정보 업데이트 함수
  function updateWeather() {
    var xhr = new XMLHttpRequest();
    var url = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst'; /* URL */
    
    // 반드시 발급받은 서비스 키를 입력하세요
    var serviceKey = 'gmb9xwHzoHg9QxlhbWNAb%2BANM0CBH5g44G7P%2BeJ%2BJRXvoOrYs7zX4vsqC9rS%2BHfkIS6P%2FUmtIoHiWcvqm0rSAg%3D%3D';  // 여기에 서비스 키 입력
    var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + serviceKey; 
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1000');
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('XML');
    queryParams += '&' + encodeURIComponent('base_date') + '=' + encodeURIComponent('20250121');
    queryParams += '&' + encodeURIComponent('base_time') + '=' + encodeURIComponent('1100');
    queryParams += '&' + encodeURIComponent('nx') + '=' + encodeURIComponent('37');
    queryParams += '&' + encodeURIComponent('ny') + '=' + encodeURIComponent('126');

    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        // 응답 데이터를 XML로 파싱
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(this.responseText, "application/xml");

        // 'item' 태그를 찾아서 필요한 데이터 추출
        var items = xmlDoc.getElementsByTagName("item");
        
        // 원하는 데이터 (PTY, T1H, WSD) 추출 후 표시
        Array.from(items).forEach(function(item) {
          var category = item.getElementsByTagName("category")[0].textContent;
          var obsrValue = item.getElementsByTagName("obsrValue")[0].textContent;

          if (category === 'PTY') {
            switch(obsrValue) {
              case '0':
                document.getElementById('pty-value').textContent = '없음';
                break;
              case '1':
                document.getElementById('pty-value').textContent = '비';
                break;
              case '2':
                document.getElementById('pty-value').textContent = '비/눈';
                break;
              case '3':
                document.getElementById('pty-value').textContent = '눈';
                break;
              case '5':
                document.getElementById('pty-value').textContent = '빗방울';
                break;
              case '6':
                document.getElementById('pty-value').textContent = '빗방울눈날림';
                break;
              case '7':
                document.getElementById('pty-value').textContent = '눈날림';
                break;
              default:
                document.getElementById('pty-value').textContent = '불러오기 실패';
                break;
            }
          } else if (category === 'T1H') {
            document.getElementById('t1h-value').textContent = obsrValue + '°C';
          } else if (category === 'WSD') {
            document.getElementById('wsd-value').textContent = obsrValue + ' m/s';
          }
        });
      }
    };

    xhr.send();
  }

  // 페이지 로드 시 초기 날씨 정보 업데이트
  updateWeather();

  // 버튼 클릭 시 날씨 정보 갱신
  button.addEventListener('click', updateWeather);
});


checkPwbtn.addEventListener("click", (e) => {
  const obj = currentPassword.value;

  if (!obj.trim()) {
    alert("비밀번호를 입력해주세요."); // 경고 메시지 표시
    currentPassword.focus(); // 입력 필드로 포커스 이동
    return; // 요청 차단
  }

  fetch("/myPageWorkee/checkPw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: obj
})
.then(resp => resp.text())
.then(result => {
    // 1 or 0

    if (result == 0) { // 인증번호 일치 안 할 때
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    // 비밀번호 일치할 때
    window.location.href = 'updateInfo';

});

});
