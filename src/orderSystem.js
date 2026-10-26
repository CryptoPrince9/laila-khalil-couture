// Couture Bespoke Ordering Engine & Modal Workflow
import { paymentManager } from './paymentGateways.js';

export const DESIGNS_DATA = [
  {
    id: "look-01",
    title: "The Celestial Noir",
    subtitle: "Asymmetrical Draped Evening Gown",
    priceUSD: 1450,
    videoSrc: "videos/design-01.mp4",
    fabric: "100% Silk Crepe de Chine with Hand-Woven Golden Filament",
    weight: "180 g/m² (Light-to-Medium Luxury)",
    stitch: "ISO 4915 Class 301 Lockstitch • Rolled Baby Hems (14 SPI)",
    productionDays: 14,
    description: "An architectonic evening gown with dynamic origami shoulder draping, sculpted contour waistline, and an ethereal bias-cut flowing skirt engineered to capture kinetic motion."
  },
  {
    id: "look-02",
    title: "Imperial Saffron Elegance",
    subtitle: "Sculptural High-Collar Ensemble",
    priceUSD: 1850,
    videoSrc: "videos/design-02.mp4",
    fabric: "Mulberry Silk Dupioni & French Triple Organza",
    weight: "210 g/m² (Structured Luster)",
    stitch: "Tailored Horsehair Canvas Interlining • Hand-Picked French Seams",
    productionDays: 18,
    description: "A commanding runway statement combining a sharply pleated architectural bodice with fluid draped panels, finished with jewel-tone warm amber reflections and regal posture."
  },
  {
    id: "look-03",
    title: "Aura of Alexandria",
    subtitle: "Cascading Silk Chiffon Kaftan Gown",
    priceUSD: 1280,
    videoSrc: "videos/design-03.mp4",
    fabric: "Semi-Translucent Micro-Chiffon & Heavy Pearl Satin Slip",
    weight: "120 g/m² (Ultra-Lightweight Fluid Drape)",
    stitch: "Zero-Waste Bias Cut • ISO Class 504 Micro-Serged Edge Finish",
    productionDays: 12,
    description: "A celebration of breezy Mediterranean movement featuring floating batwing drapery, delicate gold filigree seam finishes, and an adjustable imperial braided cinch cord."
  },
  {
    id: "look-04",
    title: "The Modern Architect",
    subtitle: "Bespoke Contemporary Tailored Suit Set",
    priceUSD: 2100,
    videoSrc: "videos/design-04.mp4",
    fabric: "Italian Super 140s Wool Crepe & Pure Cupro Bemberg Lining",
    weight: "260 g/m² (Master Tailoring Grade)",
    stitch: "Hand Pad-Stitched Lapels • Hand-Bound Buttonholes • Natural Horn Trims",
    productionDays: 21,
    description: "A masterclass in modern sartorial power. Sharp peak lapels juxtaposed with fluid wide-leg trouser tailoring, engineered for red carpet galas and high-profile keynote appearances."
  }
];

export class OrderSystem {
  constructor() {
    this.orders = this.loadOrders();
    this.selectedDesign = DESIGNS_DATA[0];
    this.currentStep = 1;
    this.modalEl = null;
  }

  loadOrders() {
    try {
      const stored = localStorage.getItem("laila_khalil_orders");
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not load orders from localStorage", e);
    }
    // Seed with one sample order for realistic atelier preview
    return [
      {
        orderId: "LK-8492",
        date: "2026-10-25",
        designId: "look-01",
        designTitle: "The Celestial Noir",
        amountUSD: 1450,
        currency: "USD",
        paymentMethod: "wise",
        paymentReference: "LK-8492",
        sizingType: "bespoke",
        measurements: { bust: "88 cm", waist: "68 cm", hips: "94 cm", height: "175 cm" },
        clientName: "Eleanor Vance",
        clientEmail: "e.vance@geneva-arts.org",
        clientPhone: "+41 79 123 4567",
        shippingCountry: "Switzerland",
        shippingAddress: "Rue du Rhône 42, 1204 Genève",
        status: "In Tailoring"
      }
    ];
  }

  saveOrders() {
    try {
      localStorage.setItem("laila_khalil_orders", JSON.stringify(this.orders));
    } catch (e) {
      console.error("Could not save orders", e);
    }
  }

