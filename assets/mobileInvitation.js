let f_num = "";
let m_num = "";
let add1 = "";
let msg_idx_eq = -1;

const urlParams = new URLSearchParams(window.location.search);
// 특정 파라미터 값 가져오기
const url_idx = urlParams.get('idx');   // ?name=홍길동
let card_type = urlParams.get('card_type');
window.card_type = card_type;

console.log('url_idx:', url_idx);
window.o_idx = url_idx;
console.log('window.o_idx:', window.o_idx);

const guestBookEntries = []; // 최신순 방명록 데이터
let editTarget = null; // 수정 대상 DOM

// 방명록 렌더링 (최대 3개)
function renderGuestBook() {
  document.querySelectorAll(".guestBookContent").forEach((el) => el.remove());

  const topEntries = guestBookEntries.slice(0, 3);
  topEntries.forEach((entry) => {
    const el = createGuestBookElement(entry.name, entry.message, entry.msg_idx);
    document.querySelector(".guestBook").insertBefore(el, document.querySelector(".guestBookBtn"));
  });
}

  // 방명록 요소 생성
  function createGuestBookElement(name, message, msg_idx) {
    const newContent = document.createElement("div");
    newContent.classList.add("guestBookContent");
    newContent.innerHTML = `
    <div class="guestBookContentText">
      <p class="guestBookContentTextfrom"><span>${name}</span></p>
      <p class="guestBookContentTextfromWhoText">${message}</p>
    </div>
    <div class="guestBookContentBtn">
      <ul class="guestBookContentBtnList">
        <li><img src="../src/common/editBtn.png" class="editBtn" /></li>
        <li><img src="../src/common/deleteBtn.png" class="deleteBtn" /></li>
      </ul>
    </div>
  `;

    // 삭제 이벤트
    newContent.querySelector(".deleteBtn").addEventListener("click", () => {
      const idx = guestBookEntries.findIndex(
        (e) => e.msg_idx === msg_idx
      );

      if (idx > -1 && confirm("정말 삭제하시겠습니까?")) {
        if(window.my_id == window.userid){
          console.log('자체 계정')
          let bodyData = {
            idx: window.o_idx,
            userid: name,
            content: message,
            msg_idx: msg_idx,
            pwd: '####'
          }
          console.log(bodyData, '#bodyData')
          //삭제
          $.ajax({
            url: 'admin-json-del-comment.php', // Replace with your endpoint
            method: 'POST',
            async: false,
            contentType: 'application/json',
            data: JSON.stringify(bodyData),
            success: function(response) {
              if(response.res_state == "0"){
                alert(response.res)
              } else {
                console.log('Success:', response);
                loadComment();
                console.log('guestBookEntries:', guestBookEntries);
                document.getElementById("guestBookAllModal").querySelector(".guestBookAllContentsContainer").innerHTML = "";
                guestBookEntries.forEach((entry) => {
                  console.log('#guestBookEntries');
                  const el = createGuestBookElement(entry.name, entry.message, entry.msg_idx);
                  console.log(el, '#el')
                  document.getElementById("guestBookAllModal").querySelector(".guestBookAllContentsContainer").appendChild(el);
                });
              }
            },
            error: function(xhr, status, error) {
              console.error('Error:', error);
            }
          });
          //renderGuestBook();
          editTarget = null;
        } else {
          // 삭제 이벤트
          document.querySelector("input[name='msg_idx']").value = msg_idx;
          document.querySelector("input[name='name']").value = name;
          document.querySelector("textarea[name='textarea']").value = message;
          document.querySelector("input[name='password']").value = "";
          document.getElementById("guestBookModalOverlay").style.display = "flex";
          editTarget = newContent;
          document.querySelector(".guestBookWriteBtn button").textContent = "삭제하기";
        }
      }
    });

    // 수정 이벤트
    newContent.querySelector(".editBtn").addEventListener("click", () => {
      document.querySelector("input[name='msg_idx']").value = msg_idx;
      document.querySelector("input[name='name']").value = name;
      document.querySelector("textarea[name='textarea']").value = message;
      document.querySelector("input[name='password']").value = "";
      document.getElementById("guestBookModalOverlay").style.display = "flex";
      editTarget = newContent;
      document.querySelector(".guestBookWriteBtn button").textContent = "수정하기";
    });

    return newContent;
  }

