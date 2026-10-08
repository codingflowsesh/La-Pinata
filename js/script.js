// Select mobile navigation elements.
const menuButton = document.querySelector(".site-nav__toggle");
const mobileMenu = document.querySelector("#mobile-navigation");
const mobileMenuBackdrop = document.querySelector(".site-nav__mobile-backdrop");
const mobileBreakpoint = window.matchMedia("(max-width: 960px)");
const phoneMenuBreakpoint = window.matchMedia("(max-width: 767px)");

if (menuButton && mobileMenu) {
  // Open menu.
  function openMenu() {
    mobileMenu.hidden = false;
    if (mobileMenuBackdrop) {
      mobileMenuBackdrop.hidden = false;
    }
    mobileMenu.classList.add("is-open");
    menuButton.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
  }

  // Close menu.
  function closeMenu() {
    mobileMenu.hidden = true;
    if (mobileMenuBackdrop) {
      mobileMenuBackdrop.hidden = true;
    }
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

  if (mobileMenuBackdrop) {
    mobileMenuBackdrop.addEventListener("click", closeMenu);
  }

  document.addEventListener("pointerdown", (event) => {
    if (
      phoneMenuBreakpoint.matches &&
      !mobileMenu.hidden &&
      !mobileMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      closeMenu();
    }
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
// Full Gallery Modal
// ==============================
function trackGalleryOpen(galleryName) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "gallery_open",
    gallery_name: galleryName
  });
}

var galleryProjects = [];
const openFullGalleryButton = document.querySelector(".js-open-full-gallery");
const fullGalleryModal = document.querySelector("#full-gallery-modal");
const fullGalleryBackdrop = fullGalleryModal?.querySelector(".full-gallery-backdrop");
const fullGalleryCloseButton = fullGalleryModal?.querySelector(".full-gallery-close");
const fullGalleryGrid = document.querySelector("#full-gallery-grid");
const fullGalleryLightbox = document.querySelector("#full-gallery-lightbox");
const fullGalleryLightboxTitle = document.querySelector("#full-gallery-lightbox-title");
const fullGalleryLightboxMedia = document.querySelector("#full-gallery-lightbox-media");
const fullGalleryLightboxClose = fullGalleryModal?.querySelector(".full-gallery-lightbox__close");
const fullGalleryLightboxPrevious = fullGalleryModal?.querySelector(".full-gallery-arrow--previous");
const fullGalleryLightboxNext = fullGalleryModal?.querySelector(".full-gallery-arrow--next");
const fullGalleryLightboxPagination = document.querySelector("#full-gallery-lightbox-pagination");
const fullGalleryLightboxCounter = document.querySelector("#full-gallery-lightbox-counter");
const fullGalleryLightboxStatus = document.querySelector("#full-gallery-lightbox-status");
const fullGalleryLightboxBack = document.querySelector(".full-gallery-lightbox__back");

if (
  openFullGalleryButton &&
  fullGalleryModal &&
  fullGalleryBackdrop &&
  fullGalleryCloseButton &&
  fullGalleryGrid &&
  fullGalleryLightbox &&
  fullGalleryLightboxTitle &&
  fullGalleryLightboxMedia &&
  fullGalleryLightboxClose &&
  fullGalleryLightboxPrevious &&
  fullGalleryLightboxNext &&
  fullGalleryLightboxPagination &&
  fullGalleryLightboxCounter &&
  fullGalleryLightboxStatus &&
  fullGalleryLightboxBack
) {
  let fullGalleryItems = galleryProjects.flatMap((project) => project.media.map((mediaItem) => ({
    ...mediaItem,
    projectId: project.id,
    projectTitle: project.title,
    alt: mediaItem.alt || `${project.title} piÃ±ata video`
  })));
  const fullGalleryReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeFullGalleryIndex = 0;
  let activeFullGalleryTrigger = null;

  function stopFullGalleryVideos() {
    fullGalleryModal.querySelectorAll("video").forEach((video) => {
      video.pause();
      try {
        video.currentTime = 0;
      } catch (error) {
        // The media may not have loaded metadata yet.
      }
    });
  }

  function renderFullGalleryGrid() {
    const fragment = document.createDocumentFragment();

    fullGalleryItems.forEach((item, index) => {
      const button = document.createElement("button");
      button.className = `full-gallery-item${item.type === "video" ? " full-gallery-item--video" : ""}`;
      button.type = "button";
      button.setAttribute("aria-label", `Open ${item.projectTitle} gallery item`);

      if (item.type === "video") {
        const video = document.createElement("video");
        video.src = item.src;
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("muted", "");
        video.setAttribute("playsinline", "");
        video.setAttribute("aria-label", item.alt);
        button.appendChild(video);

        const badge = document.createElement("span");
        badge.className = "full-gallery-play-badge";
        badge.setAttribute("aria-hidden", "true");
        badge.textContent = "â–¶";
        button.appendChild(badge);
        badge.textContent = "\u25B6";
      } else {
        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.alt;
        image.loading = "lazy";
        image.decoding = "async";
        button.appendChild(image);
      }

      button.addEventListener("click", () => {
        activeFullGalleryTrigger = button;
        openFullGalleryLightbox(index);
      });
      fragment.appendChild(button);
    });

    fullGalleryGrid.replaceChildren(fragment);
  }

  function updateFullGalleryLightboxPagination() {
    fullGalleryLightboxPagination.querySelectorAll("span").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeFullGalleryIndex);
    });
    fullGalleryLightboxStatus.textContent = `${fullGalleryItems[activeFullGalleryIndex].projectTitle}: ${activeFullGalleryIndex + 1} of ${fullGalleryItems.length}`;
    fullGalleryLightboxCounter.textContent = `${activeFullGalleryIndex + 1} / ${fullGalleryItems.length}`;
  }

  function showFullGalleryItem(index) {
    if (!fullGalleryItems.length) {
      return;
    }

    activeFullGalleryIndex = (index + fullGalleryItems.length) % fullGalleryItems.length;
    const item = fullGalleryItems[activeFullGalleryIndex];

    stopFullGalleryVideos();
    fullGalleryLightboxMedia.replaceChildren();
    fullGalleryLightboxTitle.textContent = item.projectTitle;

    if (item.type === "video") {
      const video = document.createElement("video");
      video.src = item.src;
      video.controls = true;
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("aria-label", item.alt);
      fullGalleryLightboxMedia.appendChild(video);

      if (!fullGalleryReducedMotion.matches) {
        video.play().catch(() => {});
      }
    } else {
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.alt;
      fullGalleryLightboxMedia.appendChild(image);
    }

    updateFullGalleryLightboxPagination();
  }

  function openFullGalleryLightbox(index) {
    activeFullGalleryIndex = index;
    fullGalleryGrid.hidden = true;
    fullGalleryLightbox.hidden = false;
    fullGalleryLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-lightbox-open");
    showFullGalleryItem(activeFullGalleryIndex);
    fullGalleryLightboxClose.focus({ preventScroll: true });
  }

  function closeFullGalleryLightbox() {
    stopFullGalleryVideos();
    fullGalleryLightboxMedia.replaceChildren();
    fullGalleryLightbox.hidden = true;
    fullGalleryLightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-lightbox-open");
    fullGalleryGrid.hidden = false;

    if (activeFullGalleryTrigger) {
      activeFullGalleryTrigger.focus({ preventScroll: true });
    }
  }

  function goToNextFullGalleryItem() {
    showFullGalleryItem(activeFullGalleryIndex + 1);
  }

  function goToPreviousFullGalleryItem() {
    showFullGalleryItem(activeFullGalleryIndex - 1);
  }

  // Descriptive aliases for the full-gallery lightbox controls.
  function renderFullGalleryLightboxItem(index) {
    showFullGalleryItem(index);
  }

  function nextFullGalleryItem() {
    goToNextFullGalleryItem();
  }

  function previousFullGalleryItem() {
    goToPreviousFullGalleryItem();
  }

  function stopFullGalleryLightboxVideos() {
    stopFullGalleryVideos();
  }

  function openFullGalleryModal() {
    fullGalleryItems = [
      ...galleryProjects.flatMap((project) => project.media.map((mediaItem) => ({
        ...mediaItem,
        projectId: project.id,
        projectTitle: project.title,
        alt: mediaItem.alt || `${project.title} gallery video`
      }))),
      {
        type: "video",
        src: "assets/videos/beiber-video.mp4",
        projectTitle: "Beiber",
        alt: "Beiber piÃ±ata video"
      },
      {
        type: "video",
        src: "assets/videos/jaguar-video.mp4",
        projectTitle: "Jaguar",
        alt: "Jaguar piÃ±ata video"
      }
    ].filter((item) => item.src);
    fullGalleryLightboxPagination.replaceChildren();
    fullGalleryItems.forEach(() => {
      const dot = document.createElement("span");
      dot.className = "full-gallery-lightbox__dot";
      dot.setAttribute("aria-hidden", "true");
      fullGalleryLightboxPagination.appendChild(dot);
    });
    renderFullGalleryGrid();
    closeFullGalleryLightbox();
    fullGalleryModal.hidden = false;
    fullGalleryModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-full-gallery-open");
    trackGalleryOpen("Full Gallery");
    fullGalleryCloseButton.focus();
  }

  function closeFullGalleryModal() {
    stopFullGalleryVideos();
    fullGalleryLightboxMedia.replaceChildren();
    fullGalleryModal.hidden = true;
    fullGalleryModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-full-gallery-open");
    document.body.classList.remove("is-lightbox-open");
    openFullGalleryButton.focus({ preventScroll: true });
  }

  for (let index = 0; index < fullGalleryItems.length; index += 1) {
    const dot = document.createElement("span");
    dot.className = "full-gallery-lightbox__dot";
    dot.setAttribute("aria-hidden", "true");
    fullGalleryLightboxPagination.appendChild(dot);
  }

  openFullGalleryButton.addEventListener("click", (event) => {
    event.preventDefault();
    openFullGalleryModal();
  });

  fullGalleryCloseButton.addEventListener("click", closeFullGalleryModal);
  fullGalleryBackdrop.addEventListener("click", closeFullGalleryModal);
  fullGalleryLightboxClose.addEventListener("click", closeFullGalleryLightbox);
  fullGalleryLightboxPrevious.addEventListener("click", goToPreviousFullGalleryItem);
  fullGalleryLightboxNext.addEventListener("click", goToNextFullGalleryItem);
  fullGalleryLightboxBack.addEventListener("click", closeFullGalleryLightbox);
  fullGalleryLightbox.addEventListener("click", (event) => {
    if (event.target === fullGalleryLightbox || event.target === fullGalleryLightboxMedia) {
      closeFullGalleryLightbox();
    }
  });

  fullGalleryModal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      if (!fullGalleryLightbox.hidden) {
        closeFullGalleryLightbox();
      } else {
        closeFullGalleryModal();
      }
    } else if (!fullGalleryLightbox.hidden && event.key === "ArrowLeft") {
      event.preventDefault();
      goToPreviousFullGalleryItem();
    } else if (!fullGalleryLightbox.hidden && event.key === "ArrowRight") {
      event.preventDefault();
      goToNextFullGalleryItem();
    }
  });
}

