console.log("recruitmentDetail.js 와 연결됨");

const newEl = (tag, attr, cls) => {
	const el = document.createElement(tag); // 요소 생성
	for (let key in attr) {
		el.setAttribute(key, attr[key]); // 요소에 속성 추가
		if (key == "value") el.innerText = attr[key];
	}
	for (let className of cls) el.classList.add(className); // 요소에 클래스명 추가

	return el; // 생성된 요소 반환
};

// 마이 페이지에서 상세 공고 페이지 들어온 경우, 마이페이지로 돌아가기
const goToMyRecruitmentListBtn = document.querySelector("#goToMyRecruitmentListBtn");

if(goToMyRecruitmentListBtn != null){
  goToMyRecruitmentListBtn.addEventListener("click", () => {
    const urlParams = new URLSearchParams(location.search);
    location.href = "/myPageEmp/recruitmentList?cp=" + urlParams.get("cp");
  })
}


// 공고 전체페이지에서 상세 공고 페이지 들어온 경우, 공고전체목록으로 돌아가기
const goToRecruitmentListBtn = document.querySelector("#goToRecruitmentListBtn");

if(goToRecruitmentListBtn != null){
  goToRecruitmentListBtn.addEventListener("click", () => {
  
    // 요청주소 : /recruitment/detail/10?cp=1  -> /recruitment/list?cp=1
   location.href = "/recruitment/list" + location.search;
  })
}

// 공고작성한 고용주와와 로그인한 고용주가 일치하는 경우(수정, 삭제)
const updateRecruitmentBtn = document.querySelector("#updateRecruitmentBtn");
const deleteRecruitmentBtn = document.querySelector("#deleteRecruitmentBtn");

if(updateRecruitmentBtn != null){
  updateRecruitmentBtn.addEventListener("click", () => {
    location.href = location.pathname.replace("detail", "update") + location.search;
  })
}

if(deleteRecruitmentBtn != null){
  deleteRecruitmentBtn.addEventListener("click", () => {

    if (!confirm("삭제 하시겠습니까?")) {
      alert("취소되었습니다.");
      return;
    }

    location.href = location.pathname.replace("detail", "delete") + location.search;
  })
}



const modalContainer = document.querySelector('.modal-container');  // div 태그
const modalArea = document.querySelector(".modal-area");            // 실제 영역

// 모달창 닫기 - ESC 키 
document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
      modalContainer.classList.add('hidden');
  }
});

// 모달창 닫기 - 외부 영역 클릭 시
modalContainer.addEventListener('click', (e) => {
  if (e.target === modalContainer) {
      modalContainer.classList.add('hidden');
  }
});

// 알바생이 공고목록에서 이력서 제출하는 경우
const selectResumeBtn = async (workerNo) => {

  modalContainer.classList.remove('hidden');

  console.log(workerNo);
  console.log(typeof workerNo);
  const resp = await fetch("/recruitment/selectResume?workerNo=" + workerNo);

  if(resp.status === 204){
    console.log("작성된 이력서가 없습니다");
    return;
  }

  const resumeList = await resp.json();
  console.log(resumeList);
  openModal(resumeList);

}

