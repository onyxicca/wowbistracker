import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");

function readEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error("Missing .env file in the project root.");
  }

  const env = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
    env[key] = value;
  }

  return env;
}

async function requestToken(clientId, clientSecret) {
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token request failed (${response.status}): ${body}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("Token response did not include an access token.");
  }

  return data.access_token;
}

async function requestItem({ token, region, namespace, locale, itemId }) {
  const host = `https://${region}.api.blizzard.com`;
  const url = new URL(`/data/wow/item/${itemId}`, host);
  url.searchParams.set("namespace", namespace);
  url.searchParams.set("locale", locale);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Item request failed (${response.status}): ${body}`);
  }

  return response.json();
}

async function main() {
  const env = readEnv(envPath);
  const clientId = env.BLIZZARD_CLIENT_ID;
  const clientSecret = env.BLIZZARD_CLIENT_SECRET;
  const region = env.BLIZZARD_REGION || "us";
  const namespace = env.BLIZZARD_NAMESPACE || `static-${region}`;
  const locale = env.BLIZZARD_LOCALE || "en_US";
  const itemId = Number(env.BLIZZARD_TEST_ITEM_ID || 19019);

  if (!clientId || !clientSecret) {
    throw new Error("BLIZZARD_CLIENT_ID and BLIZZARD_CLIENT_SECRET are required in .env.");
  }

  const token = await requestToken(clientId, clientSecret);
  const item = await requestItem({ token, region, namespace, locale, itemId });

  console.log("Blizzard API connection successful.");
  console.log(`Region: ${region}`);
  console.log(`Namespace: ${namespace}`);
  console.log(`Locale: ${locale}`);
  console.log(`Test item: ${item.name} (${item.id})`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
