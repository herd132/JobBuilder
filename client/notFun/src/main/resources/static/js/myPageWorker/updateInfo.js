// 다음 주소 API
function execDaumPostcode() {
  checkObj.workerAddress = false;
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ""; // 주소 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === "R") {
        // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else {
        // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById("postcode").value = data.zonecode;
      document.getElementById("address").value = addr;
      // 커서를 상세주소 필드로 이동한다.0
      document.getElementById("detailAddress").focus();
    },
  }).open();
}

const checkObj = {
  workerNickname: false,
  memberTel: false,
  memberEmail: false,
  workerMbti: true,
  workerAddress: true,
  authKey: false,
};

const updateform = document.querySelector(".update-form");

// 주소
const workerAddress = document.querySelectorAll("[name='memberAddress']")
// 주소 검색 버튼 클릭 시
document.querySelector(".search-button").addEventListener("click", execDaumPostcode);
function validateAddress() {
  if (
    (addressPostcode.value.trim() === "" && address.value.trim() === "" && detailAddress.value.trim() === "") || // 모두 비어있을 때
    (addressPostcode.value.trim() !== "" && address.value.trim() !== "" && detailAddress.value.trim() !== "") // 모두 입력되었을 때
     ) {
    checkObj.workerAddress = true;
  } else {
    checkObj.workerAddress = false;
  }
}
// 전화번호 입력 처리
const memberTel = document.querySelector("#memberTel");
const memberTelMessage = document.querySelector("#memberTelMessage");

memberTel.addEventListener("input", () => {
  const regExp = /^01[0-9]{1}[0-9]{3,4}[0-9]{4}$/;
  if (memberTel.value.trim().length === 0) {
    memberTelMessage.innerText = "연락처를 입력해 주세요";
    memberTelMessage.classList.remove("confirm", "error");
    checkObj.memberTel = false;
  } else if (!regExp.test(memberTel.value)) {
    memberTelMessage.innerText = "연락처가 유효하지 않습니다";
    memberTelMessage.classList.add("error");
    memberTelMessage.classList.remove("confirm");
    checkObj.memberTel = false;
  } else {
    memberTelMessage.classList.add("confirm");
    memberTelMessage.classList.remove("error");
    checkObj.memberTel = true;
    if (checkObj.memberTel == true) {
      fetch("/myPageWorkee/checkMemberTel?memberTel=" + memberTel.value)
        .then((resp) => resp.text())
        .then((count) => {
          if (count >= 1) {
            memberTelMessage.innerText = "이미 사용 중인 전화번호 입니다.";
            memberTelMessage.classList.add("error");
            memberTelMessage.classList.remove("confirm");
            checkObj.workerNickname = false;
            return;
          }

          memberTelMessage.innerText = "사용 가능한 전화번호 입니다.";
          memberTelMessage.classList.add("confirm");
          memberTelMessage.classList.remove("error");
          checkObj.workerNickname = true;
        })
        .catch((err) => console.log(err));
    }
  }
});

// MBTI 입력 처리
const workerMbti = document.querySelector("#workerMbti");
const workerMbtiMessage = document.querySelector("#workerMbtiMessage");

function handleOnInput(e) {
  e.value = e.value.replace(/[^A-Z]/g, "");
}

workerMbti.addEventListener("input", () => {
  const regExp = /^[EI][SN][TF][PJ]$/g;
  if (workerMbti.value.trim().length === 0) {
    workerMbtiMessage.innerText = ""; // 메시지를 지운다
    workerMbtiMessage.classList.remove("confirm", "error"); // 클래스도 초기화
    checkObj.workerMbti = true; // 필요에 따라 설정 (입력값이 없을 때 false로 할 수도 있음)
    return;
  }

  if (regExp.test(workerMbti.value)) {
    workerMbtiMessage.innerText = "유효한 MBTI 형식입니다.";
    workerMbtiMessage.classList.add("confirm");
    workerMbtiMessage.classList.remove("error");
    checkObj.workerMbti = true;
  } else {
    workerMbtiMessage.innerText = "유효하지 않은 MBTI 형식입니다.";
    workerMbtiMessage.classList.add("error");
    workerMbtiMessage.classList.remove("confirm");
    checkObj.workerMbti = false;
  }
});

// 닉네임 체크
const checkNickname = document.querySelector("#checkNickname");
const nicknameMessage = document.querySelector("#nicknameMessage");

