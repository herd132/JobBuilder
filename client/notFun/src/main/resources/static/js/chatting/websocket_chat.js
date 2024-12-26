const testSock = new SockJS("/chatSock");

const sendMessageFn = (name, str) => {

  const obj = {
    "name" : name,
    "str" : str
  };

  testSock.send(JSON.stringify(obj));

}

testSock.addEventListener("message", e => {

  // e.data : 서버로 부터 전달 받은 message
  const msg = JSON.parse(e.data);
  console.log(`${msg.name} : ${msg.str}`);
  
})