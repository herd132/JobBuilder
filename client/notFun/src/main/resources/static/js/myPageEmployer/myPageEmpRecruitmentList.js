const changeRecruitComplete = (recruitmentNo) => {

  const recruitCompleteFlSpan = document.querySelector(`#completeFl${recruitmentNo}`);

  const complete = (recruitCompleteFlSpan.innerText == 'Y') ? 'N' : 'Y';
  const obj = {"recruitmentNo": parseInt(recruitmentNo), "complete": complete};

  fetch("/myPageEmp/changeRecruitComplete" ,{
    method : "PUT",
    headers : {"Content-type" : "application/json"},
    body : JSON.stringify(obj)
  })
  .then(resp => resp.text())
  .then(result => {

    if(result > 0)recruitCompleteFlSpan.innerText = complete;
    else alert("완료여부 변경 실패ㅜㅜ");
    
  })
}

const addRecruitment = () => {
  location.href = "/recruitment/addRecruitment";
}