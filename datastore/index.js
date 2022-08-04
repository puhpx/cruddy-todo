const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('Failed to read all files');
    } else {
      files.forEach((file) => {
        var id = file.slice(0, 5);
        var todo = {id, text: id};
        data.push(todo);
        items[id] = true;
      });
    }
    callback(null, data);
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
