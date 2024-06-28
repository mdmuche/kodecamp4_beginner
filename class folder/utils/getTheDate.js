function theDate() {
  return new Date();
}

function two() {
  console.log("two function");
}

module.exports = theDate;

module.exports.two = two;
