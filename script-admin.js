// Load inventory from shared storage on init
let inventoryState = getInventory();
let selectedInventoryId = inventoryState[0]?.id ?? null;

const inventoryMockOld = [
  {
    id: "inv-1",
    name: "Eclipse Seraph",
    tier: "Secret",
    status: "Cooling",
    value: "18.4B credits",
    price: 2400,
    amount: 1,
    discount: 0,
    image: "./assets/e-seraph.png",
    boxColor: "default",
  },
  {
    id: "inv-2",
    name: "Prism Howler",
    tier: "Godly",
    status: "Tracking",
    value: "9.2B credits",
    price: 1800,
    amount: 2,
    discount: 0,
    image: "./assets/prism.png",
    boxColor: "default",
  },
  {
    id: "inv-3",
    name: "Obsidian Bloom",
    tier: "Mythic",
    status: "Secured",
    value: "6.7B credits",
    price: 1250,
    amount: 1,
    discount: 0,
    image: "./assets/obsidian.png",
    boxColor: "default",
  },
  {
    id: "inv-4",
    name: "Cobalt Rift",
    tier: "Legendary",
    status: "Flagged",
    value: "4.3B credits",
    price: 950,
    amount: 4,
    discount: 0,
    image: "./assets/cobalt.png",
    boxColor: "default",
  },
  {
    id: "inv-5",
    name: "Vanta Crown",
    tier: "Secret",
    status: "Pending",
    value: "22.5B credits",
    price: 3200,
    amount: 1,
    discount: 0,
    image: "./assets/vanta.png",
    boxColor: "default",
  },
  {
    id: "inv-6",
    name: "Mieteteira Bicicleteira",
    tier: "Secret",
    status: "Featured",
    value: "Verified listing",
    price: 2500,
    amount: 1,
    discount: 0,
    image: "./assets/mieteteira.png",
    boxColor: "default",
  },
  {
    id: "inv-7",
    name: "Garama & Madundung",
    tier: "Secret",
    status: "Gold tier",
    value: "50 Mil bounty",
    price: 4000,
    amount: 1,
    discount: 0,
    image: "./assets/garama-madundung.png",
    boxColor: "gold",
  },
];

const alertLevels = ["Info", "Warning", "Critical"];
const panels = {
  overview: document.getElementById("panel-overview"),
  inventory: document.getElementById("panel-inventory"),
  create: document.getElementById("panel-create"),
  ops: document.getElementById("panel-ops"),
  alerts: document.getElementById("panel-alerts"),
};

