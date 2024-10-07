const keys = document.querySelectorAll(".btn");
const display_input = document.querySelector(".display .input");
const display_output = document.querySelector(".display .output");
let input = "";
display_output.innerHTML = "0";

for (let key of keys) {
  const value = key.dataset.key;

  key.addEventListener("click", () => {
    if (value == "all-clear") {
      input = "";
      display_input.innerHTML = "";
      display_output.innerHTML = "0";
    } else if (value == "delete") {
      input = input.slice(0, -1);
      display_input.innerHTML = cleanInput(input);
    } else if (value == "=") {
      let result = compute(input);
      display_output.innerHTML = cleanOutput(result);
    } else {
      if (validateInput(value)) {
        input += value;
        display_input.innerHTML = cleanInput(input);
      }
    }
  });
}

function cleanInput(input) {
  let input_arr = input.split("");

  for (let i = 0; i < input_arr.length; i++) {
    if (input_arr[i] == "*") {
      input_arr[i] = `<span class="operator"> &#xd7; </span>`;
    } else if (input_arr[i] == "/") {
      input_arr[i] = `<span class="operator"> &#xf7; </span>`;
    } else if (input_arr[i] == "+") {
      input_arr[i] = `<span class="operator"> + </span>`;
    } else if (input_arr[i] == "-") {
      input_arr[i] = `<span class="operator"> - </span>`;
    }
  }

  return input_arr.join("");
}

function cleanOutput(output) {
  let output_str = output.toString();
  let decimal = output_str.split(".")[1];
  output_str = output_str.split(".")[0];

  let output_arr = output_str.split("");

  if (output_arr.length > 3) {
    for (let i = output_arr.length - 3; i > 0; i -= 3) {
      output_arr.splice(i, 0, ",");
    }
  }

  if (decimal) {
    output_arr.push(".");
    output_arr.push(decimal);
  }

  return output_arr.join("");
}

function validateInput(value) {
  const last_input = input.slice(-1);
  const operators = ["+", "-", "*", "/"];

  if (value == ".") {
    const current = input.split(/[\+\-\*\/]/).pop();
    if (current.includes(".")) return;
  }

  if (operators.includes(value)) {
    if (operators.includes(last_input)) {
      return false;
    }
  }

  return true;
}

function compute(input) {
  const operators = [];
  const values = [];
  let currentNumber = "";

  // Split input into numbers and operators
  for (let char of input) {
    if ("+-*/".includes(char)) {
      values.push(parseFloat(currentNumber));
      operators.push(char);
      currentNumber = "";
    } else {
      currentNumber += char;
    }
  }
  values.push(parseFloat(currentNumber));

  // Step 1: Handle multiplication and division
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "*" || operators[i] === "/") {
      const result =
        operators[i] === "*"
          ? values[i] * values[i + 1]
          : values[i] / values[i + 1];
      values.splice(i, 2, result); // Replace two values with the result
      operators.splice(i, 1); // Remove the operator
      i--; // Adjust index after removal
    }
  }

  // Step 2: Handle addition and subtraction
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === "+" || operators[i] === "-") {
      const result =
        operators[i] === "+"
          ? values[i] + values[i + 1]
          : values[i] - values[i + 1];
      values.splice(i, 2, result); // Replace two values with the result
      operators.splice(i, 1); // Remove the operator
      i--; // Adjust index after removal
    }
  }

  // Final result is the remaining value
  return values[0];
}
