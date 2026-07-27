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
      "footer.cta": "Reserve Su Visita",
      "services.crumb": "Areas de Especialidad",
      "services.h1": "Atencion auditiva, tratamiento de tinnitus y proteccion auditiva.",
      "services.p": "Cada servicio comienza con una conversacion detallada y una evaluacion cuidadosa, no con una venta.",
      "conditions.crumb": "Condiciones que Tratamos",
      "conditions.h1": "Desde un cambio leve en la audicion hasta tinnitus cronico, tenemos un plan.",
      "conditions.p": "La audiologia abarca mas que examenes de audicion. A continuacion, una guia rapida de las condiciones que evaluamos y tratamos cada semana.",
      "resources.crumb": "Recursos para Pacientes",
      "resources.h1": "Recursos, educacion y respuestas a preguntas frecuentes.",
      "resources.p": "Cuanto mas entiendan nuestros pacientes, mejor sera el resultado. Comience con las preguntas a continuacion o explore nuestra biblioteca educativa.",
      "locations.crumb": "Ubicacion",
      "locations.h1": "Oficina en Sherman Oaks, telesalud en toda California.",
      "locations.p": "Nuestra oficina principal esta cerca de la autopista 405 en Sherman Oaks, con estacionamiento facil y un espacio clinico tranquilo y privado.",
      "providers.crumb": "Equipo",
      "providers.p": "Doctora en Audiologia. Certificada en Manejo de Tinnitus. Especialista Certificada en Lesiones Cerebrales.",
      "providers.tag": "Soluciones personalizadas para sus problemas de tinnitus y audicion.",
      "contact.crumb": "Contacto",
      "contact.h1": "Programe una consulta o haga una pregunta.",
      "contact.p": "La forma mas rapida de contactarnos es por telefono. Respondemos el formulario en un dia habil."
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
      "footer.cta": "وقت ملاقات بگیرید",
      "services.crumb": "حوزه‌های تخصص",
      "services.h1": "مراقبت شنوایی، درمان وزوز گوش و محافظت شنوایی.",
      "services.p": "هر خدمت با یک گفتگوی کامل و ارزیابی دقیق شروع می‌شود، نه یک پیشنهاد فروش.",
      "conditions.crumb": "شرایطی که درمان می‌کنیم",
      "conditions.h1": "از تغییر خفیف شنوایی تا وزوز گوش مزمن، ما یک برنامه داریم.",
      "conditions.p": "شنوایی‌شناسی بیش از آزمایش شنوایی است. در زیر راهنمای سریعی از شرایطی که هر هفته ارزیابی و درمان می‌کنیم آمده است.",
      "resources.crumb": "منابع بیماران",
      "resources.h1": "منابع، آموزش و پاسخ به سوالات رایج.",
      "resources.p": "هرچه بیماران ما بیشتر بدانند، نتیجه بهتر خواهد بود. با سوالات زیر شروع کنید یا کتابخانه آموزشی ما را مشاهده کنید.",
      "locations.crumb": "مکان",
      "locations.h1": "دفتر شرمن اوکس، تله‌هلث در سراسر کالیفرنیا.",
      "locations.p": "دفتر اصلی ما نزدیک بزرگراه ۴۰۵ در شرمن اوکس است، با پارکینگ آسان و فضای بالینی آرام و خصوصی.",
      "providers.crumb": "تیم",
      "providers.p": "دکترای شنوایی‌شناسی. دارای گواهی مدیریت وزوز گوش. متخصص گواهی‌شده آسیب مغزی.",
      "providers.tag": "راهکارهای اختصاصی برای مشکلات وزوز گوش و شنوایی شما.",
      "contact.crumb": "تماس",
      "contact.h1": "یک مشاوره رزرو کنید یا سوالی بپرسید.",
      "contact.p": "سریع‌ترین راه تماس با ما تلفن است. فرم زیر را در یک روز کاری پاسخ می‌دهیم."
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