// ==============================
// FAQ Accordion
// ==============================
const faqButtons = document.querySelectorAll(".faq__question");
const mobileFaqBreakpoint = window.matchMedia("(max-width: 767px)");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const faqMotionDuration = 220;

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const faqItem = button.closest(".faq__item");
    const answer = faqItem.querySelector(".faq__answer");
    const isOpen = button.getAttribute("aria-expanded") === "true";

    if (faqItem.faqCloseTimer) {
      window.clearTimeout(faqItem.faqCloseTimer);
      faqItem.faqCloseTimer = null;
    }

    if (isOpen) {
      faqItem.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");

      if (!mobileFaqBreakpoint.matches || reducedMotionPreference.matches) {
        answer.hidden = true;
        return;
      }

      faqItem.classList.add("is-closing");
      faqItem.faqCloseTimer = window.setTimeout(() => {
        if (button.getAttribute("aria-expanded") === "false") {
          answer.hidden = true;
          faqItem.classList.remove("is-closing");
        }

        faqItem.faqCloseTimer = null;
      }, faqMotionDuration);
    } else {
      button.setAttribute("aria-expanded", "true");
      faqItem.classList.remove("is-closing");
      answer.hidden = false;

      if (!mobileFaqBreakpoint.matches || reducedMotionPreference.matches) {
        faqItem.classList.add("is-open");
        return;
      }

      window.requestAnimationFrame(() => {
        if (button.getAttribute("aria-expanded") === "true") {
          faqItem.classList.add("is-open");
        }
      });
    }
  });
});

