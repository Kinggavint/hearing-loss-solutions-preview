/* Hearing Loss Solutions - sitewide interactions.
   Progressive enhancement only: every feature degrades to plain, readable HTML
   when JavaScript is unavailable. Nothing here is required to read the site. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     1. Header: condense on scroll
     --------------------------------------------------------------- */
  function initHeaderScroll() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle("scrolled", window.pageYOffset > 40);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------------------------------------------------------------
     2. Navigation: mobile drawer + dropdown menus
     --------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector("nav.primary");
    if (!toggle || !nav) return;

    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-locked", open);
    });

    // Dropdowns. On desktop CSS handles hover; the button click drives
    // touch devices and the mobile drawer, and keeps keyboard users working.
    var groups = nav.querySelectorAll(".nav-group");
    Array.prototype.forEach.call(groups, function (group) {
      var btn = group.querySelector(".nav-group-btn");
      var menu = group.querySelector(".nav-menu");
      if (!btn || !menu) return;
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        var isOpen = group.classList.contains("open");
        Array.prototype.forEach.call(groups, function (g) {
          if (g !== group) {
            g.classList.remove("open");
            var b = g.querySelector(".nav-group-btn");
            if (b) b.setAttribute("aria-expanded", "false");
          }
        });
        group.classList.toggle("open", !isOpen);
        btn.setAttribute("aria-expanded", !isOpen ? "true" : "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      Array.prototype.forEach.call(groups, function (g) {
        g.classList.remove("open");
        var b = g.querySelector(".nav-group-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      Array.prototype.forEach.call(groups, function (g) {
        g.classList.remove("open");
        var b = g.querySelector(".nav-group-btn");
        if (b) b.setAttribute("aria-expanded", "false");
      });
      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-locked");
      }
    });

    // Mark the current page in the nav. A page can appear in more than one menu
    // (reviews lives under both About and Resources), so only the first group
    // gets the highlight — two lit-up parents just reads as a bug.
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var groupMarked = false;
    Array.prototype.forEach.call(nav.querySelectorAll("a[href]"), function (a) {
      var target = (a.getAttribute("href") || "").split("#")[0].split("/").pop().toLowerCase();
      if (!target || target !== here) return;
      a.classList.add("current");
      var parentGroup = a.closest ? a.closest(".nav-group") : null;
      if (parentGroup && !groupMarked) {
        parentGroup.classList.add("has-current");
        groupMarked = true;
      }
    });
  }

  /* ---------------------------------------------------------------
     3. Scroll reveal
     Elements are hidden by CSS only while `html.js` is set, so a failed
     script load or disabled JS still renders the full page.
     --------------------------------------------------------------- */
  function initReveal() {
    var root = document.documentElement;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      root.classList.add("reveal-fallback");
      return;
    }
    var targets = document.querySelectorAll(
      ".card, .feature-block, .testimonial-card, .section-head, .stat-item, " +
      ".cred-item, .two-col > *, .split-media, .promo-card, .review-card, .trust-check-item"
    );
    if (!targets.length) {
      root.classList.add("reveal-fallback");
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });

    Array.prototype.forEach.call(targets, function (el, i) {
      // Stagger siblings a little so grids cascade rather than pop as one block.
      el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + "ms";
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------
     4. Testimonial carousel
     --------------------------------------------------------------- */
  function initCarousel() {
    var carousels = document.querySelectorAll("[data-carousel]");
    Array.prototype.forEach.call(carousels, function (root) {
      var track = root.querySelector(".carousel-track");
      if (!track) return;
      var slides = track.querySelectorAll(".carousel-slide");
      if (slides.length < 2) return;

      var index = 0;
      var dotsWrap = root.querySelector(".carousel-dots");
      var timer = null;

      function go(next) {
        index = (next + slides.length) % slides.length;
        track.style.transform = "translateX(" + (-index * 100) + "%)";
        Array.prototype.forEach.call(slides, function (s, i) {
          s.setAttribute("aria-hidden", i === index ? "false" : "true");
          // Keep off-screen slides out of the tab order.
          Array.prototype.forEach.call(s.querySelectorAll("a, button"), function (f) {
            if (i === index) { f.removeAttribute("tabindex"); }
            else { f.setAttribute("tabindex", "-1"); }
          });
        });
        if (dotsWrap) {
          Array.prototype.forEach.call(dotsWrap.children, function (d, i) {
            d.classList.toggle("active", i === index);
            d.setAttribute("aria-selected", i === index ? "true" : "false");
          });
        }
      }

      if (dotsWrap) {
        for (var i = 0; i < slides.length; i++) {
          (function (i) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot";
            dot.setAttribute("role", "tab");
            dot.setAttribute("aria-label", "Go to review " + (i + 1));
            dot.addEventListener("click", function () { stop(); go(i); });
            dotsWrap.appendChild(dot);
          })(i);
        }
      }

      var prev = root.querySelector(".carousel-prev");
      var next = root.querySelector(".carousel-next");
      if (prev) prev.addEventListener("click", function () { stop(); go(index - 1); });
      if (next) next.addEventListener("click", function () { stop(); go(index + 1); });

      function start() {
        if (reduceMotion || timer) return;
        timer = setInterval(function () { go(index + 1); }, 7000);
      }
      function stop() {
        if (!timer) return;
        clearInterval(timer);
        timer = null;
      }

      root.addEventListener("mouseenter", stop);
      root.addEventListener("focusin", stop);
      root.addEventListener("mouseleave", start);

      go(0);
      start();
    });
  }

  /* ---------------------------------------------------------------
     5. Online hearing check
     A self-assessment screener, not a diagnostic hearing test. Scores the
     answers and routes the visitor to the appropriate next step.
     --------------------------------------------------------------- */
  function initHearingCheck() {
    var form = document.getElementById("hearing-check-form");
    if (!form) return;

    var resultBox = document.getElementById("hearing-check-result");
    var progressBar = document.getElementById("hc-progress-bar");
    var progressText = document.getElementById("hc-progress-text");
    var questions = form.querySelectorAll(".hc-question");
    var total = questions.length;

    function answered() {
      var count = 0;
      Array.prototype.forEach.call(questions, function (q) {
        if (q.querySelector("input:checked")) count++;
      });
      return count;
    }

    function updateProgress() {
      var done = answered();
      var pct = Math.round((done / total) * 100);
      if (progressBar) progressBar.style.width = pct + "%";
      if (progressBar) progressBar.parentElement.setAttribute("aria-valuenow", String(pct));
      if (progressText) progressText.textContent = done + " of " + total + " answered";
    }

    form.addEventListener("change", function (e) {
      if (e.target && e.target.type === "radio") {
        var q = e.target.closest(".hc-question");
        if (q) q.classList.add("hc-answered");
        updateProgress();
      }
    });

    var TIERS = [
      {
        max: 4,
        badge: "Low concern",
        tone: "low",
        title: "Your answers do not point to a significant hearing difficulty right now.",
        body: "That is good news. Hearing changes are gradual, though, and a baseline test today gives us something to measure against later. Most adults benefit from a baseline evaluation at 50 and every few years after that, sooner if you spend time around loud sound.",
        cta: "Book a baseline evaluation",
        href: "contact.html"
      },
      {
        max: 9,
        badge: "Early signs",
        tone: "mild",
        title: "Some of your answers suggest an early change in hearing.",
        body: "The pattern you described - straining in noisy rooms, asking for repeats, turning the volume up - is the way hearing loss usually announces itself first. A comprehensive evaluation will show whether the change is in the ear, the nerve, or how the brain is processing speech, and each of those has a different plan.",
        cta: "Schedule a comprehensive evaluation",
        href: "contact.html"
      },
      {
        max: 15,
        badge: "Worth addressing",
        tone: "moderate",
        title: "Your answers point to a hearing difficulty that deserves a full evaluation.",
        body: "You are describing effects that reach into conversation, work, and relationships. Untreated hearing loss also carries a well-documented association with cognitive decline and social withdrawal, which is why we do not recommend waiting. Dr. Cohen will test carefully, explain the results in plain language, and walk you through every option, including doing nothing.",
        cta: "Request an appointment",
        href: "contact.html"
      },
      {
        max: 999,
        badge: "Please call us",
        tone: "high",
        title: "Your answers describe a substantial impact on daily communication.",
        body: "Please do not put this off. A full diagnostic evaluation is the right next step, and if tinnitus or a sudden change is part of the picture there are time-sensitive treatments worth discussing quickly. Call the office and we will find you a slot.",
        cta: "Call 818-989-9001",
        href: "tel:8189899001"
      }
    ];

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var done = answered();
      if (done < total) {
        var firstMissing = null;
        Array.prototype.forEach.call(questions, function (q) {
          var missing = !q.querySelector("input:checked");
          q.classList.toggle("hc-missing", missing);
          if (missing && !firstMissing) firstMissing = q;
        });
        if (firstMissing) {
          firstMissing.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
          var input = firstMissing.querySelector("input");
          if (input) input.focus();
        }
        return;
      }

      var score = 0;
      var flags = [];
      Array.prototype.forEach.call(form.querySelectorAll("input:checked"), function (input) {
        score += parseInt(input.value, 10) || 0;
        if (input.getAttribute("data-flag") && input.value !== "0") {
          flags.push(input.getAttribute("data-flag"));
        }
      });

      var tier = TIERS[TIERS.length - 1];
      for (var i = 0; i < TIERS.length; i++) {
        if (score <= TIERS[i].max) { tier = TIERS[i]; break; }
      }

      var extras = "";
      if (flags.indexOf("tinnitus") !== -1) {
        extras += '<li><strong>You mentioned ringing or noise in your ears.</strong> Tinnitus has real treatment options. We are a designated Lenire provider and also offer Levo, Neuromonics, and sound therapy. <a href="tinnitus.html">Read about tinnitus treatment</a>.</li>';
      }
      if (flags.indexOf("sudden") !== -1) {
        extras += '<li><strong>You mentioned a sudden change in hearing.</strong> Sudden sensorineural hearing loss is time-sensitive and treated best within days. Please call <a href="tel:8189899001">818-989-9001</a> and mention "sudden loss."</li>';
      }
      if (flags.indexOf("noise") !== -1) {
        extras += '<li><strong>You are around loud sound regularly.</strong> Custom hearing protection is the single most effective way to prevent further damage. <a href="hearing-protection.html">See hearing protection options</a>.</li>';
      }
      if (flags.indexOf("balance") !== -1) {
        extras += '<li><strong>You mentioned dizziness or balance trouble.</strong> The balance system sits in the inner ear alongside hearing, so we evaluate both together. <a href="balance.html">Read about balance care</a>.</li>';
      }

      resultBox.innerHTML =
        '<div class="hc-result-card hc-' + tier.tone + '">' +
          '<span class="hc-badge">' + tier.badge + '</span>' +
          '<h2>' + tier.title + '</h2>' +
          '<p class="hc-score">Screening score: <strong>' + score + '</strong> out of 24</p>' +
          '<p>' + tier.body + '</p>' +
          (extras ? '<ul class="hc-flags">' + extras + '</ul>' : '') +
          '<div class="hero-actions">' +
            '<a href="' + tier.href + '" class="btn btn-primary">' + tier.cta + '</a>' +
            '<a href="tel:8189899001" class="btn btn-ghost">Call 818-989-9001</a>' +
          '</div>' +
          '<p class="hc-disclaimer">This screening is an educational self-assessment, not a hearing test or a diagnosis. Only a comprehensive evaluation by an audiologist can measure your hearing.</p>' +
          '<button type="button" class="alt-link hc-restart">Start the check over</button>' +
        '</div>';

      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      if (resultBox.querySelector("h2")) resultBox.querySelector("h2").setAttribute("tabindex", "-1");

      var restart = resultBox.querySelector(".hc-restart");
      if (restart) {
        restart.addEventListener("click", function () {
          form.reset();
          resultBox.hidden = true;
          resultBox.innerHTML = "";
          Array.prototype.forEach.call(questions, function (q) {
            q.classList.remove("hc-answered", "hc-missing");
          });
          updateProgress();
          form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        });
      }
    });

    updateProgress();
  }

  /* ---------------------------------------------------------------
     6. FAQ accordions (accessible upgrade for markup using data-faq)
     --------------------------------------------------------------- */
  function initFaq() {
    Array.prototype.forEach.call(document.querySelectorAll(".faq-q[data-faq]"), function (btn) {
      var item = btn.parentElement;
      btn.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");
      btn.addEventListener("click", function () {
        var open = item.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* Rotating hero.
     Dr. Cohen asked for the rotating banner she has on her live site. That one
     is an image slider - every headline is baked into a JPEG, so search engines
     see none of it. This keeps all six slides in the DOM as real text and only
     toggles visibility, so the copy stays crawlable.

     Auto-advance stops on hover, on keyboard focus, when the tab is hidden, and
     when the visitor presses pause. It never starts at all if the visitor has
     asked for reduced motion (WCAG 2.2.2 - a 7 second carousel the user cannot
     stop is a real accessibility failure, and this audience skews 60+). */
  function initHeroRotator() {
    var root = document.querySelector("[data-hero-rotator]");
    if (!root) return;

    var slides = [].slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = [].slice.call(root.querySelectorAll("[data-hero-dot]"));
    var prev = root.querySelector("[data-hero-prev]");
    var next = root.querySelector("[data-hero-next]");
    var toggle = root.querySelector("[data-hero-toggle]");
    if (slides.length < 2) return;

    var DELAY = 7000;                       // matches the cadence she is used to
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var i = 0, timer = null, paused = reduce, hovering = false;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle("is-active", on);
        if (on) { s.removeAttribute("aria-hidden"); }
        else { s.setAttribute("aria-hidden", "true"); }
      });
      dots.forEach(function (d, k) {
        d.classList.toggle("is-active", k === i);
        if (k === i) { d.setAttribute("aria-current", "true"); }
        else { d.removeAttribute("aria-current"); }
      });
    }

    function tick() { show(i + 1); }
    function start() {
      stop();
      if (paused || hovering || document.hidden) return;
      timer = setInterval(tick, DELAY);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    function setPaused(state) {
      paused = state;
      if (toggle) {
        toggle.classList.toggle("is-paused", state);
        toggle.setAttribute("aria-label", state
          ? "Resume automatic slide rotation"
          : "Pause automatic slide rotation");
      }
      start();
    }

    if (prev) prev.addEventListener("click", function () { show(i - 1); start(); });
    if (next) next.addEventListener("click", function () { show(i + 1); start(); });
    dots.forEach(function (d, k) {
      d.addEventListener("click", function () { show(k); start(); });
    });
    if (toggle) toggle.addEventListener("click", function () { setPaused(!paused); });

    root.addEventListener("mouseenter", function () { hovering = true; stop(); });
    root.addEventListener("mouseleave", function () { hovering = false; start(); });
    root.addEventListener("focusin", function () { hovering = true; stop(); });
    root.addEventListener("focusout", function () {
      if (!root.contains(document.activeElement)) { hovering = false; start(); }
    });
    document.addEventListener("visibilitychange", start);

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(i - 1); start(); }
      if (e.key === "ArrowRight") { show(i + 1); start(); }
    });

    // Touch swipe. Horizontal only, so vertical page scrolling is untouched.
    var x0 = null, y0 = null;
    root.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { show(i + (dx < 0 ? 1 : -1)); start(); }
      x0 = y0 = null;
    }, { passive: true });

    if (reduce && toggle) setPaused(true);
    show(0);
    start();
  }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    initHeaderScroll();
    initNav();
    initReveal();
    initCarousel();
    initHeroRotator();
    initHearingCheck();
    initFaq();
    var yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
