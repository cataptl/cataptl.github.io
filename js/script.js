// -------------------------------
// script.js - version complète et fonctionnelle
// -------------------------------

// -------------------------------
// Gestion des pages About, Archives et Members
// -------------------------------
const pages = {
  about: document.getElementById('aboutPage'),
  archives: document.getElementById('archivesPage'),
  members: document.getElementById('membersPage')
};

const buttons = {
  about: document.getElementById('aboutBtn'),
  archives: document.getElementById('archivesBtn'),
  members: document.getElementById('membersBtn')
};

const closes = {
  about: document.getElementById('closeAbout'),
  archives: document.getElementById('closeArchives'),
  members: document.getElementById('closeMembers')
};

function showPage(pageKey) {
  for (const key in pages) {
    if (!pages[key]) continue;
    pages[key].style.display = key === pageKey ? 'block' : 'none';
  }
}

if (buttons.about) buttons.about.addEventListener('click', () => showPage('about'));
if (buttons.archives) buttons.archives.addEventListener('click', () => showPage('archives'));
if (buttons.members) buttons.members.addEventListener('click', () => showPage('members'));

if (closes.about) closes.about.addEventListener('click', () => pages.about && (pages.about.style.display = 'none'));
if (closes.archives) closes.archives.addEventListener('click', () => pages.archives && (pages.archives.style.display = 'none'));
if (closes.members) closes.members.addEventListener('click', () => pages.members && (pages.members.style.display = 'none'));

// -------------------------------
// Redirection C + A + T + P + L
// -------------------------------
let keysPressed = {};
window.addEventListener('keydown', e => {
  keysPressed[e.key.toLowerCase()] = true;
  if (['c','a','t','p','l'].every(k => keysPressed[k])) {
    window.location.href = 'developer.html';
  }
});
window.addEventListener('keyup', e => {
  keysPressed[e.key.toLowerCase()] = false;
});

// -------------------------------
// Sélection des nodes (cellules) et positions
// -------------------------------
const nodes = {
  vis: document.querySelector('.node-vis'),
  av: document.querySelector('.node-av'),
  mu: document.querySelector('.node-mu')
};

// Définitions initiales (en % par rapport au conteneur)
const initialPositions = {
  vis: { top: 8, left: 71, scale: 1 },
  av:  { top: 71, left: 8, scale: 1 },
  mu:  { top: 87, left: 87, scale: 1 }
};

// Position cible pour 'vis' (en %)
const targetPosition = { top: 5, left: 5 };

// sécurité : vérifier que le conteneur existe
const circleContainer = document.getElementById('circle-container');
if (!circleContainer) {
  console.error('Erreur : #circle-container introuvable. Assure-toi d\'avoir un élément avec id="circle-container".');
}

// -------------------------------
// Création / configuration de la zone de texte centrale (carrée, transparente)
// -------------------------------

// Crée l'élément si le conteneur existe
const textBox = circleContainer ? document.createElement('div') : null;
if (textBox) {
  textBox.id = 'center-text-box';
  // base styles (beaucoup de styles plus fins peuvent rester en CSS si tu préfères)
  textBox.style.position = 'absolute';
  textBox.style.top = '50%';
  textBox.style.left = '50%';
  textBox.style.transform = 'translate(-50%, -50%)';
  // on donne une taille initiale en pourcentage du conteneur (carré)
  textBox.style.width = '45%';   // largeur = 45% du conteneur
  textBox.style.height = '45%';  // hauteur identique => carré
  textBox.style.maxWidth = '420px';
  textBox.style.maxHeight = '420px';
  textBox.style.minWidth = '120px';
  textBox.style.minHeight = '120px';
  textBox.style.backgroundColor = 'rgba(255,255,255,0.06)'; // zone transparente
  textBox.style.backdropFilter = 'none';
  textBox.style.display = 'flex';
  textBox.style.alignItems = 'center';
  textBox.style.justifyContent = 'center';
  textBox.style.textAlign = 'center';
  textBox.style.padding = '10px';
  textBox.style.color = '#ffffff';
  textBox.style.opacity = '0'; // invisible au départ
  textBox.style.transition = 'opacity 0.6s ease';
  textBox.style.pointerEvents = 'none'; // ne gêne pas la souris
  textBox.style.boxSizing = 'border-box';
  textBox.style.wordBreak = 'break-word';
  // Texte demandé (paragraphe normal qui remplit la zone)
  textBox.innerText = 'The visual part of our organisation is managed by POPULAR REIGNM. "PR" is a collective started in 2022. frequencies never lie';
  circleContainer.appendChild(textBox);
}

