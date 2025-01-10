// 다음 주소 API
function execDaumPostcode() {
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
      // 커서를 상세주소 필드로 이동한다.
      document.getElementById("detailAddress").value = "";
      document.getElementById("detailAddress").focus();
    },
  }).open();
}


/* ********** 이미지 영역 ********** */
/* 선택된 이미지 미리보기 관련 요소 모두 얻어오기 */

const previewList = document.querySelectorAll(".preview"); // img 태그 5개
const inputImageList = document.querySelectorAll(".inputImage"); // input 태그 5개
const deleteImageList = document.querySelectorAll(".delete-image"); // x버튼 5개

// 마지막으로 선택된 파일을 저장할 배열
const lastValidFiles = [null, null, null, null, null];


/** 미리보기 함수 (메서드용 주석, 여기서도 사용 가능)
 * @param  file : <input type="file"> 에서 선택된 파일
 * @param  order : 이미지 순서
 */
const updatePreview = (file, order) => {

  // 선택된 파일이 지정된 크기를 초과한 경우 선택 막기
  const maxSize = 1024 * 1024 * 10; // 10MB를 byte 단위로 작성

  if(file.size > maxSize){ // 파일 크기 초과 시
    alert("10MB 이하의 이미지만 선택해 주세요");

    // 미리보기는 안되어도 크기가 초과된 파일이 선택되어 있음!!

    // 이전 선택된 파일이 없는데 크기 초과 파일을 선택한 경우
    if(lastValidFiles[order] === null){
      inputImageList[order].value = ""; // 선택 파일 삭제
      return;
    }

    // 이전 선택된 파일이 있는데 크기 초과 파일을 선택한 경우
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(lastValidFiles[order]);
	// 이전에 유효했던 파일을 저장한 배열(lastValidFiles)에서 특정 순서(order)의 파일을 꺼내어 추가함
    inputImageList[order].files = dataTransfer.files;
	// DataTransfer 객체에 추가된 파일 리스트를 input태그(파일) 리스트에 대입
	
    return;
  }

  // 파일 크기 초과 안했을 때 (유효한 크기인 경우)
  // 현재 선택된 이미지 백업(기록해두기)
  lastValidFiles[order] = file;

  // 현재 선택 파일 임지 URL 생성 후 미리보기 img 태그에 대입
  const newImageUrl = URL.createObjectURL(file) // 임시 URL 생성
  previewList[order].src = newImageUrl; // 미리보기 img 태그에 대입
  
}

/* input태그, x버튼에 이벤트 리스너 추가 */
for (let i = 0; i < inputImageList.length; i++) {

  // input 태그에 이미지 선택 시 미리보기 함수 호출
  inputImageList[i].addEventListener("change", e => {
    const file = e.target.files[0];

    if (file === undefined) { // 선택 취소 시

      // 이전에 선택한 파일이 없는 경우
      if (lastValidFiles[i] === null) return;

      // 이전에 선택한 파일이 "있을" 경우 (== 이전에 정상 선택 후 재선택을 취소하는 경우) 
      const dataTransfer = new DataTransfer();

      // DataTransfer가 가지고 있는 files 필드에 lastValidFiles[i] 추가 
      dataTransfer.items.add(lastValidFiles[i]);

      // input의 files 변수에 lastVaildFile이 추가된 files 대입
      inputImageList[i].files = dataTransfer.files;

      // 이전 선택된 파일로 미리보기 되돌리기
      updatePreview(lastValidFiles[i], i); 

      return;
    }

	  // 파일을 재선택한 경우 updatePreview 이용하여 업데이트
    updatePreview(file, i);
  })

  /* X 버튼 클릭 시 미리보기, 선택된 파일 삭제 */
  deleteImageList[i].addEventListener("click", () => {

    previewList[i].src      = ""; // 미리보기 삭제
    inputImageList[i].value = ""; // 선택된 파일 삭제
    lastValidFiles[i]       = null; // 백업 파일 삭제
  })
} // 이미지 영역 끝



// 사업장등록 유효성 검사 객체
const checkObj = {
  businessNickname: false, // 사업장 별칭
  postcode: false, // 우편번호 (첫번째)
  detailAddress: false, // 세부주소 (세번째)
  worktypeList: false, // 업직종
};

// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]); // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};

/* ********** 사업장 별칭 부분 ********** */
const businessNickname = document.querySelector("#businessNickname");   // input 태그

businessNickname.addEventListener("input", (e) => {
  checkObj.businessNickname = false;
  const inputBusinessNickname = e.target.value;

  if (inputBusinessNickname.trim().length === 0) return;

  checkObj.businessNickname = true;
});

/* ********** 사업장주소 부분 ********** */
// checkObj.postcode, detailAddress 는 등록하기 클릭 시에 입력되었는지만 확인
const postcode = document.querySelector("#postcode");                 // input 태그
const address = document.querySelector("#address");                   // input 태그
const detailAddress = document.querySelector("#detailAddress");       // input 태그
const searchAddressBtn = document.querySelector("#searchAddressBtn"); // button 태그
const addressResetBtn = document.querySelector("#addressResetBtn");   // button 태그

searchAddressBtn.addEventListener("click", execDaumPostcode);
addressResetBtn.addEventListener("click", () => {
  postcode.value = "";
  address.value = "";
  detailAddress.value = "";
});

/* ********** 업직종 부분 ********** */
// checkObj.worktypeList 는 등록하기 클릭 시에 입력되었는지만 확인
// 업직종 대분류 클릭 했을 때 소분류 불러오기
const subCategory = async (workTypeNo) => {
  const subWorkType = document.querySelector("#subWorkType"); // ul태그
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
    });
  }
};

// 클릭했을 때 선택한 업직종 추가하기(삭제 이벤트도 같이)
const addSubCategory = (liSubWorkTypeName) => {
  const selectCategory = document.querySelectorAll(".select-category");

  if (selectCategory.length >= 5) {
    alert("업직종은 최대 5개만 가능합니다");
    return;
  }

  for (let i = 0; i < selectCategory.length; i++) {
    if (selectCategory[i].value == liSubWorkTypeName.innerText) {
      alert("동일한 업직종이 있습니다");
      return;
    }
  }

  const selectCategoryUl = document.querySelector("#selectCategoryUl");

  const subCategory = newEl(
    "input",
    {
      type: "text",
      name: "subCategory",
      readOnly: true,
      value: liSubWorkTypeName.innerText,
    },
    ["select-category"]
  );

  const deleteBtn = newEl("span", {}, ["subcategory-delete"]);
  deleteBtn.innerHTML = " &times";
  deleteBtn.style.cursor = "pointer";

  const li = document.createElement("li");

  li.appendChild(subCategory);
  li.appendChild(deleteBtn);
  selectCategoryUl.appendChild(li);

  document
    .querySelectorAll(".subcategory-delete")
    .forEach((deleteSubcategory) => {
      deleteSubcategory.addEventListener("click", () => {
        deleteSubcategory.parentElement.remove();
      });
    });
};

