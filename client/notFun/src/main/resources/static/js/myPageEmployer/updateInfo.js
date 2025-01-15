console.log("updateInfo.js 와 연결됨");

// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};


/* ********** 이메일 부분 ********** */


/* ********** 대표자명 부분 ********** */
const memberName = document.getElementById('memberName');
const changeMemberNameBtn = document.getElementById('changeMemberNameBtn');

changeMemberNameBtn.addEventListener('click', () => {
  changeInputField('name', memberName, changeMemberNameBtn);
});


/* ********** 대표자연락처 부분 ********** */
const memberTel = document.getElementById('memberTel');   // span태그
const changeMemberTelBtn = document.getElementById('changeMemberTelBtn');

changeMemberTelBtn.addEventListener('click', () => {
  changeInputField('tel', memberTel, changeMemberTelBtn);
});


/* ********** 입력 필드로 바꾸는 함수 ********** */
function changeInputField(fieldType, element, button) {
  const originalValue = element.innerText;
  
  // 기존 텍스트를 input 태그로 변경
  const input = document.createElement('input');
  input.value = originalValue;
  element.innerHTML = ''; // 기존 내용 지우기
  element.appendChild(input);

  // 버튼 숨기고 저장/취소 버튼 추가
  button.style.display = 'none';

  // 저장 버튼
  const saveButton = newEl('button', {}, ['saveButton']);
  saveButton.innerText = '저장';
  element.appendChild(saveButton);

  // 취소 버튼
  const cancelButton = newEl('button', {}, ['cancelButton']);
  cancelButton.innerText = '취소';
  element.appendChild(cancelButton);

  // 취소 버튼 클릭 시 원래 값으로 되돌리기
  cancelButton.addEventListener('click', () => {
    element.innerHTML = originalValue;
    button.style.display = 'inline-block'; // 변경 버튼 다시 보이기
  });

  // 저장 버튼 클릭 시 비동기 요청 보내기
  saveButton.addEventListener('click', async () => {
    const newValue = input.value;

    // 전화번호 변경의 경우 중복성 검사
    if(fieldType === 'tel'){

      if(newValue.trim().length === 0){
        alert("전화번호를 입력해주세요(-제외)");
        return;
      }
      
      // 정규식 검사
      const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;
    
      if (!regExp.test(newValue)) {
        alert("유효하지 않은 전화번호 형식입니다");
        return;
      }
    
      // 전화번호 중복성 검사
      const resp = await fetch("/employer/checkTel?memberTel=" + newValue);

      if(resp.status === 200) {
        const result = await resp.json();

        if(result > 0){
          alert("이미 사용중인 전화번호 입니다");
          return;
        }
      }
    }

    // 각 필드에 따라 다른 API 요청
    let url = '';
    let body = {};
    
    if (fieldType === 'email') {
      url = '/myPageEmp/changeEmail';
      body = { memberNo: memberNo, email: newValue };

    } else if (fieldType === 'name') {
      url = '/myPageEmp/changeMemberName';
      body = { memberNo: memberNo, memberName: newValue };

    } else if (fieldType === 'tel') {
      url = '/myPageEmp/changeMemberTel';
      body = { memberNo: memberNo, memberTel: newValue };
    }

    // 비동기 요청 보내기
    fetch(url, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    })
    .then(response => response.text())
    .then(result => {

      if (result > 0) {
        element.innerHTML = newValue; // 변경된 값으로 업데이트
        button.style.display = 'inline-block'; // 변경 버튼 다시 보이기
        alert(`${fieldType}이 변경되었습니다.`);

      } else {
        alert(`${fieldType} 변경 실패ㅜㅜ`);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('서버와의 연결에 문제가 발생했습니다.');
    });
  });
}

/* ********** 선택약관동의여부 부분 ********** */
const changeOptionalAgreeFlBtn = document.querySelector("#changeOptionalAgreeFlBtn"); // button 태그

changeOptionalAgreeFlBtn.addEventListener("click", () => {

  const optionalAgreeFl = document.querySelector("#optionalAgreeFl");     // span 태그
  const agree = (optionalAgreeFl.innerText === 'Y') ? 'N' : 'Y';

  const obj = {memberNo: memberNo, agree: agree};
  console.log(obj);

  fetch("/myPageEmp/changeOptionalAgree", {
    method : "PUT",
    headers : {"Content-type" : "application/json"},
    body : JSON.stringify(obj)
  })
  .then(resp => resp.text())
  .then(result => {

    if(result > 0){
      optionalAgreeFl.innerText = agree;
      alert("선택약관 동의여부가 변경되었습니다");

    } else{
      alert("선택약관 동의여부 변경 실패ㅜㅜ")
    }
  })
  
})