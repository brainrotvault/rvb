// Load showcase data from shared inventory
// Auto-fix common image path issues
function fixInventoryPaths() {
  try {
    const raw = localStorage.getItem('brainrotVaultInventory');
    if (!raw) return;
    
    let inventory = JSON.parse(raw);
    let changed = false;
    
    inventory = inventory.map(item => {
      if (item.name === "Los Mobilis" && (!item.image || !item.image.includes("Los-Mobilis.png"))) {
        item.image = "./assets/Los-Mobilis.png";
        changed = true;
      }
      return item;
    });
    
    if (changed) {
      localStorage.setItem('brainrotVaultInventory', JSON.stringify(inventory));
      console.log("Auto-fixed inventory image paths");
    }
  } catch (e) {
    console.error("Error fixing inventory:", e);
  }
}

function getShowcaseData() {
  fixInventoryPaths(); // Run fix before getting data
  const inventory = getInventory();
  return inventory.map((item) => ({
    name: item.name,
    tier: item.tier,
    mutation: item.mutation || "Unknown",
    value: item.value,
    watchers: item.watchers || 0,
    price: item.price ? `Rs ${item.price.toLocaleString()}` : null,
    originalPrice: item.price || null,
    discount: item.discount || 0,
    discountedPrice: item.price && item.discount > 0 
      ? Math.round(item.price * (1 - item.discount / 100))
      : null,
    image: item.image || "",
    highlight: item.highlight || "",
    amount: item.amount ?? 0,
    id: item.id,
  }));
}

const metricsData = [
  { label: "Spawn windows tracked", value: "47", meta: "Last 24h", delta: "+8% vs avg" },
  { label: "Decoy templates shared", value: "162", meta: "Community vault", delta: "+12 squads" },
  { label: "Defense wins logged", value: "318", meta: "Season to date", delta: "92% success" },
];

const checklistItems = [
  "Ping squad radar pre-run",
  "Deploy double decoys",
  "Verify spawn instance",
  "Rotate crypto vault codes",
  "Snapshot roster inventory",
];

const quotes = [
  {
    name: "Nova",
    role: "Rank #12 runner",
    text: "Vault intel lets us swap targets mid-raid without losing pace.",
  },
  {
    name: "Atlas",
    role: "Defense architect",
    text: "The deterrent templates are so good we haven’t been breached in 3 weeks.",
  },
  {
    name: "Kiro",
    role: "Closed beta curator",
    text: "No marketplace yet, but the tracking tools alone changed our strategy.",
  },
];

const labsData = [
  {
    id: "runner",
    label: "Runner stack",
    title: "Runner stack • hit & vanish",
    description: "Optimized for solo thieves sprinting between shards and toggling stealth flares.",
    checklist: ["Mark safe exit routes", "Sync timer pings", "Carry two fallback decoys"],
    metrics: [
      { label: "Prep time", value: "90s" },
      { label: "Squad size", value: "1-2" },
      { label: "Risk", value: "High" },
    ],
  },
  {
    id: "defense",
    label: "Defense grid",
    title: "Defense grid • vault sentry",
    description: "Layered deterrents that bait thieves into EMP foam before they reach core Brainrots.",
    checklist: ["Cycle honey-pot lure", "Rotate hologram guard", "Confirm regen nodes"],
    metrics: [
      { label: "Prep time", value: "6m" },
      { label: "Squad size", value: "3+" },
      { label: "Risk", value: "Medium" },
    ],
  },
  {
    id: "analyst",
    label: "Analyst uplink",
    title: "Analyst uplink • intel desk",
    description: "Data-first toolkit for reading spawn variance and dispatching squads with receipts.",
    checklist: ["Scrape vault feeds", "Tag surge anomalies", "Auto-share counter build"],
    metrics: [
      { label: "Prep time", value: "3m" },
      { label: "Squad size", value: "1-4" },
      { label: "Risk", value: "Low" },
    ],
  },
];

const faqData = [
  {
    question: "When will actual trading open?",
    answer: "The marketplace unlocks after compliance + automation audits finish. Join the waitlist to secure an invite before the gates open.",
  },
  {
    question: "Can I import my current Brainrot inventory?",
    answer: "Yes. Use the admin portal to upload a CSV or edit items manually—nothing sells yet, but you can rehearse pricing and defenses.",
  },
  {
    question: "How accurate is the drop predictor?",
    answer: "Forecasts combine spawn reports, squad telemetry, and in-game RNG tracking. Treat them as directional intel, not guarantees.",
  },
  {
    question: "Is there protection for scammers?",
    answer: "Account reputation, escrow, and TradeShield-style policies are built in before sales launch, mirroring protections seen on Eldorado.",
  },
];

