// Runway Video Showcase Controller & Theater Modal
import { DESIGNS_DATA, orderSystem } from './orderSystem.js';

export class VideoController {
  constructor() {
    this.activeTheaterVideo = null;
    this.isSlowMo = false;
  }

  init() {
    this.renderVideoShowcase();
    this.attachVideoListeners();
  }

  renderVideoShowcase() {
    const container = document.getElementById("runway-grid-container");
    if (!container) return;

    container.innerHTML = DESIGNS_DATA.map((design, index) => `
      <div class="runway-card group relative bg-neutral-900/70 border border-neutral-800 hover:border-[#d4af37]/60 rounded-2xl overflow-hidden transition-all duration-500 shadow-xl flex flex-col" data-id="${design.id}">
        
        <!-- Video Canvas Box -->
        <div class="relative w-full aspect-[9/16] sm:aspect-[3/4] bg-black overflow-hidden">
          <video 
            src="${design.videoSrc}" 
            class="runway-video w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            loop 
            muted 
            playsinline
            preload="metadata"
          ></video>

          <!-- Top Badges -->
          <div class="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span class="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-[#d4af37] uppercase">
              Look 0${index + 1}
            </span>
            <span class="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-mono tracking-widest text-white/90">
              Runway 2026
            </span>
          </div>

          <!-- Video Controls Overlay -->
          <div class="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
            <div class="flex items-center space-x-1.5">
              <button class="play-toggle-btn p-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:text-[#d4af37] transition" title="Play / Pause">
                <svg class="w-4 h-4 play-icon" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                <svg class="w-4 h-4 pause-icon hidden" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
              </button>
              <button class="mute-toggle-btn p-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:text-[#d4af37] transition" title="Audio Toggle">
                <svg class="w-4 h-4 sound-off" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
                <svg class="w-4 h-4 sound-on hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
              </button>
              <button class="slowmo-toggle-btn px-2 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-mono text-white hover:text-[#d4af37] transition" title="Catwalk Slow-Mo">
                0.5x
              </button>
            </div>

            <button class="theater-open-btn p-2 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white hover:text-[#d4af37] transition" title="Open Cinematic Theater">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
            </button>
          </div>

          <!-- Video Progress Bar -->
          <div class="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div class="video-progress-bar h-full bg-[#d4af37] w-0 transition-all duration-100"></div>
          </div>
        </div>

        <!-- Garment Spec & Order Info -->
        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
          <div>
            <div class="flex items-baseline justify-between mb-1">
              <h3 class="text-lg font-serif font-bold text-white tracking-wide group-hover:text-[#d4af37] transition-colors">${design.title}</h3>
              <span class="text-sm font-mono font-semibold text-[#d4af37]">$${design.priceUSD}</span>
            </div>
            <p class="text-xs text-neutral-400 font-serif italic mb-2">${design.subtitle}</p>
            <p class="text-xs text-neutral-300 line-clamp-2">${design.description}</p>
          </div>

          <div class="pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <div class="flex justify-between">
              <span>Fabric:</span>
              <span class="text-neutral-200 text-right truncate max-w-[60%]">${design.fabric}</span>
            </div>
            <div class="flex justify-between">
              <span>Craft Time:</span>
              <span class="text-neutral-200">${design.productionDays} Days Hand-Cut</span>
            </div>
          </div>

          <div class="pt-1 flex items-center space-x-2">
            <button class="order-direct-btn flex-1 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b38f2a] hover:from-[#e5c14d] hover:to-[#d4af37] text-black font-semibold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-[#d4af37]/10" data-id="${design.id}">
              Order Look
            </button>
            <button class="theater-open-btn px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl transition" data-id="${design.id}" title="Inspect Details">
              Details
            </button>
          </div>
        </div>

      </div>
    `).join('');
  }

