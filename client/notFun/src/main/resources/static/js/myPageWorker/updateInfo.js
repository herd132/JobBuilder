const profileImg = document.getElementById("profileImg");  // 미리보기 이미지 img
const imageInput = document.getElementById("imageInput");  // 이미지 파일 선택 input
const deleteImage = document.getElementById("deleteImage");  // 이미지 삭제 버튼
const MAX_SIZE = 1024 * 1024 * 5;

const defaultImageUrl = `${window.location.origin}/images/logo.png`;
let previousImage = profileImg.src; // 이전 이미지 URL 기록 (초기 상태의 이미지 URL 저장)
let previousFile = null; // 이전에 선택된 파일 객체를 저장

imageInput.addEventListener("change", () => {
  // change 이벤트 : 기존에 있던 값과 다르면 change 이벤트 일어남

  console.log(imageInput.files); // FileList (input 태그는 FileList 로 저장)

  const file = imageInput.files[0]; // 선택한 File 객체 가져오기

  if(file) { // 파일이 선택된 경우}
      if(file.size <= MAX_SIZE) { // 파일 크기가 허용범위 이내인 경우
          const newImageUrl = URL.createObjectURL(file);
          // blob:http://localhost/05631bf1-ab54-4219-819f-64600ba28301
          // 미리보기 이미지 url 용도
          profileImg.src = newImageUrl; // 미리보기 이미지 설정(img 태그의 src에 선택한 파일 임시 경로 대입)
          statusCheck = 1; // 새 이미지 선택 상태 기록
          previousImage = newImageUrl; // 현재 선택된 이미지를 이전 이미지로 저장(다음에 바뀔일에 대비)       // img src
          previousFile = file; // 현재 선택된 파일 객체를 이전 파일로 저장(다음에 바뀔일에 대비)               // input files

      } else { // 파일 크기가 허용 범위를 초과한 경우 
          alert("5MB 이하의 이미지를 선택해주세요!");
          imageInput.value = ""; // 1. 파일 선택 초기화
          // (alert 창은 띄웠지만 이미 선택된 큰 사이즈 파일을 비우는건 따로 해야함)
          // == imageInput.files = null;
          profileImg.src = previousImage; // 2. 이전 미리보기 이미지로 복원
          // 3. 파일 입력 복구 : 이전 파일이 존재하면 다시 할당
          if(previousFile) {
              const dataTransfer = new DataTransfer();
              // DataTransfer : 자바스크립트로 파일을 조작 할 때 사용되는 인터페이스
              // DataTransfer.items.add() : 파일 추가
              // DataTransfer.items.remove() : 파일 제거
              // DataTransfer.files : FileList 객체를 반환
              // -> <input type="file"> 요소에 파일을 동적으로 설정 가능
              // --> input 태그의 files 속성을 FileList만 저장 가능하기 때문에
              // DataTransfer를 이용하여 현재 File 객체를 FileList 변환하여 할당
              dataTransfer.items.add(previousFile);
              // 이전 파일을 추가해두기 : DataTransferdp File 객체를 추가
              imageInput.files = dataTransfer.files;
              // 이전 파일로 input 요소의 files 속성을 복구 : DataTransfer에 저장된 
              // 파일의 리스트를 FileList객체로 반환
          };
      };

  } else { // 파일 선택이 취소된 경우
      profileImg.src = previousImage; // 이전 미리 보기 이미지로 복원
      // 파입 입력 복구 : 이전 파일이 존재하면 다시 할당
      if(previouesFile) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(previousFile);
          imageInput.files = dataTransfer.files; // 이전 파일로 input 태그의 files 속성 복구
      };
  };

});

// 이미지 삭제 버튼 클릭 시
deleteImage.addEventListener("click", () => {
  // 기본 이미지 상태가 아니면 삭제 처리
  if(profileImg.src !== defaultImageUrl) {
      imageInput.value = ""; // 파일 선택 초기화
      profileImg.src = defaultImageUrl; // 기본 이미지로 설정
      statusCheck = 0; // 삭제 상태 기록
      previousFile = null; // 이전 파일 초기화 기록
  } else {
      // 기본 이미지 상태에서 삭제 버튼 클릭
      statusCheck = -1; // 변경 사항 없음 상태 유지

  };
});