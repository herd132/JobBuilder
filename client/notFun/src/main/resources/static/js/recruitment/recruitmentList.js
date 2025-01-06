console.log("recruitmentList.js 와 연결됨");


const searchParams = new URLSearchParams(location.search.substring(1));
// console.log(searchParams);
// if(searchParams.has("query")) {
//   console.log("query 있음");
//   console.log(searchParams.get("query"));
// } else {
//   console.log("query 없음");
// }

const recruitmentDetail = (recruitmentNo, cp) => {

  if(searchParams.has("stat")){
    location.href = `/recruitment/detail/${recruitmentNo}`

  }else {
    location.href = `/recruitment/detail/${recruitmentNo}` + location.search;
  }
  
}