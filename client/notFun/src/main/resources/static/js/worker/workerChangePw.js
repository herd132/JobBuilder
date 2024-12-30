// 취소버튼
const cancelUpdateBtn = document.querySelector("#cancelUpdateBtn");

cancelUpdateBtn.addEventListener("click" , () => {
    if(confirm(" 취소하고 메인 페이지로 돌아가겠습니까? ")) {
        location.href="/";
        return;
    }
})




// 1) 비밀번호 관련 요소 얻어오기
const newPw = document.querySelector("#newPw");
const newPwConfirm = document.querySelector("#newPwConfirm");
const newPwConfirmMessage = document.querySelector("#newPwConfirmMessage");

const checkObj = {
    newPw: false,
    newPwConfirm: false
};

// 5) 비밀번호, 비밀번호확인이 같은지 검사하는 함수
const checkPw = () => {
    // 같을 경우
    if (newPw.value === newPwConfirm.value) {
        newPwConfirmMessage.innerText = "비밀번호가 일치합니다";
        newPwConfirmMessage.classList.add("confirm");
        newPwConfirmMessage.classList.remove("error");
        checkObj.newPwConfirm = true; // 비밀번호 확인 true
        return;
    }

    newPwConfirmMessage.innerText = "비밀번호가 일치하지 않습니다";
    newPwConfirmMessage.classList.add("error");
    newPwConfirmMessage.classList.remove("confirm");
    checkObj.newPwConfirm = false; // 비밀번호 확인 false
};

// 2) 비밀번호 유효성 검사
newPw.addEventListener("input", (e) => {
    // 입력 받은 비밀번호 값
    const inputPw = e.target.value;

    // 3) 입력되지 않은 경우
    if (inputPw.trim().length === 0) {
        newPwConfirmMessage.innerText =
            "영어,숫자,특수문자(!,@,#,-,_) 6~20글자 사이로 입력해주세요.";
        newPwConfirmMessage.classList.remove("confirm", "error");
        checkObj.newPw = false; // 비밀번호가 유효하지 않다고 표시
        newPw.value = ""; // 처음에 띄어쓰기 입력 못하게 하기
        return;
    }

    // 4) 입력 받은 비밀번호 정규식 검사
    const regExp = /^[a-zA-Z0-9!@#_-]{6,20}$/;

    if (!regExp.test(inputPw)) {
        // 유효하지 않으면
        newPwConfirmMessage.innerText = "비밀번호가 유효하지 않습니다";
        newPwConfirmMessage.classList.add("error");
        newPwConfirmMessage.classList.remove("confirm");
        checkObj.newPw = false;
        return;
    }

    // 유효한 경우
    newPwConfirmMessage.innerText = "유효한 비밀번호 형식입니다";
    newPwConfirmMessage.classList.add("confrim");
    newPwConfirmMessage.classList.remove("error");
    checkObj.newPw = true;

    // 비밀번호 입력 시 확인란의 값과 비교하는 코드 추가

    // 비밀번호 확인에 값이 작성되어 있을 때
    if (newPwConfirm.value.length > 0) {
        checkPw();
    }
});

// 6) 비밀번호 확인 유효성 검사
// 단, 비밀번호(memberPw)가 유효할 때만 검사 수행
newPwConfirm.addEventListener("input", () => {
    if (checkObj.newPw) {
        // memberPw가 유효한 경우
        checkPw(); // 비교하는 함수 수행
        return;
    }

    checkObj.newPwConfirm = false;
});

const changePwForm = document.querySelector(".changePwForm");

// 회원 가입 폼 제출 시
changePwForm.addEventListener("submit", (e) => {
    // checkObj의 저장된 값(value) 중
    // 하나라도 false가 있으면 제출 X

    // for ~ in (객체 전용 향상된 for 문)
    for (let key in checkObj) {
        // checkObj 요소의 key 값을 순서대로 꺼내옴

        if (!checkObj[key]) {
            // 현재 접근중인 checkObj[key]의 value 값이 false 인 경우 (유효하지 않음)

            let str; // 출력할 메시지를 저장할 변수

            switch (key) {
                case "newPw":
                    str = "비밀번호가 유효하지 않습니다";
                    break;

                case "newPwConfirm":
                    str = "비밀번호가 일치하지 않습니다";
                    break;
            }

            alert(str);

            document.getElementById(key).focus(); // 초점 이동

            e.preventDefault(); // form 태그 기본 이벤트(제출) 막기
            return;
        }
    }
});