document.addEventListener("DOMContentLoaded", () => {
  //   배경음악 스크립트

  const musicToggle = document.getElementById("musicToggle");
  const audio = document.getElementById("audioOne");
  const icon = document.getElementById("musicIcon");

  let isPlaying = false;

  window.addEventListener("DOMContentLoaded", () => {
    // const tryPlay = audio.play();

    // if (tryPlay !== undefined) {
    //   tryPlay
    //     .then(() => {
    //       isPlaying = true;
    //       icon.classList.remove("paused");
    //     })
    //     .catch((err) => {
    //       isPlaying = false;
    //       icon.classList.add("paused");
    //       console.warn("브라우저가 자동 재생을 차단함:", err);
    //     });
    // }
  });
  $(".greetingPhoto").css("display", 'none')
  //$(".greetingText").css("display", 'none')
  musicToggle.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      icon.classList.add("paused");
    } else {
      audio.play();
      icon.classList.remove("paused");
    }
    isPlaying = !isPlaying;
  });

  //  연락하기 모달

  const callBtnModalOpenBtn = document.getElementById("callBtnCall");
  const momAndDadCallDeleteBtn = document.querySelector(
    ".momAndDadCallDeleteBtn"
  );
  const callBtnModalOverlay = document.getElementById("callBtnModalOverlay");

  callBtnModalOpenBtn.addEventListener("click", () => {
    callBtnModalOverlay.style.display = "flex";
  });

  momAndDadCallDeleteBtn.addEventListener("click", () => {
    callBtnModalOverlay.style.display = "none";
  });

 const modalImageWrapper = document.querySelector(".modalImageWrapper");

  modalImageWrapper.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  modalImageWrapper.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = endX - startX;

    if (Math.abs(diff) > 50) {
      // 스와이프 감지 기준 (50px 이상 이동)
      if (diff > 0) {
        // 오른쪽 → 이전 이미지
        showPrevImage();
      } else {
        // 왼쪽 → 다음 이미지
        showNextImage();
      }
    }
  }

  function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalImage();
  }

  function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateModalImage();
  }

  //  갤러리 팝업

  let images = document.querySelectorAll(".galleryPhotos img");
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const counter = document.getElementById("imageCounter");
  const closeBtn = document.getElementById("closeBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentIndex = 0;

  function openModal(index) {
    images = document.querySelectorAll(".galleryPhotos img");
    currentIndex = index;
    updateModalImage();
    modal.classList.add("active");
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  function updateModalImage() {
    modalImage.src = images[currentIndex].src;
    counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateModalImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateModalImage();
  }

  images.forEach((img, index) => {
    img.addEventListener("click", () => openModal(index));
  });

  closeBtn.addEventListener("click", closeModal);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });


  //  방명록 나오고 사라지기

  const guestBookWriteOpenBtn = document.querySelector(".guestBookBtnWrite");
  const guestBookWriteCloseBtn = document.querySelector(".guestBookDeleteBtn");
  const modalOverlay = document.getElementById("guestBookModalOverlay");

  guestBookWriteOpenBtn.addEventListener("click", () => {
    modalOverlay.style.display = "flex";
  });

  guestBookWriteCloseBtn.addEventListener("click", () => {
    modalOverlay.style.display = "none";
  });

  //  방명록 작성하기

  const writeBtn = document.querySelector(".guestBookWriteBtn button");
  const guestBookModal = document.getElementById("guestBookModalOverlay");
  const guestBookContainer = document.querySelector(".guestBook");
  const guestBookBtnArea = document.querySelector(".guestBookBtn");

  const allModal = document.getElementById("guestBookAllModal");
  const allContentsContainer = allModal.querySelector(
    ".guestBookAllContentsContainer"
  );
  const moreBtn = document.querySelector(".guestBookBtnMore");
  const guestBookAllModalcloseBtn = allModal.querySelector(
    ".guestBookAllModalCloseBtn"
  );


  // 작성/수정 버튼 클릭
  writeBtn.addEventListener("click", () => {
    const msg_idx_input = document.querySelector("input[name='msg_idx']");
    const nameInput = document.querySelector("input[name='name']");
    const messageInput = document.querySelector("textarea[name='textarea']");
    const passwordInput = document.querySelector("input[name='password']");

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    const password = passwordInput.value.trim();
    const msg_idx = msg_idx_input.value.trim();

    if (!name || !password || !message) {
      alert("작성자, 비밀번호, 내용을 모두 입력해주세요.");
      return;
    }

    if (!/^\d{4}$/.test(password)) {
      alert("비밀번호는 숫자 4자리여야 합니다.");
      passwordInput.focus();
      return;
    }
    console.log(editTarget, '#')
    if (editTarget && document.body.contains(editTarget)) {
      const idx = guestBookEntries.findIndex(
        (e) =>
          e.msg_idx === msg_idx
      );
      console.log(idx, '########idx')
      if (idx > -1) {
        guestBookEntries[idx] = { name, message, msg_idx }; // 수정된 데이터로 업데이트
      }
      editTarget = null;
    } else {
      guestBookEntries.unshift({ name, message, msg_idx });
    }

    //renderGuestBook();

    nameInput.value = "";
    messageInput.value = "";
    passwordInput.value = "";
    guestBookModal.style.display = "none";

    if(writeBtn.textContent == "삭제하기"){
        writeBtn.textContent = "작성하기";
        //삭제
        //guestBookEntries.splice(idx, 1);
        let bodyData = {
          idx: window.o_idx,
          userid: name,
          content: message,
          msg_idx: msg_idx,
          pwd: password
        }
        console.log(bodyData, '#bodyData')
        //삭제
        $.ajax({
          url: 'admin-json-del-comment.php', // Replace with your endpoint
          method: 'POST',
          async: false,
          contentType: 'application/json',
          data: JSON.stringify(bodyData),
          success: function(response) {
            if(response.res_state == "0"){
              alert(response.res)
            } else {
              console.log('Success:', response);
              loadComment();
              document.getElementById("guestBookAllModal").querySelector(".guestBookAllContentsContainer").innerHTML = "";
              guestBookEntries.forEach((entry) => {
                
                const el = createGuestBookElement(entry.name, entry.message, entry.msg_idx);
                document.getElementById("guestBookAllModal").querySelector(".guestBookAllContentsContainer").appendChild(el);
              });
            }
          },
          error: function(xhr, status, error) {
            console.error('Error:', error);
          }
        });
        //renderGuestBook();
        editTarget = null;
    } else {
      writeBtn.textContent = "작성하기";
      console.log(window.o_idx, '#window.o_idx')
      let bodyData = {
        idx: window.o_idx,
        userid: name,
        pwd: password,
        content: message,
        msg_idx: msg_idx
      }
      console.log(bodyData, '#bodyData')
      //추가
      $.ajax({
        url: 'admin-json-ins_comment.php', // Replace with your endpoint
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(bodyData),
        success: function(response) {
          if(response.res_state == "0"){
            alert(response.res)
          } else {
            alert(response.res)
            console.log('Success:', response);
            loadComment();

            console.log(guestBookEntries.length, '#guestBookEntries')
            console.log(guestBookEntries, '#guestBookEntries')

            guestBookEntries.forEach((entry) => {
              console.log('add guestBookEntries appendChild')
              const el = createGuestBookElement(entry.name, entry.message, entry.msg_idx);
              allContentsContainer.appendChild(el);
            });
          
          }
        },
        error: function(xhr, status, error) {
          console.error('Error:', error);
        }
      });
      editTarget = null;
    }
  });

  // 전체보기 버튼
  moreBtn.addEventListener("click", () => {
    allContentsContainer.innerHTML = "";
    guestBookEntries.forEach((entry) => {
      const el = createGuestBookElement(entry.name, entry.message, entry.msg_idx);
      allContentsContainer.appendChild(el);
    });
    allModal.style.display = "flex";
  });

  // 전체보기 닫기
  guestBookAllModalcloseBtn.addEventListener("click", () => {
    allModal.style.display = "none";
  });

  // 초기 렌더링
  renderGuestBook();

  // 모달 닫기(X) 버튼 이벤트
  const guestBookModalCloseBtn = document.querySelector(".guestBookDeleteBtn");
  guestBookModalCloseBtn.addEventListener("click", () => {
    guestBookModal.style.display = "none";
    editTarget = null; // 수정 모드 초기화
    document.querySelector("input[name='msg_idx']").value = msg_idx_eq;
    document.querySelector("input[name='name']").value = "";
    document.querySelector("textarea[name='textarea']").value = "";
    document.querySelector("input[name='password']").value = "";

    msg_idx_eq--;
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".guestBookContent").forEach((el) => {
      el.style.display = "none";
    });
  });

  //  계좌 토글

  document.querySelectorAll(".openAndClose button").forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const accountText = document.querySelectorAll(".accountContentText")[
        index
      ];
      const arrowImg = btn.querySelector("img");

      const isOpen = accountText.classList.contains("show");

      if (isOpen) {
        accountText.classList.remove("show");
        arrowImg.classList.remove("rotate");
      } else {
        accountText.classList.add("show");
        arrowImg.classList.add("rotate");
      }
    });
  });

  document.querySelectorAll(".accountContentBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rawText = btn.parentElement.querySelector(
        ".accountContentTextNumber"
      ).innerText;

      const onlyNumbers = rawText.replace(/\D/g, "");

      navigator.clipboard
        .writeText(rawText)
        .then(() => {
          alert("계좌번호가 복사되었습니다.");
        })
        .catch((err) => {
          alert("복사에 실패했습니다.");
        });
    });
  });

  //  참석여부 모달

  const attendanceModalOpenBtn = document.querySelector(
    ".attendanceBtndelivery"
  );
  const attendanceModalCloseBtn = document.querySelector(
    ".attendanceModalCloseBtn"
  );
  const attendanceModalCloseBtnBottom = document.querySelector(
    ".attendanceModalCloseBtnBottom"
  );
  const attendanceModalOverlay = document.getElementById(
    "attendanceModalOverlay"
  );

  attendanceModalOpenBtn.addEventListener("click", () => {
    attendanceModalOverlay.style.display = "flex";
  });

  attendanceModalCloseBtn.addEventListener("click", () => {
    attendanceModalOverlay.style.display = "none";
  });

  attendanceModalCloseBtnBottom.addEventListener("click", () => {
    attendanceModalOverlay.style.display = "none";
  });

  //  링크 and 카톡 복사
  // 1. 카카오 초기화 (여기 YOUR_APP_KEY를 실제 키로 바꾸세요)
  Kakao.init("5c75410e0e94618049d381d090a204bf");

  // 2. 링크 복사 기능
  document.getElementById("copyLinkBtn").addEventListener("click", function () {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("링크가 복사되었습니다!");
      })
      .catch((err) => {
        console.error("링크 복사 실패:", err);
      });
  });

  $.ajax({
    url: 'admin-json_result.php?idx=' + window.o_idx, 
    method: 'POST',
    contentType: 'application/json',
    data: {
      idx: window.o_idx
    },
    success: function(response) {
      var audio = $("#audioOne")[0]; // 取 DOM 元素
      if(response.main.ck_auto_bg_sound == "on"){
          console.log('#0981')
          if(response.main.audioOne == "1"){
            audio.pause();
            audio.currentTime = 0; // 回到开头         
            document.getElementById("audioOne").src="../src/music/08. Refracting Lights.mp3"
            audio.play().catch(e => {
              console.log("浏览器阻止了自动播放2:", e);
            });
          } else if(response.main.audioOne == "0"){
            audio.play().catch(e => {
              console.log("浏览器阻止了自动播放1:", e);
            });
          } else {
            audio.pause();
            audio.currentTime = 0; // 回到开头  
          }
      } else {
          console.log('#0982')
          audio.pause();
          audio.currentTime = 0; // 回到开头
      }

      console.log('response:', response);
      $(".mainPhoto img").attr("src", response.main.img_url);
      $(".babyName").html(response.main.b_name);
      $(".calendar").html(response.main.fiesta_day);

      let dayofweek = getKoreanDayOfWeek(response.main.fiesta_day)
      $(".day").eq(0).html(` (${dayofweek}) `);
      $(".day").eq(1).html(` (${dayofweek}) `);
      $(".time").html(response.main.ampm + "" +response.main.fiesta_h + ":" + response.main.fiesta_i);
      $(".fathter").html("아빠 "+ response.main.f_name);
      $(".mother").html("엄마 "+ response.main.m_name);
      $(".greetingPhoto img").attr("src", response.main.bbs_file7);
      // $(".greetingPhoto img").css("max-width", "480px")
      $(".greetingBodyContent").html(response.main.content);
      $(".momoOrDadName").eq(0).html(response.main.f_name);
      $(".momoOrDadName").eq(1).html(response.main.m_name);
      $(".placeNameTwo").html(response.main.party_name);
      $(".placeName").html(response.main.party_name);
      $(".calendar").html(response.main.fiesta_day);
      $(".time").eq(1).html(response.main.ampm + "" +response.main.fiesta_h + ":" + response.main.fiesta_i);
      $(".greetingTitle p").eq(0).html(response.main.subject);
      $(".dDay p span").eq(0).html(response.main.b_name);
      $(".hallName").html(response.main.f_hall);

      if(response.main.ck_party_name == "off"){
          $(".placeNameTwo").eq(0).css("display", "none");
          $(".placeName").eq(0).css("display", "none");
      }      
      if(response.main.ck_m_name == "off"){
         removeDots(document.getElementsByClassName("parentsName"))
         $(".mother").eq(0).css("display", "none");
         $(".mother").eq(1).css("display", "none");
         $(".momCallInformation").eq(1).css("display", "none");
      } 
      if(response.main.ck_f_name == "off"){
        removeDots(document.getElementsByClassName("parentsName"))
         $(".fathter").eq(0).css("display", "none");
         $(".fathter").eq(1).css("display", "none");
         $(".momCallInformation").eq(0).css("display", "none");
      } 

      if(response.main.ck_content == "off"){
         $(".greetingBodyContent").eq(0).css("display", "none");
      }
      if(response.main.ck_f_hp == "off"){
         $(".momCallInformation").eq(0).css("display", "none");
      } 
      if(response.main.ck_m_hp == "off"){
         $(".momCallInformation").eq(1).css("display", "none");
      } 
       if(response.main.ck_f_hp == "off" && response.main.ck_m_hp == "off"){
         $(".callBtn").eq(0).css("display", "none");
      } 
      if(response.main.ck_f_hall == "off"){
          $(".hallName").eq(0).css("display", "none");
      } 
      if(response.main.tg_attend == "on"){
        $(".attendanceTitle p").html(response.main.ck_attend_common)
      }
      if(response.main.ConfirmshowName != "on"){
        $(".attendanceModalEnteredListInput").eq(0).css("display", "none");
      }
      if(response.main.ConfirmShowPhone != "on"){
        $(".attendanceModalEnteredListInput").eq(1).css("display", "none");
      }
      if(response.main.ConfirmMemberCnt != "on"){
        $(".attendanceModalEnteredListSelect").eq(1).css("display", "none");
      }
      if(response.main.ConfirmEatYN != "on"){
        $(".attendanceModalEnteredListSelect").eq(2).css("display", "none");
      }
      if(response.main.ConfirmContent == "on"){
         $(".attendanceText").html(response.main.ck_attend_content);
      }
      if(response.main.cj_f_account == "off"){
          $(".accountContent").eq(0).css("display", "none");
      }
      if(response.main.cj_m_account == "off"){
          $(".accountContent").eq(1).css("display", "none");
      }
      console.log('#####1.02')
      f_num = response.main.f_hp;
      m_num = response.main.m_hp;

      const dateObj = new Date(response.main.fiesta_day);

      const year = dateObj.getFullYear();       // 2025
      const month = dateObj.getMonth() + 1;     // 9
      const day = dateObj.getDate();            // 3

      loadCalendar(year, month, day);

      const today = new Date();

      // 시간 부분 제거 (정확한 날짜만 비교하려면 00:00:00 기준으로 맞추는 게 좋습니다)
      dateObj.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      // 차이 계산 (밀리초 단위)
      const diffTime = dateObj - today;

      // 밀리초 → 일(day) 단위로 변환img
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      $(".dDay p span").eq(2).html(`${diffDays}일`);

      if(diffDays <0){
        location.href = "https://g-day.co.kr/kr/test/html/thankYou/thankYou.html?idx="+window.o_idx+"&card_type=C"
      }
      $.each(response.daily, function(index, item) {
          $('.timeLineItem').eq(index).find('.timeLinePhoto img').attr("src", '/kr' + item.photo_url.replace('../..',''))
          $('.timeLineItem').eq(index).find('.timeLinetextDate').html(item.date)
          $('.timeLineItem').eq(index).find('.timeLinetextTitle').html(item.subject)
          // if(index > 1){
            $('.timeLineItem').eq(index).css("display", "flex")
          //}
      });
      $('.galleryPhotos img').each(function (index) {
          $(this).css('display', "none");
      });
      $('.galleryPhotos img').each(function (index) {
        if (index < response.gallary.length) {
          $(this).attr('src', '/kr' + response.gallary[index].photo_url.replace('../..',''));
          $(this).css('display', "block");
        }
      });
      console.log(images, '#images')
      images.forEach((img, index) => {
        if (index >= response.gallary.length) {
          console.log('#remove')
          img.remove();
        }
        console.log(images, '#images2')
      });
      console.log(images, '#images3')
      if(response.main.ck_remark == "on"){
        $(".locationDetail pre").html(response.main.remark)
      } else {
        $(".locationDetail").css("display", "none");
      }
      add1 = response.main.add1;
      if(response.main.ck_parkmeng_title == "off"){
        $(".guestBookTitle").css("display", "none");
      } else {
         $(".guestBookTitle p").html(`${response.main.parkmeng}`);
      }
      if(response.main.seniorDisplayDate == "off"){
        $('.scheduleDate').css("display", "none");
      }
      if(response.main.seniorDisplayDDay == "off"){
        $('.dDay').css("display", "none");
      }
      if(response.main.seniorDisplayCalendar == "off"){
        $('.scheduleCalendar').css("display", "none");
      }
      window.my_id = response.mem_row.userid;
      window.userid = response.main.userid;

      $(".accountText").html(response.main.accountContent)
      $(".accountTitle").html(response.main.accountSubject)
      
      $(".accountContentTextName").eq(0).html(response.main.f_bank_username)
      $(".accountContentTextName").eq(1).html(response.main.m_bank_username)
      $(".accountContentTextNumber").eq(0).html(response.main.f_bank_name + " " + response.main.f_account)
      $(".accountContentTextNumber").eq(1).html(response.main.m_bank_name + " " + response.main.m_account)
      
      if(response.main.tg_location == "off"){
        $(".location").css("display", "none");
      }
      if(response.main.tg_guide == "off"){
        $(".schedule").css("display", "none");
      }
      if(response.main.tg_account == "off"){
        $(".account").css("display", "none");
      }
      if(response.main.tg_daily == "off"){
        $(".timeLine").css("display", "none");
      }
      if(response.main.tg_gallery == "off"){
        $(".gallery").css("display", "none");
      }
      if(response.main.tg_location == "off"){
        $(".location").css("display", "none");
      }
      if(response.main.tg_invite == "off"){
        $(".greeting").css("display", "none");
      }
      if(response.main.tg_parkmeng == "off"){
        $(".guestBook").css("display", "none");
      }
      if(response.main.tg_attend == "off"){
        $(".attendance").css("display", "none");
      }

      // 지도 생성 (초기 위치는 아무거나 설정, 나중에 주소로 이동됨)
      var mapContainer = document.getElementById('map'),
          mapOption = {
              center: new kakao.maps.LatLng(37.5665, 126.9780), // 초기 임시 중심 (서울)
              level: 3
          };

      var map = new kakao.maps.Map(mapContainer, mapOption);

      // 주소 → 좌표 변환 객체 생성
      var geocoder = new kakao.maps.services.Geocoder();

      // 검색할 주소명
      var address = response.main.add1;
      console.log(address, '#address')

      // 주소 검색 실행
      geocoder.addressSearch(address, function(result, status) {
          console.log(address, kakao.maps.services, '#address')
          if (status === kakao.maps.services.Status.OK) {
              var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

              // 지도 중심 이동
              map.setCenter(coords);

              // 마커 생성
              var marker = new kakao.maps.Marker({
                  map: map,
                  position: coords
              });

              // 인포윈도우 생성 및 표시
              var infowindow = new kakao.maps.InfoWindow({
                  content: '<div style="padding:5px;font-size:14px;">' + address + '</div>'
              });
              infowindow.open(map, marker);
          } else {
              alert('주소를 찾을 수 없습니다.');
          }
      });
      
      const comments = []
      setTimeout(function () {
          $.each(response.comments, function(index, item) {
            console.log(item, '#item')
            let name = item.userid;
            let message = item.content;
            let msg_idx = item.idx;
            guestBookEntries.unshift({ name, message, msg_idx });
        });

        renderGuestBook();
      }, 500);
      //console.log('https://g-day.co.kr/kr' + response.main.kakaoThumbnailPreview.replace('../..',''), '#kakaoThumbnailPreview222')
      // 3. 카카오톡 공유 기능
      document
        .getElementById("kakaoShareBtn")
        .addEventListener("click", function () {
          Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
              title: response.main.kakao_subject,
              description: response.main.kakao_content,
              imageUrl: 'https://g-day.co.kr/kr' + response.main.kakaoThumbnailPreview.replace('../..',''), // 썸네일 이미지 URL
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
              imageWidth: 300,
              imageHeight: 400,
            },
            buttons: [
              {
                title: "웹으로 보기",
                link: {
                  mobileWebUrl: window.location.href,
                  webUrl: window.location.href,
                },
              },
            ],
          });
        });

      let last = $('.schedule');  // 처음 기준은 schedule

      response.orders.forEach(order => {
        const cate = order.cate;
        if(cate == "tg_location"){
            console.log("insert----")
            $(".location").insertAfter(last);
            last = $(".location");
        }
        if(cate == "tg_guide"){ //일정
            console.log("insert2----")
            $(".schedule").insertAfter(last);
            last = $(".schedule");
        }
        if(cate == "tg_account"){
            console.log("insert3----")
            $(".account").insertAfter(last);
            last = $(".account");
        }
        if(cate == "tg_daily"){
            console.log("insert4---")
            $(".timeLine").insertAfter(last);
            last = $(".timeLine");
        }
        if(cate == "tg_gallery"){
            console.log("insert5---")
            $(".gallery").insertAfter(last);
            last = $(".gallery");
        }
        if(cate == "tg_invite"){  //초대글
            console.log("insert6----")
            $(".greeting").insertAfter(last);
            last = $(".greeting");
        }
        if(cate == "tg_parkmeng"){
            console.log("insert7-----")
            $(".guestBook").insertAfter(last);
            last = $(".guestBook");
        }
        if(cate == "tg_attend"){
            console.log("insert8----")
            $(".attendance").insertAfter(last);
            last = $(".attendance");
        }
      });
      document.body.classList.remove("loading"); // 去掉遮罩
      if(window.card_type == "C"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/appleDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "C"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/appleDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "D"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/babyStargramDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "D"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/babyStargramDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "E"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/blockDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "E"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/blockDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "F"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/greenDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "F"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/greenDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "G"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/myBirthdayDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "G"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/myBirthdayDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "J"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/simpleDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "J"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/simpleDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "L"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/starDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "L"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/starDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "O"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/traditionDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "O"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/traditionDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }
        
        else if(window.card_type == "Q"){
          $("#DIDFrame").attr("src", "https://g-day.co.kr/kr/test/html/DID/blueDID.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        }else if(window.card_type == "Q"){
          $("#DIDFrame_R").attr("src", "https://g-day.co.kr/kr/test/html/DID/blueDID_R.html?idx=" + window.o_idx+ "&card_type=" + window.card_type);
        } else {
          alert("잘못된 템플릿 입니다! 상품 정보를 확인 해주세요!");
        }
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });
});

function loadCalendar(year, month, highlightDate){
  
  //  달력 스크립트
  const calendarDates = document.getElementById("calendarDates");
  const calendarHeader = document.getElementById("calendarHeader");

  // const year = 2025;
  // const month = 9;
  // const highlightDate = 3;

  calendarHeader.textContent = `${month}월`;

  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  console.log(firstDay, lastDate, '#lastDate')

  let startX = 0;
  let endX = 0;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "calendarDate empty";
    calendarDates.appendChild(empty);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateEl = document.createElement("div");
    dateEl.className = "calendarDate";

    const dayOfWeek = new Date(year, month-1, day).getDay();
    if (dayOfWeek === 0) dateEl.classList.add("red");

    console.log(dayOfWeek, year, month-1, day, '#dayOfWeek')
    if (day === highlightDate) {
      dateEl.classList.add("highlight");

      const span = document.createElement("span");
      span.textContent = day;
      span.className = "circle-highlight";
      dateEl.appendChild(span);
    } else {
      dateEl.textContent = day;
    }

    calendarDates.appendChild(dateEl);
  }

}

function makeCall(phoneNumber, personName) {
  if (confirm(`${personName}에게 전화하시겠습니까?`)) {
    window.location.href = `tel:${phoneNumber}`;
  }
}

