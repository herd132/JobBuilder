// fetchEmployerData.js

(async () => {
  // 전역 변수 선언
  window.employerNo = null;
  window.globalMembershipList = []; // 캐싱을 위한 전역 변수

  // DOM 요소 선택
  const selectedBusinessDiv = document.querySelector('.selected-business');
  const businessNameElement = document.getElementById('businessName');
  const employerNoInput = document.getElementById('employerNoInput'); // 히든 인풋

  // 다른 스크립트 로딩 함수
  function loadOtherScripts() {
      const scriptsToLoad = ['/js/payments/membership.js']; // 다른 스크립트 파일 경로들

      // 스크립트를 순차적으로 로드하기 위한 함수
      const loadScriptSequentially = (scripts, index = 0) => {
          if (index >= scripts.length) return Promise.resolve();
          return new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = scripts[index];
              script.async = false; // 순서를 보장하기 위해 async=false 설정
              script.onload = () => {
                  console.log(`${scripts[index]} 로드 완료`);
                  resolve(loadScriptSequentially(scripts, index + 1));
              };
              script.onerror = () => {
                  console.error(`${scripts[index]} 로드 실패`);
                  reject(new Error(`${scripts[index]} 로드 실패`));
              };
              document.body.appendChild(script);
          });
      };

      loadScriptSequentially(scriptsToLoad)
          .then(() => {
              console.log("모든 스크립트 로드 완료");
              // 추가 초기화 로직이 필요하다면 여기에 작성
          })
          .catch(error => {
              console.error("스크립트 로딩 중 에러 발생:", error);
          });
  }

  // 패치 요청 함수
  async function fetchEmployerData() {
      try {
          const response = await fetch('/payments/data'); // 서버에 GET 요청

          if (!response.ok) {
              throw new Error('Failed to fetch data');
          }

          const data = await response.json(); // JSON 데이터 파싱
          console.log("서버에서 받은 데이터", data); // 서버에서 받은 데이터 로그 출력

          // 데이터 처리
          if (data.length === 1) {
              const employerNoFromData = data[0]?.employerNo;
              const businessName = data[0]?.businessName;

              // 데이터 유효성 확인
              if (!employerNoFromData || !businessName) {
                  throw new Error("Invalid data: Missing employerNo or businessName");
              }

              console.log('1개의 사업주', { employerNoFromData, businessName });

              // 히든 인풋에 값을 저장
              if (employerNoInput) {
                  employerNoInput.value = employerNoFromData; // 히든 인풋 값 설정
                  window.employerNo = employerNoFromData; // 전역 변수 업데이트

                  // 히든 인풋 값이 제대로 설정되었는지 로그 출력
                  console.log("패치안에서", employerNoInput.value);
              } else {
                  throw new Error("Hidden input '#employerNoInput' not found.");
              }

              // businessName 업데이트 (UI 처리 예시)
              if (businessNameElement) {
                  businessNameElement.textContent = businessName;
              }

              // employerNo 설정 완료 후 다른 스크립트 로드
              loadOtherScripts();

          } else if (data.length > 1) {
              console.log("여러개 사업주");
              // 여러 개의 고용주 처리 로직 추가
              await createEmployerSelectionUI(data);
              // 사용자가 선택한 후 다른 스크립트 로드
              loadOtherScripts();
          } else {
              console.log("사업주 없음");
              // employerNo가 없을 경우, 필요에 따라 다른 스크립트 로드 또는 에러 처리
          }
      } catch (error) {
          console.error('Error fetching employer data:', error.message);
          // 에러 발생 시, 필요에 따라 다른 스크립트 로드 또는 에러 처리
      }
  }

  // 다중 고용주 선택 UI 생성 함수
  function createEmployerSelectionUI(employers) {
      return new Promise((resolve, reject) => {
          // 기존 UI 초기화 (예: 이전 버튼 제거)
          selectedBusinessDiv.innerHTML = ''; // 기존 내용을 비움

          // 예시: 간단한 선택 버튼 생성
          employers.forEach(employer => {
              const button = document.createElement('button');
              button.textContent = employer.businessName;
              button.dataset.employerNo = employer.employerNo;
              button.style.display = 'block'; // 버튼을 블록 요소로 표시
              button.style.margin = '5px 0'; // 버튼 간 간격 추가

              button.addEventListener('click', () => {
                  // 선택된 고용주 설정
                  window.employerNo = employer.employerNo;
                  if (employerNoInput) {
                      employerNoInput.value = window.employerNo; // 히든 인풋 값 설정

                      // 히든 인풋 값이 제대로 설정되었는지 로그 출력
                      console.log("히든인풋", employerNoInput.value);
                  }
                  if (businessNameElement) {
                      businessNameElement.textContent = employer.businessName;
                  }

                  // 선택된 고용주 UI 업데이트 (예: 선택 UI 숨기기)
                  selectedBusinessDiv.style.display = 'none'; // 선택 UI 숨김

                  // 선택 완료 후 Promise 해제
                  resolve();
              });
              selectedBusinessDiv.appendChild(button);
          });

          // 선택 UI 표시
          selectedBusinessDiv.style.display = 'block';
      });
  }


  // fetchEmployerData를 호출하여 값을 설정하고 기다림
  await fetchEmployerData();

  // employerNo가 설정된 후의 코드
  console.log("다나와서:", window.employerNo);

})();
