(function () {
  const ICONS = {
    frontend: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8.7 16.6 4.1 12l4.6-4.6 1.4 1.4L6.9 12l3.2 3.2-1.4 1.4Zm6.6 0-1.4-1.4 3.2-3.2-3.2-3.2 1.4-1.4 4.6 4.6-4.6 4.6Z" />
      </svg>
    `,
    backend: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 5.75A1.75 1.75 0 0 1 5.75 4h12.5A1.75 1.75 0 0 1 20 5.75v2.5A1.75 1.75 0 0 1 18.25 10H5.75A1.75 1.75 0 0 1 4 8.25v-2.5Zm0 10A1.75 1.75 0 0 1 5.75 14h12.5A1.75 1.75 0 0 1 20 15.75v2.5A1.75 1.75 0 0 1 18.25 20H5.75A1.75 1.75 0 0 1 4 18.25v-2.5ZM7 6.5h4v1.5H7V6.5Zm0 10h4V18H7v-1.5Z" />
      </svg>
    `,
    design: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 4a8 8 0 1 0 8 8 2 2 0 0 1-2 2h-1.1a1.9 1.9 0 0 0-1.9 1.9A2.1 2.1 0 0 1 12.9 18H12A8 8 0 0 1 12 4Zm-3 8.25a1.25 1.25 0 1 0-1.25-1.25A1.25 1.25 0 0 0 9 12.25Zm3.5-4a1.25 1.25 0 1 0-1.25-1.25A1.25 1.25 0 0 0 12.5 8.25Zm3.5 4A1.25 1.25 0 1 0 14.75 11 1.25 1.25 0 0 0 16 12.25Z" />
      </svg>
    `,
    devops: `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M14.5 3 6 11.5l6.5 1L11 19l7-8-5.5-1L14.5 3Zm-8 14.5h4V19h-4v-1.5Z" />
      </svg>
    `
  };

  function createTagItem(item) {
    const li = document.createElement("li");

    li.innerHTML = `
      <article class="about-tag">
        <span class="about-tag__icon" aria-hidden="true">
          ${ICONS[item.icon] ?? ICONS.frontend}
        </span>
        <span class="about-tag__label">${item.label}</span>
      </article>
    `;

    return li;
  }

  async function loadAboutKnowledge() {
    const list = document.getElementById("about-knowledge-list");
    if (!list) return;

    try {
      const response = await fetch("./data/about-knowledge.json", {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Falha ao carregar áreas de conhecimento.");
      }

      const items = await response.json();

      if (!Array.isArray(items) || items.length === 0) {
        return;
      }

      const fragment = document.createDocumentFragment();

      items.forEach((item) => {
        if (!item?.label) return;
        fragment.appendChild(createTagItem(item));
      });

      list.replaceChildren(fragment);
    } catch (error) {
      console.error("[about.js]", error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadAboutKnowledge();
  });
})();