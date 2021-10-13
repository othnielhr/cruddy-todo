const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log('error when creating');
    } else {
      var pathname = (path.join(exports.dataDir, `${id}.txt`));
      // console.log(pathname);
      fs.writeFile(pathname, text, (err) => {
        if (err) {
          console.log('error writing the function');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  // items[id] = text;

};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, fileName) => {
    if (err) {
      console.log('error reading files in directory');
    } else {
      // console.log(fileName);
      var data = _.map(fileName, (value) => {
        return {id: value.split('.').slice(0, -1).join('.'), text: value.split('.').slice(0, -1).join('.')};
      });
      // console.log('array of id?', data);
      callback(null, data);
    }
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var pathname = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathname, 'utf8', (err, contents) => {
    // console.log(pathname);
    if (err) {
      callback(err, `error reading file: ${id}`);
    } else {
      callback(null, { id: id, text: contents});
    }
  });
  // old code below
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
