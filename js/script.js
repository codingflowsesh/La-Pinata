// Select mobile navigation elements.
const menuButton = document.querySelector(".site-nav__toggle");
const mobileMenu = document.querySelector("#mobile-navigation");
const mobileBreakpoint = window.matchMedia("(max-width: 960px)");

if (menuButton && mobileMenu) {
  // Open menu.
  function openMenu() {
    mobileMenu.hidden = false;
    mobileMenu.classList.add("is-open");
    menuButton.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
  }

  // Close menu.
  function closeMenu() {
    mobileMenu.hidden = true;
    mobileMenu.classList.remove("is-open");
    menuButton.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }

  // Toggle menu.
  function toggleMenu() {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  menuButton.addEventListener("click", toggleMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileMenu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });

  mobileBreakpoint.addEventListener("change", (event) => {
    if (!event.matches) {
      closeMenu();
    }
  });
}

// ==============================
// FAQ Accordion
// ==============================
const faqButtons = document.querySelectorAll(".faq__question");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const faqItem = button.closest(".faq__item");
    const answer = faqItem.querySelector(".faq__answer");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      faqItem.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
      answer.hidden = true;
    } else {
      faqItem.classList.add("is-open");
      button.setAttribute("aria-expanded", "true");
      answer.hidden = false;
    }
  });
});
