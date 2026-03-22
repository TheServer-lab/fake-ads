/**
 * FakeAds™ Widget — widget.js
 * Drop this script on any page to render real (fake) ads.
 *
 * Usage:
 *   <script src="http://localhost:3000/widget.js"></script>
 *   <div class="fakeads-widget"
 *        data-size="rectangle"
 *        data-theme="absurd"
 *        data-rotate="5000">
 *   </div>
 */

(function () {
  const API_BASE =
    (typeof FAKEADS_API !== "undefined" && FAKEADS_API) ||
    document.currentScript?.src?.replace("/widget.js", "") ||
    "http://localhost:3000";

  const CSS = `
.fakeads-root *{box-sizing:border-box;margin:0;padding:0;font-family:inherit}
.fakeads-root{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;position:relative;border:1px solid #E0DAD2;border-radius:6px;overflow:hidden;background:#fff;transition:border-color .15s;cursor:default}
.fakeads-root:hover{border-color:#C0B8B0}
.fakeads-chrome{display:flex;align-items:center;justify-content:space-between;padding:3px 6px;background:#F8F5F0;border-bottom:1px solid #E8E2D8}
.fakeads-label{font-size:9px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9A9088}
.fakeads-choices{display:flex;align-items:center;gap:3px;font-size:9px;color:#B0AAA3}
.fakeads-i{width:10px;height:10px;background:#B0AAA3;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-style:italic;font-weight:700;font-size:7px;color:#fff}
.fakeads-close{position:absolute;top:22px;right:6px;width:16px;height:16px;background:rgba(0,0,0,.08);border-radius:50%;border:none;cursor:pointer;font-size:10px;color:#888;display:flex;align-items:center;justify-content:center;z-index:2;transition:background .15s;line-height:1}
.fakeads-close:hover{background:rgba(0,0,0,.18)}
.fakeads-body{transition:opacity .3s}
.fakeads-body.fa-fade{opacity:0}
.fakeads-progress{height:2px;background:#F0EBE4}
.fakeads-bar{height:100%;width:0;transition:width linear}
.fakeads-foot{font-size:8px;color:#C0B8B0;padding:3px 8px;text-align:right}

/* rectangle */
.fa-rect .fakeads-body{padding:1rem 1rem 0.75rem;min-height:140px;display:flex;flex-direction:column;justify-content:space-between}
.fa-eyebrow{font-size:9px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin-bottom:.3rem}
.fa-headline{font-size:1.15rem;line-height:1.2;font-weight:600;margin-bottom:.4rem}
.fa-copy{font-size:.72rem;line-height:1.5;color:#666;margin-bottom:.6rem;flex:1}
.fa-cta{display:inline-block;padding:5px 13px;border-radius:4px;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:none;cursor:pointer}
.fa-brand-line{font-size:9px;color:#B0AAA3;margin-top:5px}

/* banner */
.fa-banner .fakeads-body{display:flex;align-items:center;gap:.75rem;padding:.55rem .75rem;min-height:54px}
.fa-banner-icon{font-size:1.6rem;flex-shrink:0;width:36px;text-align:center}
.fa-banner-text{flex:1}
.fa-banner-headline{font-size:.9rem;font-weight:600;line-height:1.2}
.fa-banner-copy{font-size:.68rem;color:#888;line-height:1.4}

/* native */
.fa-native .fakeads-body{display:flex;align-items:flex-start;gap:.9rem;padding:.85rem 1rem}
.fa-native-icon{width:44px;height:44px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0}
.fa-native-content{flex:1}
.fa-native-headline{font-size:.92rem;font-weight:600;line-height:1.3;margin-bottom:4px}
.fa-native-copy{font-size:.72rem;color:#666;line-height:1.5}
.fa-native-meta{display:flex;align-items:center;justify-content:space-between;margin-top:8px}
.fa-native-tag{font-size:.65rem;color:#B0AAA3}
`;

  function injectStyles() {
    if (document.getElementById("fakeads-styles")) return;
    const s = document.createElement("style");
    s.id = "fakeads-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  async function fetchAd(size, theme) {
    const params = new URLSearchParams();
    if (size) params.set("size", size);
    if (theme) params.set("theme", theme);
    const res = await fetch(`${API_BASE}/api/ad?${params}`);
    if (!res.ok) throw new Error(`FakeAds API error: ${res.status}`);
    return res.json();
  }

  function imgSrc(ad) {
    if (!ad.image) return null;
    // If image path is relative, resolve against API base
    return ad.image.startsWith("http") ? ad.image : `${API_BASE}${ad.image}`;
  }

  function renderRectangle(ad, container) {
    container.classList.add("fa-rect");
    const src = imgSrc(ad);
    if (src) {
      container.innerHTML = `
        <div class="fakeads-chrome">
          <span class="fakeads-label">Advertisement</span>
          <span class="fakeads-choices"><span class="fakeads-i">i</span> AdChoices</span>
        </div>
        <button class="fakeads-close" title="Close">✕</button>
        <div class="fakeads-body" style="padding:0">
          <img src="${src}" alt="${ad.brand}" style="width:100%;display:block;max-height:260px;object-fit:cover;object-position:top" />
        </div>
        <div class="fakeads-progress"><div class="fakeads-bar" style="background:${ad.accentColor}"></div></div>
        <div class="fakeads-foot">fakeads.net · proudly useless</div>`;
    } else {
      container.innerHTML = `
        <div class="fakeads-chrome">
          <span class="fakeads-label">Advertisement</span>
          <span class="fakeads-choices"><span class="fakeads-i">i</span> AdChoices</span>
        </div>
        <button class="fakeads-close" title="Close">✕</button>
        <div class="fakeads-body">
          <div>
            <div class="fa-eyebrow" style="color:${ad.accentColor}">${ad.eyebrow || ""}</div>
            <div class="fa-headline">${ad.headline}</div>
            <div class="fa-copy">${ad.copy}</div>
          </div>
          <div>
            <button class="fa-cta" style="background:${ad.ctaBg};color:${ad.ctaColor}">${ad.cta}</button>
            <div class="fa-brand-line">${ad.brand} · fakeads.net</div>
          </div>
        </div>
        <div class="fakeads-progress"><div class="fakeads-bar" style="background:${ad.accentColor}"></div></div>
        <div class="fakeads-foot">fakeads.net · proudly useless</div>`;
    }
  }

  function renderBanner(ad, container) {
    container.classList.add("fa-banner");
    const src = imgSrc(ad);
    if (src) {
      container.innerHTML = `
        <div class="fakeads-chrome">
          <span class="fakeads-label">Advertisement</span>
          <span class="fakeads-choices"><span class="fakeads-i">i</span> AdChoices</span>
        </div>
        <button class="fakeads-close" title="Close">✕</button>
        <div class="fakeads-body" style="padding:0">
          <img src="${src}" alt="${ad.brand}" style="width:100%;display:block;max-height:90px;object-fit:cover;object-position:top" />
        </div>
        <div class="fakeads-progress"><div class="fakeads-bar" style="background:${ad.accentColor}"></div></div>`;
    } else {
      container.innerHTML = `
        <div class="fakeads-chrome">
          <span class="fakeads-label">Advertisement</span>
          <span class="fakeads-choices"><span class="fakeads-i">i</span> AdChoices</span>
        </div>
        <button class="fakeads-close" title="Close">✕</button>
        <div class="fakeads-body">
          <div class="fa-banner-icon">${ad.icon}</div>
          <div class="fa-banner-text">
            <div class="fa-banner-headline">${ad.headline}</div>
            <div class="fa-banner-copy">${ad.copy}</div>
          </div>
          <button class="fa-cta" style="background:${ad.ctaBg};color:${ad.ctaColor}">${ad.cta}</button>
        </div>
        <div class="fakeads-progress"><div class="fakeads-bar" style="background:${ad.accentColor}"></div></div>`;
    }
  }

  function renderNative(ad, container) {
    container.classList.add("fa-native");
    const src = imgSrc(ad);
    const thumb = src
      ? `<img src="${src}" alt="${ad.brand}" style="width:72px;height:72px;object-fit:cover;object-position:top;border-radius:8px;flex-shrink:0" />`
      : `<div class="fa-native-icon" style="background:${ad.ctaBg}">${ad.icon}</div>`;
    container.innerHTML = `
      <div class="fakeads-chrome">
        <span class="fakeads-label">Sponsored Content</span>
        <span class="fakeads-choices"><span class="fakeads-i">i</span> AdChoices</span>
      </div>
      <div class="fakeads-body">
        ${thumb}
        <div class="fa-native-content">
          <div class="fa-native-headline">${ad.headline}</div>
          <div class="fa-native-copy">${ad.copy}</div>
          <div class="fa-native-meta">
            <span class="fa-native-tag">${ad.tag || "Sponsored · " + ad.brand}</span>
            <button class="fa-cta" style="background:${ad.ctaBg};color:${ad.ctaColor}">${ad.cta}</button>
          </div>
        </div>
      </div>
      <div class="fakeads-progress"><div class="fakeads-bar" style="background:${ad.accentColor}"></div></div>`;
  }

  function animateProgress(container, durationMs) {
    const bar = container.querySelector(".fakeads-bar");
    if (!bar) return;
    bar.style.transition = "none";
    bar.style.width = "0%";
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        bar.style.transition = `width ${durationMs}ms linear`;
        bar.style.width = "100%";
      })
    );
  }

  function attachClose(container) {
    const btn = container.querySelector(".fakeads-close");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      container.style.opacity = "0.25";
      container.style.pointerEvents = "none";
      setTimeout(() => {
        container.style.opacity = "";
        container.style.pointerEvents = "";
      }, 1500);
    });
  }

  async function initWidget(el) {
    const size = el.dataset.size || null;
    const theme = el.dataset.theme || null;
    const rotate = parseInt(el.dataset.rotate) || 0;

    el.classList.add("fakeads-root");

    async function loadAd(animate) {
      try {
        const ad = await fetchAd(size, theme);
        const resolvedSize = ad.size;

        if (animate) {
          const body = el.querySelector(".fakeads-body");
          if (body) {
            body.classList.add("fa-fade");
            await new Promise((r) => setTimeout(r, 300));
          }
          el.innerHTML = "";
          el.className = "fakeads-root";
        }

        if (resolvedSize === "rectangle") renderRectangle(ad, el);
        else if (resolvedSize === "banner") renderBanner(ad, el);
        else renderNative(ad, el);

        attachClose(el);
        if (rotate > 0) animateProgress(el, rotate);
      } catch (err) {
        el.innerHTML = `<div style="padding:1rem;font-size:.75rem;color:#999;text-align:center">
          FakeAds™ failed to load.<br><span style="font-size:.65rem;color:#ccc">Is the API running?</span>
        </div>`;
        console.warn("[FakeAds]", err.message);
      }
    }

    await loadAd(false);

    if (rotate > 0) {
      setInterval(() => loadAd(true), rotate);
    }
  }

  function init() {
    injectStyles();
    document.querySelectorAll(".fakeads-widget").forEach(initWidget);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose manual init for dynamic use
  window.FakeAds = { init: initWidget, API_BASE };
})();
