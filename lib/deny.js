// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions({
  denyInsert: Match.Optional(Boolean),
  denyUpdate: Match.Optional(Boolean),
});

// Define validation error messages
if (!SimpleSchema.version || SimpleSchema.version < 2) {
  SimpleSchema.messages({
    insertNotAllowed: '[label] cannot be set during an insert',
    updateNotAllowed: '[label] cannot be set during an update'
  });
}

Collection2.on('schema.attached', function (collection, ss) {
  if (ss.version >= 2) {
    ss.messageBox.messages({
      insertNotAllowed: '{{label}} cannot be set during an insert',
      updateNotAllowed: '{{label}} cannot be set during an update'
    });
  }

  ss.addValidator(function() {
    if (!this.isSet) return;

    var def = this.definition;

    if (def.denyInsert && this.isInsert) return 'insertNotAllowed';
    if (def.denyUpdate && (this.isUpdate || this.isUpsert)) return 'updateNotAllowed';
  });
});
