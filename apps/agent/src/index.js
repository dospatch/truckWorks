'use strict';

const env = require('./config/env');

console.log('==============================================');
console.log(' BC TRUCK WORKS SERVER AGENT');
console.log('==============================================');

console.log(`API: ${env.apiUrl}`);
console.log(`Server ID: ${env.serverId || 'not configured'}`);
console.log(`Agent ID: ${env.agentId || 'not configured'}`);
console.log(`Version: ${env.agentVersion}`);
console.log(`Heartbeat: ${env.heartbeatInterval}ms`);

console.log('');
console.log('Agent foundation initialized.');
console.log('Server communication will be enabled in the next phase.');