// ==============================
// Mobile Gallery
// ==============================
galleryProjects = [
  {
    id: "caterpillar",
    title: "Caterpillar",
    cover: "assets/images/trans-img/caterpillar-1.webp",
    media: [
      { type: "video", src: "assets/videos/caterpiller-video.mp4", alt: "Caterpillar piñata video" },
      { type: "image", src: "assets/images/gallery/caterpillar-1-resized.webp", alt: "Caterpillar piñata gallery photo" },
    ]
  },
  {
    id: "jasmine",
    title: "Jasmine Piñatas",
    cover: "assets/images/trans-img/jasmine-m.webp",
    media: [
      { type: "image", src: "assets/images/gallery/jasmine-m-resized.webp", alt: "Jasmine letter M piñata gallery photo" },
      { type: "image", src: "assets/images/gallery/jasmine-15-resized.webp", alt: "Jasmine number fifteen piñata gallery photo" }
    ]
  },
  {
    id: "brown-bull",
    title: "Brown Bull",
    cover: "assets/images/trans-img/brown-bull.webp",
    media: [
      { type: "image", src: "assets/images/gallery/brown-bull-resized.webp", alt: "Brown bull piñata gallery photo" }
    ]
  },
  {
    id: "cookie-monster",
    title: "Cookie Monster",
    cover: "assets/images/trans-img/cookie-monster.webp",
    media: [
      { type: "image", src: "assets/images/gallery/cookie-monster-resized.webp", alt: "Cookie Monster piñata gallery photo" }
    ]
  },
  {
    id: "blue-fish",
    title: "Blue Fish",
    cover: "assets/images/trans-img/blue-fish.webp",
    media: [
      { type: "video", src: "assets/videos/blue-fish-video.mp4", alt: "Blue fish piñata video" },
      { type: "image", src: "assets/images/gallery/blue-fish-resized.webp", alt: "Blue fish piñata gallery photo" },
    ]
  },
  {
    id: "dinosaur",
    title: "Dinosaur and Triceratops",
    cover: "assets/images/trans-img/blue-orange-dino.webp",
    media: [
      { type: "image", src: "assets/images/gallery/blue-dino-resized.webp", alt: "Blue dinosaur piñata gallery photo" },
      { type: "image", src: "assets/images/gallery/blue-orange-dino-resized.webp", alt: "Blue and orange dinosaur piñatas gallery photo" }
    ]
  },
  {
    id: "cow",
    title: "Cow",
    cover: "assets/images/trans-img/cow.webp",
    media: [
      { type: "image", src: "assets/images/gallery/cow-resized.webp", alt: "Cow piñata gallery photo" }
    ]
  },
  {
    id: "hello-kitty",
    title: "Hello Kitty",
    cover: "assets/images/trans-img/hello-kitty.webp",
    media: [
      { type: "video", src: "assets/videos/hello-kitty-video.mp4", alt: "Hello Kitty piñata video" },
      { type: "image", src: "assets/images/gallery/hello-kitty-resized.webp", alt: "Hello Kitty piñata gallery photo" },
    ]
  },
  {
    id: "joshua",
    title: "Sports Theme Set",
    cover: "assets/images/trans-img/joshua-combo.webp",
    media: [
      { type: "video", src: "assets/videos/joshua-ball-video.mp4", alt: "Joshua football piñata video" },
      { type: "image", src: "assets/images/gallery/joshua-1-resized.webp", alt: "Joshua number one piñata gallery photo" },
      { type: "image", src: "assets/images/gallery/joshua-football-resized.webp", alt: "Joshua football piñata gallery photo" },
      { type: "image", src: "assets/images/gallery/joshua-resized.webp", alt: "Number one and football piñata set gallery photo" },
    ]
  },
  {
    id: "lorenzo",
    title: "Lorenzo",
    cover: "assets/images/trans-img/lorenzo-1.webp",
    media: [
      { type: "image", src: "assets/images/gallery/lorenzo-1-resized.webp", alt: "Lorenzo number two piñata gallery photo" }
    ]
  },
  {
    id: "miss-racheal",
    title: "Miss Rachel",
    cover: "assets/images/trans-img/miss-racheal.webp",
    media: [
      { type: "video", src: "assets/videos/ms-racheal.mp4", alt: "Miss Rachel piñata video" },
      { type: "image", src: "assets/images/gallery/miss-racheal-resized.webp", alt: "Miss Rachel birthday piñata gallery photo" },
    ]
  },
  {
    id: "moana",
    title: "Moana Number 2",
    cover: "assets/images/trans-img/moana-2.webp",
    media: [
      { type: "image", src: "assets/images/gallery/moana-2-resized.webp", alt: "Moana number two piñata gallery photo" }
    ]
  },
  {
    id: "party-guy",
    title: "Party Guy",
    cover: "assets/images/trans-img/party-guy.webp",
    media: [
      { type: "video", src: "assets/videos/party-guy-video.mp4", alt: "Party guy piñata video" },
      { type: "video", src: "assets/videos/party-guy-2-video.mp4", alt: "Party guy piñata video" },
      { type: "image", src: "assets/images/gallery/party-guy-resized.webp", alt: "Party guy piñata gallery photo" },
    ]
  },
  {
    id: "pigeon",
    title: "Pigeon",
    cover: "assets/images/trans-img/pigeon.webp",
    media: [
      { type: "video", src: "assets/videos/pigeon-video.mp4", alt: "Pigeon piñata video" },
      { type: "image", src: "assets/images/gallery/pigeon-resized.png", alt: "Pigeon piñata gallery photo" },
    ]
  },
  {
    id: "pink-cross",
    title: "Pink Cross",
    cover: "assets/images/trans-img/pink cross.webp",
    media: [
      { type: "image", src: "assets/images/gallery/pink cross-resized.webp", alt: "Pink cross piñata gallery photo" }
    ]
  },
  {
    id: "pink-star",
    title: "Pink Star",
    cover: "assets/images/trans-img/pink-star.webp",
    media: [
      { type: "video", src: "assets/videos/star-video.mp4", alt: "Pink star piñata video" },
      { type: "image", src: "assets/images/gallery/pink-star-resized.webp", alt: "Pink star piñata gallery photo" },
    ]
  }
];

