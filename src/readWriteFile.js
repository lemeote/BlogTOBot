const fs = require("fs");

// Function to add a number to the list
function saveId(number) {
  // Read the existing numbers from the file
  const existingNumbers = fs.readFileSync("ids.txt", "utf8").split("\n").filter(Boolean);

  // Check if the number already exists in the list
  if (!existingNumbers.includes(number)) {
    // Add the number to the list
    existingNumbers.push(number);

    // Write the updated list back to the file
    fs.writeFileSync("ids.txt", existingNumbers.join("\n"));

    console.log(`Number ${number} added to the list.`);
  } else {
    console.log(`Number ${number} already exists in the list.`);
  }
}

// Function to search for a number in the list
function findId(number) {
  // Read the existing numbers from the file
  const existingNumbers = fs.readFileSync("ids.txt", "utf8").split("\n").filter(Boolean);

  if (existingNumbers.includes(number)) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  saveId,
  findId,
};
