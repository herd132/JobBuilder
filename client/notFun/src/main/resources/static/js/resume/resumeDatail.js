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
          profileImg
      } = data;

      // 이제 각각의 변수를 사용할 수 있음
      console.log("Resume No:", resumeNo);
      console.log("Member Name:", memberName);
      console.log("Worker Address:", workerAddress);
  })
  .catch(error => {
      console.error("요청 오류:", error);
  });
