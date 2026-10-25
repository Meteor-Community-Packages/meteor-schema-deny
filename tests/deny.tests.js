import { expect } from 'chai';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema';

const collection = new Mongo.Collection('deny');
collection.attachSchema(new SimpleSchema({
  denyInsert: { type: String, optional: true, denyInsert: true },
  denyUpdate: { type: String, optional: true, denyUpdate: true },
}));

async function expectDenied(operation, field, type, message) {
  const error = await operation().then(() => null, (err) => err);
  expect(error, 'the write must reject').to.be.an.instanceOf(Error);
  expect(error.message).to.include(message);
  const errors = collection.simpleSchema().namedContext().validationErrors();
  expect(errors).to.have.lengthOf(1);
  expect(errors[0]).to.include({ name: field, type });
}

describe('deny', () => {
  beforeEach(async () => {
    const docs = await collection.find().fetchAsync();
    await Promise.all(docs.map((doc) => collection.removeAsync(doc._id)));
  });

  it('denies inserts with denyInsert and keeps the error message', async () => {
    await expectDenied(
      () => collection.insertAsync({ denyInsert: 'blocked' }),
      'denyInsert', 'insertNotAllowed', 'Deny insert cannot be set during an insert',
    );
    expect(await collection.find().countAsync()).to.equal(0);
  });

  it('allows inserting denyUpdate and updating denyInsert', async () => {
    const id = await collection.insertAsync({ denyUpdate: 'initial' });
    await collection.updateAsync(id, { $set: { denyInsert: 'allowed' } });
    const doc = await collection.findOneAsync(id);
    expect(doc.denyInsert).to.equal('allowed');
    expect(doc.denyUpdate).to.equal('initial');
  });

  it('denies updates and leaves the stored value unchanged', async () => {
    const id = await collection.insertAsync({ denyUpdate: 'initial' });
    await expectDenied(
      () => collection.updateAsync(id, { $set: { denyUpdate: 'blocked' } }),
      'denyUpdate', 'updateNotAllowed', 'Deny update cannot be set during an update',
    );
    expect((await collection.findOneAsync(id)).denyUpdate).to.equal('initial');
  });

  it('denies upserts that set denyUpdate', async () => {
    await expectDenied(
      () => collection.upsertAsync({ _id: 'upsert' }, { $set: { denyUpdate: 'blocked' } }),
      'denyUpdate', 'updateNotAllowed', 'Deny update cannot be set during an update',
    );
    expect(await collection.findOneAsync('upsert')).to.equal(undefined);
  });

  it('allows writes that omit denied fields', async () => {
    const id = await collection.insertAsync({});
    expect(await collection.findOneAsync(id)).to.have.property('_id', id);
  });
});
