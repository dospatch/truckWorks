const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../../data');
const FILE = path.join(DATA_DIR, 'discord-embed-config.json');

const TYPES = [
  'server_recruitment',
  'convoy',
  'vtc_recruitment',
  'changelog',
  'maintenance',
  'welcome'
];

function defaults() {
  return Object.fromEntries(TYPES.map(type => [type, { enabled: false, channelIds: [] }]));
}

function load() {
  try {
    const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    return { ...defaults(), ...data };
  } catch {
    return defaults();
  }
}

function save(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

function get(type) {
  return load()[type];
}

function set(type, channelIds, enabled = true) {
  if (!TYPES.includes(type)) throw new Error(`Unknown embed type: ${type}`);
  const data = load();
  data[type] = { enabled, channelIds: [...new Set(channelIds.filter(Boolean))] };
  save(data);
  return data[type];
}

function clear(type) {
  return set(type, [], false);
}

module.exports = { TYPES, load, get, set, clear };
