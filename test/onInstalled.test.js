const assert = require('assert');

let listener;
const setCalls = [];

// minimal chrome mock
global.chrome = {
  runtime: { onInstalled: { addListener: fn => { listener = fn; } } },
  storage: { local: { set: obj => setCalls.push(obj) } },
  webNavigation: { onHistoryStateUpdated: { addListener: () => {} } },
  scripting: { executeScript: () => {} }
};

// load background.js which registers the listener
require('../background.js');

// simulate install
listener({ reason: 'install' });
assert.deepStrictEqual(setCalls, [{ urns: [] }], 'install should reset list');

// reset calls and simulate update
setCalls.length = 0;
listener({ reason: 'update' });
assert.deepStrictEqual(setCalls, [], 'update should not reset list');

console.log('All tests passed.');