const mobileGalleryBreakpoint = window.matchMedia("(max-width: 767px), (min-width: 768px) and (max-width: 1366px)");
const desktopGalleryBreakpoint = window.matchMedia("(min-width: 1367px)");
const mobileGalleryReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const mobileGalleryTrack = document.querySelector(".gallery-showcase__grid");
let mobileGalleryCards = [];
const mobileGalleryPagination = document.querySelector(".gallery-showcase__pagination");
const mobileGalleryStatus = document.querySelector(".gallery-showcase__status");
const mainGalleryPrevious = document.querySelector(".gallery-showcase__carousel-control--previous");
const mainGalleryNext = document.querySelector(".gallery-showcase__carousel-control--next");
const mobileGalleryModal = document.querySelector("#mobile-gallery-modal");
const mobileGalleryModalClose = document.querySelector(".mobile-gallery-modal__close");
const mobileGalleryModalTitle = document.querySelector(".mobile-gallery-modal__title");
const mobileGalleryModalPrevious = document.querySelector(".mobile-gallery-modal__nav--previous");
const mobileGalleryModalTrack = document.querySelector(".mobile-gallery-modal__track");
const mobileGalleryModalNext = document.querySelector(".mobile-gallery-modal__nav--next");
const mobileGalleryModalPagination = document.querySelector(".mobile-gallery-modal__pagination");
const mobileGalleryModalStatus = document.querySelector(".mobile-gallery-modal__status");
const mobileGalleryModalHint = document.querySelector(".mobile-gallery-modal__hint");

