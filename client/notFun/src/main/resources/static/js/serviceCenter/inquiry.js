const subCategories = {
  1: [
    { value: '1', text: '회원가입/탈퇴' },
    { value: '2', text: '회원정보 변경' },
    { value: '3', text: '이력서 관리' },
    { value: '3', text: '회사명/사업자등록번호변경' }
  ],
  2: [
    { value: '1', text: '알바검색' },
    { value: '2', text: '이력서 지원' },
    { value: '3', text: '알바지원내역' }
  ],
  3: [
    { value: '1', text: '공고등록' },
    { value: '2', text: '채용공고 심사/관리' },
    { value: '3', text: '지원자 관리' }
  ],
  4: [
    { value: '1', text: '공고등록상품' },
    { value: '2', text: '환불관련' },
    { value: '3', text: '결제오류' }
  ],
  5: [
    { value: '1', text: '거짓채용공고 신고' },
    { value: '2', text: '게시판 글 신고' },
    { value: '3', text: '근로분쟁' }
  ],
  6: [
    { value: '1', text: '기타' }
  ]
};

function updateSubCategory() {
  const mainCategory = document.getElementById('mainCategory');
  const subCategory = document.getElementById('subCategory');

  // 소분류 선택 초기화
  subCategory.innerHTML = '<option value="">소분류 선택</option>';

  if (mainCategory.value) {
    // 대분류가 선택되면 소분류 활성화
    subCategory.disabled = false;

    // 선택된 대분류에 해당하는 소분류 옵션 추가
    subCategories[mainCategory.value].forEach(category => {
      if (mainCategory.value == 6) {
        subCategory.innerHTML = "";
        subCategory.readOnly = true;
      }

      const option = document.createElement('option');
      option.value = category.value;
      option.textContent = category.text;
      subCategory.appendChild(option);
    });
  } else {
    // 대분류가 선택되지 않으면 소분류 비활성화
    subCategory.disabled = true;
  }
}

// 글자수 카운터 함수
// 글자수 카운터 함수 수정
function updateCharCount(textarea) {
  const maxLength = 2000;
  const currentLength = textarea.value.length;
  const charCounter = textarea.parentElement.querySelector('.char-counter');

  // 입력된 글자수가 최대 글자수를 초과하는 경우
  if (currentLength > maxLength) {
    // 초과된 부분을 잘라내기
    textarea.value = textarea.value.substring(0, maxLength);
    textarea.classList.add('exceed');
    charCounter.classList.add('exceed');
  } else {
    textarea.classList.remove('exceed');
    charCounter.classList.remove('exceed');
  }

  // 현재 글자수 업데이트
  charCounter.textContent = `${textarea.value.length} / ${maxLength}자`;
}

let selectedFiles = [];

function handleFileSelect(input) {
  const MAX_SIZE = 1024 * 1024 * 5;
  const fileError = document.querySelector('.file-error');
  const files = input.files;

  if (files[0].size > MAX_SIZE) {
    alert("파일의 용량이 5MB보다 큽니다.");
    input.value = '';
    return;
  }

  // 파일 선택이 취소된 경우
  if (files.length === 0) return;

  // 최대 파일 개수 체크
  if (selectedFiles.length + files.length > 3) {
    fileError.classList.add('show');
    input.value = ''; // 입력 초기화
    setTimeout(() => fileError.classList.remove('show'), 3000);
    return;
  }

  // 새로운 파일들 처리
  Array.from(files).forEach(file => {
    // 이미 같은 이름의 파일이 있는지 확인
    const isDuplicate = selectedFiles.some(f => f.name === file.name);
    if (!isDuplicate && selectedFiles.length < 3) {
      selectedFiles.push(file);
      displayFile(file);
    }
  });

  // 입력 초기화
  input.value = '';
  updateFileList();
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function displayFile(file) {
  const fileList = document.getElementById('fileList');
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  fileItem.innerHTML = `
      <div class="file-info">
          <span class="file-name">${file.name}</span>
          <span class="file-size">(${formatFileSize(file.size)})</span>
      </div>
      <button type="button" class="delete-file" onclick="removeFile('${file.name}')">&times;</button>
  `;
  fileList.appendChild(fileItem);
}

function removeFile(fileName) {
  selectedFiles = selectedFiles.filter(file => file.name !== fileName);
  updateFileList();
}

function updateFileList() {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = '';
  selectedFiles.forEach(file => displayFile(file));
}

// 폼 제출 시 선택된 파일들 처리
document.querySelector('.inquiry-form').addEventListener('submit', function (e) {
  e.preventDefault();
  // FormData 객체 생성
  const formData = new FormData();

  // 기존 파일 입력 제거
  formData.delete("images");
  console.log(selectedFiles);

  if(selectedFiles.length > 0 ) {
    // 선택된 파일들 추가
    selectedFiles.forEach((file, index) => {
      formData.append("images", file);
    });
  }

  let inquiry = {
    inquiryTitle: document.querySelector("#title").value,
    inquiryContent: document.querySelector("#content").value.replaceAll(/(?:\r\n|\r|\n)/g, "<br>"),
    inquiryMajorCategory: document.querySelector("#mainCategory").value,
    inquiryMinorCategory: document.querySelector("#subCategory").value
  }

  formData.append('inquiry', new Blob([JSON.stringify(inquiry)], { type: "application/json" }));

  // 여기에 실제 서버로 전송하는 코드 추가
  fetch('/serviceCenter/inquirysInsert', {
    method: 'PUT',
    body: formData
  }).then(resp => resp.text())
    .then(count => {

      if (count > 0) {
        alert("문의가 성공적으로 이루어졌습니다.");
        location.href = "/";
      } else {

        alert("문의가 실패했습니다.");
        location.href = "/serviceCenter/inquiry";
      }
    });
});

// 탭 전환 함수
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  const writeTab = document.getElementById('writeTab');
  const listTab = document.getElementById('listTab');

  tabs.forEach(tab => tab.classList.remove('active'));

  if (tabName === 'write') {
    document.querySelector('.tab:first-child').classList.add('active');
    writeTab.style.display = 'block';
    listTab.style.display = 'none';
  } else {
    document.querySelector('.tab:last-child').classList.add('active');
    writeTab.style.display = 'none';
    listTab.style.display = 'block';

    document.querySelector("#title").value = '';
    document.querySelector("#content").value = '';
    document.querySelector("#mainCategory").value = '';
    document.querySelector("#subCategory").value = '';
    document.querySelector(".char-counter").innerHTML = '0 / 2000자';

    selectedFiles = '';
    document.getElementById('mainCategory').value = '';
    updateSubCategory();

    selectInquiryList(1);
  }
}

