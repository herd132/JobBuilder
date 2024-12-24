console.log("payments.js 와 연결됨");


// 맴버십 상세 정보 요청
function fetchMembershipDetails() {
  fetch("/payments/details", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      renderDetails(data.membershipDetails);
    });
}

