// const doSomething = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     return resolve("hello world!");
//   }, 5000);
// });

// const doSomethingTwo = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     return resolve("hello world two");
//   }, 10000);
// });

// console.log(doSomething);

// doSomething
//   .then((val) => {
//     console.log("val: ", val);

//     doSomethingTwo
//       .then((v) => console.log(v))
//       .catch((err) => console.error("error:", err));
//   })
//   .catch((err) => {
//     console.error("error:", err);
//   });

// console.log("hello guys");

const isNumberEven = (num) => {
  return new Promise((resolve, reject) => {
    if (typeof num === "number") {
      if (num % 2 == 0) {
        resolve("yes its even");
      } else {
        reject("no, its not");
      }
    } else {
      console.log("not a number enter valid number type");
      return;
    }
  });
};

// isNumberEven(6)
//   .then((val) => val + " yay!!!")
//   .then((v) => console.log(v))
//   .catch((err) => console.error("there is a problem:", err))
//   .finally(() => console.log("done"));

async function executePromise() {
  try {
    const result = await isNumberEven(33);
    console.log(result);
  } catch (err) {
    console.error("error:", err);
  }
}

executePromise();
