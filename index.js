// a webpack plugin that prepend UserScript metadata

// helper function to shallow clone object
function cloneObject(obj) {
  return Object.assign({}, obj);
}

// helper function to replace keys from objB to objA
function extendObject(objA, objB) {
  return Object.assign({}, objA, objB);
}

// helper function to convert metadata json to metadata string
function jsonToMetadata(json) {
  const metadata = Object.keys(json).reduce((acc, key) => {
    switch (key) {
      case 'description':
      case 'name':
      case 'namespace':
      case 'version':
      case 'run-at':
        return `${acc}// @${key} ${json[key]}\n`;
      case 'matches':
      case 'extramatches':
        return json[key].reduce((current, subkey) => (
          `${current}// @match ${subkey}\n`
        ), acc);
      default:
        return acc;
    }
  }, '// ==UserScript==\n');
  return `${metadata}// ==/UserScript==\n\n`;
}

module.exports = function prependMetadata(source, map) {
  this.cacheable();
  const metadata = jsonToMetadata(
    extendObject(
      cloneObject(
        this.commonMetadata
      ),
      this.setting.replace
    )
  );
  this.callback(null, metadata + source, map);
};
