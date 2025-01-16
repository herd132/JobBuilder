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

if (goToMyRecruitmentListBtn != null) {
  goToMyRecruitmentListBtn.addEventListener("click", () => {
    const urlParams = new URLSearchParams(location.search);
    location.href = "/myPageEmp/recruitmentList?cp=" + urlParams.get("cp");
  })
}



// 공고작성한 고용주와와 로그인한 고용주가 일치하는 경우(수정, 삭제)
const updateRecruitmentBtn = document.querySelector("#updateRecruitmentBtn");
const deleteRecruitmentBtn = document.querySelector("#deleteRecruitmentBtn");

if (updateRecruitmentBtn != null) {
  updateRecruitmentBtn.addEventListener("click", () => {
    location.href = location.pathname.replace("detail", "update") + location.search;
  })
}

if (deleteRecruitmentBtn != null) {
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
  if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
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

  if (resp.status === 204) {
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
  const goBackBtn = newEl('button', { 'value': '돌아가기' }, ['goBack-btn']);
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

      if (!confirm("선택한 이력서로 제출하시겠습니까?")) {
        return;
      }

      // 무결성 검사
      const url = location.pathname.replace("detail", "confirm") + `?resumeNo=${selectedResumeNo}`
      const resp = await fetch(url);

      if (resp.status === 204) {
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
const resumeGrid = document.querySelector(".resume-grid");
let windowScoll = false;

// 추천 이력서 모달창 생성
const createRecommendResumeList = () => {
  let path = window.location.pathname;
  path = path.substring(path.lastIndexOf('/') + 1, path.length);

  recommendModal.classList.add('active');
  recommendModalOutside.style.height = document.body.offsetHeight + 'px';
  recommendModalOutside.style.display = 'block';

  fetch("/recommend/resume?recruitmentNo=" + path)
    .then(resp => resp.json())
    .then(resumeList => {

      if (resumeList.length == 0) {
        alert("조회되는 이력서가 없습니다.");
        recommendModal.classList.remove('active');
        recommendModalOutside.style.display = 'none';
        resumeGrid.innerHTML = `
        <div class="loadingBox">
            <div class="dim"></div>
            <div class="circle"></div>
        </div>
      `;
      }

      resumeGrid.innerHTML = '';


      resumeList.map(resume => {

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
            <div class="name">${resume.resumeTitle !== undefined ? resume.resumeTitle : "이력서 제목 미입력"}</div>
            <div class="age">${resume.memberName} ${resume.age} (${resume.workerBirthDate})</div>
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
            <span>${resume.memberAddress}</span>
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
        <a class="view-button" href="/resume/resumeDetail?resumeNo=${resume.resumeNo}">이력서 보기</a>
      </div>
    `

      });
    })
}

// 모달창 관련 이벤트 및 변수들
if (recommendSelect !== null) {
  recommendSelect.addEventListener("click", () => {

    createRecommendResumeList();
  });

  recommendModal.addEventListener("mouseenter", () => {
    windowScoll = document.documentElement.scrollTop;
    document.body.style.cssText = `
    position:fixed;
    top: -${window.scrollY}px;
    overflow-y: scroll;
    width: 100%;
    `;
  });

  recommendModal.addEventListener("mouseleave", () => {
    document.body.style.cssText = '';
    window.scrollTo(0, windowScoll);
  });

  modalClose.addEventListener("click", () => {
    recommendModal.classList.remove('active');
    recommendModalOutside.style.display = 'none';
    resumeGrid.innerHTML = `
      <div class="loadingBox">
          <div class="dim"></div>
          <div class="circle"></div>
      </div>
    `;
  })
}



// 지도 api 작성
let coordinateX;
let coordinateY;
let map;
let markers = [];
let infoWindows = [];
let isPanToTriggered = false;
let markerCluster;

document.addEventListener("DOMContentLoaded", () => {
  const mapElement = document.querySelector("#map");
  const beforeAddress = mapElement?.getAttribute("address");
  const address = beforeAddress.split("^^^");

  if (!address) {
    console.error("address 속성을 찾을 수 없습니다.");
    return;
  }

  // 네이버 맵 API 설정
  naver.maps.Service.geocode({ query: address[1] }, function (status, response) {
    if (status === naver.maps.Service.Status.ERROR) {
      return alert("Something wrong!");
    }

    var result = response.v2,
      items = result.addresses;

    coordinateX = items[0].x;
    coordinateY = items[0].y;

    workplace(coordinateY, coordinateX);
    // 지도 초기화 및 마커 생성
    setTimeout(() => {
      addressMarkers(coordinateY, coordinateX);
      // toiletMarkers('37.7087662', '126.7817724');
    }, 100); // 약간의 딜레이 추가

    const bounds = map.getBounds();
    currentBounds = bounds;

    const range = {
        swLat: bounds._sw._lat,
        neLat: bounds._ne._lat,
        swLng: bounds._sw._lng,
        neLng: bounds._ne._lng
    }

    toiletMarkers(range);
    
    //지도 이동 이벤트
    naver.maps.Event.addListener(map, 'idle', function() {

      const center = map.getCenter();
      map.setCenter(center);
      
      if (isPanToTriggered) {
        // panTo로 인해 발생한 idle이면 무시
        isPanToTriggered = false;
        return;
      }
      

      const bounds = map.getBounds();
      currentBounds = bounds;

      const range = {
          swLat: bounds._sw._lat,
          neLat: bounds._ne._lat,
          swLng: bounds._sw._lng,
          neLng: bounds._ne._lng
      }

      removeAllMarkers();
      toiletMarkers(range);
    });
  });

  
});

// 지도 초기화
function workplace(Y, X) {
  map = new naver.maps.Map("map", {
    center: new naver.maps.LatLng(Y, X),
    zoom: 17,
  });

  map.setOptions('minZoom', 14);
}

// 도착지 마커
function addressMarkers(Y, X) {
  new naver.maps.Marker({
    position: new naver.maps.LatLng(Y, X),
    map: map,
    icon: {
      url: '/images/address.png',
      scale: 0.5, // 50% 크기로 축소
    }
  });
}

// 화장실 마커 함수
function toiletMarkersCreate(toilet) {
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(toilet.latitude, toilet.longitude),
    map: map
  });

  const infoWindow = new naver.maps.InfoWindow({
    content: '<div class="info" style="width:200px;text-align: center;padding: 10px"><b>' + toilet.toiletName +
        '</b></br>' + toilet.roadName + '</div>'
  });

  markers.push(marker);
  infoWindows.push(infoWindow);
}

// 화장실 마커 fetch 정보 가져오기
const toiletMarkers = (range) => {
  fetch("/toilet/find?" + new URLSearchParams(range).toString())
  .then(resp => resp.json())
  .then(toiletList => {
    
    for(let toilet of toiletList) {
      toiletMarkersCreate(toilet);
    }
    
    for (let i=0; i<markers.length; i++) {
      naver.maps.Event.addListener(map, "click", ClickMap(i));
      naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
    }

    // // 클러스터링 초기화
    // if (!markerCluster) {
    //   markerCluster = new MarkerClustering({
    //     minClusterSize: 3,
    //     maxZoom: 18,
    //     map: map,
    //     markers: markers,
    //     disableClickZoom: true,
    //     gridSize: 120,
    //     icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
    //     indexGenerator: [10, 100, 200, 500, 1000],
    //     stylingFunction: function(clusterMarker, count) {
    //       const test = clusterMarker.getElement().querySelector("div");
    //       test.innerHTML = count;
    //     }
    //   });
    // } else {
    //   // 마커가 업데이트된 경우 클러스터링 재설정
    //   markerCluster.setMarkers(markers);
    // }
  })
}

// 모든 마커 삭제
function removeAllMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // 지도에서 마커 제거
  }
  markers = [];

  for (let i = 0; i < infoWindows.length; i++) {
      infoWindows[i].close();
  }
  infoWindows = [];
}

// 다른 곳 클릭 시 infoWindow 닫기
function ClickMap(seq) {
  return function () {
    if(infoWindows[seq] ) {
      infoWindows[seq].close();
    }
  }
}

// 마커 클릭 이벤트
function getClickHandler(seq) {
  return function () {
    const marker = markers[seq],
    infoWindow = infoWindows[seq];

    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      infoWindow.open(map, marker);
      const position = marker.getPosition();
      isPanToTriggered = true; // panTo로 인해 idle 이벤트가 발생할 것임을 표시
      map.panTo(position); // 부드럽게 이동
    }
  }
}

// 사업장 홍보 페이지 보여주기
const showPromoteBusiness = document.querySelector(".showPromoteBusiness");
showPromoteBusiness.addEventListener("click", () => { 
  console.log(typeof recruitmentNo);
  
  let path = window.location.pathname;
  path = path.substring(path.lastIndexOf('/') + 1, path.length);
  location.href = "/recruitment/showPromoteBusiness?recruitmentNo=" + path + "&businessNickname=" + businessNickname;  
});

// 길찾기 클릭시 이벤트
document.getElementById('navigate').addEventListener('click', function () {

  const mapElement = document.querySelector("#map");
  const beforeAddress = mapElement?.getAttribute("address");
  const address = beforeAddress.split("^^^");

  const destination = address[1].replace(/ /g, "%20"); // 도착지 주소

  naver.maps.Service.geocode({ query: address[1] }, function(status, response) {
    if (status === naver.maps.Service.Status.ERROR) {
      return alert('Something wrong!');
    }
  
    // 성공 시의 response 처리
    var result = response.v2,
    items = result.addresses;

    const url = `https://map.naver.com/v5/directions/-/${items[0].x},${items[0].y},${destination},,/-/transit?c=${items[0].x},${items[0].y},15,0,0,0,dh`;
    // setMarkers(items[0].y, items[0].x);
    window.open(url, '_blank'); // 새 창에서 열기
  });
});

// 클러스터 초기화
// var htmlMarker1 = {
//   content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/images/cluster-marker-1.png);background-size:contain;"></div>',
//   size: N.Size(40, 40),
//   anchor: N.Point(20, 20)
// },
// htmlMarker2 = {
//   content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/images/cluster-marker-2.png);background-size:contain;"></div>',
//   size: N.Size(40, 40),
//   anchor: N.Point(20, 20)
// },
// htmlMarker3 = {
//   content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/images/cluster-marker-3.png);background-size:contain;"></div>',
//   size: N.Size(40, 40),
//   anchor: N.Point(20, 20)
// },
// htmlMarker4 = {
//   content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/images/cluster-marker-4.png);background-size:contain;"></div>',
//   size: N.Size(40, 40),
//   anchor: N.Point(20, 20)
// },
// htmlMarker5 = {
//   content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/images/cluster-marker-5.png);background-size:contain;"></div>',
//   size: N.Size(40, 40),
//   anchor: N.Point(20, 20)
// };
