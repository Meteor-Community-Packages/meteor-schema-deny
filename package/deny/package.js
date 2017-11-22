Package.describe({
  name: "aldeed:schema-deny",
  summary: "Deny inserting or updating certain properties through schema options",
  version: "2.0.1",
  documentation: '../../README.md',
  git: "https://github.com/aldeed/meteor-schema-deny.git"
});

Package.onUse(function(api) {
  api.use([
    'aldeed:collection2-core@2.0.0',
    'ecmascript@0.6.1',
  ]);

  api.mainModule('deny.js');
});
