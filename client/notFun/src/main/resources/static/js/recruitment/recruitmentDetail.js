console.log("recruitmentDetail.js 와 연결됨");

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