const threatLevels = ["Low", "Elevated", "Critical"];
let activeTier = "all";
let catalogSearch = "";
const LIVE_USERS_BASE = 195600;
const LIVE_USERS_SWAY = 2200;
let liveUsersTimer;

function renderShowcase() {
  const grid = document.getElementById("showcase-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const showcaseData = getShowcaseData();
  const filtered = showcaseData.filter((item) => {
    const tierMatch = activeTier === "all" ? true : item.tier === activeTier;
    const searchMatch = item.name.toLowerCase().includes(catalogSearch);
    return tierMatch && searchMatch;
  });
  if (!filtered.length) {
    grid.innerHTML = `<p class="muted">No Brainrots match that filter (yet).</p>`;
    return;
  }

  const available = filtered.filter(item => item.amount > 0);
  if (!available.length) {
    grid.innerHTML = `<p class="muted">All Brainrots are sold out in this view.</p>`;
    return;
  }

  available.forEach((item) => {
    const classes = ["card"];
    if (item.highlight === "gold") classes.push("card-gold");
    const card = document.createElement("article");
    card.className = classes.join(" ");
    card.innerHTML = `
      <div class="card-media">
        ${
          item.image
            ? `<img src="${item.image}" alt="${item.name} key art" loading="lazy" />`
            : `<div class="card-media-fallback">${item.tier}</div>`
        }
      </div>
      <div class="card-content">
        <div class="card-head">
          <span class="tag">${item.tier}</span>
          ${item.mutation ? `<span class="mutation-badge">${item.mutation}</span>` : ""}
        </div>
        <h3>${item.name}</h3>
        <div class="card-meta">
          <span>Vault value: ${item.value}</span>
          <span>Watchers: ${item.watchers}</span>
          <span>Stock: ${item.amount}</span>
        </div>
        ${
          item.discountedPrice
            ? `<div class="card-price">
                <span>Sale price</span>
                <div class="price-display">
                  <span class="original-price">Rs ${item.originalPrice.toLocaleString()}</span>
                  <strong class="discounted-price">Rs ${item.discountedPrice.toLocaleString()}</strong>
                </div>
                <small>Instant delivery slot • ${item.discount}% OFF</small>
              </div>`
            : item.price
            ? `<div class="card-price"><span>Sale price</span><strong>${item.price}</strong><small>Instant delivery slot</small></div>`
            : ""
        }
        <button class="ghost buy-btn" type="button" data-name="${item.name}" data-price="${item.discountedPrice ? `Rs ${item.discountedPrice.toLocaleString()}` : item.price ? `Rs ${item.price.toLocaleString()}` : ''}" data-item-id="${item.id}" onclick="window.buyItem(this)">Buy it now!</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Global event listener removed - relying on direct onclick for reliability

function bindCatalogControls() {
  const filterWrap = document.getElementById("tier-filters");
  const searchInput = document.getElementById("catalog-search");
  if (filterWrap) {
    filterWrap.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        filterWrap.querySelectorAll("button").forEach((node) => node.classList.remove("active"));
        btn.classList.add("active");
        activeTier = btn.dataset.tier || "all";
        renderShowcase();
      });
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      catalogSearch = event.target.value.trim().toLowerCase();
      renderShowcase();
    });
  }
}

function populateMetrics() {
  const grid = document.getElementById("metrics-grid");
  if (!grid) return;
  metricsData.forEach((metric) => {
    const card = document.createElement("article");
    card.className = "metric-card";
    card.innerHTML = `
      <p class="eyebrow">${metric.meta}</p>
      <strong>${metric.value}</strong>
      <p>${metric.label}</p>
      <p class="muted">${metric.delta}</p>
    `;
    grid.appendChild(card);
  });
}

function populateChecklist() {
  const list = document.getElementById("checklist");
  if (!list) return;
  checklistItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${index + 1}</span>${item}`;
    list.appendChild(li);
  });
}

function populateQuotes() {
  const grid = document.getElementById("quote-grid");
  if (!grid) return;
  quotes.forEach((quote) => {
    const card = document.createElement("article");
    card.className = "quote-card";
    card.innerHTML = `<h4>${quote.name}</h4><p>${quote.role}</p><p>“${quote.text}”</p>`;
    grid.appendChild(card);
  });
}

function populateThreatFeed() {
  const feed = document.getElementById("threat-feed");
  if (!feed) return;
  for (let i = 0; i < 4; i += 1) {
    const level = threatLevels[Math.floor(Math.random() * threatLevels.length)];
    const node = document.createElement("div");
    node.className = "threat-item";
    node.innerHTML = `<strong>${level}</strong><span>Zone ${Math.floor(Math.random() * 90) + 10}</span>`;
    feed.appendChild(node);
  }
}

function populateLabs() {
  const tabWrap = document.getElementById("lab-tabs");
  const panel = document.getElementById("lab-panel");
  if (!tabWrap || !panel) return;
  labsData.forEach((lab, index) => {
    const btn = document.createElement("button");
    btn.textContent = lab.label;
    if (index === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
      tabWrap.querySelectorAll("button").forEach((node) => node.classList.remove("active"));
      btn.classList.add("active");
      renderLabPanel(lab);
    });
    tabWrap.appendChild(btn);
  });
  renderLabPanel(labsData[0]);
}

