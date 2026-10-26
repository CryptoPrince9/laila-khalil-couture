// Main Application Entry Point
import { HauteCouture3DScene } from './threeScene.js';
import { videoController } from './videoController.js';
import { orderSystem } from './orderSystem.js';
import { DesignerHub } from './designerHub.js';
import { soundEngine } from './audioEngine.js';
import { paymentManager } from './paymentGateways.js';

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize 3D Haute Couture Scene
  const scene3D = new HauteCouture3DScene('canvas3d-container');
  scene3D.init();

  // 2. Initialize Video Controller
  videoController.init();

  // 3. Initialize Designer Merchant & Setup Hub
  const designerHub = new DesignerHub(orderSystem);
  designerHub.init();

  // 4. Bind Audio Toggle
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  const eqBars = document.querySelectorAll(".eq-bar");

  soundToggleBtn?.addEventListener("click", () => {
    const isPlaying = soundEngine.toggle();
    if (isPlaying) {
      soundToggleBtn.classList.add("text-[#d4af37]", "border-[#d4af37]");
      eqBars.forEach(bar => bar.classList.add("animate-pulse"));
    } else {
      soundToggleBtn.classList.remove("text-[#d4af37]", "border-[#d4af37]");
      eqBars.forEach(bar => bar.classList.remove("animate-pulse"));
    }
  });

  // 5. 3D Fabric Switcher Buttons
  const fabricBtns = document.querySelectorAll(".fabric-btn");
  fabricBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      fabricBtns.forEach(b => b.classList.remove("border-[#d4af37]", "bg-[#d4af37]/20", "text-white"));
      btn.classList.add("border-[#d4af37]", "bg-[#d4af37]/20", "text-white");
      const fabricKey = btn.getAttribute("data-fabric");
      scene3D.setFabric(fabricKey);
    });
  });

  // 6. 3D Lighting Preset Buttons
  const lightBtns = document.querySelectorAll(".light-preset-btn");
  lightBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      lightBtns.forEach(b => b.classList.remove("border-[#d4af37]", "bg-[#d4af37]/20", "text-[#d4af37]"));
      btn.classList.add("border-[#d4af37]", "bg-[#d4af37]/20", "text-[#d4af37]");
      const preset = btn.getAttribute("data-preset");
      scene3D.setLightingPreset(preset);
    });
  });

  // 7. 3D View Mode Toggle (Mannequin vs 3D Video Carousel)
  const modeMannequinBtn = document.getElementById("mode-mannequin-btn");
  const modeCarouselBtn = document.getElementById("mode-carousel-btn");

  modeMannequinBtn?.addEventListener("click", () => {
    modeMannequinBtn.classList.add("bg-[#d4af37]", "text-black");
    modeMannequinBtn.classList.remove("bg-neutral-800", "text-neutral-300");
    modeCarouselBtn.classList.remove("bg-[#d4af37]", "text-black");
    modeCarouselBtn.classList.add("bg-neutral-800", "text-neutral-300");
    scene3D.setMode('mannequin');
  });

  modeCarouselBtn?.addEventListener("click", () => {
    modeCarouselBtn.classList.add("bg-[#d4af37]", "text-black");
    modeCarouselBtn.classList.remove("bg-neutral-800", "text-neutral-300");
    modeMannequinBtn.classList.remove("bg-[#d4af37]", "text-black");
    modeMannequinBtn.classList.add("bg-neutral-800", "text-neutral-300");
    scene3D.setMode('video-carousel');
  });

  // 8. Order Triggers
  document.querySelectorAll(".trigger-bespoke-order").forEach(btn => {
    btn.addEventListener("click", () => {
      const designId = btn.getAttribute("data-id") || "look-01";
      orderSystem.openOrderModal(designId);
    });
  });

  // 9. Currency Selector
  const currencySelect = document.getElementById("global-currency-select");
  if (currencySelect) {
    currencySelect.addEventListener("change", (e) => {
      const curr = e.target.value;
      const rates = { USD: 1, EUR: 0.92, GBP: 0.79, EGP: 48.75, ETH: 1 / 2650 };
      const symbols = { USD: '$', EUR: '€', GBP: '£', EGP: 'E£', ETH: 'Ξ' };

      document.querySelectorAll(".runway-card").forEach(card => {
        const id = card.getAttribute("data-id");
        const design = DESIGNS_DATA.find(d => d.id === id);
        if (design) {
          const converted = curr === 'ETH' ? (design.priceUSD * rates[curr]).toFixed(3) : Math.round(design.priceUSD * rates[curr]).toLocaleString();
          const priceEl = card.querySelector(".font-mono.font-semibold");
          if (priceEl) priceEl.textContent = `${symbols[curr]}${converted} ${curr}`;
        }
      });
    });
  }

  // 10. Web3 Quick Connect in Nav
  const navWalletBtn = document.getElementById("nav-connect-wallet-btn");
  if (navWalletBtn) {
    navWalletBtn.addEventListener("click", async () => {
      const res = await paymentManager.connectMetaMask();
      if (res.success) {
        navWalletBtn.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
          <span>${res.address.slice(0, 6)}...${res.address.slice(-4)}</span>
        `;
        navWalletBtn.classList.add("border-emerald-500/50", "text-emerald-300");
      } else {
        alert(res.message);
      }
    });
  }

  // 11. Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  mobileMenuBtn?.addEventListener("click", () => {
    mobileNav?.classList.toggle("hidden");
  });

  // 12. Smooth Scroll Anchor offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          mobileNav?.classList.add("hidden");
        }
      }
    });
  });
});
