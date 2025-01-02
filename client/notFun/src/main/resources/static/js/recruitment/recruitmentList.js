console.log("recruitmentList.js 와 연결됨");

const recruitmentDetail = (recruitmentNo, cp) => {
  location.href = `/recruitment/detail/${recruitmentNo}?cp=` + cp;
}