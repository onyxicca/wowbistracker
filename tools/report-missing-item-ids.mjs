import fs from 'fs';
import path from 'path';

const appPath = path.resolve('src/App.jsx');
const poolPath = path.resolve('src/data/season_items_midnight_s1.json');
const reportDir = path.resolve('tools/reports');
const reportPath = path.join(reportDir, 'missing-item-ids-midnight-s1.txt');

const NON_ITEM_NAMES = new Set([
  'head','neck','shoulders','shoulder','back','chest','wrist','wrists','hands','hand','waist','belt','legs','feet','finger','finger 1','finger 2','trinket','trinket 1','trinket 2','weapon','main hand','off hand','2h weapon',
  'blood','frost','unholy','havoc','vengeance','devourer','balance','feral','guardian','restoration','devastation','preservation','augmentation','beast mastery','marksmanship','survival','arcane','fire','brewmaster','mistweaver','windwalker','holy','protection','retribution','discipline','shadow','assassination','outlaw','subtlety','elemental','enhancement','affliction','demonology','destruction','arms','fury',
  'death knight','demon hunter','druid','evoker','hunter','mage','monk','paladin','priest','rogue','shaman','warlock','warrior'
]);

const CODE_MARKERS = [
  'classIcon', 'roles:', 'specs:', 'data:image', 'function ', 'const ', '=>', 'patchRank', 'onChange', 'sourceTypeFromBucket', 'itemSourceBucket', 'useState', 'useMemo', 'import ', 'export ', 'className', 'style:', 'return ('
];

