const SKILLS_DATA_URL = "./data/skills.json";

document.addEventListener("DOMContentLoaded", () => {
  loadSkillsSection();
});

async function loadSkillsSection() {
  const section = document.getElementById("skills");
  const eyebrow = document.getElementById("skills-eyebrow");
  const title = document.getElementById("skills-title");
  const description = document.getElementById("skills-description");
  const tabs = document.getElementById("skills-tabs");
  const groupTitle = document.getElementById("skills-group-title");
  const grid = document.getElementById("skills-grid");

  if (!section || !eyebrow || !title || !description || !tabs || !groupTitle || !grid) {
    return;
  }

  try {
    const response = await fetch(SKILLS_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Falha ao carregar skills: ${response.status}`);
    }

    const data = await response.json();
    const categories = Array.isArray(data.categories) ? data.categories : [];

    eyebrow.textContent = data.section?.eyebrow ?? "Habilidades";
    title.textContent = data.section?.title ?? "Tecnologias & Ferramentas";
    description.textContent =
      data.section?.description ??
      "Tecnologias e ferramentas utilizadas no desenvolvimento de produtos digitais.";

    if (!categories.length) {
      grid.innerHTML = `
        <div class="skills__empty" role="status">
          Nenhuma habilidade cadastrada no momento.
        </div>
      `;
      return;
    }

    renderSkillTabs(categories, tabs);
    renderSkillCategory(categories[0], groupTitle, grid);
    bindSkillTabs(categories, groupTitle, grid);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <div class="skills__empty skills__empty--error" role="alert">
        Não foi possível carregar a seção de habilidades.
      </div>
    `;
  }
}

function renderSkillTabs(categories, container) {
  container.innerHTML = categories
    .map((category, index) => {
      const isActive = index === 0;

      return `
        <button
          type="button"
          class="skills-tabs__button ${isActive ? "is-active" : ""}"
          data-skill-tab="${escapeAttribute(category.id)}"
          aria-pressed="${isActive ? "true" : "false"}"
        >
          ${escapeHtml(category.label)}
        </button>
      `;
    })
    .join("");
}

function bindSkillTabs(categories, titleElement, gridElement) {
  const buttons = Array.from(document.querySelectorAll("[data-skill-tab]"));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const categoryId = button.getAttribute("data-skill-tab");
      const nextCategory = categories.find((item) => item.id === categoryId);

      if (!nextCategory) return;

      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", active ? "true" : "false");
      });

      gridElement.classList.remove("is-visible");

      window.setTimeout(() => {
        renderSkillCategory(nextCategory, titleElement, gridElement);
        requestAnimationFrame(() => {
          gridElement.classList.add("is-visible");
        });
      }, 120);
    });
  });
}

function renderSkillCategory(category, titleElement, gridElement) {
  titleElement.innerHTML = `
    <span class="skills-group__title-icon" aria-hidden="true">
      ${getCategoryIcon(category.icon)}
    </span>
    <span>${escapeHtml(category.label)}</span>
  `;

  const items = Array.isArray(category.items) ? category.items : [];

  gridElement.innerHTML = items
    .map(
      (item) => `
        <article class="skill-card" aria-label="${escapeAttribute(item.name)}">
          <div class="skill-card__icon" aria-hidden="true">${escapeHtml(item.icon)}</div>
          <h4 class="skill-card__name">${escapeHtml(item.name)}</h4>
        </article>
      `
    )
    .join("");

  gridElement.classList.add("is-visible");
}

function getCategoryIcon(icon) {
  switch (icon) {
    case "code":
      return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8.5 8 4.5 12l4 4M15.5 8l4 4-4 4M13 5l-2 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
    case "server":
      return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="5" width="16" height="5" rx="1.8" stroke="currentColor" stroke-width="1.8"/>
          <rect x="4" y="14" width="16" height="5" rx="1.8" stroke="currentColor" stroke-width="1.8"/>
          <path d="M8 7.5h.01M8 16.5h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      `;
    case "sparkles":
    default:
      return `
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          <path d="M18.5 15.5 19 17l1.5.5L19 18l-.5 1.5L18 18l-1.5-.5L18 17l.5-1.5ZM5.5 15.5 6 17l1.5.5L6 18l-.5 1.5L5 18l-1.5-.5L5 17l.5-1.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>
        </svg>
      `;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return String(value).replaceAll('"', "&quot;");
}