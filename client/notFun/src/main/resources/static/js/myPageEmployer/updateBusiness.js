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


// 요소 생성 + 속성 추가 + 클래스 추가 함수
const newEl = (tag, attr, cls) => {
  const el = document.createElement(tag); // 요소 생성
  for (let key in attr) el.setAttribute(key, attr[key]); // 요소에 속성 추가
  for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

  return el; // 생성된 요소 반환
};


/* ********** 사업장주소 부분 ********** */
// checkObj.postcode, detailAddress 는 등록하기 클릭 시에 입력되었는지만 확인
const postcode = document.querySelector("#postcode"); // input 태그
const address = document.querySelector("#address"); // input 태그
const detailAddress = document.querySelector("#detailAddress"); // input 태그
const searchAddressBtn = document.querySelector("#searchAddressBtn"); // button 태그
const addressResetBtn = document.querySelector("#addressResetBtn"); // button 태그

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


/* ********** 이미지 부분 ********** */

const deleteOrderList = new Set();
const inputImageList = document.getElementsByClassName("inputImage");     // input 태그들
const deleteImageList = document.getElementsByClassName("delete-image");  // X 버튼들
const lastValidFiles = [null, null, null, null, null];      // 마지막 선택 파일들 저장할 배열

const updatePreview = (file, order) => {

	// 선택된 파일이 지정된 크기를 초과한 경우 선택 막기
	const maxSize = 1024 * 1024 * 5; // 10MB를 byte 단위로 작성

	if (file.size > maxSize) { // 파일 크기 초과 시
		alert("10MB 이하의 이미지만 선택해 주세요");

		// 미리보기는 안되어도 크기가 초과된 파일이 선택되어 있음!!

		// 이전 선택된 파일이 없는데 크기 초과 파일을 선택한 경우
		if (lastValidFiles[order] === null) {
			inputImageList[order].value = ""; // 선택 파일 삭제
			return;
		}

		// 이전 선택된 파일이 있을 때
		const dataTransfer = new DataTransfer();
		dataTransfer.items.add(lastValidFiles[order]);
		inputImageList[order].files = dataTransfer.files;

		return;
	}


	// 선택된 이미지 백업
	lastValidFiles[order] = file;

	// 현재 선택 파일 임지 URL 생성 후 미리보기 img 태그에 대입
	const newImageUrl = URL.createObjectURL(file) // 임시 URL 생성
	previewList[order].src = newImageUrl; // 미리보기 img 태그에 대입
	
	// deleteOrderList에서 해당 이미지 순서를 삭제
	// -> 왜?? 이전에 X 버튼을 눌러 삭제 기록이 있을 수도 있기 때문에
	deleteOrderList.delete(order);
}

/* input태그, x버튼에 이벤트 리스너 추가 */
for (let i = 0; i < inputImageList.length; i++) {

	// input 태그에 이미지 선택 시 미리보기 함수 호출
	inputImageList[i].addEventListener("change", e => {
		const file = e.target.files[0];

		if (file === undefined) { // 선택 취소 시

			// 이전에 선택한 파일이 없는 경우
			if (lastValidFiles[i] === null) return;


			//***  이전에 선택한 파일이 "있을" 경우 ***
			const dataTransfer = new DataTransfer();

			// DataTransfer가 가지고 있는 files 필드에 
			// lastValidFiles[i] 추가 
			dataTransfer.items.add(lastValidFiles[i]);

			// input의 files 변수에 lastVaildFile이 추가된 files 대입
			inputImageList[i].files = dataTransfer.files;

			// 이전 선택된 파일로 미리보기 되돌리기
			updatePreview(lastValidFiles[i], i);

			return;
		}

		updatePreview(file, i);
	})

	/* X 버튼 클릭 시 미리보기, 선택된 파일 삭제 */
	deleteImageList[i].addEventListener("click", () => {

		previewList[i].src = ""; // 미리보기 삭제
		inputImageList[i].value = ""; // 선택된 파일 삭제
		lastValidFiles[i] = null; // 백업 파일 삭제

		// 기존에 존재하던 이미지가 있는 상태에서
		// X 버튼이 눌러 졌을 때
		// --> 기존에 이미지가 있었는데 
		//     i번째 이미지 X버튼 눌러서 삭제함 --> DELETE 수행
		if (orderList.includes(i)) {
			deleteOrderList.add(i);
		}

	})

}

const updateBusinessForm = document.querySelector("#updateBusinessForm");

updateBusinessForm.addEventListener("submit", (e) => {

  // 사진 외 부분에 추가적인 로직 구현해야함



  // 사진 부분
  const input = document.createElement("input");

	// Array.from() : Set -> Array로 변환
	// 배열.toString() : [1,2,3] --> "1,2,3" 변환 (그대로 SQL 문법에서 사용할 예정)
	input.value = Array.from(deleteOrderList).toString();

	console.log("삭제된 이미지 리스트 : " + input.value);

	input.name = "deleteOrderList";
	input.type = "hidden";

	updateBusinessForm.append(input); // 자식으로 input 추가
})