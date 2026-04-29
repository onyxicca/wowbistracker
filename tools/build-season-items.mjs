import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DEFAULT_OUT = "src/data/season_items_midnight_s1.json";
const DEFAULT_IDS = "tools/season-item-ids-midnight-s1.txt";
const DEFAULT_NAMES = "tools/season-item-names-midnight-s1.txt";

function parseArgs(argv) {
  const args = new Map();
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) continue;
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args.set(key.slice(2), true);
    } else {
      args.set(key.slice(2), next);
      i += 1;
    }
  }
  return args;
}

async function exists(file) {
  try {
    await fs.access(path.resolve(ROOT, file));
    return true;
  } catch {
    return false;
  }
}

async function loadEnv() {
  const file = path.resolve(ROOT, ".env");
  const raw = await fs.readFile(file, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function config() {
  const region = process.env.BLIZZARD_REGION || "us";
  return {
    clientId: process.env.BLIZZARD_CLIENT_ID,
    clientSecret: process.env.BLIZZARD_CLIENT_SECRET,
    region,
    namespace: process.env.BLIZZARD_NAMESPACE || `static-${region}`,
    locale: process.env.BLIZZARD_LOCALE || "en_US",
    tokenUrl: `https://${region}.battle.net/oauth/token`,
    apiBase: `https://${region}.api.blizzard.com`,
  };
}

async function getToken(cfg) {
  if (!cfg.clientId || !cfg.clientSecret) {
    throw new Error("Missing BLIZZARD_CLIENT_ID or BLIZZARD_CLIENT_SECRET in .env");
  }

  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const auth = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");
  const response = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  return json.access_token;
}

async function apiGet(cfg, token, endpoint, params = {}) {
  const url = new URL(`${cfg.apiBase}${endpoint}`);
  url.searchParams.set("namespace", params.namespace || cfg.namespace);
  url.searchParams.set("locale", params.locale || cfg.locale);
  for (const [key, value] of Object.entries(params)) {
    if (key === "namespace" || key === "locale" || value === undefined || value === null) continue;
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`${endpoint} failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeName(value) {
  return cleanText(value).toLowerCase().replace(/\s+/g, " ");
}

function slugify(value) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || null;
}

function inferSourceType(value) {
  const src = cleanText(value).toLowerCase();
  if (!src) return "Unknown";
  if (src.includes("craft")) return "Crafting";
  if (src.includes("dungeon") || src.includes("mythic") || src.includes("m+")) return "Dungeon";
  if (src.includes("raid") || src.includes("boss") || src.includes("vault") || src.includes("catalyst") || src.includes("tier")) return "Raid";
  if (src.includes("delve") || src.includes("world") || src.includes("renown") || src.includes("prey") || src.includes("pvp")) return "Other";
  return "Unknown";
}

function cleanSourceLabel(value) {
  const src = cleanText(value);
  if (!src) return "Unknown";
  return src.replace(/\s*\/\s*/g, " / ").replace(/\s+/g, " ");
}

async function readIdInput(file) {
  if (!(await exists(file))) return [];
  const raw = await fs.readFile(path.resolve(ROOT, file), "utf8");
  const rows = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [id, sourceType, sourceLabel, sourceId] = trimmed.split("|").map((v) => v?.trim() || "");
    if (!/^\d+$/.test(id)) continue;
    rows.push({
      itemId: Number(id),
      sourceType: sourceType || "Unknown",
      sourceLabel: sourceLabel || "Unknown",
      sourceId: sourceId || null,
    });
  }
  return rows;
}

async function readNameInput(file) {
  if (!(await exists(file))) return [];
  const raw = await fs.readFile(path.resolve(ROOT, file), "utf8");
  const rows = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [itemName, sourceType, sourceLabel, sourceId] = trimmed.split("|").map((v) => v?.trim() || "");
    if (!itemName) continue;
    rows.push({
      itemName,
      sourceType: sourceType || "Unknown",
      sourceLabel: sourceLabel || "Unknown",
      sourceId: sourceId || null,
    });
  }
  return rows;
}

async function extractNamesFromApp(file) {
  if (!file || !(await exists(file))) return [];
  const raw = await fs.readFile(path.resolve(ROOT, file), "utf8");
  const withoutImages = raw.replace(/data:image\/[a-zA-Z+.-]+;base64,[A-Za-z0-9+/=]+/g, "");
  const byName = new Map();

  const addRow = (itemName, sourceLabel = "Unknown") => {
    const name = cleanText(itemName);
    if (!name) return;
    if (/^(Raid|Dungeon|Other|Crafting|Unknown|Manual|Equivalent|Alternative|Strong Alternative|Counts as BiS)$/i.test(name)) return;
    if (/^[A-Z][a-z]+\s+[A-Z][a-z]+$/.test(name) && name.length < 18) return;
    const label = cleanSourceLabel(sourceLabel);
    const key = normalizeName(name);
    const existing = byName.get(key);
    if (existing && existing.sourceLabel !== "Unknown") return;
    byName.set(key, {
      itemName: name,
      sourceType: inferSourceType(label),
      sourceLabel: label,
      sourceId: slugify(label),
    });
  };

  const objectPattern = /\b([a-z0-9_]+)\s*:\s*\{\s*name\s*:\s*["']([^"']{4,100})["']\s*,\s*source\s*:\s*["']([^"']*)["']/gi;
  let objectMatch;
  while ((objectMatch = objectPattern.exec(withoutImages))) {
    addRow(objectMatch[2], objectMatch[3]);
  }

  const itemNamePattern = /\bitemName\s*:\s*["']([^"']{4,100})["']/g;
  let itemMatch;
  while ((itemMatch = itemNamePattern.exec(withoutImages))) {
    addRow(itemMatch[1], "Unknown");
  }

  return [...byName.values()];
}

async function searchItemByName(cfg, token, itemName) {
  const json = await apiGet(cfg, token, "/data/wow/search/item", {
    "name.en_US": itemName,
    _pageSize: 10,
  });

  const results = Array.isArray(json.results) ? json.results : [];
  const wanted = normalizeName(itemName);
  const exact = results.find((entry) => normalizeName(entry?.data?.name?.[cfg.locale] || entry?.data?.name?.en_US || entry?.data?.name) === wanted);
  const selected = exact || results[0];
  const id = selected?.data?.id;
  return Number.isFinite(id) ? Number(id) : null;
}

async function fetchItem(cfg, token, itemId) {
  return apiGet(cfg, token, `/data/wow/item/${itemId}`);
}

async function fetchMedia(cfg, token, itemId) {
  try {
    const json = await apiGet(cfg, token, `/data/wow/media/item/${itemId}`);
    const asset = Array.isArray(json.assets) ? json.assets.find((item) => item.key === "icon") || json.assets[0] : null;
    return asset?.value || null;
  } catch {
    return null;
  }
}

function itemNameFromApi(item) {
  if (typeof item.name === "string") return item.name;
  return item.name?.en_US || Object.values(item.name || {})[0] || "Unknown Item";
}

function statName(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.name || value.type?.name || value.stat?.name || value.display?.display_string || value.display_string || "";
}

function collectStatNames(apiItem) {
  const groups = [
    apiItem.stats,
    apiItem.preview_item?.stats,
    apiItem.preview_item?.item?.stats,
    apiItem.preview_item?.quality?.stats,
  ];
  const out = [];
  for (const group of groups) {
    if (!Array.isArray(group)) continue;
    for (const stat of group) {
      const name = statName(stat).trim();
      if (name) out.push(name);
    }
  }
  return [...new Set(out)];
}

function primaryStatsFromNames(names) {
  const blob = names.map(v => String(v || "").toLowerCase()).join(" ");
  return ["strength", "agility", "intellect"].filter(stat => blob.includes(stat));
}

function normalizeItem(apiItem, icon, source) {
  const inventoryType = apiItem.inventory_type || null;
  const itemClass = apiItem.item_class || null;
  const itemSubclass = apiItem.item_subclass || null;
  const quality = apiItem.quality || null;
  const statNames = collectStatNames(apiItem);
  const primaryStats = primaryStatsFromNames(statNames);

  return {
    itemId: apiItem.id,
    itemName: itemNameFromApi(apiItem),
    slot: inventoryType?.type || null,
    inventoryType: inventoryType?.name || inventoryType?.type || null,
    sourceType: source.sourceType || "Unknown",
    sourceId: source.sourceId || null,
    sourceLabel: source.sourceLabel || "Unknown",
    bossName: source.bossName || null,
    raidName: source.raidName || null,
    dungeonName: source.dungeonName || null,
    itemClass: itemClass?.name || null,
    itemSubclass: itemSubclass?.name || null,
    quality: quality?.name || null,
    primaryStats,
    statNames,
    icon,
  };
}

function dedupeRows(rows) {
  const seen = new Set();
  const out = [];
  for (const row of rows) {
    const key = row.itemId ? `id:${row.itemId}` : `name:${normalizeName(row.itemName)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

async function ensureTemplate(file, sample) {
  if (await exists(file)) return;
  await fs.mkdir(path.dirname(path.resolve(ROOT, file)), { recursive: true });
  await fs.writeFile(path.resolve(ROOT, file), sample, "utf8");
}

async function main() {
  const args = parseArgs(process.argv);
  const idFile = args.get("ids") || DEFAULT_IDS;
  const nameFile = args.get("names") || DEFAULT_NAMES;
  const outFile = args.get("out") || DEFAULT_OUT;
  const appFile = args.get("from-app") || null;

  await loadEnv();
  const cfg = config();
  const token = await getToken(cfg);

  await ensureTemplate(DEFAULT_IDS, "# itemId|sourceType|sourceLabel|sourceId\n# 19019|Other|API smoke test|test\n");
  await ensureTemplate(DEFAULT_NAMES, "# itemName|sourceType|sourceLabel|sourceId\n# Thunderfury, Blessed Blade of the Windseeker|Other|API smoke test|test\n");

  const idRows = await readIdInput(idFile);
  const nameRows = await readNameInput(nameFile);
  const appRows = await extractNamesFromApp(appFile);
  const inputRows = dedupeRows([...idRows, ...nameRows, ...appRows]);

  if (!inputRows.length) {
    console.log(`No item input found. Add IDs to ${idFile}, names to ${nameFile}, or run with --from-app src/App.jsx`);
    return;
  }

  const records = [];
  const failed = [];

  for (const source of inputRows) {
    try {
      let itemId = source.itemId || null;
      if (!itemId && source.itemName) {
        itemId = await searchItemByName(cfg, token, source.itemName);
      }
      if (!itemId) {
        failed.push({ itemName: source.itemName || null, reason: "No item ID found" });
        continue;
      }
      const apiItem = await fetchItem(cfg, token, itemId);
      const icon = await fetchMedia(cfg, token, itemId);
      records.push(normalizeItem(apiItem, icon, { ...source, itemId }));
      console.log(`Added ${itemNameFromApi(apiItem)} (${itemId})`);
    } catch (error) {
      failed.push({ itemId: source.itemId || null, itemName: source.itemName || null, reason: error.message });
    }
  }

  records.sort((a, b) => a.itemName.localeCompare(b.itemName));
  const payload = {
    seasonId: "midnight-s1",
    generatedAt: new Date().toISOString(),
    records,
    failed,
  };

  await fs.mkdir(path.dirname(path.resolve(ROOT, outFile)), { recursive: true });
  await fs.writeFile(path.resolve(ROOT, outFile), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${records.length} records to ${outFile}`);
  const sourceCounts = records.reduce((acc, item) => {
    const key = item.sourceType || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  console.log("By source type:", sourceCounts);
  if (failed.length) console.log(`Failed: ${failed.length} rows. Check failed entries in the output JSON.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
