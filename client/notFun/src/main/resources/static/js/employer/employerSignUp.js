console.log("employerSignUp.html과 연결됨");

const allAgree = document.querySelector("#allAgree"); // 전체동의 input(checkbox) 태그
const checkAllList = document.querySelectorAll(".checkAll"); // 약관 input(checkbox)태그

allAgree.addEventListener("click", (e) => {
  checkAllList.forEach((checkAll) => {
    checkAll.checked = e.target.checked;
  });
});

checkAllList.forEach((checkAll) => {
  checkAll.addEventListener("click", () => {
    const checked = document.querySelectorAll(".checkAll:checked");

    if (checkAllList.length === checked.length) allAgree.checked = true;
    else allAgree.checked = false;
  });
});
