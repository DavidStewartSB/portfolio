const EXPERIENCE_DATA_URL = "./data/experiences.json";

async function loadExperiences() {
  const section = document.getElementById("experience");
  const timeline = document.getElementById("experience-timeline");
  const eyebrow = document.getElementById("experience-eyebrow");
  const title = document.getElementById("experience-title");
  const description = document.getElementById("experience-description");

  if (!section || !timeline || !eyebrow || !title || !description) return;

  try {
    const response = await fetch(EXPERIENCE_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Falha ao carregar experiências: ${response.status}`);
    }

    const data = await response.json();

    eyebrow.textContent = data.section?.eyebrow ?? "Experiência";
    title.textContent = data.section?.title ?? "Experiência Profissional";
    description.textContent =
      data.section?.description ??
      "Trajetória profissional em desenvolvimento de software, arquitetura e evolução de produtos digitais.";

    const items = Array.isArray(data.items) ? data.items : [];
    timeline.innerHTML = "";

    if (!items.length) {
      timeline.innerHTML = `
        <div class="experience__empty" role="status">
          Nenhuma experiência cadastrada no momento.
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    items.forEach((item, index) => {
      const article = document.createElement("article");
      article.className = "experience-card";
      article.setAttribute("data-reveal", "");
      article.style.setProperty("--experience-index", String(index));

      const summaryItems = Array.isArray(item.summary)
        ? item.summary
            .map(
              (point) => `
                <li class="experience-card__bullet">
                  <span class="experience-card__bullet-dot" aria-hidden="true"></span>
                  <span>${escapeHtml(point)}</span>
                </li>
              `
            )
            .join("")
        : "";

      const techItems = Array.isArray(item.technologies)
        ? item.technologies
            .map(
              (tech) => `
                <li class="experience-card__tag">${escapeHtml(tech)}</li>
              `
            )
            .join("")
        : "";

      article.innerHTML = `
        <div class="experience-card__rail" aria-hidden="true">
          <span class="experience-card__node">
            ${getBriefcaseIcon()}
          </span>
        </div>

        <div class="experience-card__body">
          <header class="experience-card__header">
            <div class="experience-card__title-wrap">
              <h3 class="experience-card__role">${escapeHtml(item.role ?? "")}</h3>
            </div>

            <ul class="experience-card__meta" role="list" aria-label="Detalhes da experiência">
              ${item.company ? renderMetaItem(getCompanyIcon(), item.company, "experience-card__meta-item--strong") : ""}
              ${item.location ? renderMetaItem(getLocationIcon(), item.location) : ""}
              ${item.period ? renderMetaItem(getCalendarIcon(), item.period) : ""}
            </ul>
          </header>

          ${
            summaryItems
              ? `
            <ul class="experience-card__list" role="list">
              ${summaryItems}
            </ul>
          `
              : ""
          }

          ${
            techItems
              ? `
            <ul class="experience-card__tags" role="list" aria-label="Tecnologias utilizadas">
              ${techItems}
            </ul>
          `
              : ""
          }
        </div>
      `;

      fragment.appendChild(article);
    });

    timeline.appendChild(fragment);
    revealExperienceCards();
  } catch (error) {
    timeline.innerHTML = `
      <div class="experience__empty experience__empty--error" role="alert">
        Não foi possível carregar a seção de experiências.
      </div>
    `;
    console.error(error);
  }
}

function renderMetaItem(icon, text, extraClass = "") {
  return `
    <li class="experience-card__meta-item ${extraClass}">
      <span class="experience-card__meta-icon" aria-hidden="true">
        ${icon}
      </span>
      <span>${escapeHtml(text)}</span>
    </li>
  `;
}

function revealExperienceCards() {
  const cards = document.querySelectorAll(".experience-card[data-reveal]");

  if (!("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  cards.forEach((card) => observer.observe(card));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getBriefcaseIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M4 9.5C4 8.67 4.67 8 5.5 8h13c.83 0 1.5.67 1.5 1.5v8C20 18.33 19.33 19 18.5 19h-13C4.67 19 4 18.33 4 17.5v-8Z" stroke="currentColor" stroke-width="1.8"/>
      <path d="M4 12h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M10 12v1M14 12v1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
  `;
}

function getCompanyIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 19h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M6 19V8l6-3 6 3v11" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M10 11h.01M14 11h.01M10 14h.01M14 14h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;
}

function getLocationIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 20s6-4.35 6-9a6 6 0 1 0-12 0c0 4.65 6 9 6 9Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" stroke-width="1.8"/>
    </svg>
  `;
}

function getCalendarIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4v3M17 4v3M4 9h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <rect x="4" y="6" width="16" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8"/>
      <path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;
}

document.addEventListener("DOMContentLoaded", loadExperiences);