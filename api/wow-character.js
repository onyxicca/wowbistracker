const tokenCache = new Map();
const responseCache = new Map();

const REGION_CONFIG = {
  us: { apiHost: 'https://us.api.blizzard.com', namespace: 'profile-us', locale: 'en_US' },
  eu: { apiHost: 'https://eu.api.blizzard.com', namespace: 'profile-eu', locale: 'en_GB' },
  kr: { apiHost: 'https://kr.api.blizzard.com', namespace: 'profile-kr', locale: 'ko_KR' },
  tw: { apiHost: 'https://tw.api.blizzard.com', namespace: 'profile-tw', locale: 'zh_TW' },
};

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function normalizeRegion(value) {
  const region = String(value || 'us').trim().toLowerCase();
  return REGION_CONFIG[region] ? region : null;
}

function normalizeCharacter(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9à-ÿ' -]/gi, '')
    .replace(/\s+/g, '-');
}

function normalizeRealm(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function fetchJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs || 9000);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text.slice(0, 300) };
      }
    }

    if (!response.ok) {
      const error = new Error(data?.detail || data?.message || `Request failed with ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function getAccessToken(region) {
  const cached = tokenCache.get(region);
  if (cached && cached.expiresAt > Date.now() + 30000) return cached.token;

  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const error = new Error('Missing Blizzard API credentials on the server.');
    error.status = 500;
    throw error;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const data = await fetchJson('https://oauth.battle.net/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    timeoutMs: 9000,
  });

  const token = data?.access_token;
  if (!token) {
    const error = new Error('Blizzard token response did not include an access token.');
    error.status = 502;
    throw error;
  }

  tokenCache.set(region, {
    token,
    expiresAt: Date.now() + Math.max(60, Number(data.expires_in || 3600) - 60) * 1000,
  });

  return token;
}

function simplifyEquipment(data) {
  const equippedItems = Array.isArray(data?.equipped_items) ? data.equipped_items : [];

  return equippedItems.map((entry) => ({
    slotType: entry?.slot?.type || '',
    slotName: entry?.slot?.name || '',
    itemId: entry?.item?.id || null,
    itemName: entry?.name || '',
    itemLevel: entry?.level?.value || null,
    quality: entry?.quality?.type || '',
    inventoryType: entry?.inventory_type?.type || '',
    binding: entry?.binding?.type || '',
    tooltipUrl: entry?.item?.id ? `https://www.wowhead.com/item=${entry.item.id}` : '',
  })).filter((item) => item.itemId && item.itemName);
}

async function loadCharacterEquipment({ region, realm, character }) {
  const config = REGION_CONFIG[region];
  const token = await getAccessToken(region);
  const url = new URL(`${config.apiHost}/profile/wow/character/${realm}/${character}/equipment`);
  url.searchParams.set('namespace', config.namespace);
  url.searchParams.set('locale', config.locale);

  const data = await fetchJson(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    timeoutMs: 9000,
  });

  return {
    character: data?.character?.name || character,
    realm: data?.character?.realm?.name || realm,
    realmSlug: realm,
    region,
    namespace: config.namespace,
    locale: config.locale,
    fetchedAt: new Date().toISOString(),
    equippedItems: simplifyEquipment(data),
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { ok: false, error: 'Method not allowed.' });
  }

  try {
    const query = req.query || {};
    const region = normalizeRegion(query.region);
    const realm = normalizeRealm(query.realm);
    const character = normalizeCharacter(query.name || query.character);

    if (!region) return send(res, 400, { ok: false, error: 'Unsupported region. Use us, eu, kr, or tw.' });
    if (!realm) return send(res, 400, { ok: false, error: 'Realm is required.' });
    if (!character) return send(res, 400, { ok: false, error: 'Character name is required.' });

    const cacheKey = `${region}:${realm}:${character}`;
    const cached = responseCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return send(res, 200, { ok: true, cached: true, ...cached.data });
    }

    const data = await loadCharacterEquipment({ region, realm, character });
    responseCache.set(cacheKey, { data, expiresAt: Date.now() + 60000 });

    return send(res, 200, { ok: true, cached: false, ...data });
  } catch (error) {
    const status = error.status && error.status >= 400 && error.status < 600 ? error.status : 500;
    const safeMessage = status === 404
      ? 'Character equipment was not found. Check region, realm, and character name.'
      : error.message || 'Character lookup failed.';

    return send(res, status, { ok: false, error: safeMessage });
  }
}
