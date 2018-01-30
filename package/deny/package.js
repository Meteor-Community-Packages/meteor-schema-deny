Package.describe({
  name: "aldeed:schema-deny",
  summary: "Deny inserting or updating certain properties through schema options",
  version: "3.0.0",
  documentation: '../../README.md',
  git: "https://github.com/aldeed/meteor-schema-deny.git"
});

Package.onUse(function(api) {
  api.use([
    'aldeed:collection2@3.0.0',
    'ecmascript@0.6.1',
  ]);

  api.mainModule('deny.js');
});
