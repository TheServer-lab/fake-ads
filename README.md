# FakeAds™ API

> The Internet's Least Legitimate Ad Network.

A real Express API that serves completely fake ads. Built for testing, demos, and confusing your coworkers.

---

## Quick Start

```bash
npm install
npm start
# → http://localhost:3000
```

For dev with auto-reload:
```bash
npm run dev
```

---

## API Endpoints

### `GET /api/ad`
Returns a single random fake ad.

```bash
curl http://localhost:3000/api/ad
```

**Query params:**

| Param   | Values                          | Default |
|---------|---------------------------------|---------|
| `size`  | `rectangle` `banner` `native`   | random  |
| `theme` | `absurd` `corporate`            | random  |

**Examples:**
```bash
# Random ad
GET /api/ad

# Rectangle only
GET /api/ad?size=rectangle

# Absurd theme, banner size
GET /api/ad?size=banner&theme=absurd

# Corporate native ad
GET /api/ad?size=native&theme=corporate
```

**Response:**
```json
{
  "id": "aircube-001",
  "brand": "AirCube®",
  "theme": "absurd",
  "size": "rectangle",
  "icon": "🌬️",
  "accentColor": "#0A90B4",
  "ctaBg": "#C0E8F0",
  "ctaColor": "#0A4A5C",
  "eyebrow": "Now Available",
  "headline": "Premium Subscription Air",
  "copy": "Why breathe free air like some kind of animal?...",
  "cta": "Inhale Now",
  "meta": {
    "network": "FakeAds™",
    "impressionId": "imp_1234567890_abc123",
    "servedAt": "2024-01-15T10:30:00.000Z",
    "disclaimer": "This ad is completely made up. The product does not exist."
  }
}
```

---

### `GET /api/ads`
Returns multiple ads at once.

```bash
GET /api/ads?count=3&theme=absurd
```

| Param   | Values  | Default |
|---------|---------|---------|
| `count` | 1–10    | 3       |
| `size`  | see above | random |
| `theme` | see above | random |

---

### Other endpoints

| Endpoint        | Description              |
|-----------------|--------------------------|
| `GET /api/brands` | List all fake brands   |
| `GET /api/themes` | List available themes  |
| `GET /api/sizes`  | List available sizes   |
| `GET /widget.js`  | Embeddable widget script |

---

## Embeddable Widget

Serve `widget.js` from the API and drop it on any page:

```html
<script src="http://localhost:3000/widget.js"></script>

<!-- Rectangle ad, absurd theme, rotates every 5s -->
<div class="fakeads-widget"
     data-size="rectangle"
     data-theme="absurd"
     data-rotate="5000">
</div>

<!-- Banner, corporate -->
<div class="fakeads-widget"
     data-size="banner"
     data-theme="corporate">
</div>

<!-- Fully random -->
<div class="fakeads-widget"></div>
```

### Widget attributes

| Attribute      | Values                        | Default |
|----------------|-------------------------------|---------|
| `data-size`    | `rectangle` `banner` `native` | random  |
| `data-theme`   | `absurd` `corporate`          | random  |
| `data-rotate`  | milliseconds (e.g. `5000`)    | no rotation |

### JavaScript API

```js
// Override the API base URL before the script loads
window.FAKEADS_API = "https://your-server.com";

// Or init manually on a dynamic element
const el = document.querySelector("#my-slot");
el.classList.add("fakeads-widget");
el.dataset.size = "native";
FakeAds.init(el);
```

---

## Ad Inventory

### Absurd theme
| Brand | Concept |
|-------|---------|
| AirCube® | Subscription air ($79/mo) |
| Blorb® | Blockchain-powered spoon |
| NothingBurger™ | Zero-ingredient food product |
| Gravel+ | Monthly artisanal rock delivery |
| ScentCoin™ | Earn crypto by smelling things |
| DreamLease™ | Subscription dream streaming |

### Corporate theme
| Brand | Concept |
|-------|---------|
| BlandCo™ | Synergizing your synergies |
| InfinitePDF | Convert feelings to PDFs |
| VagueMetrics™ | 10,000 dashboards, zero insight |
| Pivotware™ | Operating system for your roadmap's roadmap |
| Cloudify360° | Put everything in the cloud. Twice. |

---

## Add Your Own Ads

Edit `ads-data.js`. Each ad needs:

```js
{
  id: "myproduct-001",
  theme: "absurd",          // "absurd" | "corporate"
  brand: "MyProduct™",
  icon: "🦆",
  accentColor: "#FF6600",
  ctaBg: "#FF6600",
  ctaColor: "#fff",
  sizes: {
    rectangle: { eyebrow, headline, copy, cta },
    banner:    { headline, copy, cta },
    native:    { headline, copy, tag, cta },
  }
}
```

---

## Deploy to Render.com

### Option A — One-click (recommended)

1. Push this folder to a GitHub repo
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render detects `render.yaml` automatically
4. Click **Apply** — done. Your API will be live at `https://fakeads-api.onrender.com`

### Option B — Manual

1. Push to GitHub
2. Render → **New** → **Web Service** → connect repo
3. Set these:
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
   - **Environment:** Node
   - **Plan:** Free
4. Add env var: `PORT` = `10000`
5. Deploy

### After deploy

Update your widget embeds to point at your live URL:

```html
<div class="fakeads-widget"
     data-size="rectangle"
     data-theme="absurd"
     data-api="https://fakeads-api.onrender.com">
</div>
```

Or in JS:
```js
mountAd(el, {
  size: "rectangle",
  apiBase: "https://fakeads-api.onrender.com"
});
```

> **Note:** Render free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30s to wake up. Upgrade to a paid plan to keep it always-on.

### Local dev

```bash
npm install
npm run dev   # uses nodemon for auto-reload
```

---

*FakeAds™ — No advertisers were contacted. No revenue was generated. No products exist.*
