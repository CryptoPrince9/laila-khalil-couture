// Designer Laila Khalil Merchant & Setup Hub
import { paymentManager } from './paymentGateways.js';

export class DesignerHub {
  constructor(orderSystem) {
    this.orderSystem = orderSystem;
    this.modalEl = null;
  }

  init() {
    this.renderModal();
    this.attachEventListeners();
  }

  renderModal() {
    const existing = document.getElementById("designer-hub-modal");
    if (existing) existing.remove();

    const config = paymentManager.config;
    const orders = this.orderSystem ? this.orderSystem.getOrders() : [];

    const modalHTML = `
      <div id="designer-hub-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden opacity-0 transition-opacity duration-300">
        <div class="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111116] border border-[#d4af37]/30 rounded-2xl shadow-2xl p-6 md:p-8 text-neutral-200">
          
          <!-- Header -->
          <div class="flex items-center justify-between pb-5 border-b border-neutral-800">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <h3 class="text-xl font-serif tracking-widest text-[#f5ecd7] font-semibold">LAILA KHALIL ATELIER PORTAL</h3>
                <p class="text-xs text-neutral-400">Merchant Setup, Wise & MetaMask Payment Integration & Order Command</p>
              </div>
            </div>
            <button id="close-designer-hub" class="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Account Status Banner -->
          <div class="my-5 p-4 rounded-xl border ${config.isConfigured ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-amber-950/20 border-amber-500/30 text-amber-300'} flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
            <div class="flex items-center space-x-3">
              <span class="w-3 h-3 rounded-full ${config.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}"></span>
              <span><strong>Store Payment Status:</strong> ${config.isConfigured ? 'Active Merchant Accounts Verified' : 'Demo & Provisional Mode — Follow Guides Below to Connect Laila\'s Accounts'}</span>
            </div>
            <span class="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full ${config.isConfigured ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} font-medium">
              ${config.isConfigured ? 'Production Live' : 'Setup Required'}
            </span>
          </div>

          <!-- Tab Navigation -->
          <div class="flex space-x-2 border-b border-neutral-800 pb-3 mb-6 overflow-x-auto text-sm">
            <button class="hub-tab-btn active px-4 py-2 rounded-lg font-medium transition" data-tab="setup-wise">1. Wise Setup Guide</button>
            <button class="hub-tab-btn px-4 py-2 rounded-lg font-medium transition" data-tab="setup-metamask">2. MetaMask Setup Guide</button>
            <button class="hub-tab-btn px-4 py-2 rounded-lg font-medium transition" data-tab="update-credentials">3. Merchant Settings</button>
            <button class="hub-tab-btn px-4 py-2 rounded-lg font-medium transition" data-tab="manage-orders">4. Orders Dashboard (${orders.length})</button>
          </div>

          <!-- TAB 1: WISE SETUP GUIDE -->
          <div id="tab-setup-wise" class="hub-tab-pane">
            <div class="space-y-4">
              <div class="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-[#d4af37] mb-1">How Designer Laila Khalil Creates Her Wise Business Account</h4>
                    <p class="text-xs text-neutral-400 mb-4">Wise provides local international bank details in USD, EUR, GBP, and 40+ currencies with real mid-market exchange rates and low fees.</p>
                  </div>
                  <a href="https://wise.com/register" target="_blank" rel="noopener" class="px-4 py-2 bg-[#d4af37] hover:bg-[#c49e2e] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition inline-flex items-center space-x-1">
                    <span>Open Wise Website</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">1</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Sign Up as Business / Sole Trader</h5>
                    <p class="text-xs text-neutral-400">Go to wise.com, select "Business Account" under "Laila Khalil Atelier" or "Sole Proprietor". Enter your business email.</p>
                  </div>

                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">2</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Verify Identity</h5>
                    <p class="text-xs text-neutral-400">Upload your passport or national ID card and proof of address. Wise instant verification typically takes 10 to 30 minutes.</p>
                  </div>

                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">3</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Open Multi-Currency Balances</h5>
                    <p class="text-xs text-neutral-400">Click "+ Open a balance" to generate your own European IBAN (Belgium/Germany), US ACH Routing, and UK Sort Code.</p>
                  </div>

                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">4</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Copy Your Details to Tab 3</h5>
                    <p class="text-xs text-neutral-400">Copy your Wise Tag (@username), IBAN, and bank routing numbers into Tab 3 ("Merchant Settings") to activate live customer orders!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 2: METAMASK SETUP GUIDE -->
          <div id="tab-setup-metamask" class="hub-tab-pane hidden">
            <div class="space-y-4">
              <div class="bg-neutral-900/60 p-5 rounded-xl border border-neutral-800">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-[#d4af37] mb-1">How Designer Laila Khalil Creates Her MetaMask Web3 Wallet</h4>
                    <p class="text-xs text-neutral-400 mb-4">MetaMask gives Laila a non-custodial digital vault to accept Ethereum (ETH), USDT, and USDC directly with zero chargebacks and instant global settlement.</p>
                  </div>
                  <a href="https://metamask.io/download/" target="_blank" rel="noopener" class="px-4 py-2 bg-[#d4af37] hover:bg-[#c49e2e] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition inline-flex items-center space-x-1">
                    <span>Get MetaMask</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                  </a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">1</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Install MetaMask Extension or App</h5>
                    <p class="text-xs text-neutral-400">Add the MetaMask browser extension to Chrome/Brave/Edge or download the official app on iPhone/Android from metamask.io.</p>
                  </div>

                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">2</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Create Wallet & Back Up 12 Words</h5>
                    <p class="text-xs text-neutral-400">Click "Create New Wallet". Carefully write down the 12-word Secret Recovery Phrase on a physical notebook. Keep it confidential!</p>
                  </div>

                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">3</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Copy Your Public Address</h5>
                    <p class="text-xs text-neutral-400">Click on your account name to copy your public Ethereum address (starts with <code>0x...</code>). This is completely safe to share publicly.</p>
                  </div>

                  <div class="p-4 bg-black/40 rounded-lg border border-neutral-800/80">
                    <span class="inline-block w-6 h-6 rounded-full bg-[#d4af37]/20 text-[#d4af37] text-center font-bold text-xs leading-6 mb-2">4</span>
                    <h5 class="text-sm font-semibold text-white mb-1">Paste Into Tab 3 & Start Receiving</h5>
                    <p class="text-xs text-neutral-400">Paste your <code>0x...</code> address in Tab 3 below. The website will immediately update its MetaMask payment buttons and QR codes!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 3: UPDATE CREDENTIALS -->
          <div id="tab-update-credentials" class="hub-tab-pane hidden">
            <form id="merchant-config-form" class="space-y-6">
              <!-- Wise Section -->
              <div class="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <h4 class="text-sm font-semibold uppercase tracking-wider text-[#d4af37] mb-3 flex items-center space-x-2">
                  <span>Wise Multi-Currency Bank Details</span>
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label class="block text-neutral-400 mb-1">Payee Business / Designer Name</label>
                    <input type="text" name="wisePayeeName" value="${config.wise.payeeName}" class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" required />
                  </div>
                  <div>
                    <label class="block text-neutral-400 mb-1">Wise Tag (e.g. @lailakhalil)</label>
                    <input type="text" name="wiseTag" value="${config.wise.wiseTag}" class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" required />
                  </div>
                  <div>
                    <label class="block text-neutral-400 mb-1">Wise Account Email</label>
                    <input type="email" name="wiseEmail" value="${config.wise.wiseEmail}" class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" required />
                  </div>
                  <div>
                    <label class="block text-neutral-400 mb-1">EUR / Intl IBAN</label>
                    <input type="text" name="wiseIban" value="${config.wise.ibanEUR}" class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" required />
                  </div>
                  <div>
                    <label class="block text-neutral-400 mb-1">SWIFT / BIC Code</label>
                    <input type="text" name="wiseSwift" value="${config.wise.swiftBIC}" class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" />
                  </div>
                  <div>
                    <label class="block text-neutral-400 mb-1">US ACH Routing Number</label>
                    <input type="text" name="wiseRoutingUSD" value="${config.wise.routingUSD}" class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white focus:border-[#d4af37] focus:outline-none" />
                  </div>
                </div>
              </div>

              <!-- MetaMask Section -->
              <div class="p-5 bg-neutral-900/60 rounded-xl border border-neutral-800">
                <h4 class="text-sm font-semibold uppercase tracking-wider text-[#d4af37] mb-3 flex items-center space-x-2">
                  <span>MetaMask Web3 Crypto Wallet</span>
                </h4>
                <div class="text-xs space-y-3">
                  <div>
                    <label class="block text-neutral-400 mb-1">Laila's Public Ethereum / Polygon Address (0x...)</label>
                    <input type="text" name="ethAddress" value="${config.metamask.ethAddress}" placeholder="0x..." class="w-full bg-black/60 border border-neutral-700 rounded-lg p-2.5 text-white font-mono focus:border-[#d4af37] focus:outline-none" required />
                    <p class="text-[11px] text-neutral-500 mt-1">This address will receive ETH, USDT, and USDC payments directly into Laila's wallet.</p>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-2">
                <p id="save-msg" class="text-xs text-emerald-400 opacity-0 transition-opacity">Settings saved successfully! Website updated in real-time.</p>
                <button type="submit" class="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#c49e2e] hover:to-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition shadow-lg shadow-[#d4af37]/20">
                  Save & Update Live Store
                </button>
              </div>
            </form>
          </div>

          <!-- TAB 4: ORDERS DASHBOARD -->
          <div id="tab-manage-orders" class="hub-tab-pane hidden">
            <div class="space-y-4">
              <div class="flex items-center justify-between pb-2">
                <p class="text-xs text-neutral-400">Total client orders received: <strong class="text-white">${orders.length}</strong></p>
                <div class="space-x-2">
                  <button id="export-orders-btn" class="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition">Export Orders (JSON)</button>
                  <button id="clear-orders-btn" class="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs rounded-lg transition">Clear Demo Orders</button>
                </div>
              </div>

              ${orders.length === 0 ? `
                <div class="p-8 text-center bg-neutral-900/40 rounded-xl border border-neutral-800">
                  <p class="text-neutral-400 text-sm">No customer orders placed yet.</p>
                  <p class="text-xs text-neutral-500 mt-1">When clients order designs via Wise or MetaMask, their measurements, contact info, and payment records will appear here.</p>
                </div>
              ` : `
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs text-neutral-300 border-collapse">
                    <thead>
                      <tr class="border-b border-neutral-800 text-neutral-400 bg-neutral-900/80">
                        <th class="p-3">Order Ref</th>
                        <th class="p-3">Design</th>
                        <th class="p-3">Client</th>
                        <th class="p-3">Size/Fitting</th>
                        <th class="p-3">Amount</th>
                        <th class="p-3">Gateway</th>
                        <th class="p-3">Status</th>
                        <th class="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-800">
                      ${orders.map(o => `
                        <tr class="hover:bg-neutral-900/50">
                          <td class="p-3 font-mono text-[#d4af37]">${o.orderId}</td>
                          <td class="p-3 font-medium text-white">${o.designTitle}</td>
                          <td class="p-3">${o.clientName}<br><span class="text-neutral-500">${o.clientEmail}</span></td>
                          <td class="p-3">${o.sizingType === 'bespoke' ? `<span class="text-amber-400 font-semibold">Bespoke Fitting</span>` : o.standardSize}</td>
                          <td class="p-3 font-semibold">$${o.amountUSD}</td>
                          <td class="p-3">
                            <span class="px-2 py-0.5 rounded text-[10px] ${o.paymentMethod === 'metamask' ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-700/40' : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40'}">
                              ${o.paymentMethod.toUpperCase()}
                            </span>
                          </td>
                          <td class="p-3">
                            <span class="px-2 py-0.5 rounded text-[10px] bg-amber-900/30 text-amber-300 border border-amber-700/30">
                              ${o.status || 'Received'}
                            </span>
                          </td>
                          <td class="p-3">
                            <button class="view-order-details text-[#d4af37] hover:underline" data-id="${o.orderId}">View Spec</button>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modalEl = document.getElementById("designer-hub-modal");
  }

  attachEventListeners() {
    const openBtns = document.querySelectorAll(".open-designer-hub-btn");
    openBtns.forEach(btn => btn.addEventListener("click", () => this.open()));

    const closeBtn = document.getElementById("close-designer-hub");
    if (closeBtn) closeBtn.addEventListener("click", () => this.close());

    // Tab switching
    const tabBtns = document.querySelectorAll(".hub-tab-btn");
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active", "text-[#d4af37]", "border-b-2", "border-[#d4af37]"));
        btn.classList.add("active", "text-[#d4af37]", "border-b-2", "border-[#d4af37]");

        const tabId = btn.getAttribute("data-tab");
        document.querySelectorAll(".hub-tab-pane").forEach(pane => pane.classList.add("hidden"));
        const target = document.getElementById(`tab-${tabId}`);
        if (target) target.classList.remove("hidden");
      });
    });

    // Handle form save
    const form = document.getElementById("merchant-config-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const updated = {
          wise: {
            ...paymentManager.config.wise,
            payeeName: formData.get("wisePayeeName"),
            wiseTag: formData.get("wiseTag"),
            wiseEmail: formData.get("wiseEmail"),
            ibanEUR: formData.get("wiseIban"),
            swiftBIC: formData.get("wiseSwift"),
            routingUSD: formData.get("wiseRoutingUSD")
          },
          metamask: {
            ...paymentManager.config.metamask,
            ethAddress: formData.get("ethAddress")
          }
        };

        paymentManager.saveConfig(updated);
        const msg = document.getElementById("save-msg");
        if (msg) {
          msg.classList.remove("opacity-0");
          setTimeout(() => msg.classList.add("opacity-0"), 4000);
        }

        // Re-render modal to reflect new state
        setTimeout(() => {
          this.renderModal();
          this.attachEventListeners();
          this.open();
          // switch to tab 3
          document.querySelector('[data-tab="update-credentials"]')?.click();
        }, 800);
      });
    }

    // Export orders
    const exportBtn = document.getElementById("export-orders-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const orders = this.orderSystem ? this.orderSystem.getOrders() : [];
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `laila_khalil_orders_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      });
    }

    // Clear demo orders
    const clearBtn = document.getElementById("clear-orders-btn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear demo orders?")) {
          localStorage.removeItem("laila_khalil_orders");
          this.renderModal();
          this.attachEventListeners();
          this.open();
          document.querySelector('[data-tab="manage-orders"]')?.click();
        }
      });
    }
  }

  open() {
    this.renderModal();
    this.attachEventListeners();
    const modal = document.getElementById("designer-hub-modal");
    if (modal) {
      modal.classList.remove("hidden");
      setTimeout(() => modal.classList.remove("opacity-0"), 20);
    }
  }

  close() {
    const modal = document.getElementById("designer-hub-modal");
    if (modal) {
      modal.classList.add("opacity-0");
      setTimeout(() => modal.classList.add("hidden"), 300);
    }
  }
}
