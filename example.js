function fibonacci(num) {
  if (num === 0 || num === 1) {
    return num;
  } else {
    return fibonacci(num - 1) + fibonacci(num - 2);
  }
}

console.log(fibonacci(10));