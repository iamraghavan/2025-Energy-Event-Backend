// utils/generateID.js

const generateID = () => {
  // Returns a random 5-digit numeric string, padded if needed
  return Math.floor(10000 + Math.random() * 90000).toString();
};

module.exports = generateID;