/* ********** 등록하기 버튼 클릭 시 ********** */
document.querySelector("#addBusinessForm").addEventListener("submit", async (e) => {

  e.preventDefault();

  // 사업장 주소 부분에 대한 처리
  checkObj.postcode = false;
  checkObj.detailAddress = false;

  if (postcode.value.trim().length > 0) checkObj.postcode = true;
  if (detailAddress.value.trim().length > 0) checkObj.detailAddress = true;


  // 사업장 별칭 중복검사
  const respNickname = await fetch("/myPageEmp/checkBusinessNickname", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({businessNickname : businessNickname.value, memberNo: memberNo})
  })
  
  const countNickname = await respNickname.text();

  if(countNickname > 0) {
    alert("일치하는 지점명이 있습니다. 지점명을 바꿔주세요");
    checkObj.businessNickname = false;
    businessNickname.focus();
    return;
  }

  // 사업장 전화번호 부분
  const businessTelInput = document.querySelector("#businessTel");

  // 사업장 전화번호 필수입력
  if(businessTelInput.value.length == 0){
    alert("사업장 전화번호를 입력해주세요");
    businessTelInput.focus();
    return;
  }

  // 사업정 전화번호 정규식 검사
  const regExp = /^(0\d{1,2})\d{3,4}\d{4}$/;
  if (!regExp.test(businessTelInput.value)) {
    alert("전화번호는 '01012345678' 형식으로 입력해주세요.");
    businessTelInput.focus();
    return;
  }

  // 사업장 전화번호 중복검사
  const respBusinessTel = await fetch("/myPageEmp/checkBusinessTel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({businessTel : businessTelInput.value, memberNo: memberNo})
  })

  const countBusinessTel = await respBusinessTel.text();

  if(countBusinessTel > 1) {
    alert("일치하는 전화번호가 있습니다. 전화번호를 바꿔주세요");
    businessTelInput.focus();
    return;
  }

  // 업직종 부분에 대한 처리
  checkObj.worktypeList = false;
  const worktypeList = document.querySelectorAll(".select-category");
  if (worktypeList.length > 0) checkObj.worktypeList = true;

  // 유효성 검사
  for (let key in checkObj) {
    if (!checkObj[key]) {
      let str;

      switch (key) {
        case "businessNickname":
          str = "회사명/점포명이 입력되지 않았습니다";
          break;
        case "postcode":
          str = "우편번호를 입력해주세요";
          break;
        case "detailAddress":
          str = "사업장 세부주소를 입력해주세요";
          break;
        case "worktypeList":
          str = "업직종이 선택되지 않았습니다";
          break;
      }

      alert(str);
      if (key != "worktypeList") document.getElementById(key).focus();
      return;
    }
  }
  
  // 폼 제출 (유효성 검사 후에)
  e.target.submit();
});

/* ********** 돌아가기 버튼 클릭 시 ********** */
const goBackInfo = () => {
  location.href = "/myPageEmp/info";
};




/* GPT 작성문 작성자가 뻘짓하면 날라감/ 일단은 선생님 버전으로 할 예정
document.addEventListener("DOMContentLoaded", function () {
  const addBusinessImgBtn = document.getElementById("addBusinessImgBtn");
  const addBusinessContainer = document.getElementById("addBusinessContainer");
  const businessImgs = addBusinessContainer.querySelectorAll(".businessImg");
  let currentIndex = 0;

  // 초기에 모든 이미지 컨테이너 숨기기
  businessImgs.forEach((img) => {
    img.style.display = "none";
  });

  addBusinessImgBtn.addEventListener("click", function () {
    if (currentIndex < businessImgs.length) {
      // 다음 이미지 컨테이너 보이기
      businessImgs[currentIndex].style.display = "inline-block";
      currentIndex++;

      // 최대 개수에 도달하면 버튼 비활성화
      if (currentIndex >= businessImgs.length) {
        addBusinessImgBtn.disabled = true;
        addBusinessImgBtn.style.opacity = "0.5";
      }
    }
  });

  // 삭제 버튼 클릭 이벤트 처리
  addBusinessContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-image")) {
      const imgContainer = e.target.closest(".businessImg");
      const input = imgContainer.querySelector(".inputImage");
      const preview = imgContainer.querySelector("img");

      // 이미지 미리보기와 입력값 초기화
      preview.src = "";
      input.value = "";

      // 컨테이너를 숨기고 마지막으로 이동
      imgContainer.style.display = "none";
      addBusinessContainer.appendChild(imgContainer);

      // 현재 인덱스 감소 및 버튼 활성화
      currentIndex--;
      addBusinessImgBtn.disabled = false;
      addBusinessImgBtn.style.opacity = "1";
    }
  });

  // 이미지 미리보기 처리
  addBusinessContainer.addEventListener("change", function (e) {
    if (e.target.classList.contains("inputImage")) {
      const file = e.target.files[0];
      const preview = e.target.previousElementSibling.querySelector("img");
  
      // 파일이 선택되지 않았거나 크기가 10MB를 초과하는 경우
      if (file) {
        const fileSizeInMB = file.size / (1024 * 1024); // 파일 크기를 MB로 변환
  
        // 10MB 초과시
        if (fileSizeInMB > 10) {
          alert("파일 크기는 10MB 이하만 업로드 가능합니다.");
          // 입력 필드를 초기화하여 업로드된 파일을 취소
          e.target.value = ""; // 선택된 파일 초기화
          preview.src = ""; // 미리보기 이미지 초기화
        } else {
          const reader = new FileReader();
          reader.onload = function (e) {
            preview.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    }
  });
});
*/