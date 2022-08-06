const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;
var Promise = require('bluebird');

var counter;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

// Non-Promise
// const readCounter = (callback) => {
//   fs.readFile(exports.counterFile, (err, fileData) => {
//     if (err) {
//       callback(null, 0);
//     } else {
//       callback(null, Number(fileData));
//     }
//   });
// };

const readCounter = (callback) => {
  return new Promise((resolve, reject) => {
    fs.readFile(exports.counterFile, (err, fileData) => {
      if (fileData) {
        resolve(callback(null, Number(fileData)));
      } else {
        reject(callback(null, 0));
      }
    });
  });
};

// Non-Promise
// const writeCounter = (count, callback) => {
//   var counterString = zeroPaddedNumber(count);
//   fs.writeFile(exports.counterFile, counterString, (err) => {
//     if (err) {
//       throw ('error writing counter');
//     } else {
//       callback(null, counterString);
//     }
//   });
// };

const writeCounter = (count, callback) => {
  return new Promise ((resolve, reject) => {
    var counterString = zeroPaddedNumber(count);
    fs.writeFile(exports.counterFile, counterString, (err) => {
      if (err) {
        reject('error writing counter');
      } else {
        resolve(callback(null, counterString));
      }
    });
  });
};



// Public API - Fix this function //////////////////////////////////////////////

// Non-Promise
// exports.getNextUniqueId = (callback) => {
//   readCounter((err, count) => {
//     writeCounter(count + 1, (err, count) => {
//       callback(err, count);
//     });
//   });
// };

exports.getNextUniqueId = (callback) => {
  return new Promise((resolve, reject) => {
    readCounter((err, count) => {
      if (err) {
        reject(err);
      } else {
        resolve(writeCounter(count + 1, (err, count) => {
          callback(err, count);
        }));
      }
    });
  });
};



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
