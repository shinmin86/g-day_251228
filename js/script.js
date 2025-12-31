const params=new URLSearchParams(window.location.search);
const idx=params.get("idx");
const cardType=params.get("card_type");
document.getElementById("cardType").textContent=cardType?`Card Type: ${cardType}`:"";
document.getElementById("cardIndex").textContent=idx?`Index: ${idx}`:"";
function copyLink(){navigator.clipboard.writeText(window.location.href).then(()=>alert("링크가 복사되었습니다."));}
