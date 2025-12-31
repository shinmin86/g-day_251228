// Placeholder JS (static/offline safe). Replace with original mobileInvitation.js for full behavior.
(function(){
  'use strict';
  // Basic: audio toggle
  const toggle = document.getElementById('musicToggle');
  const audio = document.getElementById('audioOne');
  if(toggle && audio){
    toggle.addEventListener('click', ()=>{
      if(audio.paused){ audio.play().catch(()=>{}); }
      else { audio.pause(); }
    });
  }
  // Disable server-dependent buttons gracefully
  const disable = (sel, msg)=>{
    document.querySelectorAll(sel).forEach(el=>{
      el.addEventListener('click', (e)=>{
        e.preventDefault();
        alert(msg);
      });
    });
  };
  disable('.guestBookBtnWrite, .guestBookBtnMore', '정적 HTML 버전에서는 방명록 기능이 비활성화되어 있습니다.');
  disable('.attendanceBtndelivery', '정적 HTML 버전에서는 참석 등록 기능이 비활성화되어 있습니다.');
})();