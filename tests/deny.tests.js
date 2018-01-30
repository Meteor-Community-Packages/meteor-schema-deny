import expect from 'expect';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const test = new Mongo.Collection('test');
test.attachSchema(new SimpleSchema({
  denyInsert: {
    type: String,
    optional: true,
    denyInsert: true,
  },
  denyUpdate: {
    type: String,
    optional: true,
    denyUpdate: true,
  },
}));

describe('deny', () => {
  it('denyInsert', (done) => {
    test.insert({
      denyInsert: 'foo',
    }, (error) => {
      expect(error && error.message).toBe('Deny insert cannot be set during an insert in test insert');

      const validationErrors = test.simpleSchema().namedContext().validationErrors();
      expect(validationErrors.length).toBe(1);

      const key = validationErrors[0] || {};
      expect(key.name).toBe('denyInsert');
      expect(key.type).toBe('insertNotAllowed');

      done();
    });
  });

  it('denyUpdate', (done) => {
    test.insert({
      denyUpdate: 'foo',
    }, (err, newId) => {
      expect(typeof newId).toBe('string');

      test.update(newId, {
        $set: {
          denyUpdate: 'foo',
        },
      }, (error) => {
        expect(error && error.message).toBe('Deny update cannot be set during an update in test update');

        const validationErrors = test.simpleSchema().namedContext().validationErrors();
        expect(validationErrors.length).toBe(1);

        const key = validationErrors[0] || {};
        expect(key.name).toBe('denyUpdate');
        expect(key.type).toBe('updateNotAllowed');

        // Now test valid case
        test.update(newId, {
          $set: {
            denyInsert: 'foo',
          },
        }, (e) => {
          expect(!!e).toBe(false);
          done();
        });
      });
    });
  });
});
