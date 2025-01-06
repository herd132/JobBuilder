const goToListBtn = document.querySelector(".list-button");

goToListBtn.addEventListener("click", () => {

  location.href = "/serviceCenter/notice" + location.search;
                        // 쿼리스트링
});