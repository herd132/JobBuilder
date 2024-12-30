IMP.init("imp41253800"); // 예: 'imp00000000'


const button = document.querySelector("#button");

const onClickPay = async () => {
  alert("테스트");
  IMP.request_pay ({
    pg: "kakaopay",
    channelKey: "channel-key-9bcb53f0-0601-4878-92c4-10cc3da1fc03",
    pay_method: "card",
    amount: "600",
    name: "매운 라면",
    merchant_uid: "abc123123",
  });
};

button.addEventListener("click", onClickPay);