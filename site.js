(function () {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  const menuButton = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");

  const storedTheme = localStorage.getItem("theme");
  root.dataset.theme = storedTheme || "light";

  function updateThemeLabel() {
    if (!toggle) return;
    const isDark = root.dataset.theme === "dark";
    const icon = toggle.querySelector("[data-theme-icon]");
    toggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    toggle.querySelector("[data-theme-label]").textContent = isDark ? "Light" : "Dark";
    if (icon) icon.innerHTML = `<i data-lucide="${isDark ? "sun" : "moon"}"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }

  if (toggle) {
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", root.dataset.theme);
      updateThemeLabel();
    });
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  let activeModal = null;
  const imageLightbox = document.createElement("div");
  imageLightbox.className = "image-lightbox";
  imageLightbox.setAttribute("aria-hidden", "true");
  imageLightbox.innerHTML = `
    <button class="image-lightbox-close" type="button" aria-label="Close full-size image"><i data-lucide="x"></i></button>
    <img alt="">
  `;
  document.body.appendChild(imageLightbox);
  const lightboxImage = imageLightbox.querySelector("img");
  const lightboxClose = imageLightbox.querySelector("button");

  function closeImageLightbox() {
    imageLightbox.classList.remove("is-open");
    imageLightbox.setAttribute("aria-hidden", "true");
    if (lightboxImage) {
      lightboxImage.removeAttribute("src");
      lightboxImage.alt = "";
    }
  }

  function openImageLightbox(image) {
    if (!lightboxImage) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Full-size project image";
    imageLightbox.classList.add("is-open");
    imageLightbox.setAttribute("aria-hidden", "false");
    lightboxClose?.focus();
    if (window.lucide) window.lucide.createIcons();
  }

  function closeModal() {
    if (!activeModal) return;
    closeImageLightbox();
    activeModal.classList.remove("is-open");
    activeModal.setAttribute("aria-hidden", "true");
    activeModal.querySelectorAll("video").forEach((video) => video.pause());
    document.body.classList.remove("modal-active");
    activeModal = null;
  }

  document.querySelectorAll("[data-modal-target]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modal = document.getElementById(trigger.dataset.modalTarget);
      if (!modal) return;
      activeModal = modal;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-active");
      modal.querySelectorAll("video").forEach((video) => video.load());
      modal.querySelector("[data-modal-close]")?.focus();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  });

  document.querySelectorAll(".modal-gallery img, .modal-work-item img").forEach((image) => {
    image.addEventListener("click", (event) => {
      event.stopPropagation();
      openImageLightbox(image);
    });
  });

  lightboxClose?.addEventListener("click", closeImageLightbox);
  imageLightbox.addEventListener("click", (event) => {
    if (event.target === imageLightbox) closeImageLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (imageLightbox.classList.contains("is-open")) {
      closeImageLightbox();
      return;
    }
    closeModal();
  });

  updateThemeLabel();
  if (window.lucide) window.lucide.createIcons();
})();
