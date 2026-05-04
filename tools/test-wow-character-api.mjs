import 'dotenv/config';
import handler from '../api/wow-character.js';

const [, , region = 'us', realm = '', name = ''] = process.argv;

if (!realm || !name) {
  console.log('Usage: node tools/test-wow-character-api.mjs us area-52 charactername');
  process.exit(1);
}

const req = {
  method: 'GET',
  query: { region, realm, name },
};

const chunks = [];
const res = {
  statusCode: 200,
  headers: {},
  setHeader(key, value) { this.headers[key] = value; },
  end(body) { chunks.push(body); },
};

await handler(req, res);

const output = chunks.join('');
console.log('Status:', res.statusCode);
try {
  const json = JSON.parse(output);
  if (!json.ok) {
    console.log('Error:', json.error);
    process.exit(res.statusCode >= 400 ? 1 : 0);
  }

  console.log('Character:', `${json.character}-${json.realm}`);
  console.log('Region:', json.region);
  console.log('Equipped items:', json.equippedItems.length);
  for (const item of json.equippedItems.slice(0, 20)) {
    console.log(`${item.slotName || item.slotType}: ${item.itemName} (${item.itemId}) ilvl ${item.itemLevel || '?'}`);
  }
} catch {
  console.log(output);
}