if (
  mobileGalleryTrack &&
  mobileGalleryPagination &&
  mobileGalleryStatus &&
  mainGalleryPrevious &&
  mainGalleryNext &&
  mobileGalleryModal &&
  mobileGalleryModalClose &&
  mobileGalleryModalTitle &&
  mobileGalleryModalPrevious &&
  mobileGalleryModalTrack &&
  mobileGalleryModalNext &&
  mobileGalleryModalPagination &&
  mobileGalleryModalStatus &&
  mobileGalleryModalHint
) {
  let activeGalleryCard = null;
  let activeGalleryProject = null;
  let mainGalleryFrame = null;
  let modalGalleryFrame = null;
  let pointerStartX = 0;
  let mainGalleryWasDragged = false;

  const galleryCardThemes = {
    caterpillar: "pink",
    jasmine: "yellow",
    "brown-bull": "mint",
    "cookie-monster": "lavender",
    "blue-fish": "pink",
    dinosaur: "lavender",
    cow: "yellow",
    "hello-kitty": "pink",
    joshua: "mint",
    lorenzo: "lavender",
    "miss-racheal": "mint",
    moana: "yellow",
    "party-guy": "pink",
    pigeon: "lavender",
    "pink-cross": "mint",
    "pink-star": "yellow"
  };

  function renderGalleryTeaserCards() {
    const cards = document.createDocumentFragment();

    galleryProjects.forEach((project, index) => {
      const card = document.createElement("article");
      const media = document.createElement("span");
      const image = document.createElement("img");
      const theme = galleryCardThemes[project.id] || ["pink", "lavender", "mint", "yellow"][index % 4];

      card.className = `gallery-showcase__card gallery-showcase__card--${theme}`;
      card.dataset.galleryProject = project.id;

      if (project.id === "jasmine") {
        card.classList.add("gallery-showcase__card--jasmine");
      }

      if (project.id === "cookie-monster") {
        card.classList.add("gallery-showcase__card--cookie-monster");
      }

      media.className = "gallery-showcase__card-media";
      image.src = project.cover;
      image.alt = `${project.title} custom piñata`;
      image.loading = index < 4 ? "eager" : "lazy";
      image.decoding = "async";

      media.appendChild(image);
      card.appendChild(media);
      cards.appendChild(card);
    });

    mobileGalleryTrack.replaceChildren(cards);
    return Array.from(mobileGalleryTrack.querySelectorAll(".gallery-showcase__card[data-gallery-project]"));
  }

  mobileGalleryCards = renderGalleryTeaserCards();

  function isGalleryInteractionActive() {
    return mobileGalleryBreakpoint.matches || desktopGalleryBreakpoint.matches;
  }

  function findProject(projectId) {
    return galleryProjects.find((project) => project.id === projectId);
  }

  function getProjectMedia(project) {
    return project.media;
  }

  function createPaginationDots(container, count, dotClass) {
    container.replaceChildren();

    for (let index = 0; index < count; index += 1) {
      const dot = document.createElement("span");
      dot.className = dotClass;
      dot.classList.toggle("is-active", index === 0);
      container.appendChild(dot);
    }
  }

  function updatePaginationDots(container, activeIndex) {
    container.querySelectorAll("span").forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  }

  function getNearestSlideIndex(track, slides) {
    const trackLeft = track.getBoundingClientRect().left;
    let closestIndex = 0;
    let closestDistance = Infinity;

    slides.forEach((slide, index) => {
      const distance = Math.abs(slide.getBoundingClientRect().left - trackLeft);

      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });

    return closestIndex;
  }

  function updateMainGalleryPagination() {
    const activeIndex = getNearestSlideIndex(mobileGalleryTrack, mobileGalleryCards);
    updatePaginationDots(mobileGalleryPagination, activeIndex);
    mobileGalleryStatus.textContent = `Piñata ${activeIndex + 1} of ${mobileGalleryCards.length}`;
    syncMainGalleryVideos(activeIndex);
    updateMainGalleryControls();
  }

  function updateMainGalleryControls() {
    const maximumScroll = Math.max(0, mobileGalleryTrack.scrollWidth - mobileGalleryTrack.clientWidth);
    const isAtStart = mobileGalleryTrack.scrollLeft <= 1;
    const isAtEnd = mobileGalleryTrack.scrollLeft >= maximumScroll - 1;

    mainGalleryPrevious.disabled = isAtStart;
    mainGalleryNext.disabled = isAtEnd;
  }

  function navigateMainGallery(direction) {
    const activeIndex = getNearestSlideIndex(mobileGalleryTrack, mobileGalleryCards);
    const nextIndex = Math.min(Math.max(activeIndex + direction, 0), mobileGalleryCards.length - 1);

    if (nextIndex === activeIndex) {
      return;
    }

    mobileGalleryTrack.scrollTo({
      left: mobileGalleryCards[nextIndex].offsetLeft,
      behavior: mobileGalleryReducedMotion.matches ? "auto" : "smooth"
    });
  }

  // ==============================
  // Mobile Gallery Video Autoplay
  // ==============================
  function resetVideo(video) {
    video.pause();
    video.currentTime = 0;
  }

  function pauseAllVideos(activeIndex) {
    mobileGalleryModalTrack.querySelectorAll(".mobile-gallery-modal__slide").forEach((slide, index) => {
      const video = slide.querySelector("video");

      if (video && index !== activeIndex) {
        resetVideo(video);
      }
    });
  }

  function playVisibleVideo(activeIndex) {
    if (mobileGalleryReducedMotion.matches || mobileGalleryModal.hidden) {
      return;
    }

    const slides = mobileGalleryModalTrack.querySelectorAll(".mobile-gallery-modal__slide");
    const activeSlide = slides[activeIndex];

    if (!activeSlide) {
      return;
    }

    const video = activeSlide.querySelector("video");

    if (video) {
      video.play().catch(() => {});
    }
  }

  function syncModalVideos(activeIndex) {
    pauseAllVideos(activeIndex);
    playVisibleVideo(activeIndex);
  }

  function prepareMainGalleryVideos() {
    if (!isGalleryInteractionActive()) {
      return;
    }

    mobileGalleryCards.forEach((card) => {
      const video = card.querySelector("video");

      if (video) {
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.preload = "metadata";
      }
    });
  }

  function syncMainGalleryVideos(activeIndex) {
    if (!isGalleryInteractionActive()) {
      return;
    }

    mobileGalleryCards.forEach((card, index) => {
      const video = card.querySelector("video");

      if (!video) {
        return;
      }

      if (index === activeIndex && !mobileGalleryReducedMotion.matches) {
        video.play().catch(() => {});
      } else {
        resetVideo(video);
      }
    });
  }

  function updateModalPagination() {
    const slides = mobileGalleryModalTrack.querySelectorAll(".mobile-gallery-modal__slide");
    const activeIndex = getNearestSlideIndex(mobileGalleryModalTrack, slides);
    const projectMedia = getProjectMedia(activeGalleryProject);
    const projectName = activeGalleryProject.title || projectMedia[0].alt;

    updatePaginationDots(mobileGalleryModalPagination, activeIndex);
    mobileGalleryModalStatus.textContent = `${projectName}: ${activeIndex + 1} of ${slides.length}`;
    syncModalVideos(activeIndex);
  }

  function navigateModalMedia(direction) {
    const slides = mobileGalleryModalTrack.querySelectorAll(".mobile-gallery-modal__slide");

    if (!slides.length) {
      return;
    }

    const activeIndex = getNearestSlideIndex(mobileGalleryModalTrack, slides);
    const nextIndex = (activeIndex + direction + slides.length) % slides.length;
    const nextSlide = slides[nextIndex];

    mobileGalleryModalTrack.scrollTo({
      left: nextSlide.offsetLeft,
      behavior: mobileGalleryReducedMotion.matches ? "auto" : "smooth"
    });
  }

  function createModalMedia(project) {
    pauseAllVideos();
    mobileGalleryModalTrack.replaceChildren();

    getProjectMedia(project).forEach((mediaItem) => {
      const slide = document.createElement("div");
      slide.className = "mobile-gallery-modal__slide";

      if (mediaItem.type === "video") {
        const video = document.createElement("video");
        video.src = mediaItem.src;
        video.controls = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        video.preload = "metadata";
        video.setAttribute("aria-label", `${project.title || "Piñata"} video`);
        slide.appendChild(video);
      } else {
        const image = document.createElement("img");
        image.src = mediaItem.src;
        image.alt = mediaItem.alt;
        slide.appendChild(image);
      }

      mobileGalleryModalTrack.appendChild(slide);
    });
  }

  function openMobileGallery(project, card) {
    if (!isGalleryInteractionActive()) {
      return;
    }

    activeGalleryCard = card;
    activeGalleryProject = project;
    createModalMedia(project);
    const projectMedia = getProjectMedia(project);
    createPaginationDots(mobileGalleryModalPagination, projectMedia.length, "mobile-gallery-modal__dot");

    mobileGalleryModalTitle.textContent = project.title;
    mobileGalleryModalTitle.hidden = project.title === "";
    mobileGalleryModalHint.textContent = desktopGalleryBreakpoint.matches
      ? "Browse this piñata’s photos and videos"
      : "Swipe to see this piñata’s photos and videos";
    mobileGalleryModalHint.hidden = projectMedia.length < 2;
    mobileGalleryModal.hidden = false;
    document.body.classList.add("mobile-gallery-open");
    trackGalleryOpen(project.title);
    mobileGalleryModalTrack.scrollLeft = 0;
    updateModalPagination();
    mobileGalleryModalClose.focus();
  }

  function closeMobileGallery() {
    if (mobileGalleryModal.hidden) {
      return;
    }

    pauseAllVideos();
    mobileGalleryModal.hidden = true;
    document.body.classList.remove("mobile-gallery-open");
    mobileGalleryModalTrack.replaceChildren();

    if (activeGalleryCard) {
      activeGalleryCard.focus({ preventScroll: true });
    }

    activeGalleryCard = null;
    activeGalleryProject = null;
  }

  function updateMobileCardAccessibility() {
    mobileGalleryCards.forEach((card) => {
      const project = findProject(card.dataset.galleryProject);

      if (isGalleryInteractionActive()) {
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        const projectMedia = getProjectMedia(project);
        card.setAttribute("aria-label", `Open ${project.title || projectMedia[0].alt} gallery`);
      } else {
        card.removeAttribute("role");
        card.removeAttribute("tabindex");
        card.removeAttribute("aria-label");
      }
    });

    if (!isGalleryInteractionActive()) {
      closeMobileGallery();
    }
  }

  createPaginationDots(mobileGalleryPagination, mobileGalleryCards.length, "gallery-showcase__dot");
  prepareMainGalleryVideos();
  updateMobileCardAccessibility();
  updateMainGalleryPagination();

  mobileGalleryCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (mainGalleryWasDragged) {
        return;
      }

      const project = findProject(card.dataset.galleryProject);

      if (project) {
        openMobileGallery(project, card);
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const project = findProject(card.dataset.galleryProject);

        if (project) {
          openMobileGallery(project, card);
        }
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        navigateMainGallery(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        navigateMainGallery(1);
      }
    });
  });

  mobileGalleryTrack.addEventListener("pointerdown", (event) => {
    pointerStartX = event.clientX;
    mainGalleryWasDragged = false;
  });

  mobileGalleryTrack.addEventListener("pointerup", (event) => {
    mainGalleryWasDragged = Math.abs(event.clientX - pointerStartX) > 8;
    window.setTimeout(() => {
      mainGalleryWasDragged = false;
    }, 0);
  });

  mobileGalleryTrack.addEventListener("scroll", () => {
    if (mainGalleryFrame) {
      window.cancelAnimationFrame(mainGalleryFrame);
    }

    mainGalleryFrame = window.requestAnimationFrame(updateMainGalleryPagination);
  }, { passive: true });

  mobileGalleryModalTrack.addEventListener("scroll", () => {
    if (modalGalleryFrame) {
      window.cancelAnimationFrame(modalGalleryFrame);
    }

    modalGalleryFrame = window.requestAnimationFrame(updateModalPagination);
  }, { passive: true });

  mobileGalleryModalClose.addEventListener("click", closeMobileGallery);
  mobileGalleryModalPrevious.addEventListener("click", () => navigateModalMedia(-1));
  mobileGalleryModalNext.addEventListener("click", () => navigateModalMedia(1));
  mainGalleryPrevious.addEventListener("click", () => navigateMainGallery(-1));
  mainGalleryNext.addEventListener("click", () => navigateMainGallery(1));

  mobileGalleryModal.addEventListener("click", (event) => {
    if (event.target === mobileGalleryModal) {
      closeMobileGallery();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileGalleryModal.hidden) {
      closeMobileGallery();
    } else if (!mobileGalleryModal.hidden && event.key === "ArrowLeft") {
      event.preventDefault();
      navigateModalMedia(-1);
    } else if (!mobileGalleryModal.hidden && event.key === "ArrowRight") {
      event.preventDefault();
      navigateModalMedia(1);
    }
  });

  function syncGalleryInteraction() {
    prepareMainGalleryVideos();
    updateMobileCardAccessibility();
    updateMainGalleryPagination();
  }

  mobileGalleryBreakpoint.addEventListener("change", syncGalleryInteraction);
  desktopGalleryBreakpoint.addEventListener("change", syncGalleryInteraction);

  mobileGalleryReducedMotion.addEventListener("change", () => {
    if (mobileGalleryReducedMotion.matches) {
      pauseAllVideos();
    }
  });

  window.addEventListener("resize", updateMainGalleryPagination);
}
