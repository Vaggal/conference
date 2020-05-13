function removeCircularJSON(object) {
  var simpleObject = {};
  for (var prop in object) {
    if (!Object.prototype.hasOwnProperty.call(object, prop)) {
      continue;
    }
    if (typeof object[prop] == "object") {
      continue;
    }
    if (typeof object[prop] == "function") {
      continue;
    }
    simpleObject[prop] = object[prop];
  }
  return simpleObject; // returns cleaned up JSON
}

module.exports = {
  removeCircularJSON: removeCircularJSON,
};
