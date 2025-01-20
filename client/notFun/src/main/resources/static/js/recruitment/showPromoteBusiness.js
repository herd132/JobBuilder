const goToListBtn = document.querySelector("#goToListBtn");

goToListBtn.addEventListener("click", () => {


location.href = "/recruitment/detail/" + recruitmentNo;
                      // 쿼리스트링
});