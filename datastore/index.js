const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var ps = Promise.promisifyAll(fs);

var items = {};
var getTimestamp = () => {
  var timestamp = Math.floor(Date.now() / 1000);
  var date = new Date(timestamp * 1000).toString().split(' ');
  return `${date[1]} ${date[2]}, ${date[3]} ${date[4]}`;
  // console.log(date);
  // var YYYY = date.getFullYear();
  // var MM = date.getMonth();
  // var DD = date.getDate();
  // var HH = date.getHours();
  // var MM = date.getMinutes();
  // var SS = date.getSeconds();
  // return `${MM}/${DD}/${YYYY} ${HH}:${MM}:${SS}`;
};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var createTime = getTimestamp();
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      callback(null, { id, text, createTime });
    });
  });
};

exports.readAll = (callback) => {
  var data = [];
  return ps.readdirAsync(exports.dataDir)
    .then((files) => {
      var todos = files.map((file) => {
        var id = file.split('.')[0];
        return ps.readFileAsync(path.join(exports.dataDir, file), 'utf8')
          .then((text) => {
            return {id, text};
          });
      });
      Promise.all(todos).then((todos) => {
        callback(null, todos);
      });
    });
};

exports.readOne = (id, callback) => {
  return new Promise ((resolve, reject) => {
    var fileName = id + '.txt';
    var filePath = exports.dataDir + '/' + fileName;
    fs.readFile(filePath, (err, contents) => {
      if (err) {
        reject(callback(new Error(`No item with id: ${id}`)));
      } else {
        resolve(callback(null, { id, text: contents.toString() }));
      }
    });
  });
};

//Non-Promise
// exports.update = (id, text, callback) => {
//   var fileName = id + '.txt';
//   var filePath = exports.dataDir + '/' + fileName;
//   fs.readFile(filePath, (err, contents) => {
//     if (err) {
//       callback (new Error(`No item with id: ${id}`));
//     } else {
//       fs.writeFile(filePath, text, (err) => {
//         if (err) {
//           throw ('error updating');
//         } else {
//           callback(null, {id, text});
//         }
//       });
//     }
//   });
// };

exports.update = (id, text, callback) => {
  return new Promise((resolve, reject) => {

    var fileName = id + '.txt';
    var filePath = exports.dataDir + '/' + fileName;
    fs.readFile(filePath, (err, contents) => {
      if (err) {
        reject(callback (new Error(`No item with id: ${id}`)));
      } else {
        resolve(fs.writeFile(filePath, text, () => {
          callback(null, {id, text });
        }));
      }
    });
  });
};

// Non-Promise
// exports.delete = (id, callback) => {
//   var fileName = id + '.txt';
//   var filePath = exports.dataDir + '/' + fileName;
//   fs.unlink(filePath, (err) => {
//     if (err) {
//       callback(new Error(`No item with id: ${id}`));
//     } else {
//       callback();
//     }
//   });
// };

exports.delete = (id, callback) => {
  return new Promise ((resolve, reject) => {
    var fileName = id + '.txt';
    var filePath = exports.dataDir + '/' + fileName;
    fs.unlink(filePath, (err) => {
      if (err) {
        reject(callback(new Error(`No item with id: ${id}`)));
      } else {
        resolve(callback());
      }
    });
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};