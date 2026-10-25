[![CircleCI](https://circleci.com/gh/aldeed/meteor-schema-deny/tree/master.svg?style=svg)](https://circleci.com/gh/aldeed/meteor-schema-deny/tree/master)

# aldeed:schema-deny

A Meteor package that allows you to deny inserting or updating certain properties in your database by setting options in your schema.

## Installation

In your Meteor app directory, enter:

```bash
meteor add aldeed:schema-deny
```

## Compatibility

Supports `aldeed:collection2` 4.x from 4.0.4 and 5.x, with `aldeed:simple-schema` 1.13.1, 2.x, or 3.x where supported by Collection2. Use SimpleSchema 3 with Collection2 5. Collection2 5 requires Meteor 3.1.2+ and `insertAsync`, `updateAsync`, and `upsertAsync`.

The test app uses Meteor 3.5.3. CI tests Collection2 4.0.4 / SimpleSchema 1.13.1, Collection2 4.2.2 / SimpleSchema 2.0.0, and Collection2 5.0.0 / SimpleSchema 3.0.0 on the server and in a headless browser.

## Usage

If you set `denyUpdate: true`, any collection update that modifies the field will fail. For instance:

```js
const postSchema = new SimpleSchema({
  title: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    denyUpdate: true
  }
});

const Posts = new Mongo.Collection('posts');
Posts.attachSchema(postSchema);

const postId = await Posts.insertAsync({title: 'Hello', content: 'World', createdAt: new Date()});
```

The `denyInsert` option works the same way, but for inserts. If you set `denyInsert` to true, you will need to set `optional: true` as well.

## Contributing

Anyone is welcome to contribute. Fork, make and test your changes (`meteor test-packages ./`), and then submit a pull request.

### Running Tests

```bash
cd tests
npm i && npm test
```

### Running Tests in Watch Mode

```bash
cd tests
npm i && npm run test:watch
```
