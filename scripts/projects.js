const PROJECTS_DATA_URL = "./data/projects.json";

document.addEventListener("DOMContentLoaded", () => {
  loadProjectsSection();
});

async function loadProjectsSection() {
  const section = document.getElementById("projects");
  const eyebrow = document.getElementById("projects-eyebrow");
  const title = document.getElementById("projects-title");
  const description = document.getElementById("projects-description");
  const list = document.getElementById("projects-list");
  const preview = document.getElementById("projects-preview");

  if (!section || !eyebrow || !title || !description || !list || !preview) return;

  try {
    const response = await fetch(PROJECTS_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Falha ao carregar projetos: ${response.status}`);
    }

    const data = await response.json();

    eyebrow.textContent = data.section?.eyebrow ?? "Projetos";
    title.textContent = data.section?.title ?? "Meus Projetos";
    description.textContent =
      data.section?.description ??
      "Projetos com foco em arquitetura, performance, experiência e identidade visual.";

    const projects = Array.isArray(data.items) ? data.items : [];
    list.innerHTML = "";
    preview.innerHTML = "";

    if (!projects.length) {
      list.innerHTML = `
        <div class="projects__empty" role="status">
          Nenhum projeto cadastrado no momento.
        </div>
      `;
      return;
    }

    renderProjectsList(projects, list);
    renderInitialPreview(projects[0], preview);

    setupProjectsObserver(projects);
  } catch (error) {
    console.error(error);

    list.innerHTML = `
      <div class="projects__empty projects__empty--error" role="alert">
        Não foi possível carregar a seção de projetos.
      </div>
    `;
  }
}

function renderProjectsList(projects, container) {
  const fragment = document.createDocumentFragment();

  projects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project-card";
    article.id = `project-${project.id}`;
    article.dataset.projectId = project.id;
    article.dataset.projectIndex = String(index);
    article.setAttribute("tabindex", "-1");

    const bullets = Array.isArray(project.bullets)
      ? project.bullets
          .map(
            (item) => `
              <li class="project-card__bullet">
                <span class="project-card__bullet-dot" aria-hidden="true"></span>
                <span>${escapeHtml(item)}</span>
              </li>
            `
          )
          .join("")
      : "";

    const techs = Array.isArray(project.technologies)
      ? project.technologies
          .map((item) => `<li class="project-card__tag">${escapeHtml(item)}</li>`)
          .join("")
      : "";

    const button = project.projectUrl
      ? `
        <a
          href="${escapeAttribute(project.projectUrl)}"
          class="project-card__button button button--ghost"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="${escapeAttribute(project.projectLabel ?? "Ver projeto")} - ${escapeAttribute(project.title ?? "")}"
        >
          <span>${escapeHtml(project.projectLabel ?? "Ver projeto")}</span>
          <span class="project-card__button-icon" aria-hidden="true">
            ${getExternalIcon()}
          </span>
        </a>
      `
      : "";

    const mobileImage = project.image
      ? `
        <figure class="project-card__mobile-media">
          <img
            src="${escapeAttribute(project.image)}"
            alt="${escapeAttribute(project.imageAlt ?? project.title ?? "Projeto")}"
            class="project-card__mobile-image"
            loading="lazy"
            decoding="async"
          />
        </figure>
      `
      : "";

    article.innerHTML = `
      <div class="project-card__content">
        <header class="project-card__header">
          <p class="project-card__kicker">Projeto ${String(index + 1).padStart(2, "0")}</p>
          <h3 class="project-card__title">${escapeHtml(project.title ?? "")}</h3>
          ${
            project.subtitle
              ? `<p class="project-card__subtitle">${escapeHtml(project.subtitle)}</p>`
              : ""
          }
          ${
            project.description
              ? `<p class="project-card__description">${escapeHtml(project.description)}</p>`
              : ""
          }
        </header>

        ${mobileImage}

        ${
          bullets
            ? `
          <ul class="project-card__list" role="list">
            ${bullets}
          </ul>
        `
            : ""
        }

        ${
          techs
            ? `
          <ul class="project-card__tags" role="list" aria-label="Tecnologias utilizadas">
            ${techs}
          </ul>
        `
            : ""
        }

        ${button}
      </div>
    `;

    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

function renderInitialPreview(project, container) {
  if (!project) return;

  container.innerHTML = `
    <div class="projects-preview__frame is-active" data-preview-frame>
      <div class="projects-preview__glow" aria-hidden="true"></div>
      <div class="projects-preview__image-shell">
        <img
          src="${escapeAttribute(project.image)}"
          alt="${escapeAttribute(project.imageAlt ?? project.title ?? "Projeto")}"
          class="projects-preview__image"
          loading="eager"
          decoding="async"
        />
      </div>
    </div>
  `;

  container.dataset.activeProjectId = project.id;
}

function setupProjectsObserver(projects) {
  const preview = document.getElementById("projects-preview");
  const cards = Array.from(document.querySelectorAll(".project-card"));

  if (!preview || !cards.length) return;

  let activeProjectId = projects[0]?.id ?? null;
  highlightActiveCard(activeProjectId);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleEntries.length) return;

      const nextCard = visibleEntries[0].target;
      const nextProjectId = nextCard.dataset.projectId;
      const nextProject = projects.find((item) => item.id === nextProjectId);

      if (!nextProject || nextProjectId === activeProjectId) return;

      activeProjectId = nextProjectId;
      switchPreview(preview, nextProject);
      highlightActiveCard(activeProjectId);
    },
    {
      root: null,
      threshold: buildThresholdList(),
      rootMargin: "-18% 0px -28% 0px"
    }
  );

  cards.forEach((card) => observer.observe(card));
}

function switchPreview(previewContainer, project) {
  const currentFrame = previewContainer.querySelector("[data-preview-frame]");
  const nextFrame = document.createElement("div");

  nextFrame.className = "projects-preview__frame is-entering";
  nextFrame.dataset.previewFrame = "";
  nextFrame.innerHTML = `
    <div class="projects-preview__glow" aria-hidden="true"></div>
    <div class="projects-preview__image-shell">
      <img
        src="${escapeAttribute(project.image)}"
        alt="${escapeAttribute(project.imageAlt ?? project.title ?? "Projeto")}"
        class="projects-preview__image"
        loading="eager"
        decoding="async"
      />
    </div>
  `;

  previewContainer.appendChild(nextFrame);

  requestAnimationFrame(() => {
    nextFrame.classList.add("is-active");

    if (currentFrame) {
      currentFrame.classList.remove("is-active");
      currentFrame.classList.add("is-leaving");
    }
  });

  window.setTimeout(() => {
    if (currentFrame && currentFrame.parentNode) {
      currentFrame.parentNode.removeChild(currentFrame);
    }

    nextFrame.classList.remove("is-entering");
    nextFrame.classList.remove("is-leaving");
  }, 520);

  previewContainer.dataset.activeProjectId = project.id;
}

function highlightActiveCard(projectId) {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    const isActive = card.dataset.projectId === projectId;
    card.classList.toggle("is-active", isActive);
  });
}

function buildThresholdList() {
  const thresholds = [];
  for (let i = 0; i <= 1; i += 0.1) thresholds.push(i);
  return thresholds;
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

function getExternalIcon() {
  return `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 5h5v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 14 19 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}