// -------------------------------
// Ajustement automatique de la taille de police
// OBJECTIF : que le texte remplisse la zone carrée (paragraphe normal),
//             on augmente la taille jusqu'à presque dépasser, puis on recule 1px.
// -------------------------------
function fitTextToBox(box) {
  if (!box) return;
  // zone intérieure utilisable (padding accounted)
  const paddingX = 20; // correspond aux 10px padding left + right dans style
  const paddingY = 20;
  const maxW = box.clientWidth - paddingX;
  const maxH = box.clientHeight - paddingY;

  // Valeurs de sécurité
  if (maxW <= 0 || maxH <= 0) return;

  // Texte dans un span temporaire pour mesurer précisément
  let span = box._measureSpan;
  if (!span) {
    span = document.createElement('div');
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'normal';
    span.style.width = maxW + 'px';
    span.style.lineHeight = '1';
    span.style.padding = '0';
    span.style.margin = '0';
    span.style.boxSizing = 'border-box';
    document.body.appendChild(span);
    box._measureSpan = span;
  }

  // On essaie une fourchette de font-size par recherche exponentielle + linéaire
  let size = 8;
  span.style.fontFamily = window.getComputedStyle(box).fontFamily || 'inherit';
  span.style.fontWeight = window.getComputedStyle(box).fontWeight || '400';
  span.style.width = maxW + 'px';
  // On augmente rapidement jusqu'à dépasser
  while (true) {
    span.style.fontSize = size + 'px';
    span.innerText = box.innerText;
    if (span.scrollHeight > maxH || span.scrollWidth > maxW) break;
    size += 2;
    if (size > 300) break; // sécurité
  }
  // on recule jusqu'à rentrer (décrément fin)
  while (size > 6) {
    span.style.fontSize = size + 'px';
    span.innerText = box.innerText;
    if (span.scrollHeight <= maxH && span.scrollWidth <= maxW) break;
    size -= 1;
  }
  // Appliquer taille calculée moins 0 pour être sûr
  box.style.fontSize = Math.max(6, size) + 'px';
}

// Ajuster texte au chargement et au redimensionnement
if (textBox) {
  // initial fit (attend un tick si nécessaire)
  window.requestAnimationFrame(() => fitTextToBox(textBox));
  window.addEventListener('resize', () => {
    // recalculer taille du carré si le conteneur change
    fitTextToBox(textBox);
  });
}

// -------------------------------
// Simulation de "scroll" via molette (bloqué pour la page)
// - simulatedScroll va de 0 à 1.
// - e.preventDefault() est utilisé et l'écouteur est { passive: false }.
// - on force touch-action pour éviter comportement natif sur certains appareils.
// -------------------------------
let simulatedScroll = 0;
if (circleContainer) {
  circleContainer.style.touchAction = 'none'; // empêche certains comportements tactiles
}

