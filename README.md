[![Build Status](https://travis-ci.org/aldeed/meteor-schema-deny.png?branch=master)](https://travis-ci.org/aldeed/meteor-schema-deny)

aldeed:schema-deny
=========================

A Meteor package that allows you to deny inserting or updating certain properties in your database by setting options in your schema. This package is currently included automatically with the aldeed:collection2 package.

## Installation

In your Meteor app directory, enter:

```
$ meteor add aldeed:schema-deny
```

## Usage

If you set `denyUpdate: true`, any collection update that modifies the field will fail. For instance:

```js
var PostSchema = new SimpleSchema({
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

Posts = new Mongo.Collection('posts');
Posts.attachSchema(PostSchema);

var postId = Posts.insert({title: 'Hello', content: 'World', createdAt: new Date()});
```

The `denyInsert` option works the same way, but for inserts. If you set `denyInsert` to true, you will need to set `optional: true` as well. 

## Contributing

Anyone is welcome to contribute. Fork, make and test your changes (`meteor test-packages ./`), and then submit a pull request.
