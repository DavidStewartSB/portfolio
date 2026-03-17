(function () {
  function initHeroShare() {
    const root = document.querySelector("[data-share-root]");
    if (!root) return;

    const toggle = root.querySelector("[data-share-toggle]");
    const menu = root.querySelector("[data-share-menu]");
    const copyButton = root.querySelector("[data-copy-url]");

    if (!toggle || !menu) return;

    function openMenu() {
      menu.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      menu.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    }

    function toggleMenu() {
      if (menu.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    }

    toggle.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: "Confira este portfólio.",
            url: window.location.href
          });
          return;
        } catch {
          toggleMenu();
          return;
        }
      }

      toggleMenu();
    });

    copyButton?.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        copyButton.textContent = "URL copiada";
        window.setTimeout(() => {
          copyButton.textContent = "Copiar URL";
        }, 1400);
      } catch {
        copyButton.textContent = "Falha ao copiar";
        window.setTimeout(() => {
          copyButton.textContent = "Copiar URL";
        }, 1400);
      }
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initHeroShare);
})();