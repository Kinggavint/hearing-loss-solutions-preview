/* Hearing Loss Solutions - lightweight i18n toggle for Home page key strings.
   Applies to elements with data-i18n="key" attributes.
   Only a curated set of key strings (hero, CTAs, nav, footer CTA) are translated.
   Falls back to the original English DOM content, which is always the source of truth for "en". */
(function () {
  var translations = {
    es: {
      "hero.eyebrow": "ATENCION DISENADA PARA SUS NECESIDADES DE COMUNICACION Y ESTILO DE VIDA",
      "hero.kicker": "Atencion personalizada disenada para ofrecer resultados.",
      "hero.h1": "Mejor audicion, silencio recuperado y una vida mas tranquila.",
      "hero.lede": "La Dra. Shahrzad Cohen ha guiado a pacientes en el sur de California a traves de la perdida auditiva y el tinnitus desde 2001, combinando atencion personalizada, tecnologia avanzada y el tiempo que cada consulta merece.",
      "hero.cta.primary": "Programar una Consulta",
      "hero.cta.secondary": "Conozca Nuestra Atencion",
      "nav.home": "Inicio",
      "nav.team": "Equipo",
      "nav.services": "Areas de Especialidad",
      "nav.conditions": "Condiciones",
      "nav.resources": "Recursos",
      "nav.locations": "Ubicaciones",
      "nav.cta": "Contactenos",
      "footer.cta": "Reserve Su Visita"
    },
    fa: {
      "hero.eyebrow": "مراقبت متناسب با نیازهای ارتباطی و سبک زندگی شما",
      "hero.kicker": "مراقبت اختصاصی طراحی شده برای نتیجه بخشی.",
      "hero.h1": "شنوایی بهتر، آرامش بازیافته، و زندگی آرام‌تر.",
      "hero.lede": "دکتر شهرزاد کوهن از سال ۲۰۰۱ بیماران را در سراسر جنوب کالیفرنیا در زمینه کاهش شنوایی و وزوز گوش راهنمایی کرده و مراقبت شخصی، فناوری پیشرفته و زمان کافی برای هر ویزیت را ترکیب می‌کند.",
      "hero.cta.primary": "درخواست مشاوره",
      "hero.cta.secondary": "مراقبت ما را ببینید",
      "nav.home": "خانه",
      "nav.team": "تیم",
      "nav.services": "حوزه‌های تخصص",
      "nav.conditions": "شرایط",
      "nav.resources": "منابع",
      "nav.locations": "مکان‌ها",
      "nav.cta": "تماس با ما",
      "footer.cta": "وقت ملاقات بگیرید"
    }
  };

  var defaults = {};

  function cacheDefaults() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      defaults[key] = el.textContent;
    });
  }

  function setLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (lang === "en" || !translations[lang] || !translations[lang][key]) {
        el.textContent = defaults[key];
      } else {
        el.textContent = translations[lang][key];
      }
    });
    document.documentElement.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("hls-lang", lang); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    cacheDefaults();
    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang"));
      });
    });
    var saved = "en";
    try { saved = localStorage.getItem("hls-lang") || "en"; } catch (e) {}
    setLang(saved);
  });
})();