checkNickname.addEventListener("click", (e) => {
  const workerNickname = document.querySelector("#workerNickname");
  if (workerNickname.value.trim().length === 0) {
    nicknameMessage.innerText =
      "한글, 영어, 숫자로만 2~20 글자로 입력해주세요.";
    nicknameMessage.classList.remove("confirm", "error");
    checkObj.workerNickname = false;
    workerNickname.value = "";
    return;
  }
  const regExp = /^[가-힣\w\d]{2,20}$/;

  if (!regExp.test(workerNickname.value)) {
    nicknameMessage.innerText = "유효하지 않은 닉네임 형식입니다.";
    nicknameMessage.classList.add("error");
    nicknameMessage.classList.remove("confirm");
    checkObj.workerNickname = false;
    return;
  }

  // 닉네임 중복 검사
  fetch("/myPageWorkee/checkNickname?workerNickname=" + workerNickname.value)
    .then((resp) => resp.text())
    .then((count) => {
      if (count == 1) {
        nicknameMessage.innerText = "이미 사용 중인 닉네임 입니다.";
        nicknameMessage.classList.add("error");
        nicknameMessage.classList.remove("confirm");
        checkObj.workerNickname = false;
        return;
      }

      nicknameMessage.innerText = "사용 가능한 닉네임 입니다.";
      nicknameMessage.classList.add("confirm");
      nicknameMessage.classList.remove("error");
      checkObj.workerNickname = true;
    })
    .catch((err) => console.log(err));
});

// 이메일 인증

// 인증번호 받기 버튼
const sendAuthKeyBtn = document.querySelector("#sendAuthKeyBtn");

// 인증번호 입력 input
const authKey = document.querySelector("#authKey");

// 인증번호 입력 후 확인 버튼
const checkAuthKeyBtn = document.querySelector("#checkAuthKeyBtn");

// 인증번호 관련 메시지 출력 span
const authKeyMessage = document.querySelector("#authKeyMessage");

let authTimer; // 타이머 역할을 할 setInterval을 저장할 변수

const initMin = 4; // 타이머 초기값 (분)
const initSec = 59; // 타이머 초기값 (초)
const initTime = "05:00";

// 실제 줄어드는 시간을 저장할 변수
let min = initMin;
let sec = initSec;

//---------------------------------------------------

/* 이메일 유효성 검사 */

// 1) 이메일 유효성 검사에 사용될 요소 얻어오기
const memberEmail = document.querySelector("#memberEmail");
const emailMessage = document.querySelector("#workerEmailMessage");

// 2) 이메일이 입력(input) 될 때 마다 유효성 검사 수행
memberEmail.addEventListener("input", (e) => {
  // 이메일 인증 후 이메일이 변경된 경우
  checkObj.authKey = false;
  document.querySelector("#authKeyMessage").innerText = "";
  clearInterval(authTimer);

  // 작성된 이메일 값 얻어오기
  const inputEmail = e.target.value;

  //console.log(inputEmail);

  // 3) 입력된 이메일이 없을 경우
  if (inputEmail.trim().length === 0) {
    emailMessage.innerText = "메일을 받을 수 있는 이메일을 입력해주세요.";

    // 메시지에 색상을 추가하는 클래스 모두 제거
    emailMessage.classList.remove("confirm", "error");

    // 이메일 유효성 검사 여부를 false 변경
    checkObj.memberEmail = false;

    // 잘못 입력한 띄어쓰기가 있을 경우 없앰
    memberEmail.value = "";

    return;
  }

  // 4) 입력된 이메일이 있을 경우 정규식 검사
  //    (알맞은 형태로 작성했는지 검사)
  const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // 영어, 숫자, 특수문자(. _ % + -)를 허용
  // 이메일 형식으로 작성
  // 도메인 부분은 최소 2개의 문자로 끝나야함 (.com, .net, .org, .kr 등)

  // 입력 받은 이메일이 정규식과 일치하지 않는 경우
  // (알맞은 이메일 형태가 아닌 경우)
  if (!regExp.test(inputEmail)) {
    emailMessage.innerText = "알맞은 이메일 형식으로 작성해주세요.";
    emailMessage.classList.add("error"); // 글자를 빨간색으로 변경
    emailMessage.classList.remove("confirm"); // 초록색 제거
    checkObj.memberEmail = false; // 유효하지 않은 이메일임을 기록
    return;
  }

  // 5) 유효한 이메일 형식인 경우 중복 검사 수행
  // 비동기(ajax)

  fetch("/worker/checkEmail?memberEmail=" + inputEmail)
    .then((resp) => resp.text())
    .then((count) => {
      // count : 1이면 중복, 0이면 중복 아님
      // == : 값만 비교
      // === : 값 + 자료형 비교
      if (count == 1) {
        // 증복이면
        emailMessage.innerText = "이미 사용중인 이메일 입니다.";
        emailMessage.classList.add("error");
        emailMessage.classList.remove("confirm");
        checkObj.memberEmail = false; // 중복은 유효하지 않은 상태이다.
        return;
      }
      // 중복 X인 경우
      emailMessage.innerText = "사용 가능한 이메일 입니다";
      emailMessage.classList.add("confirm");
      emailMessage.classList.remove("error");
      checkObj.memberEmail = true; // 유효한 이메일
    })
    .catch((error) => {
      // fetch 수행 중 예외 발생 시 처리
      console.log(error); // 발생한 예외 출력
      // finally도 쓸수있음 (무조건수행)
    });
});

