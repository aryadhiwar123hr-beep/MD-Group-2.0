// ---------- Service catalog data ----------
const SERVICE_CATALOG = {
  security: {
    label: "Security services",
    items: [
      { name: "Security guards", desc: "Trained, licensed guards for daily site coverage." },
      { name: "Corporate & office security", desc: "Access control and front-desk security staffing." },
      { name: "Residential security", desc: "Society and gated-community guard deployment." },
      { name: "Event & bouncer staffing", desc: "Short-term security for events and functions." },
      { name: "CCTV monitoring", desc: "Live remote monitoring with incident logging." },
      { name: "Night patrol", desc: "Scheduled patrol rounds with digital checkpoints." },
    ],
  },
  housekeeping: {
    label: "Housekeeping & cleaning",
    items: [
      { name: "Deep cleaning", desc: "One-time intensive cleaning for move-in or reset." },
      { name: "Office cleaning", desc: "Daily or scheduled commercial cleaning teams." },
      { name: "Residential cleaning", desc: "Recurring home and apartment cleaning staff." },
      { name: "Carpet & sofa cleaning", desc: "Steam and shampoo cleaning for upholstery." },
      { name: "Post-construction cleaning", desc: "Debris removal and handover-ready cleaning." },
    ],
  },
  manpower: {
    label: "Manpower supply",
    items: [
      { name: "Skilled labour", desc: "Trained tradespeople supplied on contract." },
      { name: "Unskilled labour", desc: "General labour for sites and operations." },
      { name: "Office staff", desc: "Front-office and administrative placements." },
      { name: "Data entry staff", desc: "Short or long-term data processing support." },
      { name: "Drivers", desc: "Verified drivers for fleet and personal use." },
      { name: "Delivery staff", desc: "Last-mile delivery personnel on demand." },
      { name: "Warehouse staff", desc: "Loading, sorting, and inventory manpower." },
      { name: "Temporary staffing", desc: "Short-notice staffing for peak periods." },
    ],
  },
  facility: {
    label: "Facility management",
    items: [
      { name: "Building management", desc: "End-to-end upkeep of common areas and systems." },
      { name: "Electrical maintenance", desc: "Licensed electricians for repair and upkeep." },
      { name: "Plumbing", desc: "Scheduled and on-call plumbing support." },
      { name: "AC maintenance", desc: "HVAC servicing and preventive maintenance." },
      { name: "Carpentry", desc: "Fixture repair and woodwork maintenance." },
      { name: "Property maintenance", desc: "General upkeep across a facility's lifecycle." },
    ],
  },
  specialized: {
    label: "Specialized services",
    items: [
      { name: "Pest control", desc: "Scheduled treatment and preventive control." },
      { name: "Gardening & landscaping", desc: "Grounds upkeep and landscape design." },
      { name: "Waste management", desc: "Collection, segregation, and disposal service." },
      { name: "CCTV installation", desc: "Camera system design, install, and setup." },
      { name: "Fire safety", desc: "Fire system checks, audits, and equipment service." },
    ],
  },
};

// ---------- Catalog rendering (homepage) ----------
function renderCatalog() {
  const grid = document.getElementById("svc-grid");
  const tabs = document.getElementById("cat-tabs");
  if (!grid || !tabs) return;

  const catKeys = Object.keys(SERVICE_CATALOG);
  let active = catKeys[0];

  function paint() {
    tabs.innerHTML = catKeys
      .map(
        (k) =>
          `<button class="cat-tab${k === active ? " active" : ""}" data-cat="${k}">${SERVICE_CATALOG[k].label}</button>`
      )
      .join("");
    grid.innerHTML = SERVICE_CATALOG[active].items
      .map((item, i) => {
        const id = `${active}-${i}`;
        const selected = window.__mdQuote?.has(id);
        return `
        <div class="svc-item">
          <div class="svc-icon">${item.name.slice(0, 2).toUpperCase()}</div>
          <div class="svc-name">${item.name}</div>
          <div class="svc-desc">${item.desc}</div>
          <div class="svc-row">
            <span></span>
            <button class="svc-add${selected ? " selected" : ""}" data-id="${id}" data-name="${item.name}">
              ${selected ? "Added ✓" : "+ Add to quote"}
            </button>
          </div>
        </div>`;
      })
      .join("");
  }

  tabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    active = btn.dataset.cat;
    paint();
  });

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".svc-add");
    if (!btn) return;
    toggleQuoteItem(btn.dataset.id, btn.dataset.name);
    paint();
  });

  paint();
}

// ---------- Quote builder state ----------
function initQuoteState() {
  if (!window.__mdQuote) window.__mdQuote = new Map();
}
function toggleQuoteItem(id, name) {
  initQuoteState();
  if (window.__mdQuote.has(id)) window.__mdQuote.delete(id);
  else window.__mdQuote.set(id, name);
  updateQuoteBar();
}
function updateQuoteBar() {
  const bar = document.getElementById("quote-bar");
  const countEl = document.getElementById("quote-count");
  if (!bar || !countEl) return;
  const n = window.__mdQuote ? window.__mdQuote.size : 0;
  countEl.textContent = n;
  bar.style.display = n > 0 ? "flex" : "none";
}

// ---------- Mobile nav ----------
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.style.display === "flex";
    links.style.cssText = open
      ? "display:none;"
      : "display:flex; position:absolute; top:72px; left:0; right:0; background:#0b1f3a; flex-direction:column; padding:20px 28px; gap:18px; border-bottom:1px solid rgba(255,255,255,0.08);";
  });
}

// ---------- Generic form submit → confirmation swap ----------
function initFormSubmit(formId, confirmId) {
  const form = document.getElementById(formId);
  const confirm = document.getElementById(confirmId);
  if (!form || !confirm) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const required = form.querySelectorAll("[required]");
    let valid = true;
    required.forEach((f) => {
      if (!f.value) valid = false;
    });
    if (!valid) {
      form.reportValidity();
      return;
    }
    form.style.display = "none";
    confirm.style.display = "block";
    confirm.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

// ---------- Chip select (single or multi) ----------
function initChipGroups() {
  document.querySelectorAll("[data-chip-group]").forEach((group) => {
    const multi = group.dataset.chipGroup === "multi";
    group.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      if (!multi) {
        group.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
      }
      chip.classList.toggle("active");
    });
  });
}

// ---------- Role toggle (client vs worker) ----------
function initRoleToggle() {
  const toggle = document.querySelector(".role-toggle");
  if (!toggle) return;
  const panels = document.querySelectorAll("[data-role-panel]");
  toggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    toggle.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    panels.forEach((p) => {
      p.style.display = p.dataset.rolePanel === btn.dataset.role ? "block" : "none";
    });
  });
}

// ---------- Portal sidebar panel switcher ----------
function initPanelNav() {
  const links = document.querySelectorAll("[data-panel-link]");
  const panels = document.querySelectorAll("[data-panel]");
  if (!links.length || !panels.length) return;
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.panelLink;
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      panels.forEach((p) => {
        p.style.display = p.dataset.panel === target ? "block" : "none";
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  initMobileNav();
  initChipGroups();
  initRoleToggle();
  initPanelNav();
  updateQuoteBar();
  initFormSubmit("quote-form", "quote-confirm");
  initFormSubmit("worker-form", "worker-confirm");
});
