const CONFIG = {
  dadTel: "01000000000",
  momTel: "01000000000",
  gallery: [
    "./assets/gallery1.jpg",
    "./assets/gallery2.jpg",
    "./assets/gallery3.jpg",
    "./assets/gallery4.jpg",
    "./assets/gallery5.jpg",
    "./assets/gallery6.jpg",
    "./assets/gallery7.jpg",
    "./assets/gallery8.jpg",
    "./assets/gallery9.jpg"
  ]
};

// 모달
function openModal(el){ el.setAttribute("aria-hidden","false"); }
function closeModal(el){ el.setAttribute("aria-hidden","true"); }

document.addEventListener("click", (e) => {
  const close = e.target.closest("[data-close]");
  if (close) {
    const modal = e.target.closest(".modal,.viewer");
    if (modal) closeModal(modal);
  }
});

// 연락하기
const contactsModal = document.getElementById("contactsModal");
document.getElementById("dadCall").href = `tel:${CONFIG.dadTel}`;
document.getElementById("momCall").href = `tel:${CONFIG.momTel}`;
document.getElementById("btnContacts").addEventListener("click", () => openModal(contactsModal));

// 갤러리 + 뷰어
const galleryGrid = document.getElementById("galleryGrid");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");
const viewerIndex = document.getElementById("viewerIndex");
const viewerTotal = document.getElementById("viewerTotal");
let currentIdx = 0;

function renderGallery() {
  galleryGrid.innerHTML = "";
  CONFIG.gallery.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = `gallery-${i+1}`;
    img.loading = "lazy";
    img.addEventListener("click", () => openViewer(i));
    galleryGrid.appendChild(img);
  });
}
function openViewer(i){
  currentIdx = i;
  viewerTotal.textContent = String(CONFIG.gallery.length);
  updateViewer();
  openModal(viewer);
}
function updateViewer(){
  viewerImg.src = CONFIG.gallery[currentIdx];
  viewerIndex.textContent = String(currentIdx+1);
}
document.getElementById("prevBtn").addEventListener("click", () => {
  currentIdx = (currentIdx - 1 + CONFIG.gallery.length) % CONFIG.gallery.length;
  updateViewer();
});
document.getElementById("nextBtn").addEventListener("click", () => {
  currentIdx = (currentIdx + 1) % CONFIG.gallery.length;
  updateViewer();
});
renderGallery();

// 복사
async function copyText(text){
  await navigator.clipboard.writeText(text);
  alert("복사되었습니다.");
}
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-copy]");
  if (!btn) return;
  const sel = btn.getAttribute("data-copy");
  const el = document.querySelector(sel);
  if (el) copyText(el.textContent.trim());
});
document.getElementById("btnCopyLink").addEventListener("click", async () => {
  await copyText(location.href);
});
