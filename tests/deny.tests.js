import { expect } from 'chai';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'meteor/aldeed:simple-schema';

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
  describe('denyInsert', () => {
    const evaluateInsert = ({ error, message }) => {
      expect(error && error.message).to.equal(message);
      const validationErrors = test.simpleSchema().namedContext().validationErrors();
      expect(validationErrors.length).to.equal(1);
      const key = validationErrors[0] || {};
      expect(key.name).to.equal('denyInsert');
      expect(key.type).to.equal('insertNotAllowed');
    };

    it('denies insert (async)', async () => {
      try {
        await test.insertAsync({ denyInsert: 'foo', })
      } catch (error) {
        evaluateInsert({ error, message: 'Deny insert cannot be set during an insert in test insertAsync' })
      }
    });

    if (Meteor.isServer) {
      it('denies insert (sync)', () => {
        try {
          test.insert({ denyInsert: 'foo', });
        } catch (error) {
          evaluateInsert({ error, message: 'Deny insert cannot be set during an insert in test insert' })
        }
      });
    }
    if (Meteor.isClient) {
      it('denies insert (sync)', (done) => {
        test.insert({ denyInsert: 'foo', }, error => {
          evaluateInsert({ error, message: 'Deny insert cannot be set during an insert in test insert' })
          done()
        });
      });
    }
  });

  describe('denyUpdate', () => {
    const evaluateUpdate = ({ error, message }) => {
      expect(error && error.message).to.equal(message);

      const validationErrors = test.simpleSchema().namedContext().validationErrors();
      expect(validationErrors.length).to.equal(1);

      const key = validationErrors[0] || {};
      expect(key.name).to.equal('denyUpdate');
      expect(key.type).to.equal('updateNotAllowed');
    }

    it('denies update (async)', async () => {
      const newId = await test.insertAsync({ denyUpdate: 'foo' });
      try {
        await test.updateAsync(newId, { $set: {
            denyUpdate: 'foo',
          },
        })
      } catch (error) {
        evaluateUpdate({ error, message: 'Deny update cannot be set during an update in test updateAsync' })
      }

      // valid use case
      // Now test valid case
      await test.updateAsync(newId, {
        $set: {
          denyInsert: 'foo',
        },
      })
    });

    it('denyUpdate', (done) => {
      test.insert({
        denyUpdate: 'foo',
      }, (err, newId) => {
        expect(typeof newId).to.equal('string');

        try {
          test.update(newId, {
            $set: {
              denyUpdate: 'foo',
            },
          }, (error) => {
            expect(error && error.message).to.equal('Deny update cannot be set during an update in test update');

            const validationErrors = test.simpleSchema().namedContext().validationErrors();
            expect(validationErrors.length).to.equal(1);

            const key = validationErrors[0] || {};
            expect(key.name).to.equal('denyUpdate');
            expect(key.type).to.equal('updateNotAllowed');

            // Now test valid case
            test.update(newId, {
              $set: {
                denyInsert: 'foo',
              },
            }, (e) => {
              expect(!!e).to.equal(false);
              done();
            });
          });
        } catch (error) {

        }
      });
    });
  });
});
