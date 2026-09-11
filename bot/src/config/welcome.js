const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../../../data/welcome-config.json');
const DEFAULTS = {
  enabled: true,
  title: '🚛 Welcome to BC TRUCK WORKS!',
  description: 'Welcome {user} to the TruckWorks community!\n\nPlease read the rules, choose your game roles, and get ready to hit the road.',
  footer: 'BC TRUCK WORKS • Community & Trucking',
  color: 0x5865F2,
  channelId: ''
};

function load() {
  try { return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(FILE, 'utf8')) }; }
  catch { return { ...DEFAULTS }; }
}
function save(config) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(config, null, 2));
}
function update(patch) { const config = { ...load(), ...patch }; save(config); return config; }
module.exports = { DEFAULTS, load, save, update };