// 인증번호 받기 버튼 클릭 시
sendAuthKeyBtn.addEventListener("click", () => {
  // 새로운 인증번호 발급을 원하는것이기 때문에
  // 새로 발급받은 인증번호 확인전까진 checkObj.authKey는 false
  checkObj.authKey = false;
  // 인증번호 발급 관련 메세지 비우기
  authKeyMessage.innerText = "";

  // 중복되지 않은 유효한 이메일을 입력한 경우가 아니면
  if (!checkObj.memberEmail) {
    alert("유효한 이메일 작성 후 클릭해 주세요");
    return;
  }

  // 클릭 시 타이머 숫자 초기화
  min = initMin;
  sec = initSec;

  // 이전 동작중인 인터벌 클리어(없애기)
  clearInterval(authTimer);

  // *************************************
  // 비동기로 서버에서 메일보내기
  fetch("/email/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: memberEmail.value, // 값 하나면 json으로 변환해서보내줌
  })
    .then((resp) => resp.text())
    .then((result) => {
      if (result == 1) {
        console.log("인증번호 발송 성공");
      } else {
        console.log("인증번호 발송 실패!!!");
      }
    });

  // *************************************

  // 메일은 비동기로 서버에서 보내라고 하고
  // 화면에서는 타이머 시작하기

  authKeyMessage.innerText = initTime; // 05:00 세팅
  authKeyMessage.classList.remove("confirm", "error"); // 검정 글씨

  alert("인증번호가 발송되었습니다.");

  // setInterval(함수, 지연시간(ms))
  // - 지연시간(ms)만큼 시간이 지날 때 마다 함수 수행

  // clearInterval(Interval이 저장된 변수)
  // - 매개변수로 전달받은 interval을 멈춤

  // 인증 시간 출력(1초 마다 동작)
  authTimer = setInterval(() => {
    authKeyMessage.innerText = `${addZero(min)}:${addZero(sec)}`;

    // 0분 0초인 경우 ("00:00" 출력 후)
    if (min == 0 && sec == 0) {
      checkObj.authKey = false; // 인증 못함
      clearInterval(authTimer); // interval 멈춤
      authKeyMessage.classList.add("error");
      authKeyMessage.classList.remove("confirm");
      return;
    }

    // 0초인 경우(0초를 출력한 후)
    if (sec == 0) {
      sec = 60;
      min--;
    }

    sec--; // 1초 감소
  }, 1000); // 1초 지연시간
});

// 전달 받은 숫자가 10 미만인 경우(한자리) 앞에 0 붙여서 반환
function addZero(number) {
  if (number < 10) return "0" + number;
  else return number;
}

// -------------------------------------------------------------

// 인증하기 버튼 클릭 시
// 입력된 인증번호를 비동기로 서버에 전달
// -> 입력된 인증번호와 발급된 인증번호가 같은지 비교
//   같으면 1, 아니면 0반환
// 단, 타이머가 00:00초가 아닐 경우에만 수행

checkAuthKeyBtn.addEventListener("click", () => {
  if (min === 0 && sec === 0) {
    // 타이머가 00:00인 경우
    alert("인증번호 입력 제한시간을 초과하였습니다.");
    return;
  }

  if (authKey.value.length < 6) {
    // 인증번호가 제대로 입력 안된 경우(길이가 6미만인 경우)
    alert("인증번호를 정확히 입력해 주세요.");
    return;
  }

  // 문제 없는 경우(제한시간, 인증번호 길이 유효 시)
  // 입력받은 이메일, 인증번호로 객체 생성
  const obj = {
    email: memberEmail.value,
    authKey: authKey.value,
  };

  // 인증번호 확인용 비동기 요청 보냄
  fetch("/email/checkAuthKey", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj), // obj JS 객체를 JSON으로 변경
  })
    .then((resp) => resp.text())
    .then((result) => {
      // 1 or 0

      if (result == 0) {
        alert("인증번호가 일치하지 않습니다!");
        checkObj.authKey = false;
        return;
      }

      // 일치할 때
      clearInterval(authTimer); // 타이무스토쁘

      authKeyMessage.innerText = "인증 되었습니다.";
      authKeyMessage.classList.remove("error");
      authKeyMessage.classList.add("confirm");

      checkObj.authKey = true; // 인증번호 검사여부 true 변경
    });
});


