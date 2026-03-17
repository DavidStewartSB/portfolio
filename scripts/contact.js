const CONTACT_DATA_PATH = "./data/contact.json";

const CONTACT_ICONS = {
  email: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6.75C4 5.78 4.78 5 5.75 5h12.5C19.22 5 20 5.78 20 6.75v10.5c0 .97-.78 1.75-1.75 1.75H5.75A1.75 1.75 0 0 1 4 17.25V6.75Z"
        stroke="currentColor"
        stroke-width="1.7"
      />
      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  phone: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7.8 4.5h2.1c.4 0 .76.27.88.66l.88 2.93a1 1 0 0 1-.28 1.03l-1.35 1.2a13.6 13.6 0 0 0 4.76 4.76l1.2-1.35a1 1 0 0 1 1.03-.28l2.93.88c.39.12.66.48.66.88v2.1c0 .66-.54 1.2-1.2 1.2h-.6C10.36 20.5 3.5 13.64 3.5 5.7v-.6c0-.66.54-1.2 1.2-1.2h3.1Z"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `,
  github: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.36 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.67.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.74 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.56 1.43.21 2.48.11 2.74.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  `,
  linkedin: `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M6.94 8.5a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44ZM5.45 9.84h2.98V19H5.45V9.84ZM10.3 9.84h2.86v1.25h.04c.4-.76 1.37-1.56 2.82-1.56 3.01 0 3.57 2.02 3.57 4.65V19h-2.99v-4.28c0-1.02-.02-2.34-1.4-2.34-1.4 0-1.62 1.12-1.62 2.27V19H10.3V9.84Z"
      />
    </svg>
  `,
  instagram: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="4"
        stroke="currentColor"
        stroke-width="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="3.75"
        stroke="currentColor"
        stroke-width="1.7"
      />
      <circle cx="16.6" cy="7.4" r="1" fill="currentColor" />
    </svg>
  `,
  default: `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7" />
    </svg>
  `
};

function contactEscapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function contactGetIcon(type) {
  return CONTACT_ICONS[type] || CONTACT_ICONS.default;
}

function contactBuildCard(item) {
  const label = contactEscapeHtml(item.label);
  const value = contactEscapeHtml(item.value);
  const href = item.href || "#";
  const icon = contactGetIcon(item.type);
  const externalAttrs = item.external
    ? ` target="_blank" rel="noopener noreferrer"`
    : "";

  return `
    <a
      class="contact-card"
      href="${href}"
      aria-label="${label}: ${value}"
      ${externalAttrs}
      role="listitem"
    >
      <span class="contact-card__icon" aria-hidden="true">
        ${icon}
      </span>

      <div class="contact-card__body">
        <span class="contact-card__label">${label}</span>
        <strong class="contact-card__value">${value}</strong>
      </div>
    </a>
  `;
}
async function loadContactSection() {
  const grid = document.getElementById("contact-grid");
  const eyebrow = document.getElementById("contact-eyebrow");
  const title = document.getElementById("contact-title");
  const description = document.getElementById("contact-description");

  if (!grid || !eyebrow || !title || !description) return;

  try {
    const response = await fetch(CONTACT_DATA_PATH);

    if (!response.ok) {
      throw new Error(`Falha ao carregar contact.json: ${response.status}`);
    }

    const data = await response.json();

    eyebrow.textContent = data.eyebrow || "Contato";
    title.textContent = data.title || "Vamos conversar?";
    description.textContent =
      data.description ||
      "Estou sempre aberto a novas oportunidades, projetos interessantes e conexões que gerem valor real.";

    const items = Array.isArray(data.items) ? data.items : [];

    grid.innerHTML = items.map(contactBuildCard).join("");
  } catch (error) {
    console.error("[contact] erro ao carregar dados:", error);

    grid.innerHTML = `
      <article class="contact__fallback" role="alert">
        <h3 class="contact__fallback-title">Não foi possível carregar os contatos</h3>
        <p class="contact__fallback-text">
          Verifique o arquivo <code>contact.json</code> e o caminho configurado em <code>contact.js</code>.
        </p>
      </article>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadContactSection);