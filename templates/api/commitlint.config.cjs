// .cjs on purpose: package.json declares "type": "module", which makes a .js
// file an ES module — but this config (and the shared @repo/commitlint-config
// it extends) uses CommonJS module.exports. With the .js extension commitlint
// failed to load the config at all, silently killing the commit-msg hook.
module.exports = { extends: ['@repo/commitlint-config'] }
