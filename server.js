const express = require("express");
const cors = require("cors");
const ads = require("./ads-data");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve the embeddable widget script
app.use("/widget.js", express.static("widget.js"));

// Serve ad images and other static assets
app.use("/public", express.static("public"));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_SIZES = ["rectangle", "banner", "native"];
const VALID_THEMES = ["absurd", "corporate"];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatAd(ad, size) {
  const sizeData = ad.sizes[size];
  return {
    id: ad.id,
    brand: ad.brand,
    theme: ad.theme,
    size,
    icon: ad.icon,
    accentColor: ad.accentColor,
    ctaBg: ad.ctaBg,
    ctaColor: ad.ctaColor,
    ...sizeData,
    meta: {
      network: "FakeAds™",
      impressionId: `imp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      servedAt: new Date().toISOString(),
      disclaimer: "This ad is completely made up. The product does not exist.",
    },
  };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /api/ad
// Query params:
//   size  = rectangle | banner | native  (default: random)
//   theme = absurd | corporate           (default: random)
app.get("/api/ad", (req, res) => {
  let { size, theme } = req.query;

  // Validate size
  if (size && !VALID_SIZES.includes(size)) {
    return res.status(400).json({
      error: "Invalid size",
      valid: VALID_SIZES,
      tip: "Try ?size=rectangle or leave it out for a random size.",
    });
  }

  // Validate theme
  if (theme && !VALID_THEMES.includes(theme)) {
    return res.status(400).json({
      error: "Invalid theme",
      valid: VALID_THEMES,
      tip: "Try ?theme=absurd or ?theme=corporate",
    });
  }

  // Filter by theme
  let pool = theme ? ads.filter((a) => a.theme === theme) : ads;

  if (pool.length === 0) {
    return res.status(404).json({ error: "No ads found for that combination." });
  }

  // Pick a random ad from the pool
  const ad = pickRandom(pool);

  // Pick a random size if not specified
  const resolvedSize = size || pickRandom(VALID_SIZES);

  res.json(formatAd(ad, resolvedSize));
});

// GET /api/ads — return multiple ads at once
// Query params:
//   count = 1-10  (default: 3)
//   size, theme   (same as above)
app.get("/api/ads", (req, res) => {
  let { size, theme, count } = req.query;

  const n = Math.min(Math.max(parseInt(count) || 3, 1), 10);

  if (size && !VALID_SIZES.includes(size)) {
    return res.status(400).json({ error: "Invalid size", valid: VALID_SIZES });
  }
  if (theme && !VALID_THEMES.includes(theme)) {
    return res.status(400).json({ error: "Invalid theme", valid: VALID_THEMES });
  }

  let pool = theme ? ads.filter((a) => a.theme === theme) : ads;

  if (pool.length === 0) {
    return res.status(404).json({ error: "No ads found for that combination." });
  }

  const results = Array.from({ length: n }, () => {
    const ad = pickRandom(pool);
    const resolvedSize = size || pickRandom(VALID_SIZES);
    return formatAd(ad, resolvedSize);
  });

  res.json({ count: results.length, ads: results });
});

// GET /api/themes — list available themes
app.get("/api/themes", (req, res) => {
  res.json({ themes: VALID_THEMES });
});

// GET /api/sizes — list available sizes
app.get("/api/sizes", (req, res) => {
  res.json({ sizes: VALID_SIZES });
});

// GET /api/brands — list all fake brands
app.get("/api/brands", (req, res) => {
  const brands = ads.map((a) => ({
    id: a.id.split("-")[0],
    brand: a.brand,
    theme: a.theme,
    icon: a.icon,
  }));
  res.json({ count: brands.length, brands });
});

// Root — friendly welcome
app.get("/", (req, res) => {
  res.json({
    name: "FakeAds™ API",
    tagline: "The Internet's Least Legitimate Ad Network",
    version: "1.0.0",
    endpoints: {
      "GET /api/ad": "Fetch a random fake ad",
      "GET /api/ad?size=rectangle": "Filter by size: rectangle | banner | native",
      "GET /api/ad?theme=absurd": "Filter by theme: absurd | corporate",
      "GET /api/ads?count=5": "Fetch multiple ads at once (max 10)",
      "GET /api/brands": "List all fake brands",
      "GET /api/themes": "List available themes",
      "GET /api/sizes": "List available sizes",
      "GET /widget.js": "Embeddable JS widget",
    },
    disclaimer: "No actual advertisers were harmed. No revenue was generated. No products exist.",
  });
});

// 404 catch-all
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    hint: "Try GET /api/ad or visit / for the full endpoint list.",
  });
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════╗
  ║  FakeAds™ API — running on port ${PORT}  ║
  ║  http://localhost:${PORT}                ║
  ║  The Internet's least legitimate      ║
  ║  ad network is now open for business. ║
  ╚═══════════════════════════════════════╝
  `);
});
