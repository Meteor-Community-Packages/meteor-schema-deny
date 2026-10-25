import { expect } from 'chai';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema';

// Local collections exercise the real Collection2 adapter on both the client
// and server, without depending on DDP allow/deny rules.
const collection = new Mongo.Collection(null);
collection.attachSchema(new SimpleSchema({
  insertOnly: { type: String, optional: true, denyUpdate: true },
  updateOnly: { type: String, optional: true, denyInsert: true },
}));

async function expectDenied(operation, field, type, message) {
  let rejection;
  try {
    await operation();
  } catch (error) {
    rejection = error;
  }
  // A successful write must fail the test too.
  expect(rejection).to.be.instanceOf(Error);
  expect(rejection.message).to.include(message);
  expect(rejection.invalidKeys).to.deep.include({ name: field, type, value: 'blocked' });
}

describe('schema-deny compatibility', () => {
  beforeEach(async () => { await collection.removeAsync({}); });

  it('rejects denyInsert fields without storing a document', async () => {
    await expectDenied(
      () => collection.insertAsync({ updateOnly: 'blocked' }),
      'updateOnly', 'insertNotAllowed', 'cannot be set during an insert',
    );
    expect(await collection.find().countAsync()).to.equal(0);
  });

  it('rejects denyUpdate fields without changing the document', async () => {
    const id = await collection.insertAsync({ insertOnly: 'original' });
    await expectDenied(
      () => collection.updateAsync(id, { $set: { insertOnly: 'blocked' } }),
      'insertOnly', 'updateNotAllowed', 'cannot be set during an update',
    );
    expect((await collection.findOneAsync(id)).insertOnly).to.equal('original');
  });

  it('rejects denyUpdate fields during an upsert that would insert', async () => {
    await expectDenied(
      () => collection.upsertAsync({ _id: 'missing' }, { $set: { insertOnly: 'blocked' } }),
      'insertOnly', 'updateNotAllowed', 'cannot be set during an update',
    );
    expect(await collection.find().countAsync()).to.equal(0);
  });

  it('rejects denyUpdate fields during an upsert that would update', async () => {
    const id = await collection.insertAsync({ insertOnly: 'original' });
    await expectDenied(
      () => collection.upsertAsync(id, { $set: { insertOnly: 'blocked' } }),
      'insertOnly', 'updateNotAllowed', 'cannot be set during an update',
    );
    expect((await collection.findOneAsync(id)).insertOnly).to.equal('original');
  });

  it('allows inserts and updates when their respective deny flag is absent', async () => {
    const id = await collection.insertAsync({ insertOnly: 'allowed' });
    await collection.updateAsync(id, { $set: { updateOnly: 'allowed' } });
    const document = await collection.findOneAsync(id);
    expect(document.insertOnly).to.equal('allowed');
    expect(document.updateOnly).to.equal('allowed');
  });
});