  getOrders() {
    return this.orders;
  }

  openOrderModal(designId = "look-01") {
    const found = DESIGNS_DATA.find(d => d.id === designId);
    if (found) this.selectedDesign = found;
    this.currentStep = 1;
    this.renderModal();
    const modal = document.getElementById("order-checkout-modal");
    if (modal) {
      modal.classList.remove("hidden");
      setTimeout(() => modal.classList.remove("opacity-0"), 20);
    }
  }

  closeOrderModal() {
    const modal = document.getElementById("order-checkout-modal");
    if (modal) {
      modal.classList.add("opacity-0");
      setTimeout(() => modal.classList.add("hidden"), 300);
    }
  }

  renderModal() {
    const existing = document.getElementById("order-checkout-modal");
    if (existing) existing.remove();

    const d = this.selectedDesign;
    const cryptoRates = paymentManager.calculateCryptoPrice(d.priceUSD);
    const orderRef = "LK-" + Math.floor(1000 + Math.random() * 9000);
    const wiseDetails = paymentManager.generateWisePaymentDetails(orderRef.replace('LK-', ''), d.priceUSD, "USD");

    const modalHTML = `
      <div id="order-checkout-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-lg hidden opacity-0 transition-opacity duration-300">
        <div class="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0d0d12] border border-[#d4af37]/35 rounded-2xl shadow-2xl p-5 sm:p-8 text-neutral-200">
          
          <!-- Top Bar -->
          <div class="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div>
              <span class="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">LAILA KHALIL • BESPOKE COMMISSION</span>
              <h3 class="text-xl sm:text-2xl font-serif text-[#f5ecd7] font-medium mt-0.5">Order ${d.title}</h3>
            </div>
            <button id="close-order-modal-btn" class="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Stepper Indicator -->
          <div class="flex items-center justify-between my-5 px-2">
            <div class="flex items-center space-x-2 text-xs ${this.currentStep >= 1 ? 'text-[#d4af37]' : 'text-neutral-500'}">
              <span class="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold">1</span>
              <span class="hidden sm:inline">Design & Fit</span>
            </div>
            <div class="h-0.5 flex-1 mx-3 bg-neutral-800 ${this.currentStep >= 2 ? 'bg-[#d4af37]' : ''}"></div>
            <div class="flex items-center space-x-2 text-xs ${this.currentStep >= 2 ? 'text-[#d4af37]' : 'text-neutral-500'}">
              <span class="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold">2</span>
              <span class="hidden sm:inline">Client Details</span>
            </div>
            <div class="h-0.5 flex-1 mx-3 bg-neutral-800 ${this.currentStep >= 3 ? 'bg-[#d4af37]' : ''}"></div>
            <div class="flex items-center space-x-2 text-xs ${this.currentStep >= 3 ? 'text-[#d4af37]' : 'text-neutral-500'}">
              <span class="w-6 h-6 rounded-full border border-current flex items-center justify-center font-bold">3</span>
              <span class="hidden sm:inline">Wise / MetaMask</span>
            </div>
          </div>

          <!-- FORM CONTAINER -->
          <form id="order-form" class="space-y-6">
            <input type="hidden" name="orderId" value="${orderRef}" />
            <input type="hidden" name="designId" value="${d.id}" />
            <input type="hidden" name="designTitle" value="${d.title}" />
            <input type="hidden" name="amountUSD" value="${d.priceUSD}" />

            <!-- STEP 1: DESIGN & FIT -->
            <div id="step-1-content" class="${this.currentStep === 1 ? '' : 'hidden'} space-y-5">
              <div class="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div class="w-full sm:w-36 h-36 rounded-lg overflow-hidden bg-black flex-shrink-0 relative">
                  <video src="${d.videoSrc}" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span class="absolute bottom-1 left-2 text-[10px] text-white/80 font-mono">Runway 2026</span>
                </div>
                <div class="flex-1 text-xs space-y-1.5">
                  <div class="flex items-baseline justify-between">
                    <h4 class="text-base font-serif font-bold text-white">${d.title}</h4>
                    <span class="text-base font-semibold text-[#d4af37] font-mono">$${d.priceUSD} USD</span>
                  </div>
                  <p class="text-neutral-400">${d.description}</p>
                  <div class="pt-2 text-[11px] text-neutral-400 space-y-0.5 border-t border-neutral-800/80">
                    <p><strong>Fabric:</strong> ${d.fabric}</p>
                    <p><strong>Stitch & Specs:</strong> ${d.stitch}</p>
                    <p><strong>Atelier Craft Time:</strong> ${d.productionDays} Business Days Hand-Tailoring</p>
                  </div>
                </div>
              </div>

              <!-- Switch Design Dropdown -->
              <div>
                <label class="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">Switch Runway Design</label>
                <select id="switch-design-select" class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none">
                  ${DESIGNS_DATA.map(item => `
                    <option value="${item.id}" ${item.id === d.id ? 'selected' : ''}>${item.title} — $${item.priceUSD} USD (${item.subtitle})</option>
                  `).join('')}
                </select>
              </div>

              <!-- Sizing Choice -->
              <div>
                <label class="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Select Sizing Standard</label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="cursor-pointer border border-[#d4af37]/40 bg-neutral-900/80 p-3 rounded-lg flex items-center space-x-2 text-xs hover:border-[#d4af37] transition">
                    <input type="radio" name="sizingType" value="standard" checked class="text-[#d4af37]" />
                    <span>Standard Haute Couture Size (XS - XXL)</span>
                  </label>
                  <label class="cursor-pointer border border-neutral-700 bg-neutral-900/80 p-3 rounded-lg flex items-center space-x-2 text-xs hover:border-[#d4af37] transition">
                    <input type="radio" name="sizingType" value="bespoke" class="text-[#d4af37]" />
                    <span class="text-[#f5ecd7] font-medium">Bespoke Made-to-Measure (Recommended)</span>
                  </label>
                </div>
              </div>

              <!-- Standard Size Selector -->
              <div id="standard-size-box">
                <label class="block text-xs text-neutral-400 mb-1.5">Select Ready-to-Wear Size</label>
                <div class="grid grid-cols-6 gap-2 text-center text-xs">
                  ${['XS (EU 34)', 'S (EU 36)', 'M (EU 38)', 'L (EU 40)', 'XL (EU 42)', 'XXL (EU 44)'].map((s, idx) => `
                    <label class="border border-neutral-700 rounded-lg py-2.5 cursor-pointer hover:border-[#d4af37] transition has-[:checked]:border-[#d4af37] has-[:checked]:bg-[#d4af37]/10">
                      <input type="radio" name="standardSize" value="${s}" ${idx === 1 ? 'checked' : ''} class="hidden" />
                      <span>${s.split(' ')[0]}</span>
                      <span class="block text-[9px] text-neutral-400">${s.split(' ')[1]}</span>
                    </label>
                  `).join('')}
                </div>
              </div>

              <!-- Bespoke Measurements Box (Hidden by default) -->
              <div id="bespoke-measurements-box" class="hidden p-4 bg-neutral-900/40 rounded-xl border border-[#d4af37]/30 space-y-3">
                <div class="flex items-center justify-between">
                  <h5 class="text-xs font-semibold text-[#d4af37] uppercase tracking-wider">Custom Measurements (cm or inches)</h5>
                  <span class="text-[10px] text-neutral-400">Our master tailor cuts your unique pattern</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label class="text-[11px] text-neutral-400">Total Height</label>
                    <input type="text" name="m_height" placeholder="e.g. 175 cm" class="w-full bg-black/60 border border-neutral-700 rounded p-2 text-white text-xs mt-1" />
                  </div>
                  <div>
                    <label class="text-[11px] text-neutral-400">Bust (Apex)</label>
                    <input type="text" name="m_bust" placeholder="e.g. 88 cm" class="w-full bg-black/60 border border-neutral-700 rounded p-2 text-white text-xs mt-1" />
                  </div>
                  <div>
                    <label class="text-[11px] text-neutral-400">Natural Waist</label>
                    <input type="text" name="m_waist" placeholder="e.g. 68 cm" class="w-full bg-black/60 border border-neutral-700 rounded p-2 text-white text-xs mt-1" />
                  </div>
                  <div>
                    <label class="text-[11px] text-neutral-400">Full Hips</label>
                    <input type="text" name="m_hips" placeholder="e.g. 96 cm" class="w-full bg-black/60 border border-neutral-700 rounded p-2 text-white text-xs mt-1" />
                  </div>
                </div>
                <div>
                  <label class="text-[11px] text-neutral-400">Special Fitting / Posture Instructions</label>
                  <textarea name="m_notes" rows="2" placeholder="e.g., broad shoulders, floor-length with 10cm heels, event date..." class="w-full bg-black/60 border border-neutral-700 rounded p-2 text-white text-xs mt-1"></textarea>
                </div>
              </div>

              <div class="flex justify-end pt-3">
                <button type="button" id="go-step-2-btn" class="px-6 py-2.5 bg-[#d4af37] hover:bg-[#c49e2e] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition">
                  Continue to Client Details →
                </button>
              </div>
            </div>

            <!-- STEP 2: CLIENT DETAILS -->
            <div id="step-2-content" class="${this.currentStep === 2 ? '' : 'hidden'} space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label class="block text-neutral-400 mb-1">Full Legal Name *</label>
                  <input type="text" name="clientName" placeholder="Client Name" required class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label class="block text-neutral-400 mb-1">VIP Email Address *</label>
                  <input type="email" name="clientEmail" placeholder="client@example.com" required class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label class="block text-neutral-400 mb-1">WhatsApp / Contact Phone *</label>
                  <input type="tel" name="clientPhone" placeholder="+1 (555) 000-0000" required class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div>
                  <label class="block text-neutral-400 mb-1">Destination Country *</label>
                  <input type="text" name="shippingCountry" placeholder="e.g. United Arab Emirates, France, USA, Egypt" required class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-neutral-400 mb-1">Full Delivery Address (DHL Express Delivery) *</label>
                  <input type="text" name="shippingAddress" placeholder="Street, Apt/Suite, City, Postal Code" required class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" />
                </div>
              </div>

              <div class="flex items-center justify-between pt-3">
                <button type="button" id="back-step-1-btn" class="px-4 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs rounded-lg transition">
                  ← Back
                </button>
                <button type="button" id="go-step-3-btn" class="px-6 py-2.5 bg-[#d4af37] hover:bg-[#c49e2e] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition">
                  Select Payment Method (Wise / MetaMask) →
                </button>
              </div>
            </div>

            <!-- STEP 3: PAYMENT GATEWAY (WISE & METAMASK) -->
            <div id="step-3-content" class="${this.currentStep === 3 ? '' : 'hidden'} space-y-5">
              
              <div class="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span class="text-xs text-neutral-400">Commission Total:</span>
                  <p class="text-xl font-bold font-mono text-[#d4af37]">$${d.priceUSD} USD</p>
                </div>
                <div class="text-right text-xs text-neutral-400">
                  <span>Order Reference:</span>
                  <p class="font-mono text-white font-semibold">${orderRef}</p>
                </div>
              </div>

              <!-- Payment Method Tabs -->
              <div>
                <label class="block text-xs uppercase tracking-wider text-neutral-400 mb-2">Choose Payment Channel</label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="cursor-pointer border border-[#d4af37] bg-[#d4af37]/10 p-3.5 rounded-xl flex items-center space-x-3 text-xs transition has-[:checked]:border-[#d4af37]">
                    <input type="radio" name="paymentMethod" value="wise" checked class="text-[#d4af37]" />
                    <div>
                      <strong class="text-white block font-medium">Wise (Multi-Currency Wire)</strong>
                      <span class="text-[10px] text-neutral-400">USD, EUR, GBP, EGP Direct Wire / Card</span>
                    </div>
                  </label>
                  <label class="cursor-pointer border border-neutral-700 bg-neutral-900/80 p-3.5 rounded-xl flex items-center space-x-3 text-xs transition has-[:checked]:border-[#d4af37] has-[:checked]:bg-[#d4af37]/10">
                    <input type="radio" name="paymentMethod" value="metamask" class="text-[#d4af37]" />
                    <div>
                      <strong class="text-white block font-medium">MetaMask (Web3 Crypto)</strong>
                      <span class="text-[10px] text-neutral-400">ETH, USDT, USDC • Instant Escrow</span>
                    </div>
                  </label>
                </div>
              </div>

              <!-- WISE PAYMENT DETAILS PANEL -->
              <div id="wise-payment-panel" class="p-5 rounded-xl bg-gradient-to-b from-neutral-900 to-black border border-emerald-500/30 space-y-4">
                <div class="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">W</div>
                    <span class="text-sm font-semibold text-white">Wise Direct International Bank Transfer</span>
                  </div>
                  <span class="text-[11px] text-emerald-400 font-mono">Zero Hidden Fees</span>
                </div>

                <p class="text-xs text-neutral-300">
                  Transfer <strong>$${d.priceUSD} USD</strong> (or equivalent) using Wise to Laila Khalil Atelier's official coordinates:
                </p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-black/60 p-4 rounded-lg border border-neutral-800">
                  <div>
                    <span class="text-neutral-500 text-[10px] block">PAYEE NAME</span>
                    <span class="text-white">${wiseDetails.payeeName}</span>
                  </div>
                  <div>
                    <span class="text-neutral-500 text-[10px] block">WISE TAG / HANDLE</span>
                    <span class="text-[#d4af37] font-semibold">${wiseDetails.wiseTag}</span>
                  </div>
                  <div>
                    <span class="text-neutral-500 text-[10px] block">EUR / INTL IBAN</span>
                    <span class="text-white">${wiseDetails.iban}</span>
                  </div>
                  <div>
                    <span class="text-neutral-500 text-[10px] block">SWIFT / BIC</span>
                    <span class="text-white">${wiseDetails.swiftBic}</span>
                  </div>
                  <div>
                    <span class="text-neutral-500 text-[10px] block">US ACH ROUTING</span>
                    <span class="text-white">${wiseDetails.routingUSD}</span>
                  </div>
                  <div>
                    <span class="text-neutral-500 text-[10px] block">PAYMENT REFERENCE (MANDATORY)</span>
                    <span class="text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">${wiseDetails.reference}</span>
                  </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                  <a href="${wiseDetails.deepLink}" target="_blank" rel="noopener" class="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition">
                    Open Wise & Pay Now ↗
                  </a>
                  <button type="submit" class="flex-1 text-center py-2.5 bg-[#d4af37] hover:bg-[#c49e2e] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition shadow-lg shadow-[#d4af37]/20">
                    Confirm Order & Submit Proof
                  </button>
                </div>
              </div>

              <!-- METAMASK PAYMENT DETAILS PANEL -->
              <div id="metamask-payment-panel" class="hidden p-5 rounded-xl bg-gradient-to-b from-neutral-900 to-black border border-indigo-500/30 space-y-4">
                <div class="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">Ξ</div>
                    <span class="text-sm font-semibold text-white">MetaMask Web3 Crypto Settlement</span>
                  </div>
                  <span class="text-[11px] text-indigo-400 font-mono">Ethereum / Polygon</span>
                </div>

                <div class="flex items-center justify-between bg-black/60 p-3 rounded-lg border border-neutral-800 text-xs">
                  <div>
                    <span class="text-neutral-400 block text-[11px]">Crypto Equivalent:</span>
                    <span class="text-lg font-mono font-bold text-indigo-300">~${cryptoRates.ETH} ETH</span>
                    <span class="text-neutral-500 text-[11px] ml-1">or $${cryptoRates.USDT} USDT</span>
                  </div>
                  <button type="button" id="connect-wallet-action-btn" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition">
                    ${paymentManager.connectedWallet ? 'Wallet Connected' : 'Connect MetaMask'}
                  </button>
                </div>

                <!-- Recipient Address Box -->
                <div class="bg-black/80 p-3.5 rounded-lg border border-neutral-800 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-neutral-400 text-[11px]">Laila Khalil Public Atelier Wallet (ERC-20):</span>
                    <button type="button" id="copy-eth-addr-btn" class="text-[#d4af37] hover:underline text-[11px]">Copy Address</button>
                  </div>
                  <div class="p-2 bg-neutral-900 rounded font-mono text-[11px] text-indigo-200 break-all border border-neutral-800">
                    ${paymentManager.config.metamask.ethAddress}
                  </div>
                </div>

                <!-- Pay Button -->
                <div class="flex flex-col sm:flex-row gap-3 pt-2">
                  <button type="button" id="send-metamask-tx-btn" class="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition">
                    Pay with Connected MetaMask ↗
                  </button>
                  <button type="submit" class="flex-1 py-2.5 bg-[#d4af37] hover:bg-[#c49e2e] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition shadow-lg shadow-[#d4af37]/20">
                    Confirm Order Ticket
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2">
                <button type="button" id="back-step-2-btn" class="px-4 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs rounded-lg transition">
                  ← Back to Client Details
                </button>
              </div>

            </div>

            <!-- SUCCESS CONFIRMATION VIEW (Hidden until submitted) -->
            <div id="order-success-view" class="hidden text-center py-6 space-y-4">
              <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h4 class="text-2xl font-serif text-[#f5ecd7]">Commission Ticket Received</h4>
              <p class="text-xs text-neutral-400 max-w-md mx-auto">
                Thank you. Your bespoke order has been registered in the Laila Khalil Atelier queue. An official tech pack confirmation and payment invoice have been generated.
              </p>
              <div class="p-4 bg-neutral-900 rounded-xl border border-neutral-800 text-xs font-mono max-w-sm mx-auto text-left space-y-1">
                <p><strong>Order ID:</strong> <span id="confirmed-order-id" class="text-[#d4af37]">LK-0000</span></p>
                <p><strong>Design:</strong> <span id="confirmed-design-name" class="text-white">-</span></p>
                <p><strong>Amount:</strong> <span id="confirmed-amount" class="text-white">-</span></p>
                <p><strong>Status:</strong> <span class="text-amber-400">Pending Wire / Web3 Verification</span></p>
              </div>
              <div class="pt-3 flex justify-center space-x-3">
                <button type="button" id="print-order-invoice-btn" class="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-lg transition">
                  Print Official Invoice ⎙
                </button>
                <button type="button" id="finish-order-btn" class="px-5 py-2 bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition">
                  Return to Atelier
                </button>
              </div>
            </div>

          </form>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.attachEventListeners();
  }

  attachEventListeners() {
    const modal = document.getElementById("order-checkout-modal");
    if (!modal) return;

    // Close button
    document.getElementById("close-order-modal-btn")?.addEventListener("click", () => this.closeOrderModal());

    // Switch design select
    document.getElementById("switch-design-select")?.addEventListener("change", (e) => {
      this.openOrderModal(e.target.value);
    });

    // Sizing radio toggle
    const sizingRadios = modal.querySelectorAll('input[name="sizingType"]');
    sizingRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        const isBespoke = e.target.value === 'bespoke';
        document.getElementById("bespoke-measurements-box")?.classList.toggle("hidden", !isBespoke);
        document.getElementById("standard-size-box")?.classList.toggle("hidden", isBespoke);
      });
    });

    // Navigation buttons
    document.getElementById("go-step-2-btn")?.addEventListener("click", () => {
      this.currentStep = 2;
      document.getElementById("step-1-content")?.classList.add("hidden");
      document.getElementById("step-2-content")?.classList.remove("hidden");
    });

    document.getElementById("back-step-1-btn")?.addEventListener("click", () => {
      this.currentStep = 1;
      document.getElementById("step-2-content")?.classList.add("hidden");
      document.getElementById("step-1-content")?.classList.remove("hidden");
    });

    document.getElementById("go-step-3-btn")?.addEventListener("click", () => {
      const form = document.getElementById("order-form");
      if (!form.clientName.value || !form.clientEmail.value || !form.clientPhone.value || !form.shippingAddress.value) {
        alert("Please complete the required contact and delivery fields.");
        return;
      }
      this.currentStep = 3;
      document.getElementById("step-2-content")?.classList.add("hidden");
      document.getElementById("step-3-content")?.classList.remove("hidden");
    });

    document.getElementById("back-step-2-btn")?.addEventListener("click", () => {
      this.currentStep = 2;
      document.getElementById("step-3-content")?.classList.add("hidden");
      document.getElementById("step-2-content")?.classList.remove("hidden");
    });

    // Payment method toggle
    const payRadios = modal.querySelectorAll('input[name="paymentMethod"]');
    payRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        const isWise = e.target.value === 'wise';
        document.getElementById("wise-payment-panel")?.classList.toggle("hidden", !isWise);
        document.getElementById("metamask-payment-panel")?.classList.toggle("hidden", isWise);
      });
    });

    // MetaMask Connect Action
    document.getElementById("connect-wallet-action-btn")?.addEventListener("click", async () => {
      const res = await paymentManager.connectMetaMask();
      if (res.success) {
        const btn = document.getElementById("connect-wallet-action-btn");
        if (btn) btn.textContent = `Connected: ${res.address.slice(0, 6)}...${res.address.slice(-4)}`;
      } else {
        alert(res.message || "Could not connect to MetaMask. You can still transfer directly to the provided Ethereum address.");
      }
    });

    // Copy ETH address
    document.getElementById("copy-eth-addr-btn")?.addEventListener("click", () => {
      navigator.clipboard.writeText(paymentManager.config.metamask.ethAddress);
      alert("Atelier Ethereum address copied to clipboard!");
    });

    // Send MetaMask Tx
    document.getElementById("send-metamask-tx-btn")?.addEventListener("click", async () => {
      const form = document.getElementById("order-form");
      const orderId = form.orderId.value;
      const amountUSD = parseFloat(form.amountUSD.value);

      try {
        const res = await paymentManager.sendMetaMaskPayment(orderId, amountUSD);
        if (res.success) {
          alert(`Transaction submitted! Hash: ${res.txHash.slice(0, 10)}...`);
          this.handleOrderSubmission(form, 'metamask', res.txHash);
        } else {
          alert(res.message || "Transaction was not completed.");
        }
      } catch (err) {
        alert(err.message || "MetaMask transaction failed.");
      }
    });

    // Form Submit (Wise or manual confirmation)
    document.getElementById("order-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = e.target;
      const payMethod = form.paymentMethod.value;
      this.handleOrderSubmission(form, payMethod);
    });

    // Finish button
    document.getElementById("finish-order-btn")?.addEventListener("click", () => {
      this.closeOrderModal();
    });

    // Print invoice button
    document.getElementById("print-order-invoice-btn")?.addEventListener("click", () => {
      window.print();
    });
  }

  handleOrderSubmission(form, paymentMethod, txHash = null) {
    const newOrder = {
      orderId: form.orderId.value,
      date: new Date().toISOString().split('T')[0],
      designId: form.designId.value,
      designTitle: form.designTitle.value,
      amountUSD: parseFloat(form.amountUSD.value),
      currency: "USD",
      paymentMethod: paymentMethod,
      paymentReference: form.orderId.value,
      txHash: txHash,
      sizingType: form.sizingType.value,
      standardSize: form.standardSize ? form.standardSize.value : "M",
      measurements: form.sizingType.value === 'bespoke' ? {
        height: form.m_height?.value || "Unspecified",
        bust: form.m_bust?.value || "Unspecified",
        waist: form.m_waist?.value || "Unspecified",
        hips: form.m_hips?.value || "Unspecified",
        notes: form.m_notes?.value || ""
      } : null,
      clientName: form.clientName.value,
      clientEmail: form.clientEmail.value,
      clientPhone: form.clientPhone.value,
      shippingCountry: form.shippingCountry.value,
      shippingAddress: form.shippingAddress.value,
      status: paymentMethod === 'metamask' && txHash ? "Paid via Crypto" : "Pending Wire Verification"
    };

    this.orders.unshift(newOrder);
    this.saveOrders();

    // Show success view
    document.getElementById("step-1-content")?.classList.add("hidden");
    document.getElementById("step-2-content")?.classList.add("hidden");
    document.getElementById("step-3-content")?.classList.add("hidden");
    const successView = document.getElementById("order-success-view");
    if (successView) {
      document.getElementById("confirmed-order-id").textContent = newOrder.orderId;
      document.getElementById("confirmed-design-name").textContent = newOrder.designTitle;
      document.getElementById("confirmed-amount").textContent = `$${newOrder.amountUSD} USD`;
      successView.classList.remove("hidden");
    }
  }
}

export const orderSystem = new OrderSystem();
