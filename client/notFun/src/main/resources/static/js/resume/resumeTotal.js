const cp = document.querySelector(".active").innerText;

fetch("/resume/ajax/list?cp=" + cp)
.then(resp => resp.json())
.then(resumeList => {
  console.log(resumeList);
  document.querySelector(".loadingBox").remove();
  document.querySelector(".pagination").classList.remove("hiddne");
  document.querySelector(".board-list").innerHTML = "됨";
})