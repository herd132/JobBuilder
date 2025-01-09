console.log("employerFindEmail.js 와 연결됨");

const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]); // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

// 요소 선택
const businessRegistrationNumberBtn = document.querySelector('.businessRegistrationNumber-btn');
const memberTelBtn = document.querySelector('.memberTel-btn');

const businessRegistrationNumberArea = document.querySelector('.businessRegistrationNumber-area');
const memberTelArea = document.querySelector('.memberTel-area');

const confirmByBusinessRegistrationNumberBtn = document.getElementById('confirmBybusinessRegistrationNumberBtn');
const confirmByMemberTelBtn = document.getElementById('confirmByMemberTelBtn');

// 기본적으로 전화번호 찾기 영역을 숨김
memberTelArea.style.display = 'none';
confirmByMemberTelBtn.style.display = 'none';

// 사업자 등록번호로 찾기 버튼 클릭 시
businessRegistrationNumberBtn.addEventListener('click', function() {
  businessRegistrationNumberArea.style.display = 'block'; // 사업자 등록번호 영역 보이기
  memberTelArea.style.display = 'none'; // 전화번호 영역 숨기기
  confirmByBusinessRegistrationNumberBtn.style.display = 'block'; // 사업자 등록번호 확인 버튼 보이기
  confirmByMemberTelBtn.style.display = 'none'; // 전화번호 확인 버튼 숨기기
});

// 전화번호로 찾기 버튼 클릭 시
memberTelBtn.addEventListener('click', function() {
  memberTelArea.style.display = 'block'; // 전화번호 영역 보이기
  businessRegistrationNumberArea.style.display = 'none'; // 사업자 등록번호 영역 숨기기
  confirmByMemberTelBtn.style.display = 'block'; // 전화번호 확인 버튼 보이기
  confirmByBusinessRegistrationNumberBtn.style.display = 'none'; // 사업자 등록번호 확인 버튼 숨기기
});

const findEmailContainer = document.querySelector(".find-email-container");

// 사업자 등록번호 확인 버튼 클릭 시 비동기 요청
confirmByBusinessRegistrationNumberBtn.addEventListener('click', async () => {
  const memberName = document.getElementById('memberName').value;
  const firstNo = document.getElementById('firstNo').value;
  const secondNo = document.getElementById('secondNo').value;
  const thirdNo = document.getElementById('thirdNo').value;

  if(memberName.length == 0 || firstNo.length == 0 || secondNo.length == 0 || thirdNo.length == 0){
    alert("빈칸을 모두 채워주세요");
    return;
  }

  const businessRegistrationNumber = `${firstNo}-${secondNo}-${thirdNo}`;

  const resp = await fetch('/employer/findEmailByBusinessRegistrationNumber', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      memberName: memberName,
      businessRegistrationNumber: businessRegistrationNumber,
    })
  })

  if(resp.status === 204){

    findEmailContainer.innerHTML = `
    <div class="error-message">등록된 이메일을 찾을 수 없습니다.</div>
    `;

    // "메인 페이지로 돌아가기" 버튼 동적 생성
    const goBackBtn = newEl('button', {}, ['go-back-btn', 'btn', 'btn-primary']);
    goBackBtn.innerText = "로그인 페이지로 돌아가기";
    goBackBtn.addEventListener("click", () => {
      window.location.href = "http://localhost/multiLogin"; // 로그인 페이지로 리다이렉트
    });

    findEmailContainer.appendChild(goBackBtn);
    return;
  }

  const findEmail = await resp.text();
  console.log(findEmail);

  findEmailContainer.innerHTML = `
  <div class="success-message">사업자 등록번호를 통해 찾은 이메일은 다음과 같습니다.</div>
  <div class="result">${findEmail}</div>
  `;
  
  // "로그인" 버튼 동적 생성
  const loginBtn = newEl('button', {}, ['login-btn', 'btn', 'btn-success']);
  loginBtn.innerText = "로그인";
  loginBtn.addEventListener("click", () => {
    window.location.href = "http://localhost/multiLogin"; // 로그인 페이지로 리다이렉트
  });

  // "비밀번호 찾기" 버튼 동적 생성
  const findPwBtn = newEl('button', {}, ['find-pw-btn', 'btn', 'btn-info']);
  findPwBtn.innerText = "비밀번호 찾기";
  findPwBtn.addEventListener("click", () => {
    window.location.href = "http://localhost/employer/employerFindPw"; // 비밀번호 찾기 페이지로 리다이렉트
  });

  // 생성된 버튼들을 화면에 추가
  findEmailContainer.appendChild(loginBtn);
  findEmailContainer.appendChild(findPwBtn);
});

// 전화번호 확인 버튼 클릭 시 비동기 요청
confirmByMemberTelBtn.addEventListener('click', async () => {

  const memberName = document.getElementById('memberName').value;
  const memberTel = document.getElementById('memberTel').value;

  if(memberName.length == 0 || memberTel.length == 0){
    alert("빈칸을 모두 채워주세요");
    return;
  }

  // 서버로 비동기 요청 보내기
  const resp = await fetch('/employer/findEmailByPhoneNumber', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      memberName: memberName,
      memberTel: memberTel,
    })
  });

  if(resp.status === 204){
    findEmailContainer.innerHTML = `
      <div class="error-message">등록된 이메일을 찾을 수 없습니다.</div>
    `;

    // "메인 페이지로 돌아가기" 버튼 동적 생성
    const goBackBtn = newEl('button', {}, ['go-back-btn', 'btn', 'btn-primary']);
    goBackBtn.innerText = "로그인 페이지로 돌아가기";
    goBackBtn.addEventListener("click", () => {
      window.location.href = "http://localhost/multiLogin"; // 로그인 페이지로 리다이렉트
    });

    findEmailContainer.appendChild(goBackBtn);

    return;
  }

  const findEmail = await resp.text();  // 이메일을 문자열로 받기
  console.log(findEmail);

  findEmailContainer.innerHTML = `
    <div class="success-message">전화번호를 통해 찾은 이메일은 다음과 같습니다.</div>
    <div class="result">${findEmail}</div>
  `;
  
  // "로그인" 버튼 동적 생성
  const loginBtn = newEl('button', {}, ['login-btn', 'btn', 'btn-success']);
  loginBtn.innerText = "로그인";
  loginBtn.addEventListener("click", () => {
    window.location.href = "http://localhost/multiLogin"; // 로그인 페이지로 리다이렉트
  });

  // "비밀번호 찾기" 버튼 동적 생성
  const findPwBtn = newEl('button', {}, ['find-pw-btn', 'btn', 'btn-info']);
  findPwBtn.innerText = "비밀번호 찾기";
  findPwBtn.addEventListener("click", () => {
    window.location.href = "http://localhost/employer/employerFindPw"; // 비밀번호 찾기 페이지로 리다이렉트
  });

  // 생성된 버튼들을 화면에 추가
  findEmailContainer.appendChild(loginBtn);
  findEmailContainer.appendChild(findPwBtn);
});