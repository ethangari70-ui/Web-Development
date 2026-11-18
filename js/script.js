// SkyNest Co-Living Spaces — shared behaviour
// Handles: mobile nav toggle, text-resize control, high-contrast toggle.
// Preferences persist across pages via localStorage.

(function () {
  "use strict";

  var root = document.documentElement;
  var FONT_KEY = "skynest-font-scale";
  var CONTRAST_KEY = "skynest-contrast";
  var MIN_SCALE = 0.9;
  var MAX_SCALE = 1.35;
  var STEP = 0.1;

  function applyFontScale(scale) {
    root.style.fontSize = (16 * scale) + "px";
  }

  function getStoredScale() {
    var v = parseFloat(localStorage.getItem(FONT_KEY));
    return isNaN(v) ? 1 : v;
  }

  function setStoredScale(v) {
    localStorage.setItem(FONT_KEY, v);
    applyFontScale(v);
  }

  function applyContrast(on) {
    if (on) {
      root.setAttribute("data-contrast", "high");
    } else {
      root.removeAttribute("data-contrast");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // ---- restore saved preferences on every page ----
    applyFontScale(getStoredScale());
    applyContrast(localStorage.getItem(CONTRAST_KEY) === "on");

    // ---- text resize buttons ----
    var incBtn = document.getElementById("font-inc");
    var decBtn = document.getElementById("font-dec");
    var resetBtn = document.getElementById("font-reset");

    if (incBtn) {
      incBtn.addEventListener("click", function () {
        var next = Math.min(MAX_SCALE, getStoredScale() + STEP);
        setStoredScale(next);
      });
    }
    if (decBtn) {
      decBtn.addEventListener("click", function () {
        var next = Math.max(MIN_SCALE, getStoredScale() - STEP);
        setStoredScale(next);
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        setStoredScale(1);
      });
    }

    // ---- high contrast toggle ----
    var contrastBtn = document.getElementById("contrast-toggle");
    if (contrastBtn) {
      contrastBtn.addEventListener("click", function () {
        var isOn = root.getAttribute("data-contrast") === "high";
        applyContrast(!isOn);
        localStorage.setItem(CONTRAST_KEY, !isOn ? "on" : "off");
        contrastBtn.setAttribute("aria-pressed", String(!isOn));
      });
      contrastBtn.setAttribute(
        "aria-pressed",
        String(localStorage.getItem(CONTRAST_KEY) === "on")
      );
    }

    // ---- mobile nav toggle (keyboard + click accessible) ----
    var menuToggle = document.getElementById("menu-toggle");
    var mainNav = document.getElementById("main-nav");
    function setMenu(open) {
      mainNav.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (menuToggle && mainNav) {
      menuToggle.addEventListener("click", function () {
        setMenu(!mainNav.classList.contains("open"));
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mainNav.classList.contains("open")) {
          setMenu(false);
          menuToggle.focus();
        }
      });
    }

    // ---- contact form: friendly inline confirmation (no backend) ----
    var contactForm = document.getElementById("enquiry-form");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = document.getElementById("form-status");
        if (status) {
          status.textContent =
            "Thanks — your enquiry has been noted. Our team will reply within one working day.";
          status.setAttribute("role", "status");
        }
        contactForm.reset();
      });
    }
  });
})();