// Fonction d'application des styles de position/transform en fonction de simulatedScroll
function applyCellTransforms(t) {
  if (!nodes.vis || !nodes.av || !nodes.mu) return;

  // Vis : se déplace mais ne change pas d'échelle
  const visTop = initialPositions.vis.top + (targetPosition.top - initialPositions.vis.top) * t;
  const visLeft = initialPositions.vis.left + (targetPosition.left - initialPositions.vis.left) * t;
  nodes.vis.style.top = visTop + '%';
  nodes.vis.style.left = visLeft + '%';
  // on maintient le centrage
  nodes.vis.style.transform = 'translate(-50%, -50%)';

  // Av and Mu : rétrécissent & s'estompent
  const otherScale = initialPositions.av.scale * (1 - t);
  nodes.av.style.transform = `translate(-50%, -50%) scale(${otherScale})`;
  nodes.av.style.opacity = String(Math.max(0, 1 - t));
  const otherScaleMu = initialPositions.mu.scale * (1 - t);
  nodes.mu.style.transform = `translate(-50%, -50%) scale(${otherScaleMu})`;
  nodes.mu.style.opacity = String(Math.max(0, 1 - t));
}

// Wheel handler (bloque le scroll de la page)
function onWheelBlock(e) {
  // Empêche le défilement de la page
  if (e.cancelable) e.preventDefault();

  // Ajuster simulatedScroll selon deltaY (sensibilité ajustable)
  // Utiliser deltaMode pour normaliser si nécessaire (ici on assume pixels)
  const delta = e.deltaY || 0;
  // sensibilité : 0.012 donne mouvement perceptible sans être trop rapide
  simulatedScroll += delta * 0.012;
  simulatedScroll = Math.max(0, Math.min(1, simulatedScroll));

  // Appliquer transformations
  applyCellTransforms(simulatedScroll);

  // Faire apparaitre le texte dès que t dépasse un petit seuil
  if (textBox) {
    if (simulatedScroll > 0.05) {
      textBox.style.opacity = '1';
      // Re-ajustement de la taille police si la box a pu changer (ex: responsive)
      fitTextToBox(textBox);
    } else {
      textBox.style.opacity = '0';
    }
  }
}

// Ajouter l'écouteur wheel sur le document entier mais non-passif
// On attache au window/document pour capturer la molette même hors du cercle.
window.addEventListener('wheel', onWheelBlock, { passive: false });

// Si tu veux aussi bloquer les flèches PageUp/PageDown/Home/End pour éviter scroll,
// on peut intercepter keydown (optionnel) :
window.addEventListener('keydown', (e) => {
  const keysToBlock = ['PageDown','PageUp','Home','End','ArrowUp','ArrowDown'];
  if (keysToBlock.includes(e.code)) {
    if (e.cancelable) e.preventDefault();
  }
});

// -------------------------------
// Initialisation des positions au chargement
// -------------------------------
function initPositions() {
  if (!nodes.vis || !nodes.av || !nodes.mu) return;
  nodes.vis.style.position = 'absolute';
  nodes.av.style.position = 'absolute';
  nodes.mu.style.position = 'absolute';

  // apply starting coords + transforms (center via translate(-50%,-50%))
  nodes.vis.style.top = initialPositions.vis.top + '%';
  nodes.vis.style.left = initialPositions.vis.left + '%';
  nodes.vis.style.transform = 'translate(-50%, -50%)';

  nodes.av.style.top = initialPositions.av.top + '%';
  nodes.av.style.left = initialPositions.av.left + '%';
  nodes.av.style.transform = 'translate(-50%, -50%) scale(1)';
  nodes.av.style.opacity = '1';

  nodes.mu.style.top = initialPositions.mu.top + '%';
  nodes.mu.style.left = initialPositions.mu.left + '%';
  nodes.mu.style.transform = 'translate(-50%, -50%) scale(1)';
  nodes.mu.style.opacity = '1';
}
initPositions();

// Ajuster la taille du texte si la page charge lentement (quelques frames)
if (textBox) {
  requestAnimationFrame(() => fitTextToBox(textBox));
  setTimeout(() => fitTextToBox(textBox), 300);
}

// -------------------------------
// Fin du script
// -------------------------------
