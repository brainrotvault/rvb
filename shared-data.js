// Shared inventory state for both admin and public site
// Admin writes to this; public site reads from it

const INVENTORY_KEY = "brainrot_vault_inventory";

function getInventory() {
  const stored = localStorage.getItem(INVENTORY_KEY);
  if (!stored) return getDefaultInventory();
  try {
    return JSON.parse(stored);
  } catch {
    return getDefaultInventory();
  }
}

function saveInventory(inventory) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  // Broadcast change event so other tabs/windows can react
  window.dispatchEvent(new CustomEvent("inventoryUpdated", { detail: inventory }));
}

function getDefaultInventory() {
  return [
    {
      id: "inv-losmobilis",
      name: "Los Mobilis",
      tier: "Secret",
      status: "Available",
      value: "Custom value",
      price: 3000,
      discount: 0,
      amount: 1,
      mutation: "UNKNOWN",
      watchers: 0,
      image: "./assets/Los-Mobilis.png",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-mieteteira",
      name: "Mieteteira Bicicleteira",
      tier: "Secret",
      status: "Available",
      value: "Verified listing",
      price: 2500,
      discount: 0,
      amount: 1,
      mutation: "Yin Yang",
      watchers: 9,
      image: "./assets/mieteteira.png",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-garama",
      name: "Garama & Madundung",
      tier: "Secret",
      status: "Available",
      value: "50 Mil bounty",
      price: 4000,
      discount: 0,
      amount: 1,
      mutation: "Top 5 rare",
      watchers: 27,
      image: "./assets/garama-madundung.png",
      highlight: "gold",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-1",
      name: "Eclipse Seraph",
      tier: "Secret",
      status: "Cooling",
      value: "18.4B credits",
      price: 2400,
      discount: 0,
      amount: 1,
      mutation: "Phase Rift",
      watchers: 43,
      image: "",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-2",
      name: "Prism Howler",
      tier: "Godly",
      status: "Tracking",
      value: "9.2B credits",
      price: 1800,
      discount: 0,
      amount: 2,
      mutation: "Prismatic Echo",
      watchers: 31,
      image: "",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-3",
      name: "Obsidian Bloom",
      tier: "Mythic",
      status: "Secured",
      value: "6.7B credits",
      price: 1250,
      discount: 0,
      amount: 1,
      mutation: "Rooted Pulse",
      watchers: 22,
      image: "",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-4",
      name: "Cobalt Rift",
      tier: "Legendary",
      status: "Flagged",
      value: "4.3B credits",
      price: 950,
      discount: 0,
      amount: 4,
      mutation: "Rift Walker",
      watchers: 19,
      image: "",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-5",
      name: "Vanta Crown",
      tier: "Secret",
      status: "Pending",
      value: "22.5B credits",
      price: 3200,
      discount: 0,
      amount: 1,
      mutation: "Umbra Split",
      watchers: 55,
      image: "",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
    {
      id: "inv-6",
      name: "Ionic Wisp",
      tier: "Rare",
      status: "Available",
      value: "1.1B credits",
      price: 450,
      discount: 0,
      amount: 3,
      mutation: "Ionic Drift",
      watchers: 12,
      image: "",
      highlight: "",
      auction: false,
      auctionStartingPrice: 0,
    },
  ];
}

// Initialize on first load
if (!localStorage.getItem(INVENTORY_KEY)) {
  saveInventory(getDefaultInventory());
}

