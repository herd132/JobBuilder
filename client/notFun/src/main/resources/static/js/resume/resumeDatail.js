fetch("/resume/resumeDetaila", {
  method: "POST",
  headers: {
      "Content-Type": "application/json"
  },
  body: JSON.stringify({ resumeNo: resumeNo })
})
  .then(response => response.json())
  .then(data => {
      console.log("서버에서 받은 데이터:", data);

      // 구조 분해 할당을 사용하여 변수 자동 초기화
      const {resume,careerInfo} = data;

      const {
        resumeNo,
        workerNo,
        resumeTitle,
        resumeContent,
        gradeNo,
        periodNo,
        salaryNo,
        salaryAmount,
        registrationDate,
        modificationDate,
        memberName,
        memberEmail,
        memberTel,
        workerAddress,
        workerBirthDate,
        workerMbti,
        profileImg,
        totalCareer
    } = resume;

    const {companyName} = careerInfo;

      // 이제 각각의 변수를 사용할 수 있음
      console.log("Resume No:", careerInfo);
      console.log("Resume No:", companyName);
      console.log("Member Name:", memberName);
      console.log("Worker Address:", workerAddress);
      console.log("Worker Address:", totalCareer);
 // 경력 변환
const formatCareer = (totalCareer) => {
    if (!totalCareer || totalCareer <= 0) return "신입";
    const totalMonths = Math.floor(totalCareer / 30);
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    return `${years ? `${years}년 ` : ""}${months ? `${months}개월` : ""}`.trim();
  };
  
  // 시간 변환
  const formatTime = (dateString) => {
    if (!dateString) return "수정된 적 없음";
    const diff = Math.floor((new Date() - new Date(dateString)) / 1000 / 60);
    return diff < 60
      ? `${diff}분 전`
      : diff < 1440
      ? `${Math.floor(diff / 60)}시간 전`
      : dateString;
  };


  const content = `경력 : ${formatCareer(totalCareer)}`;
  document.getElementById('content').innerHTML = content;


console.log(data.careerInfo);




  })
  .catch(error => {
      console.error("요청 오류:", error);
  });

