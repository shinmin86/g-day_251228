
(async()=>{
 const e=await fetch('data/event.json').then(r=>r.json());
 document.querySelector('.name').textContent=e.babyName;
 document.querySelector('.datetime').textContent=`${e.dateISO} (${e.dayKo}) ${e.time}`;
 document.querySelector('.place').textContent=e.place;
 document.querySelector('.parents').textContent=`아빠 ${e.father} · 엄마 ${e.mother}`;
})();