  attachVideoListeners() {
    const cards = document.querySelectorAll(".runway-card");
    cards.forEach(card => {
      const video = card.querySelector(".runway-video");
      const playBtn = card.querySelector(".play-toggle-btn");
      const playIcon = card.querySelector(".play-icon");
      const pauseIcon = card.querySelector(".pause-icon");
      const muteBtn = card.querySelector(".mute-toggle-btn");
      const soundOff = card.querySelector(".sound-off");
      const soundOn = card.querySelector(".sound-on");
      const slowmoBtn = card.querySelector(".slowmo-toggle-btn");
      const progressBar = card.querySelector(".video-progress-bar");
      const designId = card.getAttribute("data-id");

      // Auto play on hover / desktop mouseenter
      card.addEventListener("mouseenter", () => {
        video.play().catch(() => {});
        playIcon.classList.add("hidden");
        pauseIcon.classList.remove("hidden");
      });

      card.addEventListener("mouseleave", () => {
        video.pause();
        playIcon.classList.remove("hidden");
        pauseIcon.classList.add("hidden");
      });

      // Play / Pause toggle
      playBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.paused) {
          video.play();
          playIcon.classList.add("hidden");
          pauseIcon.classList.remove("hidden");
        } else {
          video.pause();
          playIcon.classList.remove("hidden");
          pauseIcon.classList.add("hidden");
        }
      });

