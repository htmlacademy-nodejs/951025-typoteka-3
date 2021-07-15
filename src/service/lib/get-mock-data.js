const fs = require(`fs/promises`);
const path = require(`path`);

const MOCK_URL = path.join(__dirname, `../mocks.json`);
let data = null;

const getMockData = async () => {
  if (data !== null) {
    return Promise.resolve(data);
  }

  try {
    const fileContent = await fs.readFile(MOCK_URL);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(`Error is occured: ${err}`);
    return Promise.reject(err);
  }

  return Promise.resolve(data);
};

module.exports = getMockData;
