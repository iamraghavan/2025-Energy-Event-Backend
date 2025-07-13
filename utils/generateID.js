// utils/generateID.js
const generateID = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

module.exports = generateID;
