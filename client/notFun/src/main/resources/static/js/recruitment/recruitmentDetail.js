console.log("recruitmentDetail.js 와 연결됨");






// 마이 페이지에서 상세 공고 페이지 들어온 경우
const goToMyRecruitmentListBtn = document.querySelector("#goToMyRecruitmentListBtn");

if(goToMyRecruitmentListBtn != null){
  goToMyRecruitmentListBtn.addEventListener("click", () => {
    location.href = "/myPageEmp/recruitmentList" + location.search;
  })

}

// 공고 전체페이지에서 상세 공고 페이지 들어온 경우
const goToRecruitmentListBtn = document.querySelector("#goToRecruitmentListBtn");

if(goToRecruitmentListBtn != null){
  goToRecruitmentListBtn.addEventListener("click", () => {
  
    // 요청주소 : /recruitment/detail/10?cp=1  -> /recruitment/list?cp=1
   location.href = "/recruitment/list" + location.search;
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
