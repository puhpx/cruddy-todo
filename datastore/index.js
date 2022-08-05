const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var ps = Promise.promisifyAll(fs);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {

  // var id = counter.getNextUniqueId();
  counter.getNextUniqueId((err, id) => {
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      callback(null, { id, text });
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
  var fileName = id + '.txt';
  var filePath = exports.dataDir + '/' + fileName;
  fs.readFile(filePath, (err, contents) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: contents.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  var fileName = id + '.txt';
  var filePath = exports.dataDir + '/' + fileName;
  fs.readFile(filePath, (err, contents) => {
    if (err) {
      callback (new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw ('error updating');
        } else {
          callback(null, {id, text});
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var fileName = id + '.txt';
  var filePath = exports.dataDir + '/' + fileName;
  fs.unlink(filePath, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};