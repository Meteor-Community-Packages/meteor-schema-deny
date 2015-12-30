Package.describe({
  name: "aldeed:schema-deny",
  summary: "Deny inserting or updating certain properties through schema options",
  version: "1.0.0",
  git: "https://github.com/aldeed/meteor-schema-deny.git"
});

Package.onUse(function(api) {
  api.use([
    'aldeed:collection2@2.7.0',
    'underscore@1.0.0',
    'minimongo@1.0.0',
    'check@1.0.0',
  ]);

  api.addFiles([
    'lib/deny.js'
  ]);
});

Package.onTest(function(api) {
  api.use([
    'aldeed:schema-deny',
    'tinytest@1.0.0',
    'underscore@1.0.0',
    'random@1.0.0',
    'mongo@1.0.0',
    'aldeed:simple-schema',
  ]);

  api.addFiles([
    'tests/deny.js'
  ]);
});
