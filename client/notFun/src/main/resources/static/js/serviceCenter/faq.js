document.addEventListener('DOMContentLoaded', function() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
          // 현재 아이템의 상태를 확인
          const isActive = item.classList.contains('active');
          
          // 모든 아이템을 닫음
          faqItems.forEach(otherItem => {
              if (otherItem !== item && otherItem.classList.contains('active')) {
                  otherItem.classList.remove('active');
              }
          });
          
          // 현재 아이템의 상태를 토글
          if (!isActive) {
              item.classList.add('active');
          } else {
              item.classList.remove('active');
          }

          question.classList.add('active');
      });
  });
});