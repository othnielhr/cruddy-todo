const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const promisified = Promise.promisifyAll(fs);
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
  // var result = [];
  return promisified.readdirAsync(exports.dataDir)
    .then((files) => {
      // console.log('passed in ', files);
      var fileArray = files.map((file) => {
        var id = file.slice(0, 5); // 00001
        return promisified.readFileAsync(path.join(exports.dataDir, file), 'utf8')
          .then((data) => {
            // console.log('data ', data);
            //result.push({id: id, text: data});
            return {id: id, text: data};
          });
      });
      // console.log('result is ', result);
      Promise.all(fileArray).then((values) => {
        console.log('values ', values);
        // console.log('fileArray ', fileArray);
        callback(null, values);
      });
    })
    .catch((err) => {
      console.log('error', err);
    });

  // return new Promise(function(resolve, reject) {
  //   fs.readdir(exports.dataDir, (err, fileName) => {
  //     if (err) {
  //       console.log('error reading files in directory');
  //       reject(err);
  //     } else {
  //       resolve(fileName);
  //     }
  //   });
  // })
  //   .then( (fileArray) => {
  //     return new Promise(function(resolve, reject) {
  //       var files = [];
  //       fileArray.forEach(element => {
  //         var pathname = (path.join(exports.dataDir, element));
  //         fs.readFile(pathname, 'utf8', (err, content) => {
  //           if (err) {
  //             reject(err);
  //           } else {
  //             var format = {id: element.slice(0, 5), text: content};
  //             files.push(format);
  //             resolve(files);
  //           }
  //         });
  //       });
  //     })
  //       .then((data) => {
  //         console.log('data ', data);
  //         callback(null, data);
  //       });
  //   });
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
  var pathname = path.join(exports.dataDir, `${id}.txt`);
  fs.readFile(pathname, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(pathname, text, (err) => {
        if (err) {
          callback(err, null);
        } else {
          // console.log(`changed text: ${text} of id: ${id}`);
          callback(null, text);
        }
      });
    }

  });

  // old code below
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {

  var pathname = path.join(exports.dataDir, `${id}.txt`);
  fs.stat(pathname, (err, stats) => {
    if (err) {
      callback(err, null);
    } else {
      fs.unlink(pathname, (err) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, exports.dataDir);
          //console.log('delete successful');
        }
      });
    }

  });

  //old code
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
