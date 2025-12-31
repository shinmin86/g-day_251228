window.addEventListener("DOMContentLoaded", () => {

  
const urlParams = new URLSearchParams(window.location.search);
// 특정 파라미터 값 가져오기
const url_idx = urlParams.get('idx');   // ?name=홍길동

let card_type = urlParams.get('card_type');
window.card_type = card_type;
console.log('url_idx:', url_idx);
window.o_idx = url_idx;
console.log('window.o_idx:', window.o_idx);


  console.log('#v02')
  $.ajax({
    url: '../admin-json_result.php?idx=' + window.o_idx, 
    method: 'POST',
    contentType: 'application/json',
    data: {
      idx: window.o_idx
    },
    success: function(response) {
      console.log('response:', response);
      $(".mainPhoto img").attr("src", "../" +  response.main.img_url);
      $(".babyName").html(response.main.b_name);
      $(".fathter").html("아빠 "+ response.main.f_name);
      $(".mother").html("엄마 "+ response.main.m_name);

      setTimeout(() => {
        const target = document.getElementById("invitationMain");

        html2canvas(target, {
          width: 1080,
          height: 1920,
          windowWidth: 1080,
          windowHeight: 1920,
          scale: 1,
          useCORS: true,
          scrollX: 0,                     // 스크롤 보정
          scrollY: 0,
          x: 0,
          y: 0

        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg");

          const image = document.createElement("img");
          image.src = imgData;
          image.style.width = "100%";
          image.style.maxWidth = "1080px";
          image.style.display = "block";

          target.style.display = "none";

          const wrapper = document.getElementById("renderedImageWrapper");
          wrapper.innerHTML = "";
          wrapper.appendChild(image);

          let bodyData = {
            idx: window.o_idx,
            did_img: imgData,
          }
          console.log(bodyData, '#bodyData')

          $.ajax({
            url: '../did.php?id=2', // Replace with your endpoint
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(bodyData),
            success: function(response) {
              console.log('Success:', response);
            },
            error: function(xhr, status, error) {
              console.error('Error:', error);
            }
          });
        });
      }, 2000);

      console.log('#v02')
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });
});

