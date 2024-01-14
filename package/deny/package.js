Package.describe({
  name: "aldeed:schema-deny",
  summary: "Deny inserting or updating certain properties through schema options",
  version: "3.1.0",
  documentation: '../../README.md',
  git: "https://github.com/aldeed/meteor-schema-deny.git"
});

Package.onUse(function(api) {
  api.versionsFrom(['1.12.1', '2.3.6', '2.8.1']);
  api.use([
    'aldeed:collection2@3.5.0',
    'ecmascript',
  ]);

  api.mainModule('deny.js');
});
