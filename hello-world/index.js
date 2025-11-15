console.log("Hello node js");

const array = [1, 2, 3, 4];

setTimeout(() => {
  for (let i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
}, 2000);

function sum(num1, num2) {
  return num1 + num2;
}

console.log(sum(2, 3));