function openKakaoMapOld(){
  location.href='kakaomap://route?ep='+add1+'&epx=126.9779451&epy=37.5662952&by=CAR' 
}

function openTmapOld(){
  location.href='tmap://route?goalx=126.9779451&goaly=37.5662952&goalname=' + add1
}
function openNaverMapOld(){
  location.href='nmap://route/car?dlat=37.5662952&dlng=126.9779451&dname='+add1+'&appname=com.example.myapp' 
}

function loadComment(){
  guestBookEntries.length = 0;
  $.ajax({
    url: 'admin-json_result.php?idx=' + window.o_idx, 
    method: 'POST',
    async: false,
    contentType: 'application/json',
    data: {
      idx: window.o_idx
    },
    success: function(response) {
      $.each(response.comments, function(index, item) {
          console.log(item, '#item')
          let name = item.userid;
          let message = item.content;
          let msg_idx = item.idx;
          guestBookEntries.unshift({ name, message, msg_idx });
      });
      renderGuestBook();
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });
}

function insAttend(){
  let p_div = ($(".attendanceModalCheckBox").eq(0).prop("checked") && $(".attendanceModalCheckBox").eq(1).prop("checked"))?"2":$(".attendanceModalCheckBox").eq(0).prop("checked")?"0":"1";
  let username =  $(".attendanceModalEnteredListInput").eq(0).val()
  let phone =  $(".attendanceModalEnteredListInput").eq(1).val()
  let isInvite =  $(".attendanceModalEnteredListSelect").eq(0).val()
  let member =  $(".attendanceModalEnteredListSelect").eq(1).val()
  let isEat =  $(".attendanceModalEnteredListSelect").eq(2).val()

  let bodyData = {
        p_div: p_div,
        username: username,
        phone: phone,
        isInvite: isInvite,
        member: member,
        isEat: isEat,
        idx: window.o_idx
      }
  console.log(bodyData, '#bodyData')
  //삭제
  $.ajax({
    url: 'admin-json-ins_attend.php', // Replace with your endpoint
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(bodyData),
    success: function(response) {
      console.log('Success:', response);
      document.getElementById("attendanceModalOverlay").style.display = "none";
      alert("정상적으로 저장되었습니다..");
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });
}

function getKoreanDayOfWeek(dateString) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const date = new Date(dateString); // "2019-01-01"
    const dayOfWeek = date.getDay();   // 0~6
    return days[dayOfWeek];
}


function removeDots(rootEl) {
  $('.dot1').eq(0).css("display", "none");
  $('.dot1').eq(1).css("display", "none");
}

  function getCoordsFromAddress(address, onSuccess, onError) {
      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, function(result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const lat = result[0].y;
          const lng = result[0].x;
          onSuccess({ lat, lng });
        } else {
          onError("주소 검색 실패");
        }
      });
    }

  function openNaverMap() {
    const address = add1;
    if (!address) {
      alert("주소를 입력하세요");
      return;
    }

    getCoordsFromAddress(address,
      function(coords) {
        const dname = encodeURIComponent(address);
        const uri = `nmap://route/car?dlat=${coords.lat}&dlng=${coords.lng}&dname=${dname}&appname=com.example.myapp`;

        window.location.href = uri;
      },
      function(errorMsg) {
        alert(errorMsg);
      }
    );
  }


function openKakaoMap() {
  const address = add1;
  if (!address) {
    alert("주소를 입력하세요");
    return;
  }

  getCoordsFromAddress(address,
    function(coords) {
      const dname = encodeURIComponent(address);
      // ✅ 좌표 순서 수정: lng (X), lat (Y)
      //const uri = `kakaomap://route?ep=${dname}&epx=${coords.lng}&epy=${coords.lat}&by=CAR`;
      const uri = `kakaomap://search?q=${dname}&p=${coords.lat},${coords.lng}`;
      window.location.href = uri;
    },
    function(errorMsg) {
      alert(errorMsg);
    }
  );
}

function openTmap() {
  const address = add1;
  if (!address) {
    alert("주소를 입력하세요");
    return;
  }

  getCoordsFromAddress(address,
    function(coords) {
      const dname = encodeURIComponent(address);
      // ✅ 좌표 순서 수정: lng (X), lat (Y)
      const uri = `tmap://route?goalx=${coords.lng}&goaly=${coords.lat}&goalname=${dname}`;

      window.location.href = uri;
    },
    function(errorMsg) {
      alert(errorMsg);
    }
  );
}