function decodeJsString(value) {
  return value
    .replace(/\\n/g, ' ')
    .replace(/\\r/g, ' ')
    .replace(/\\t/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\`/g, '`')
    .trim();
}

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalize(value) {
  return compact(value)
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/\+\s*darkmoon sigil:[^/|,]+/gi, '')
    .replace(/['’`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugSearch(value) {
  return encodeURIComponent(compact(value));
}

function hasCodeSmell(value) {
  return CODE_MARKERS.some(marker => value.includes(marker));
}

function isLikelyNonItemName(name) {
  const n = normalize(name);
  if (!n || n.length < 3) return true;
  if (NON_ITEM_NAMES.has(n)) return true;
  if (hasCodeSmell(name)) return true;
  if (name.length > 90) return true;
  if ((name.match(/[{}=;]/g) || []).length) return true;
  if ((name.match(/:/g) || []).length > 1) return true;
  return false;
}

function isCompoundOrQualifier(name) {
  return /\s\/\s|\s\+\s|\bif dual wield\b|\bif equipped\b|\boption\b/i.test(name);
}

function inferSourceType(source) {
  const s = compact(source).toLowerCase();
  if (!s) return 'Unknown';
  if (/craft|blacksmith|tailor|leatherwork|jewelcraft|inscription|engineering/.test(s)) return 'Crafting';
  if (/raid|catalyst|vault|belo|chimaerus|vorasius|vaelgor|ezzorak|averzian|salhadaar|lightblinded|crown of the cosmos|midnight falls/.test(s)) return 'Raid';
  if (/dungeon|mythic|pit of saron|skyreach|magister|algeth|nexus point|maisara|seat of the triumvirate|windrunner spire/.test(s)) return 'Dungeon';
  if (/world|delve|ritual|special/.test(s)) return 'Other';
  return 'Unknown';
}

function sourceFileFor(type) {
  if (type === 'Raid') return 'tools/sources/season-raid-items-midnight-s1.txt';
  if (type === 'Dungeon') return 'tools/sources/season-dungeon-items-midnight-s1.txt';
  if (type === 'Crafting') return 'tools/sources/season-crafted-items-midnight-s1.txt';
  return 'tools/sources/season-special-items-midnight-s1.txt';
}

function uniquePush(map, item) {
  const key = normalize(item.name);
  if (!key) return;
  const existing = map.get(key);
  if (!existing) {
    map.set(key, { ...item, sources: new Set([item.source].filter(Boolean)), sourceTypes: new Set([item.sourceType].filter(Boolean)) });
    return;
  }
  if (item.source) existing.sources.add(item.source);
  if (item.sourceType) existing.sourceTypes.add(item.sourceType);
}

if (!fs.existsSync(appPath)) {
  console.error(`Missing ${appPath}`);
  process.exit(1);
}
if (!fs.existsSync(poolPath)) {
  console.error(`Missing ${poolPath}`);
  process.exit(1);
}

const appText = fs.readFileSync(appPath, 'utf8');
const pool = JSON.parse(fs.readFileSync(poolPath, 'utf8'));
const poolRecords = Array.isArray(pool.records) ? pool.records : [];
const poolByName = new Map(poolRecords.map(item => [normalize(item.itemName || item.name), item]).filter(([key]) => key));

const candidates = new Map();
const ignored = [];
const lowConfidence = [];

const pairRegex = /\bname\s*:\s*(["'`])((?:\\.|(?!\1)[\s\S])*?)\1\s*,\s*source\s*:\s*(["'`])((?:\\.|(?!\3)[\s\S])*?)\3/g;
let match;
while ((match = pairRegex.exec(appText))) {
  const name = compact(decodeJsString(match[2]));
  const source = compact(decodeJsString(match[4]));
  const sourceType = inferSourceType(source);
  if (isLikelyNonItemName(name)) {
    ignored.push({ name, source, reason: 'not an item-like name' });
    continue;
  }
  const item = { name, source, sourceType };
  if (isCompoundOrQualifier(name)) {
    lowConfidence.push(item);
    continue;
  }
  uniquePush(candidates, item);
}

const missing = [];
const matched = [];
for (const candidate of candidates.values()) {
  const key = normalize(candidate.name);
  const poolMatch = poolByName.get(key);
  if (poolMatch) {
    matched.push({ ...candidate, itemId: poolMatch.itemId });
  } else {
    missing.push(candidate);
  }
}

missing.sort((a, b) => a.name.localeCompare(b.name));
lowConfidence.sort((a, b) => a.name.localeCompare(b.name));
ignored.sort((a, b) => a.name.localeCompare(b.name));

function formatItem(item) {
  const sources = item.sources ? [...item.sources] : [item.source].filter(Boolean);
  const sourceTypes = item.sourceTypes ? [...item.sourceTypes] : [item.sourceType].filter(Boolean);
  const preferredType = sourceTypes.find(t => t && t !== 'Unknown') || 'Unknown';
  const sourceText = sources.length ? sources.join(' | ') : 'Unknown';
  return [
    `- ${item.name}`,
    `  Source type guess: ${preferredType}`,
    `  Source text: ${sourceText}`,
    `  Suggested source file: ${sourceFileFor(preferredType)}`,
    `  Wowhead search: https://www.wowhead.com/search?q=${slugSearch(item.name)}`,
    ''
  ].join('\n');
}

fs.mkdirSync(reportDir, { recursive: true });
const lines = [];
lines.push('Missing item IDs report v5');
lines.push(`Generated: ${new Date().toISOString()}`);
lines.push(`Pool records: ${poolRecords.length}`);
lines.push(`Exact name/source candidates: ${candidates.size}`);
lines.push(`Matched: ${matched.length}`);
lines.push(`High confidence missing: ${missing.length}`);
lines.push(`Possible/low confidence missing: ${lowConfidence.length}`);
lines.push(`Ignored likely non-items: ${ignored.length}`);
lines.push('');
lines.push('HIGH CONFIDENCE MISSING ITEMS');
lines.push(missing.length ? missing.map(formatItem).join('\n') : 'None\n');
lines.push('POSSIBLE / LOW CONFIDENCE MISSING ITEMS');
lines.push(lowConfidence.length ? lowConfidence.map(formatItem).join('\n') : 'None\n');
lines.push('IGNORED LIKELY NON-ITEMS');
lines.push(ignored.length ? ignored.slice(0, 100).map(x => `- ${x.name}${x.source ? ` | ${x.source}` : ''} | ${x.reason}`).join('\n') : 'None');
lines.push('');

fs.writeFileSync(reportPath, lines.join('\n'), 'utf8');
console.log(`Pool records: ${poolRecords.length}`);
console.log(`Exact name/source candidates: ${candidates.size}`);
console.log(`Matched: ${matched.length}`);
console.log(`High confidence missing: ${missing.length}`);
console.log(`Possible/low confidence missing: ${lowConfidence.length}`);
console.log(`Ignored likely non-items: ${ignored.length}`);
console.log(`Wrote ${path.relative(process.cwd(), reportPath)}`);
