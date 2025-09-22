// Redirections sur clics pour les 3 images
document.getElementById("section1").addEventListener("click", function() {
  window.location.href = "https://popularreignm.com";
});
document.getElementById("section2").addEventListener("click", function() {
  window.location.href = "https://tis.passmo.org";
});
document.getElementById("section3").addEventListener("click", function() {
  window.location.href = "https://thoiry.church";
});

// Ajuste les hauteurs de toutes les sections
function adjustSectionsHeight() {
  const vh = window.innerHeight;
  document.querySelectorAll(".search-section, .images-section, .av-section")
          .forEach(section => section.style.height = `${vh}px`);
}

// Scroll automatique sur la section images au chargement
window.onload = function() {
  adjustSectionsHeight();
  document.querySelector(".images-section").scrollIntoView();
};

// Recalcul des hauteurs au redimensionnement
window.addEventListener('resize', adjustSectionsHeight);

//
let currentSlide = 1; // 0 = visuals, 1 = AV, 2 = music
const avContainer = document.querySelector(".av-container");
const avSection = document.querySelector(".av-section");
const pageContainer = document.querySelector(".page-container");

// Fonction pour afficher le slide
function showSlide(index) {
  currentSlide = (index + 3) % 3; // boucle infinie
  avContainer.style.transform = `translateX(-${currentSlide * 100}vw)`;
}

// Swipe horizontal
let startX = 0;
let isDragging = false;

avSection.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

avSection.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  let diff = e.touches[0].clientX - startX;

  // seuil 50px
  if (diff > 50) { // swipe droite
    showSlide(currentSlide - 1);
    isDragging = false;
  } else if (diff < -50) { // swipe gauche
    showSlide(currentSlide + 1);
    isDragging = false;
  }
});

avSection.addEventListener('touchend', () => {
  isDragging = false;
});

// Scroll vertical uniquement pour revenir à la section images
pageContainer.addEventListener('scroll', () => {
  const scrollTop = pageContainer.scrollTop;
  const avOffsetTop = avSection.offsetTop;

  // si on est au-dessus de la section AV, rien faire
  if (scrollTop < avOffsetTop) return;

  // si on scroll vers le haut depuis AV
  const currentScroll = window.scrollY || pageContainer.scrollTop;
  if (currentScroll < avOffsetTop) {
    document.querySelector(".images-section").scrollIntoView({behavior: "smooth"});
  }
});

//

// Bloquer le scroll vertical inutile
const page = document.querySelector('.page-container');
page.addEventListener('wheel', (e) => {
  const scrollTop = page.scrollTop;
  const maxScroll = page.scrollHeight - page.clientHeight;

  if ((scrollTop <= 0 && e.deltaY < 0) || (scrollTop >= maxScroll && e.deltaY > 0)) {
    e.preventDefault(); // bloque scroll vers le haut en haut ou vers le bas en bas
  }
}, { passive: false });

// Bloquer le swipe horizontal inutile dans la section AV
avSection.addEventListener('touchmove', (e) => {
  let touchX = e.touches[0].clientX;
  let diff = touchX - startX;

  if ((currentSlide === 0 && diff > 0) || (currentSlide === 2 && diff < 0)) {
    e.preventDefault(); // bloque swipe vers la gauche si on est sur Visuals ou droite si Music
  }
}, { passive: false });

// Pour le drag desktop
avSection.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  let diff = e.clientX - startX;

  if ((currentSlide === 0 && diff > 0) || (currentSlide === 2 && diff < 0)) {
    return; // ignore drag vers les côtés impossibles
  }
});
