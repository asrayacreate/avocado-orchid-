/**
 * EstimatePro ERP — Main Interactions
 * Vanilla JS, no dependencies. Respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Dynamic year ---------------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- Notice board ---------------- */
  const NOTICE_KEY = "estimatepro-notice-dismissed";
  const noticeBoard = document.querySelector("#notice-board");
  if (noticeBoard) {
    const closeBtn = noticeBoard.querySelector("[data-notice-close]");
    function setNoticeHeightVar() {
      const h = noticeBoard.classList.contains("is-dismissed") ? 0 : noticeBoard.offsetHeight;
      document.documentElement.style.setProperty("--notice-h", h + "px");
    }
    function dismissNotice(persist) {
      noticeBoard.classList.add("is-dismissed");
      setNoticeHeightVar();
      if (persist) {
        try {
          localStorage.setItem(NOTICE_KEY, "1");
        } catch (err) {
          /* ignore */
        }
      }
    }
    let noticeDismissed = false;
    try {
      noticeDismissed = localStorage.getItem(NOTICE_KEY) === "1";
    } catch (err) {
      noticeDismissed = false;
    }
    if (noticeDismissed) {
      dismissNotice(false);
    } else {
      setNoticeHeightVar();
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => dismissNotice(true));
    }
    window.addEventListener("resize", () => {
      if (!noticeBoard.classList.contains("is-dismissed")) setNoticeHeightVar();
    });
  }

  /* ---------------- Sticky header on scroll ---------------- */
  const header = document.querySelector(".site-header");
  function updateHeaderState() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  /* ---------------- Desktop dropdowns ---------------- */
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    const trigger = item.querySelector(".nav-link");
    if (!trigger) return;

    function close() {
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    }
    function open() {
      navItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".nav-link")?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }

    trigger.addEventListener("click", (e) => {
      if (!item.querySelector(".dropdown")) return; // plain link, let it navigate
      e.preventDefault();
      item.classList.contains("is-open") ? close() : open();
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
        trigger.blur();
      }
    });
  });

  document.addEventListener("click", (e) => {
    navItems.forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove("is-open");
        item.querySelector(".nav-link")?.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------------- Mobile menu ---------------- */
  const hamburger = document.querySelector(".hamburger");
  const mobilePanel = document.querySelector(".mobile-panel");

  function closeMobileMenu() {
    if (!mobilePanel || !hamburger) return;
    mobilePanel.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  function openMobileMenu() {
    if (!mobilePanel || !hamburger) return;
    mobilePanel.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  if (hamburger && mobilePanel) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true";
      isOpen ? closeMobileMenu() : openMobileMenu();
    });
    mobilePanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMobileMenu();
    });
    // Close mobile menu if viewport grows back to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeMobileMenu();
    });
  }

  /* ---------------- Smooth scroll for in-page links ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.getBoundingClientRect().bottom : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* ---------------- Active nav state on scroll ---------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".main-nav a[href^='#'], .mobile-panel a[href^='#']");
  function setActiveNav() {
    if (!sections.length) return;
    const headerH = header ? header.getBoundingClientRect().bottom : 0;
    let currentId = "";
    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top - headerH - 40;
      if (top <= 0) currentId = section.id;
    });
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("is-active", isMatch && !!currentId);
    });
  }
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* ---------------- Reveal-on-scroll ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------- Floating contact widget ---------------- */
  const floatingContact = document.querySelector("[data-floating-contact]");
  if (floatingContact) {
    const toggleBtn = floatingContact.querySelector(".floating-contact-toggle");
    const menu = floatingContact.querySelector(".floating-contact-menu");
    function closeFloatingMenu() {
      floatingContact.setAttribute("data-open", "false");
      toggleBtn.setAttribute("aria-expanded", "false");
      if (menu) menu.hidden = true;
    }
    function openFloatingMenu() {
      floatingContact.setAttribute("data-open", "true");
      toggleBtn.setAttribute("aria-expanded", "true");
      if (menu) menu.hidden = false;
    }
    toggleBtn.addEventListener("click", () => {
      const isOpen = floatingContact.getAttribute("data-open") === "true";
      isOpen ? closeFloatingMenu() : openFloatingMenu();
    });
    document.addEventListener("click", (e) => {
      if (!floatingContact.contains(e.target)) closeFloatingMenu();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeFloatingMenu();
    });
  }

  /* ---------------- Login modal ---------------- */
  const loginModal = document.querySelector("#login-modal");
  if (loginModal) {
    const loginTriggers = document.querySelectorAll("[data-login-trigger]");
    const closeButtons = loginModal.querySelectorAll("[data-modal-close]");
    let lastFocused = null;

    function openLoginModal(e) {
      if (e) e.preventDefault();
      lastFocused = document.activeElement;
      loginModal.hidden = false;
      document.body.style.overflow = "hidden";
      const firstInput = loginModal.querySelector("input");
      if (firstInput) firstInput.focus();
    }
    function closeLoginModal() {
      loginModal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    loginTriggers.forEach((trigger) => trigger.addEventListener("click", openLoginModal));
    closeButtons.forEach((btn) => btn.addEventListener("click", closeLoginModal));
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeLoginModal();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !loginModal.hidden) closeLoginModal();
    });

    const loginFormDemo = document.querySelector("#login-form-demo");
    if (loginFormDemo) {
      loginFormDemo.addEventListener("submit", (e) => {
        e.preventDefault();
        // Intentionally a no-op: this site has no backend, so login cannot
        // actually authenticate. The persistent status message already
        // explains this; we simply prevent a real form submission/reload.
      });
    }
  }

  /* ---------------- Back to top ---------------- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      () => {
        backToTop.classList.toggle("is-visible", window.scrollY > 600);
      },
      { passive: true }
    );
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = question.getAttribute("aria-expanded") === "true";
      // Close all others (single-open accordion)
      document.querySelectorAll(".faq-question").forEach((q) => {
        if (q !== question) {
          q.setAttribute("aria-expanded", "false");
          const a = document.getElementById(q.getAttribute("aria-controls"));
          if (a) a.style.maxHeight = null;
        }
      });
      question.setAttribute("aria-expanded", String(!isOpen));
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  /* ---------------- Pricing monthly/annual toggle ---------------- */
  const pricingToggleBtns = document.querySelectorAll(".pricing-toggle button");
  const priceTags = document.querySelectorAll("[data-price-monthly]");
  pricingToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      pricingToggleBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const mode = btn.dataset.mode;
      priceTags.forEach((tag) => {
        tag.textContent = mode === "annual" ? tag.dataset.priceAnnual : tag.dataset.priceMonthly;
      });
    });
  });

  /* ---------------- Language switcher (i18n) ---------------- */
  const LANG_KEY = "estimatepro-lang";
  const langToggles = document.querySelectorAll("[data-lang-toggle]");

  function applyTranslations(lang) {
    if (typeof TRANSLATIONS === "undefined") return;
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.documentElement.setAttribute("lang", lang === "ne" ? "ne" : "en");

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key]) el.setAttribute("placeholder", dict[key]);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (dict[key]) el.setAttribute("aria-label", dict[key]);
    });

    langToggles.forEach((btn) => {
      btn.setAttribute("data-active-lang", lang);
      btn.setAttribute("aria-label", lang === "ne" ? "Switch language to English" : "Switch language to Nepali");
    });

    // Admin-edited pricing plan names/descriptions (synced from admin.html via
    // localStorage) take priority over the translation dictionary. Re-apply
    // them after every language switch so they aren't overwritten by the
    // data-i18n text replacement above. The rate-library sync intentionally
    // is not re-run here since the hero BOQ table doesn't carry data-i18n
    // text that would conflict.
    if (typeof syncAdminPlansIntoPricing === "function") {
      syncAdminPlansIntoPricing();
    }
  }

  function setLanguage(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (err) {
      /* localStorage may be unavailable; continue without persistence */
    }
    applyTranslations(lang);
  }

  langToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = btn.getAttribute("data-active-lang") === "ne" ? "ne" : "en";
      setLanguage(current === "en" ? "ne" : "en");
    });
  });

  let storedLang = "en";
  try {
    storedLang = localStorage.getItem(LANG_KEY) || "en";
  } catch (err) {
    storedLang = "en";
  }
  applyTranslations(storedLang);

  /* ---------------- Currency switcher (NPR default, USD optional) ---------------- */
  const CURRENCY_KEY = "estimatepro-currency";
  /**
   * Indicative conversion rate for display purposes only — not a live FX feed.
   * Update this figure periodically to keep NPR display amounts realistic.
   */
  const USD_TO_NPR_RATE = 133;

  /**
   * ---------------- Admin demo console sync ----------------
   * admin.html stores BOQ rate items and pricing-plan edits in localStorage
   * under these keys. If present, we use them to override the hero BOQ table
   * and the public Pricing cards, so changes made in the admin demo console
   * are reflected here without any code changes. This is still a client-side
   * demo (no real backend) — the data lives in the visitor's own browser, so
   * it only reflects on devices where the same browser/profile was used to
   * edit the admin console.
   */
  function syncAdminRatesIntoHero() {
    let rates = null;
    try {
      const raw = localStorage.getItem("estimatepro-admin-rates");
      if (raw) rates = JSON.parse(raw);
    } catch (err) {
      rates = null;
    }
    if (!Array.isArray(rates) || rates.length === 0) return;

    const tbody = document.querySelector("#hero-boq-body");
    if (!tbody) return;

    tbody.innerHTML = "";
    rates.forEach((r) => {
      const amountNpr = parseFloat(r.amount);
      if (Number.isNaN(amountNpr)) return;
      const amountUsdEquivalent = amountNpr / USD_TO_NPR_RATE;
      const tr = document.createElement("tr");
      const tdItem = document.createElement("td");
      tdItem.className = "item-name";
      tdItem.textContent = r.item || "";
      const tdUnit = document.createElement("td");
      tdUnit.textContent = r.unit || "";
      const tdQty = document.createElement("td");
      tdQty.className = "num";
      tdQty.textContent = "—";
      const tdAmount = document.createElement("td");
      tdAmount.className = "num";
      tdAmount.setAttribute("data-amount", String(amountUsdEquivalent));
      tdAmount.textContent = "रू " + Math.round(amountNpr).toLocaleString("en-IN");
      tr.append(tdItem, tdUnit, tdQty, tdAmount);
      tbody.appendChild(tr);
    });
  }

  function syncAdminPlansIntoPricing() {
    let plans = null;
    try {
      const raw = localStorage.getItem("estimatepro-admin-plans");
      if (raw) plans = JSON.parse(raw);
    } catch (err) {
      plans = null;
    }
    if (!Array.isArray(plans) || plans.length === 0) return;

    document.querySelectorAll("[data-plan-index]").forEach((card) => {
      const idx = parseInt(card.getAttribute("data-plan-index"), 10);
      const plan = plans[idx];
      if (!plan) return;
      const nameEl = card.querySelector("[data-plan-name]");
      const descEl = card.querySelector("[data-plan-desc]");
      if (nameEl && plan.name) nameEl.textContent = plan.name;
      if (descEl && plan.desc) descEl.textContent = plan.desc;
    });
  }

  // Run the sync before capturing currency-aware elements, so any rows
  // injected above are included in the currency-formatting pass below.
  syncAdminRatesIntoHero();
  syncAdminPlansIntoPricing();

  const currencyToggles = document.querySelectorAll("[data-currency-toggle]");
  const currencyAmountEls = document.querySelectorAll("[data-amount]");

  function formatMoney(amountUsd, currency) {
    if (currency === "npr") {
      const npr = Math.round(amountUsd * USD_TO_NPR_RATE);
      return "रू " + npr.toLocaleString("en-IN");
    }
    return "$" + Math.round(amountUsd).toLocaleString("en-US");
  }

  function applyCurrency(currency) {
    currencyAmountEls.forEach((el) => {
      const base = parseFloat(el.getAttribute("data-amount"));
      if (Number.isNaN(base)) return;
      el.textContent = formatMoney(base, currency);
    });
    currencyToggles.forEach((btn) => {
      btn.setAttribute("data-active-currency", currency);
      btn.setAttribute(
        "aria-label",
        currency === "npr" ? "Switch currency to US Dollar" : "Switch currency to Nepali Rupee"
      );
    });
  }

  function setCurrency(currency) {
    try {
      localStorage.setItem(CURRENCY_KEY, currency);
    } catch (err) {
      /* ignore */
    }
    applyCurrency(currency);
  }

  currencyToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = btn.getAttribute("data-active-currency") === "usd" ? "usd" : "npr";
      setCurrency(current === "npr" ? "usd" : "npr");
    });
  });

  let storedCurrency = "npr";
  try {
    storedCurrency = localStorage.getItem(CURRENCY_KEY) || "npr";
  } catch (err) {
    storedCurrency = "npr";
  }
  applyCurrency(storedCurrency);

  /* ---------------- Live Estimate Builder hero mockup ---------------- */
  const liveTotalEl = document.querySelector("[data-live-total]");
  if (liveTotalEl) {
    let frame = 0;
    function activeCurrency() {
      try {
        return localStorage.getItem(CURRENCY_KEY) || "npr";
      } catch (err) {
        return "npr";
      }
    }
    function baseTotalUsd() {
      const cells = document.querySelectorAll("#hero-boq-body [data-amount]");
      let sum = 0;
      cells.forEach((cell) => {
        const v = parseFloat(cell.getAttribute("data-amount"));
        if (!Number.isNaN(v)) sum += v;
      });
      return sum;
    }
    function tick() {
      frame += 1;
      const base = baseTotalUsd();
      const wobble = Math.sin(frame / 28) * (base * 0.0035 || 3200);
      liveTotalEl.textContent = formatMoney(base + wobble, activeCurrency());
    }
    tick();
    if (!prefersReducedMotion) {
      setInterval(tick, 110);
    }
    currencyToggles.forEach((btn) => btn.addEventListener("click", tick));
  }

  /* ---------------- Hero dashboard category tabs (auto-cycling) ---------------- */
  const heroMock = document.querySelector(".hero-mock");
  if (heroMock) {
    const heroTabs = heroMock.querySelectorAll("[data-hero-tab]");
    const heroPanels = heroMock.querySelectorAll("[data-hero-panel]");
    let heroAutoTimer = null;

    function activateHeroTab(name) {
      heroTabs.forEach((tab) => {
        const isMatch = tab.dataset.heroTab === name;
        tab.classList.toggle("is-active", isMatch);
        tab.setAttribute("aria-selected", String(isMatch));
      });
      heroPanels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.heroPanel === name);
      });
    }

    function startHeroAutoCycle() {
      if (prefersReducedMotion || !heroTabs.length) return;
      const order = Array.from(heroTabs).map((t) => t.dataset.heroTab);
      let index = 0;
      heroAutoTimer = window.setInterval(() => {
        index = (index + 1) % order.length;
        activateHeroTab(order[index]);
      }, 4000);
    }
    function stopHeroAutoCycle() {
      if (heroAutoTimer) {
        window.clearInterval(heroAutoTimer);
        heroAutoTimer = null;
      }
    }

    heroTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activateHeroTab(tab.dataset.heroTab);
        stopHeroAutoCycle();
        startHeroAutoCycle();
      });
    });

    startHeroAutoCycle();
  }

  /* ---------------- Demo / Contact form ---------------- */
  const demoForm = document.querySelector("#demo-form");
  if (demoForm) {
    /**
     * FORM SERVICE CONFIGURATION
     * This site is static (GitHub Pages) and has no backend.
     * To enable real submissions, configure one static-site-compatible
     * form service below and set FORM_CONFIG.endpoint + FORM_CONFIG.provider.
     *
     * Example — Web3Forms:
     *   provider: "web3forms", endpoint: "https://api.web3forms.com/submit",
     *   accessKey: "YOUR_PUBLIC_ACCESS_KEY"
     *
     * Example — Formspree:
     *   provider: "formspree", endpoint: "https://formspree.io/f/YOUR_FORM_ID"
     *
     * Do NOT put private/secret API keys here — only public form endpoints.
     */
    const FORM_CONFIG = {
      provider: null, // "web3forms" | "formspree" | null
      endpoint: null,
      accessKey: null,
    };

    const statusBox = demoForm.querySelector(".form-status");

    function showStatus(message, type) {
      if (!statusBox) return;
      statusBox.textContent = message;
      statusBox.className = "form-status " + (type === "success" ? "is-success" : "is-info");
    }

    function validateField(field) {
      const wrapper = field.closest(".form-field");
      const errorEl = wrapper ? wrapper.querySelector(".form-error") : null;
      let message = "";

      if (field.hasAttribute("required") && !field.value.trim()) {
        message = field.dataset.errorRequired || "This field is required.";
      } else if (field.type === "email" && field.value.trim()) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(field.value.trim())) {
          message = field.dataset.errorEmail || "Please enter a valid email address.";
        }
      } else if (field.type === "checkbox" && field.hasAttribute("required") && !field.checked) {
        message = field.dataset.errorConsent || "Please confirm consent to be contacted.";
      }

      if (wrapper) wrapper.classList.toggle("has-error", !!message);
      if (errorEl) errorEl.textContent = message;
      return !message;
    }

    demoForm.querySelectorAll("input, select, textarea").forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
    });

    demoForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fields = Array.from(demoForm.querySelectorAll("input, select, textarea"));
      const allValid = fields.map(validateField).every(Boolean);
      if (!allValid) {
        showStatus(demoForm.dataset.errorSummary || "Please correct the highlighted fields.", "info");
        return;
      }

      if (!FORM_CONFIG.provider || !FORM_CONFIG.endpoint) {
        showStatus(
          demoForm.dataset.notConfigured ||
            "Demo request form is not yet connected to a backend. Please configure a form service to enable submissions.",
          "info"
        );
        return;
      }

      const submitBtn = demoForm.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const formData = new FormData(demoForm);
        if (FORM_CONFIG.provider === "web3forms" && FORM_CONFIG.accessKey) {
          formData.append("access_key", FORM_CONFIG.accessKey);
        }
        const response = await fetch(FORM_CONFIG.endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        if (response.ok) {
          showStatus(demoForm.dataset.success || "Thank you! Your request has been received.", "success");
          demoForm.reset();
        } else {
          showStatus("Something went wrong submitting the form. Please try again or email us directly.", "info");
        }
      } catch (err) {
        showStatus("Could not reach the form service. Please try again or email us directly.", "info");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  /* ---------------- Cookie consent banner ---------------- */
  const COOKIE_KEY = "estimatepro-cookie-consent";
  const cookieBanner = document.querySelector(".cookie-banner");
  if (cookieBanner) {
    let consent = null;
    try {
      consent = localStorage.getItem(COOKIE_KEY);
    } catch (err) {
      consent = null;
    }
    if (!consent) {
      window.setTimeout(() => cookieBanner.classList.add("is-visible"), 700);
    }
    cookieBanner.querySelectorAll("[data-cookie-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        try {
          localStorage.setItem(COOKIE_KEY, btn.dataset.cookieAction);
        } catch (err) {
          /* ignore */
        }
        cookieBanner.classList.remove("is-visible");
      });
    });
  }
})();
