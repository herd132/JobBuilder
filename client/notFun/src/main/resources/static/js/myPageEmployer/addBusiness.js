// 다음 주소 API
function execDaumPostcode() {
  new daum.Postcode({
    oncomplete: function (data) {
      // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

      // 각 주소의 노출 규칙에 따라 주소를 조합한다.
      // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
      var addr = ''; // 주소 변수

      //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
      if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
        addr = data.roadAddress;
      } else { // 사용자가 지번 주소를 선택했을 경우(J)
        addr = data.jibunAddress;
      }

      // 우편번호와 주소 정보를 해당 필드에 넣는다.
      document.getElementById('postcode').value = data.zonecode;
      document.getElementById("address").value = addr;
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("detailAddress").value = "";
      document.getElementById("detailAddress").focus();
    }
  }).open();
}

// 사업장등록 유효성 검사 객체
const checkObj = {
  "businessNickname": false,            // 사업장 별칭
  "postcode": false,                    // 우편번호 (첫번째)
  "detailAddress": false,               // 세부주소 (세번째)
  "worktypeList": false                 // 업직종
}

// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {

  const el = document.createElement(tag);                 // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]);  // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가
  
  return el;                                              // 생성된 요소 반환
};

/* ********** 사업장 별칭 부분 ********** */
const businessNickname = document.querySelector("#businessNickname");
businessNickname.addEventListener("input", e => {

  checkObj.businessNickname = false;
  const inputBusinessNickname = e.target.value;

  if(inputBusinessNickname.trim().length === 0) return;

  checkObj.businessNickname = true;
})

/* ********** 사업장주소 부분 ********** */
// checkObj.postcode, detailAddress 는 등록하기 클릭 시에 입력되었는지만 확인
const postcode = document.querySelector("#postcode");                   // input 태그
const address = document.querySelector("#address");                     // input 태그
const detailAddress = document.querySelector("#detailAddress");         // input 태그
const searchAddressBtn = document.querySelector("#searchAddressBtn");   // button 태그
const addressResetBtn = document.querySelector("#addressResetBtn");     // button 태그

searchAddressBtn.addEventListener("click", execDaumPostcode);
addressResetBtn.addEventListener("click", () => {
  postcode.value = "";
  address.value = "";
  detailAddress.value = "";
})


/* ********** 업직종 부분 ********** */
// checkObj.worktypeList 는 등록하기 클릭 시에 입력되었는지만 확인
// 업직종 대분류 클릭 했을 때 소분류 불러오기
const subCategory = async (workTypeNo) => {

  const subWorkType = document.querySelector("#subWorkType");       // ul태그
  subWorkType.innerHTML = "";

  const resp = await fetch(`/myPageEmp/selectSubWorkType/${workTypeNo}`);
  const result = await resp.json();

  for (let element of result) {

    const liSubWorkTypeName = document.createElement("li");

    liSubWorkTypeName.innerText = element.worktypeCategory;
    liSubWorkTypeName.id = element.workTypeNo;
    liSubWorkTypeName.style.cursor = "pointer";

    subWorkType.appendChild(liSubWorkTypeName);

    liSubWorkTypeName.addEventListener("click", (e) => {
      addSubCategory(e.target);
    })
  }
}

// 클릭했을 때 선택한 업직종 추가하기(삭제 이벤트도 같이)
const addSubCategory = (liSubWorkTypeName) => {

  const selectCategory = document.querySelectorAll(".select-category");

  if(selectCategory.length >= 5){
    alert("업직종은 최대 5개만 가능합니다");
    return;
  }

  for(let i=0; i<selectCategory.length; i++){
    if(selectCategory[i].value == liSubWorkTypeName.innerText){
      alert("동일한 업직종이 있습니다");
      return;
    }
  }

  const selectCategoryUl = document.querySelector("#selectCategoryUl");

  const subCategory = newEl(
    "input",
    {type: "text", name: "subCategory", readOnly:true, value: liSubWorkTypeName.innerText},
    ["select-category"]
  );

  const deleteBtn = newEl("span", {}, ["subcategory-delete"]);
  deleteBtn.innerHTML = " &times";
  deleteBtn.style.cursor = "pointer";

  const li = document.createElement("li");     

  li.appendChild(subCategory);
  li.appendChild(deleteBtn);
  selectCategoryUl.appendChild(li);

  document.querySelectorAll(".subcategory-delete").forEach(deleteSubcategory => {
    deleteSubcategory.addEventListener("click", () => {
      deleteSubcategory.parentElement.remove();
    })
  })
}


/* ********** 등록하기 버튼 클릭 시 ********** */
document.querySelector("#addBusinessForm").addEventListener("submit", e => {



  // 사업장 주소 부분에 대한 처리
  checkObj.postcode = false;
  checkObj.detailAddress = false;

  if(postcode.value.trim().length > 0) checkObj.postcode = true;
  if(detailAddress.value.trim().length > 0) checkObj.detailAddress = true;

  // 업직종 부분에 대한 처리
  checkObj.worktypeList = false;
  const worktypeList = document.querySelectorAll(".select-category");
  if(worktypeList.length > 0) checkObj.worktypeList = true;

  // 유효성 검사
  for(let key in checkObj){
    if(!checkObj[key]){

      let str;

      switch(key){
        case "businessNickname" : str = "회사명/점포명이 입력되지 않았습니다"; break;
        case "postcode" : str = "우편번호를 입력해주세요"; break;
        case "detailAddress" : str = "사업장 세부주소를 입력해주세요"; break;
        case "worktypeList" : str = "업직종이 선택되지 않았습니다"; break;
      }

      alert(str);
      e.preventDefault();
      if(key != "worktypeList") document.getElementById(key).focus();
      return;
    }
  }

})

/* ********** 돌아가기 버튼 클릭 시 ********** */
const goBackInfo = () => {
  location.href = "/myPageEmp/info";
}