function renderLabPanel(lab) {
  const panel = document.getElementById("lab-panel");
  if (!panel || !lab) return;
  panel.innerHTML = `
    <h3>${lab.title}</h3>
    <p>${lab.description}</p>
    <ul>
      ${lab.checklist.map((item) => `<li>${item}</li>`).join("")}
    </ul>
    <div class="lab-metrics">
      ${lab.metrics.map((metric) => `<div><span class="muted">${metric.label}</span><strong>${metric.value}</strong></div>`).join("")}
    </div>
  `;
}

function populateFAQ() {
  const wrap = document.getElementById("faq-accordion");
  if (!wrap) return;
  faqData.forEach((item) => {
    const accordion = document.createElement("article");
    accordion.className = "accordion-item";
    accordion.innerHTML = `
      <button class="accordion-trigger" type="button">
        <span>${item.question}</span>
        <span>+</span>
      </button>
      <div class="accordion-body">
        <p>${item.answer}</p>
      </div>
    `;
    accordion.querySelector(".accordion-trigger").addEventListener("click", () => {
      accordion.classList.toggle("open");
    });
    wrap.appendChild(accordion);
  });
}

function predictDrop() {
  const el = document.getElementById("predictor");
  if (!el) return;
  const showcaseData = getShowcaseData();
  const item = showcaseData[Math.floor(Math.random() * showcaseData.length)];
  el.textContent = `${item.name} forecast: ${Math.floor(Math.random() * 12) + 1} hrs window`;
}

// Listen for inventory updates and refresh showcase
window.addEventListener("inventoryUpdated", () => {
  renderShowcase();
});

function updateLiveUsers() {
  const el = document.getElementById("stat-users");
  if (!el) return;
  const time = Date.now();
  const seasonWave = Math.sin(time / 45000) * LIVE_USERS_SWAY;
  const micro = Math.random() * 400 - 200;
  const liveUsers = Math.max(120000, Math.round(LIVE_USERS_BASE + seasonWave + micro));
  el.textContent = liveUsers.toLocaleString();
}

function initIntel() {
  populateMetrics();
  renderShowcase();
  bindCatalogControls();
  populateChecklist();
  populateQuotes();
  populateThreatFeed();
  populateLabs();
  populateFAQ();
}

function toggleWaitlist() {
  const modal = document.getElementById("waitlist-modal");
  if (!modal) return;
  modal.open ? modal.close() : modal.showModal();
}

function closeModal() {
  const modal = document.getElementById("waitlist-modal");
  if (modal?.open) modal.close();
}

function handleWaitlist(event) {
  event.preventDefault();
  alert("Thanks! You're on the BrainRot Vault waitlist.");
}

// Payment modal functions are now defined inline in index.html


// handlePayment is now defined inline in index.html

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function toggleMobileNav() {
  document.querySelector(".site-header")?.classList.toggle("mobile-open");
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  initIntel();
  predictDrop();
  updateLiveUsers();
  liveUsersTimer = setInterval(updateLiveUsers, 5000);
  setYear();
});