// 문의 내역 토글 함수
function toggleInquiry(header) {
  const content = header.nextElementSibling;
  content.classList.toggle('show');
}

function selectInquiryList(cp) {

  fetch("/serviceCenter/selectInquiryList?cp=" + cp)
    .then(resp => resp.json())
    .then(result => {

      createListTap(result.inquiryList);
      inquiryPagination(result.pagination);
    })
}

function inquiryPagination(pagination) {
  const paginationDiv = document.querySelector(".pagination");
  paginationDiv.innerHTML = `
    <a class="page-btn" value=${pagination.startPage}>&lt;&lt;</a>
    <a class="page-btn" value=${pagination.prevPage}>&lt;</a>
  `;

  let currentMaxPage = pagination.nextPage < pagination.endPage ? pagination.nextPage - 1 : pagination.endPage;

  for (let i = pagination.prevPage; i <= currentMaxPage; i++) {

    if (i == pagination.currentPage) {
      paginationDiv.innerHTML += `<a class="page-btn active" value=${i}>${i}</a>`
    } else {
      paginationDiv.innerHTML += `<a class="page-btn" value=${i}>${i}</a>`
    }

  }

  paginationDiv.innerHTML += `
    <a class="page-btn" value=${pagination.nextPage}>&gt;</a>
    <a class="page-btn" value=${pagination.endPage}>&gt;&gt;</a>
  `;

  const paginations = document.querySelectorAll(".pagination a");

  paginations.forEach(page => {

    if (page.getAttribute("value") != pagination.currentPage) {
      page.addEventListener("click", e => {
        selectInquiryList(e.target.getAttribute("value"));
      })
    }
  });
}

function createListTap(inquiryList) {

  const listTab = document.querySelector("#listTab div");
  
  listTab.innerHTML = '';

  inquiryList.forEach(inquiry => {
    const status = inquiry.inquiryStatus == 1 ?
        `<span class="inquiry-status status-waiting">답변 대기</span>` :
        `<span class="inquiry-status status-completed">답변 완료</span>`;
    listTab.innerHTML += `
      <div class="inquiry-item">
        <div class="inquiry-header" onclick="toggleInquiry(this)">
          <div class="inquiry-title">${inquiry.inquiryTitle}</div>
          ${status}
          <div class="inquiry-meta">
              <span>${inquiry.inquiryEnrollDate}</span>
              <span>${inquiry.inquiryMajorCategoryName} &gt; ${inquiry.inquiryMinorCategoryName}</span>
          </div>
        </div>
        <div class="inquiry-content">
          <h4 style="margin-bottom: 0.5rem">문의 내용</h4>
          <p>${inquiry.inquiryContent}</p><br><br>
          <p>수신 동의한 이메일 : ${inquiry.memberEmail}</p>
        </div>
      </div>
    `;
  })
}

function updateTitle(input) {
  
  const maxLength = 25;
  const currentLength = input.value.length;

  // 입력된 글자수가 최대 글자수를 초과하는 경우
  if (currentLength > maxLength) {
    // 초과된 부분을 잘라내기
    input.value = input.value.substring(0, maxLength);
  } 
}