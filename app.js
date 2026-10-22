// PhotoMate.cc — before/after sliders, gallery, FR/EN.

const PAIRS = [
  ["01", 1600, 1067], ["02", 1067, 1600], ["03", 1067, 1600], ["04", 1600, 900],
  ["05", 1173, 1600], ["06", 1600, 1200], ["07", 1600, 898], ["08", 1600, 1122],
  ["09", 1600, 1067], ["10", 1067, 1600], ["11", 1600, 1068], ["12", 1600, 1067],
  ["13", 1600, 1067], ["14", 1098, 1600], ["15", 1067, 1600],
];

const EN = {
  "nav.what": "The service",
  "nav.gallery": "Before / after",
  "nav.how": "How it worked",
  "hero.badge": "Archived project · service closed",
  "hero.tagline": "Artificial intelligence for photography.",
  "hero.lead": "PhotoMate edited your photos in seconds and picked the best ones according to your criteria. The service is no longer offered: this page keeps a record of what it did.",
  "hero.cta": "See the edits",
  "label.before": "Before",
  "label.after": "After",
  "what.title": "What PhotoMate did",
  "what.edit.title": "Automatic editing",
  "what.edit.text": "The AI adjusted the light, tones and colours, then suggested a crop suited to each photo. Every edit stayed adjustable in Lightroom, Photoshop or Bridge.",
  "what.edit.l1": "JPG, DNG and RAW files (converted to DNG)",
  "what.edit.l2": "Choice of crop ratio",
  "what.edit.l3": "Custom model trained on your style",
  "what.score.title": "Quality scoring",
  "what.score.text": "The AI scored each image against your guidelines, kept the best ones and explained how to improve the others. A whole shoot could thus be sorted without going through every photo by hand.",
  "what.score.l1": "Detailed score per criterion",
  "what.score.l2": "Custom criteria",
  "what.score.l3": "Automatic filtering of photo series",
  "what.privacy.title": "Your photos stayed yours",
  "what.privacy.text": "Only your email address was kept. Images were neither stored after download nor used to train the models, unless you explicitly asked for a custom model.",
  "gallery.title": "Before / after",
  "gallery.hint": "Drag the slider on each photo to compare the original with PhotoMate’s edit.",
  "how.title": "How it worked",
  "how.s1.t": "Prepare the photos",
  "how.s1.p": "In JPG or DNG format. RAW files (.NEF, .CR3…) could be converted losslessly with Adobe DNG Converter.",
  "how.s2.t": "Send them to PhotoMate",
  "how.s2.p": "In the web app, choosing the editing model and the image ratio you wanted.",
  "how.s3.t": "Let the AI work",
  "how.s3.p": "Tones, colours and crop computed for each photo, according to its particular characteristics.",
  "how.s4.t": "Take back control",
  "how.s4.p": "Downloading the edited images, then opening them in Lightroom or Photoshop, where every setting stayed adjustable.",
  "footer.made": 'PhotoMate was built by <a href="https://me.paulasquin.com">Paul Asquin</a>. The service is closed.',
  "footer.credits": "Sample photos: Pexels stock images, edited by PhotoMate.",
  "footer.legal": 'Publisher: Paul Asquin (<a href="https://me.paulasquin.com">me.paulasquin.com</a>). Hosting: GitHub Pages, GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, USA. No cookies, no trackers, no data collected.',
};

const META = {
  fr: { title: "PhotoMate.cc — l’IA au service de la photo", before: "Photo d’origine", after: "Photo retouchée par PhotoMate", compare: "Comparer avant et après" },
  en: { title: "PhotoMate.cc — AI for photography", before: "Original photo", after: "Photo edited by PhotoMate", compare: "Compare before and after" },
};

function compareFigure([id, w, h]) {
  const fig = document.createElement("figure");
  fig.className = "compare reveal";
  fig.innerHTML = `
    <img class="after" src="img/${id}-apres.jpg" width="${w}" height="${h}" loading="lazy" decoding="async" alt="">
    <div class="before-clip"><img class="before" src="img/${id}-avant.jpg" width="${w}" height="${h}" loading="lazy" decoding="async" alt=""></div>
    <span class="label l-before" data-i18n="label.before">Avant</span>
    <span class="label l-after" data-i18n="label.after">Après</span>
    <span class="handle" aria-hidden="true"></span>
    <input class="slider" type="range" min="0" max="100" value="50">`;
  return fig;
}

function wire(fig) {
  const slider = fig.querySelector(".slider");
  const set = (v) => fig.style.setProperty("--pos", `${v}%`);
  slider.addEventListener("input", () => { fig.dataset.touched = "1"; set(slider.value); });
  set(slider.value);
}

// The hero slider sweeps on its own until someone touches it.
function sweep(fig) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const slider = fig.querySelector(".slider");
  const t0 = performance.now();
  const step = (t) => {
    if (fig.dataset.touched) return;
    const v = 50 + 32 * Math.sin((t - t0) / 1400);
    slider.value = v;
    fig.style.setProperty("--pos", `${v}%`);
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

let lang = "fr";

function applyLang(next) {
  lang = next;
  document.documentElement.lang = lang;
  for (const el of document.querySelectorAll("[data-i18n]")) {
    el.dataset.fr ??= el.textContent;
    el.textContent = lang === "en" ? EN[el.dataset.i18n] ?? el.dataset.fr : el.dataset.fr;
  }
  for (const el of document.querySelectorAll("[data-i18n-html]")) {
    el.dataset.fr ??= el.innerHTML;
    el.innerHTML = lang === "en" ? EN[el.dataset.i18nHtml] : el.dataset.fr;
  }
  const m = META[lang];
  document.title = m.title;
  for (const img of document.querySelectorAll(".compare .after")) img.alt = m.after;
  for (const img of document.querySelectorAll(".compare .before")) img.alt = m.before;
  for (const s of document.querySelectorAll(".compare .slider")) s.setAttribute("aria-label", m.compare);
  document.querySelector(".lang").textContent = lang === "en" ? "FR" : "EN";
  try { localStorage.setItem("lang", lang); } catch {}
}

const grid = document.querySelector(".grid");
for (const pair of PAIRS.slice(1)) grid.append(compareFigure(pair));
for (const fig of document.querySelectorAll(".compare")) wire(fig);
sweep(document.querySelector(".hero-compare"));

for (const el of document.querySelectorAll(".card, .steps li, .gallery h2, .what h2, .how h2")) el.classList.add("reveal");
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
}, { rootMargin: "0px 0px -8% 0px" });
for (const el of document.querySelectorAll(".reveal")) io.observe(el);

let saved = null;
try { saved = localStorage.getItem("lang"); } catch {}
applyLang(saved || (navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en"));
document.querySelector(".lang").addEventListener("click", () => applyLang(lang === "fr" ? "en" : "fr"));
