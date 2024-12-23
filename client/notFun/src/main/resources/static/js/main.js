const navMypage = document.querySelector(".nav-mypage");

if( navMypage !== null ) {

  document.querySelector("body").addEventListener("click", e => {
    if (e.target === document.querySelector(".fa-chevron-down ") || e.target === document.querySelector(".nav-nickname")) {
  
      navMypage.classList.remove("hidden");
  
    } else if (e.target !== navMypage) {
      
      navMypage.classList.add("hidden");
    }
  })

}