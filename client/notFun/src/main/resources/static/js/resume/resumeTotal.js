const cp = document.querySelector(".pagination .active").innerText;
const recommendModal = document.querySelector(".recommend-modal");

fetch("/resume/ajax/list?cp=" + cp)
.then(resp => resp.json())
.then(respMap => {
  const resumeList = respMap.resumeTotalList;
  const memberNo = respMap.memberNo == undefined ? 0 : respMap.memberNo;
  const resumeGrid = document.querySelector(".resume-grid");
  document.querySelector(".pagination").classList.remove("hidden");
  
  let path = window.location.pathname;
  path = path.substring(path.lastIndexOf('/') + 1, path.length);

  // 이력서가 없을 시 처리
  if (resumeList.length == 0) {
    resumeGrid.style.textAlign = 'center';
    resumeGrid.style.height = '400px';
    resumeGrid.style.display = 'block';
    resumeGrid.style.lineHeight = '400px';

    resumeGrid.innerHTML = `
      등록된 이력서가 없습니다.
    `;
    return
  }

  resumeGrid.innerHTML = '';

  resumeList.map(resume => {

    const viewButton = memberNo == 0 ? '<br>': `<a class="view-button" href="/resume/resumeDetail?resumeNo=${resume.resumeNo}">이력서 보기</a>`;
    const profileImg = resume.profileImg !== undefined ? resume.profileImg : '/images/avatar.png';
    let carrer = resume.carrerStr.split("^^^")[0] == "-&&&근무중(1개월 미만)" ?
      '등록된 경력이 없습니다.' : resume.carrerStr.split("^^^");
    let str = "";
    if (Array.isArray(carrer)) {
      carrer.map((c, index) => {
        let arr = c.split("&&&");
        str += arr[0];
        str += arr[1] !== '' ? `(${arr[1]})<br>` : '(경력 기간 미입력)';
      });
    } else {
      str = carrer;
    }
    resumeGrid.innerHTML += `
  <div class="resume-card">
    <div class="resume-header">
      <img src="${profileImg}" alt="Profile image" class="profile-image">
      <div class="basic-info">
        <div class="name">${resume.memberName} </div>
        <div class="age">${resume.age} (${resume.workerBirthDate})</div>
      </div>
    </div>
    <div class="contact-info">
      <div class="info-item">
        <span class="info-label">연락처</span>
        <span>${resume.memberTel}</span>
      </div>
      <div class="info-item">
        <span class="info-label">이메일</span>
        <span>${resume.memberEmail}</span>
      </div>
      <div class="info-item">
        <span class="info-label">지역</span>
        <span>${resume.memberAddress == undefined ? 미입력 : resume.memberAddress}</span>
      </div>
      <div class="info-item">
        <span class="info-label">MBTI</span>
        <span>${resume.workerMbti}</span>
      </div>
    </div>
    <div class="career-info">
      <div class="career-title">주요 경력</div>
      <div class="career-detail">
        ${str}
      </div><br>
      <div class="career-title">희망 업직종</div>
      <div class="career-detail">
        ${resume.workCategory}
      </div>
    </div>
    ${viewButton}
  </div>
`

  });
})