const imageInput = document.getElementById("imageInput"); // 파일 선택 input
const deleteImage = document.getElementById("deleteImage"); // 이미지 삭제 버튼

const defaultImageUrl = `${window.location.origin}/images/avatar.png`;

let statusCheck = -1; // -1이면 초기 상태, 0이면 이미지 삭제, 1이면 새 이미지 선택
let previousImage = profileImg.src; // 이전 이미지(초기 상태 이미지 URL 저장)
let previousFile = null; // 이전에 선택된 파일 객체 저장

// 이미지 선택 시 미리보기 및 파일 크기 검사
imageInput.addEventListener("change", () => {
    
  const file = imageInput.files[0];
  
  if (file) {
    // 파일 선택된 경우
    const newImageUrl = URL.createObjectURL(file); // 임시 URL 생성
    // 미리보기 이미지 url 용도
    profileImg.src = newImageUrl; // 미리보기 이미지 설정(img 태그의 src에 선택한 파일 임시 경로 대입)
    statusCheck = 1; // 새 이미지 선택 상태 기록
    checkObj.profileImg = true;
    previousImage = newImageUrl; // 현재 선택된 이미지 이전 이미지로 저장(바뀔 경우 대비) --> src
    previousFile = file; // 현재 선택된 파일 객체를 이전 파일로 저장(바뀔 경우 대비) --> input
  } else {
    // 파일 선택이 취소된 경우
    profileImg.src = previousImage; // 이전 미리보기 이미지로 복원
    
    // 파일 입력 복구 : 이전 파일이 존재하면 다시 할당
    if (previousFile) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(previousFile);
      imageInput.files = dataTransfer.files; // 이전 파일로 input 태그의 files 속성 복구
    }
  }
});

// 이미지 삭제 버튼 클릭 시
deleteImage.addEventListener("click", () => {
  // 기본 이미지 상태가 아니면 삭제 처리
  if (profileImg.src !== defaultImageUrl) {
    imageInput.value = ""; // 파일 선택 초기화
    profileImg.src = defaultImageUrl; // 기본 이미지로 설정
    statusCheck = 0; // 삭제 상태 기록
    checkObj.profileImg = true; // 이미지 삭제됨
    previousFile = null; // 이전 파일 초기화 기록
  } else {
    // 기본 이미지 상태에서 삭제 버튼 클릭 시 상태를 변경하지 않음
    statusCheck = -1; // 변경 사항 없음 상태 유지
    checkObj.profileImg = false; // 변경 사항 없음
  }
});

updateform.addEventListener("submit", async (e) => {
  e.preventDefault(); // 폼 제출을 막음

  // 1. 모든 유효성 검사 확인
  validateAddress(); // 주소 유효성 검사 추가
  for (let key in checkObj) {
    if (!checkObj[key]) {
      alert("필수 입력 칸을 모두 입력해주세요!");
      document.getElementById(key).focus(); // 첫 번째 잘못된 필드에 포커스
      return; // 유효성 검사가 실패하면 전송 중지
    }
  }

  // 2. FormData 객체 생성
  const formData = new FormData();

  // 3. 일반 입력 데이터 추가
  formData.append('postcode', document.querySelectorAll("[name='workerAddress']")); //주소
  formData.append('memberTel', document.getElementById("memberTel").value); // 전화번호
  formData.append('workerMbti', document.getElementById("workerMbti").value); // MBTI
  formData.append('memberEmail', document.getElementById("memberEmail").value); // 이메일

  // 4. 이미지 파일 추가
  const imageInput = document.getElementById("imageInput");
  if (imageInput.files[0]) {
    formData.append('profileImg', imageInput.files[0]); // 이미지 파일
  }

  // 5. 데이터 전송
  try {
    const response = await fetch("/myPageWorkee/updateInfo", {
      method: 'POST',
      body: formData,
    });

    const result = await response.json(); // 서버 응답 처리

    if (result.success) {
      alert("업데이트되었습니다.");
    } else {
      alert("업데이트에 실패했습니다.");
    }
  } catch (error) {
    console.error("업데이트 중 오류 발생:", error);
    alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
  }
});