// gpt가 짜준 코드
function openModal(data) {

  const modalArea = document.querySelector(".modal-area");
  modalArea.innerHTML = '';  // 기존 내용 지우기

  // 모달 제목
  const modalHeader = newEl('h2', { 'value': '이력서 선택' }, ['modal-header']);
  modalArea.appendChild(modalHeader);

  // 이력서 리스트를 담을 div
  const resumeListContainer = newEl('div', {}, ['resume-list']);
  
  data.forEach(resume => {
    // 각 이력서 항목 생성
    const resumeItem = newEl('div', {}, ['resume-item']);
    
    // 라디오 버튼 생성
    const radioInputId = 'resume_' + resume.resumeNo;
    const radioInput = newEl('input', { 'type': 'radio', 'name': 'resumeNo', 'value': resume.resumeNo, 'id': radioInputId }, []);
    const resumeTitle = newEl('span', { 'value': resume.resumeTitle || '제목 없음' }, ['resume-title']);
    
    // 라디오 버튼과 제목을 감싸는 label
    const label = newEl('label', { 'for': radioInputId }, ['resume-label']);
    label.appendChild(radioInput);
    label.appendChild(resumeTitle);

    resumeItem.appendChild(label);
    
    // 경력 여부 표시
    const careerStatus = newEl('div', {}, ['career-status']);
    if (resume.resumeCareerInfoList.length === 0) {
        careerStatus.innerText = '신입';
    } else {
        careerStatus.innerText = '경력자';
    }
    
    resumeItem.appendChild(careerStatus);

    // 직무 유형(Job Type) 제목 및 목록 추가
    const jobTypeTitle = newEl('div', { 'value': '직무 유형:' }, ['section-title']);
    const jobTypeList = newEl('div', {}, ['job-type-list']);

    resume.resumeJobTypeList.forEach(jobType => {
      const jobTypeItem = newEl('span', { 'value': jobType }, ['job-type-item']);
      jobTypeItem.innerText = jobType;
      jobTypeList.appendChild(jobTypeItem);
    });

    resumeItem.appendChild(jobTypeTitle);
    resumeItem.appendChild(jobTypeList);

    // 업무 유형(Work Type) 제목 및 목록 추가
    const workTypeTitle = newEl('div', { 'value': '업무 유형:' }, ['section-title']);
    const workTypeList = newEl('div', {}, ['work-type-list']);

    resume.resumeWorkTypeList.forEach(workType => {
      const workTypeItem = newEl('span', { 'value': workType.workTypeCategory }, ['work-type-item']);
      workTypeItem.innerText = workType.workTypeCategory;
      workTypeList.appendChild(workTypeItem);
    });

    resumeItem.appendChild(workTypeTitle);
    resumeItem.appendChild(workTypeList);
    
    // 근무 기간(Period) 제목 및 목록 추가
    const periodTitle = newEl('div', { 'value': '근무 기간:' }, ['section-title']);
    const periodList = newEl('div', {}, ['period-list']);

    resume.resumePeriodList.forEach(period => {
      const periodItem = newEl('span', { 'value': period.periodName }, ['period-item']);
      periodItem.innerText = period.periodName;
      periodList.appendChild(periodItem);
    });

    resumeItem.appendChild(periodTitle);
    resumeItem.appendChild(periodList);

    // 근무 시간대(Days & Time) 제목 및 목록 추가
    const daysTimeTitle = newEl('div', { 'value': '근무 시간대:' }, ['section-title']);
    const daysTimeList = newEl('div', {}, ['days-time-list']);
    
    resume.resumeDaysTimeList.forEach(daysTime => {
      const daysTimeItem = newEl('div', {}, ['days-time-item']);
      daysTimeItem.innerText = `${daysTime.daysName} - ${daysTime.timeName}`;
      daysTimeList.appendChild(daysTimeItem);
    });
    
    resumeItem.appendChild(daysTimeTitle);
    resumeItem.appendChild(daysTimeList);

    resumeListContainer.appendChild(resumeItem);
  });

  modalArea.appendChild(resumeListContainer);

  // 제출하기 버튼 추가
  const confirmBtn = newEl('button', { 'value': '제출 하기' }, ['confirm-btn']);
  modalArea.appendChild(confirmBtn);

  // "돌아가기" 버튼 추가
  const goBackBtn = newEl('button', { 'value': '돌아가기'}, ['goBack-btn']);
  modalArea.appendChild(goBackBtn);

  goBackBtn.addEventListener("click", () => {
    modalContainer.classList.add('hidden');
  })
  
  // 모달 띄우기
  const modalContainer = document.querySelector('.modal-container');
  modalContainer.classList.remove('hidden');
  
  // 확인 버튼 클릭 시 처리
  confirmBtn.addEventListener('click', async () => {

    const selectedRadio = document.querySelector('input[name="resumeNo"]:checked');

    if (selectedRadio) {

      const selectedResumeNo = selectedRadio.value;

      console.log(`선택한 이력서 번호: ${selectedResumeNo}`);
      // 선택한 이력서 번호로 추가 작업 가능

      if(!confirm("선택한 이력서로 제출하시겠습니까?")){
        return;
      }
      
      // 무결성 검사
      const url = location.pathname.replace("detail", "confirm") + `?resumeNo=${selectedResumeNo}`
      const resp = await fetch(url);

      if(resp.status === 204){
        alert("동일한 공고에 이미 제출한 이력서입니다");
        return;
      }

      // PFK 테이블에 집어넣는 요청
      location.href = location.pathname.replace("detail", "submit") + `?resumeNo=${selectedResumeNo}`;
      
    } else {
      alert('이력서를 선택해주세요.');
    }
    
  });
}
/* 상세 공고 에서 띄울 사항
  * 1. recruitment
  * recruitmentNo, recruitmentTitle, recruitmentContent/ 공고제목, 공고내용
  * recruitmentDeadline, numOfRecruitmentName/ 마감일, 인원 수
  * jobtypeNo, jobtypeName/ 고용 형태 
  * salaryNo, salaryName, salaryMount/ 급여 형태
  * gradeNo, gradeName/ 학력
  * periodNo, periodName/ 근무 기간
  * daysNo, daysName/ 근무 요일
  * timeNo, timeName/ 근무 시간
  * employerNo, businessNickname/ 사업장 지점
  * writeDate/ 작성일
  * recruitmentDeadline/ 마감일
  * memberNo, businessName/ 회사명
  * businessAddress/ 사업장 주소

  * 2. businessWorktype (여러 개) 업직종
  * businessWorktypeNo
  * employerNo
  * worktypeNo, worktypeCategory

  * 3. preferredList (여러 개) 선호조건
  * recruitmentPreferredNo
  * recruitmentNo
  * preferredNo, preferredCategory

  * 4. supportList (여러 개) 복리후생
  * recruitmentSupportNo
  * SupportNo
  * recruitmentNo
  * supportCategory
  * 
*/


const recommendSelect = document.querySelector(".recommend-select");
const recommendModal = document.querySelector(".recommend-modal");
const recommendModalOutside = document.querySelector(".recommend-modal-outside");
const modalClose = document.querySelector(".modal-close");
let popupOpenType = false;

if (recommendSelect !== null ) {
  recommendSelect.addEventListener("click", () => {

    recommendModal.classList.add('active');
    recommendModalOutside.style.height = document.body.offsetHeight + 'px';
    recommendModalOutside.style.display = 'block';
  });

  recommendModal.addEventListener("mouseenter", () => {
    document.body.style.cssText = `
    position:fixed;
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;
    `;
  });
  
  recommendModal.addEventListener("mouseleave", () => {
    document.body.style.cssText = '';
    window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
  });

  modalClose.addEventListener("click", () => {
    recommendModal.classList.remove('active');
    recommendModalOutside.style.display = 'none';
  })

  recommendModal.addEventListener('mousewheel', function(e) {
   
  }, {passive: false});
}

const createRecommendResumeList = () => {
  const resumeGrid = document.querySelector(".resume-grid");

  resumeGrid.innerHTML += '';

  fetch("/recommend/resume", {
  })
}