function formatCredits(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return value;
  return `Cr ${numeric.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

function applyDiscount(price, discount) {
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;
  return Math.max(0, numericPrice * (1 - numericDiscount / 100));
}

function formatRs(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || numeric === 0) return "—";
  return `Rs ${numeric.toLocaleString("en-US")}`;
}

function renderInventory() {
  const body = document.getElementById("inventory-body");
  if (!body) return;
  body.innerHTML = "";
  const defaults = getDefaultInventory();
  
  inventoryState.forEach((item) => {
    const row = document.createElement("div");
    row.className = "table-row";
    if (item.id === selectedInventoryId) row.classList.add("selected");
    row.dataset.id = item.id;
    
    // Check if price or discount changed from default
    const original = defaults.find((d) => d.id === item.id);
    const hasDiscount = item.discount > 0;
    const priceChanged = original && original.price !== item.price;
    
    let priceDisplay = formatCredits(item.price);
    if (hasDiscount) {
      priceDisplay = `${formatCredits(item.price)} → ${formatCredits(applyDiscount(item.price, item.discount))}`;
    }
    
    let discountDisplay = hasDiscount ? `${item.discount}% <span class="price-badge discount">SALE</span>` : "—";
    if (priceChanged && !hasDiscount) {
      discountDisplay = `<span class="price-badge changed">EDITED</span>`;
    }
    const isAuction = Boolean(item.auction);
    const auctionPrice = Number(item.auctionStartingPrice ?? item.price) || Number(item.price || 0);
    const auctionDisplay = isAuction ? formatRs(auctionPrice) : "—";
    const auctionButtonLabel = isAuction ? "Edit bid" : "Add to bid board";
    
    row.innerHTML = `
      <span>${item.name}</span>
      <span>${item.tier}</span>
      <span>${item.value}</span>
      <span class="price-indicator">${priceDisplay}</span>
      <span>${discountDisplay}</span>
      <span>${item.amount}</span>
      <span>${item.status}</span>
      <span>${auctionDisplay}</span>
      <span>
        <div class="action-buttons">
          <button class="auction-btn" onclick="manageAuction('${item.id}'); event.stopPropagation();">
            ${auctionButtonLabel}
          </button>
          ${
            item.auction
              ? `<button class="ghost small" onclick="removeFromBidBoard('${item.id}'); event.stopPropagation();">
                  Remove from bid board
                </button>`
              : ""
          }
          <button class="delete-btn" onclick="deleteBrainrot('${item.id}'); event.stopPropagation();">×</button>
        </div>
      </span>
    `;
    row.addEventListener("click", () => selectInventory(item.id));
    body.appendChild(row);
  });
}

function deleteBrainrot(id) {
  if (!confirm("Delete this Brainrot? This cannot be undone.")) return;
  inventoryState = inventoryState.filter((item) => item.id !== id);
  if (selectedInventoryId === id) {
    selectedInventoryId = inventoryState[0]?.id ?? null;
  }
  saveInventory(inventoryState);
  renderInventory();
  fillInventoryForm();
  updateFormStatus("Brainrot deleted");
}

function selectInventory(id) {
  selectedInventoryId = id;
  renderInventory();
  fillInventoryForm();
}

function fillInventoryForm() {
  const form = document.getElementById("inventory-form");
  if (!form || !selectedInventoryId) return;
  const item = inventoryState.find((entry) => entry.id === selectedInventoryId);
  if (!item) return;

  form.elements.name.value = item.name;
  form.elements.tier.value = item.tier;
  form.elements.status.value = item.status;
  form.elements.value.value = item.value;
  form.elements.price.value = item.price;
  form.elements.discount.value = item.discount ?? 0;
  form.elements.amount.value = item.amount;
  updateFormStatus(`Editing ${item.name}`);
  updatePricePreview();
}

function handleInventoryForm() {
  const form = document.getElementById("inventory-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!selectedInventoryId) return;
    const formData = new FormData(form);
    inventoryState = inventoryState.map((item) =>
      item.id === selectedInventoryId
        ? {
            ...item,
            name: formData.get("name"),
            tier: formData.get("tier"),
            status: formData.get("status"),
            value: formData.get("value"),
            price: Number(formData.get("price")) || 0,
            discount: Number(formData.get("discount")) || 0,
            amount: Number(formData.get("amount")) || 0,
            image: item.image,
            boxColor: item.boxColor,
            auction: item.auction,
            auctionStartingPrice: item.auctionStartingPrice,
          }
        : item,
    );
    saveInventory(inventoryState);
    renderInventory();
    updateFormStatus(`Saved ${formData.get("name")} • ${new Date().toLocaleTimeString()}`);
  });
  ["price", "discount"].forEach((name) => {
    form.elements[name].addEventListener("input", updatePricePreview);
  });
}

function updateFormStatus(message) {
  const status = document.getElementById("form-status");
  if (status) status.textContent = message;
}

function updatePricePreview() {
  const form = document.getElementById("inventory-form");
  const preview = document.getElementById("price-preview");
  if (!form || !preview) return;
  const price = Number(form.elements.price.value);
  const discount = Number(form.elements.discount.value);
  if (Number.isNaN(price)) {
    preview.textContent = "Final price: —";
    return;
  }
  const final = applyDiscount(price, discount);
  preview.textContent = `Final price: ${formatCredits(final)}`;
}

function populateAlerts() {
  const wrap = document.getElementById("admin-alerts");
  if (!wrap) return;
  wrap.innerHTML = "";
  for (let i = 0; i < 5; i += 1) {
    const level = alertLevels[Math.floor(Math.random() * alertLevels.length)];
    const card = document.createElement("article");
    card.className = "alert-card";
    card.innerHTML = `
      <strong>${level}</strong>
      <p>Zone ${Math.floor(Math.random() * 80) + 10} • Cooldown ${Math.floor(Math.random() * 50) + 10} mins</p>
    `;
    wrap.appendChild(card);
  }
}

function refreshAlerts() {
  populateAlerts();
}

function initPanels() {
  const links = document.querySelectorAll(".sidebar-link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
      showPanel(link.dataset.panel);
    });
  });
  showPanel("overview");
}

function showPanel(target) {
  Object.entries(panels).forEach(([key, panel]) => {
    if (!panel) return;
    panel.hidden = key !== target;
  });
  if (target === "overview") panels.overview.hidden = false;
}

function handleCreateForm() {
  const form = document.getElementById("create-form");
  if (!form) return;
  
  // Image preview functionality
  const imageInput = document.getElementById("create-image");
  const previewContainer = document.getElementById("image-preview");
  const previewImg = document.getElementById("preview-img");
  const previewError = document.getElementById("preview-error");
  
  if (imageInput && previewContainer && previewImg) {
    imageInput.addEventListener("input", () => {
      const imagePath = imageInput.value.trim();
      if (imagePath) {
        previewContainer.style.display = "block";
        previewImg.style.display = "block";
        previewError.style.display = "none";
        previewImg.src = imagePath;
        
        // Handle image load error
        previewImg.onerror = () => {
          previewImg.style.display = "none";
          previewError.style.display = "block";
          previewError.textContent = "Image not found: " + imagePath;
        };
        
        previewImg.onload = () => {
          previewError.style.display = "none";
        };
      } else {
        previewContainer.style.display = "none";
      }
    });
  }
  
  const updatePreview = () => {
    const price = Number(form.elements.price.value);
    const discount = Number(form.elements.discount.value);
    const preview = document.getElementById("create-price-preview");
    if (!preview) return;
    if (Number.isNaN(price)) {
      preview.textContent = "Final price: —";
      return;
    }
    preview.textContent = `Final price: ${formatCredits(applyDiscount(price, discount))}`;
  };
  ["price", "discount"].forEach((name) => {
    form.elements[name].addEventListener("input", updatePreview);
  });
  updatePreview();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const entry = {
      id: `inv-${Date.now()}`,
      name: formData.get("name") || "Untitled",
      tier: formData.get("tier") || "Secret",
      status: formData.get("status") || "Custom",
      value: formData.get("description") || "Custom value",
      price: Number(formData.get("price")) || 0,
      discount: Number(formData.get("discount")) || 0,
      amount: Number(formData.get("amount")) || 0,
      image: formData.get("image") || "",
      boxColor: formData.get("boxColor") || "default",
      auction: false,
      auctionStartingPrice: 0,
    };
    inventoryState = [entry, ...inventoryState];
    selectedInventoryId = entry.id;
    saveInventory(inventoryState);
    renderInventory();
    fillInventoryForm();
    form.reset();
    form.querySelector("#create-box").value = "default";
    form.querySelector("#create-discount").value = "0";
    updatePreview();
  });
}

function manageAuction(id) {
  const item = inventoryState.find((entry) => entry.id === id);
  if (!item) return;
  const existing = item.auction ? item.auctionStartingPrice : item.price;
  const promptValue = prompt(
    `Starting bid for ${item.name} (leave blank to remove from bid board):`,
    existing || "",
  );
  if (promptValue === null) return;
  const trimmed = promptValue.trim();
  let updatedItem;
  if (!trimmed) {
    updatedItem = { ...item, auction: false, auctionStartingPrice: 0 };
  } else {
    const parsed = Number(trimmed);
    if (Number.isNaN(parsed) || parsed <= 0) {
      alert("Enter a valid number greater than zero.");
      return;
    }
    updatedItem = { ...item, auction: true, auctionStartingPrice: parsed };
  }
  inventoryState = inventoryState.map((entry) => (entry.id === id ? updatedItem : entry));
  saveInventory(inventoryState);
  renderInventory();
  updateFormStatus(
    updatedItem.auction
      ? `Auction starting bid set to ${formatRs(updatedItem.auctionStartingPrice)} for ${item.name}.`
      : `${item.name} removed from bid board.`,
  );
}

function removeFromBidBoard(id) {
  const item = inventoryState.find((entry) => entry.id === id);
  if (!item || !item.auction) return;
  inventoryState = inventoryState.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          auction: false,
          auctionStartingPrice: 0,
        }
      : entry,
  );
  saveInventory(inventoryState);
  renderInventory();
  updateFormStatus(`${item.name} removed from bid board.`);
}

document.addEventListener("DOMContentLoaded", () => {
  renderInventory();
  fillInventoryForm();
  handleInventoryForm();
  handleCreateForm();
  populateAlerts();
  initPanels();
});

window.refreshAlerts = refreshAlerts;
window.deleteBrainrot = deleteBrainrot;
window.manageAuction = manageAuction;
window.removeFromBidBoard = removeFromBidBoard;

