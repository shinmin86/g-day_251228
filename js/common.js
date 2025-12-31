// ===== thankYou page only =====
(function(){
  if(!document.body.dataset.page) return;
  if(document.body.dataset.page==="thankyou"){
    const params=new URLSearchParams(location.search);
    const idx=params.get("idx");
    const type=params.get("card_type");
    const idxEl=document.getElementById("cardIndex");
    const typeEl=document.getElementById("cardType");
    if(idx && idxEl) idxEl.textContent=`Index: ${idx}`;
    if(type && typeEl) typeEl.textContent=`Card Type: ${type}`;
  }
})();

function copyLink(){
  navigator.clipboard.writeText(location.href)
    .then(()=>alert("링크가 복사되었습니다."));
}
