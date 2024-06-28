// function greet(name = "Guest", age) {
//   return `hello ${name}, ${
//     age > 18 ? "you're welcome here" : "caman comot for here you too small"
//   }`;
// }

// //? arrow function
// const greet = (name = "Guest", age) => {
//   return `hello ${name}, ${
//     age > 18 ? "you're welcome here" : "caman comot for here you too small"
//   }`;
// };

// const greet1 = greet("james", 25);
// const greet2 = greet("john", 13);
// console.log(greet1);
// console.log(greet2);

// const students = ["jay", "peter", "john", "henry"];

// students.forEach(function (value) {
//   console.log(value);
// });

// function reverseString(str, cb) {
//   const rev = str.split("").reverse().join("");
//   cb(rev, str);
// }

// reverseString("martins", function (result, initialString) {
//   console.log("result is of reversing", initialString + " is", result);
// });

function isevenOrOdd(numArray, cb) {
  let result = [];
  for (let i = 0; i < numArray.length; i++) {
    if (numArray[i] % 2 === 0) {
      result.push({
        value: numArray[i],
        isEven: true,
      });
    } else {
      result.push({
        value: numArray[i],
        isEven: false,
      });
    }
  }

  cb(result);
}

isevenOrOdd([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], function (val) {
  console.log(val);
});