      // Mute toggle
      muteBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        soundOff.classList.toggle("hidden", !video.muted);
        soundOn.classList.toggle("hidden", video.muted);
      });

      // Slowmo toggle
      slowmoBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.playbackRate === 1.0) {
          video.playbackRate = 0.5;
          slowmoBtn.classList.add("text-[#d4af37]", "border-[#d4af37]");
          slowmoBtn.textContent = "0.5x";
        } else {
          video.playbackRate = 1.0;
          slowmoBtn.classList.remove("text-[#d4af37]", "border-[#d4af37]");
          slowmoBtn.textContent = "1.0x";
        }
      });

      // Progress bar
      video.addEventListener("timeupdate", () => {
        if (video.duration) {
          const pct = (video.currentTime / video.duration) * 100;
          if (progressBar) progressBar.style.width = `${pct}%`;
        }
      });

      // Open Theater modal
      card.querySelectorAll(".theater-open-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          this.openTheaterModal(designId);
        });
      });

      // Order look direct
      card.querySelector(".order-direct-btn")?.addEventListener("click", (e) => {
        e.stopPropagation();
        orderSystem.openOrderModal(designId);
      });
    });
  }

  openTheaterModal(designId) {
    const design = DESIGNS_DATA.find(d => d.id === designId) || DESIGNS_DATA[0];
    const existing = document.getElementById("runway-theater-modal");
    if (existing) existing.remove();

    const theaterHTML = `
      <div id="runway-theater-modal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-xl opacity-0 transition-opacity duration-300">
        <div class="relative w-full max-w-5xl h-[90vh] bg-[#0c0c10] border border-[#d4af37]/40 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
          
          <!-- Close button -->
          <button id="close-theater-btn" class="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 border border-white/20 text-white hover:text-[#d4af37] transition">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <!-- Left: Full Height Video -->
          <div class="w-full md:w-3/5 h-1/2 md:h-full bg-black relative flex items-center justify-center">
            <video id="theater-video" src="${design.videoSrc}" class="w-full h-full object-contain" loop autoplay playsinline></video>
            
            <!-- Video Overlay Controls -->
            <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-xs">
              <div class="flex items-center space-x-3">
                <button id="theater-play-btn" class="text-white hover:text-[#d4af37]">Play/Pause</button>
                <button id="theater-mute-btn" class="text-white hover:text-[#d4af37]">Unmute</button>
                <button id="theater-speed-btn" class="text-neutral-400 hover:text-white">Speed: 1.0x</button>
              </div>
              <span class="text-[10px] font-mono text-[#d4af37] uppercase">Runway Ultra HD</span>
            </div>
          </div>

          <!-- Right: Haute Couture Spec Sheet -->
          <div class="w-full md:w-2/5 h-1/2 md:h-full p-6 md:p-8 overflow-y-auto space-y-6 text-neutral-200 flex flex-col justify-between">
            <div class="space-y-4">
              <div>
                <span class="text-[10px] uppercase tracking-widest text-[#d4af37] font-semibold">LAILA KHALIL • RUNWAY ARCHIVE</span>
                <h2 class="text-2xl font-serif font-bold text-white mt-1">${design.title}</h2>
                <p class="text-xs text-neutral-400 font-serif italic">${design.subtitle}</p>
                <p class="text-xl font-mono font-semibold text-[#d4af37] mt-2">$${design.priceUSD} USD</p>
              </div>

              <div class="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs space-y-2">
                <h4 class="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">Design Architecture & Narrative</h4>
                <p class="text-neutral-400 leading-relaxed">${design.description}</p>
              </div>

              <!-- Textile Science & Manufacturing Specs -->
              <div class="space-y-2 text-xs">
                <h4 class="text-[11px] font-semibold uppercase tracking-wider text-[#d4af37]">Atelier Tech Pack Specifications</h4>
                <div class="p-3 bg-neutral-900/40 rounded-lg border border-neutral-800 space-y-1.5 text-[11px]">
                  <p><strong class="text-neutral-300">Shell Fabric:</strong> <span class="text-neutral-400">${design.fabric}</span></p>
                  <p><strong class="text-neutral-300">Textile Weight:</strong> <span class="text-neutral-400">${design.weight}</span></p>
                  <p><strong class="text-neutral-300">Stitch Classification:</strong> <span class="text-neutral-400">${design.stitch}</span></p>
                  <p><strong class="text-neutral-300">Hand-Tailoring Duration:</strong> <span class="text-neutral-400">${design.productionDays} Business Days</span></p>
                  <p><strong class="text-neutral-300">Circularity Pledge:</strong> <span class="text-neutral-400">100% Biodegradable Pure Silk / Wool mono-materiality</span></p>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-neutral-800 space-y-2">
              <button id="theater-order-btn" class="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#e6ca65] hover:from-[#c49e2e] hover:to-[#d4af37] text-black font-semibold text-xs uppercase tracking-widest rounded-xl transition shadow-xl shadow-[#d4af37]/20">
                Commission This Garment (Wise / MetaMask)
              </button>
              <p class="text-[10px] text-center text-neutral-500">Includes complimentary worldwide DHL Express delivery and custom bespoke pattern fitting.</p>
            </div>
          </div>

        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', theaterHTML);
    const modal = document.getElementById("runway-theater-modal");
    const video = document.getElementById("theater-video");

    setTimeout(() => modal.classList.remove("opacity-0"), 20);

    document.getElementById("close-theater-btn")?.addEventListener("click", () => {
      modal.classList.add("opacity-0");
      setTimeout(() => modal.remove(), 300);
    });

    document.getElementById("theater-play-btn")?.addEventListener("click", () => {
      if (video.paused) video.play(); else video.pause();
    });

    document.getElementById("theater-mute-btn")?.addEventListener("click", (e) => {
      video.muted = !video.muted;
      e.target.textContent = video.muted ? "Unmute" : "Mute";
    });

    document.getElementById("theater-speed-btn")?.addEventListener("click", (e) => {
      if (video.playbackRate === 1.0) {
        video.playbackRate = 0.5;
        e.target.textContent = "Speed: 0.5x (Catwalk)";
      } else {
        video.playbackRate = 1.0;
        e.target.textContent = "Speed: 1.0x";
      }
    });

    document.getElementById("theater-order-btn")?.addEventListener("click", () => {
      modal.classList.add("opacity-0");
      setTimeout(() => {
        modal.remove();
        orderSystem.openOrderModal(design.id);
      }, 300);
    });
  }
}

export const videoController = new VideoController();
