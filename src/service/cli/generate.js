const {getRandomInt, getRandomDate, shuffle} = require(`../../utils`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../../const`);
const fs = require(`fs/promises`);
const path = require(`path`);

const MIN_ELEMENTS = 1;
const MAX_ELEMENTS = 1000;
const FILE_NAME = `mocks.json`;
const THREE_MONTHS_MILISECONDS = 7889229;
const SENTENCES_PATH = path.join(__dirname, `../../data/sentences.txt`);
const TITLES_PATH = path.join(__dirname, `../../data/titles.txt`);
const CATEGORIES_PATH = path.join(__dirname, `../../data/categories.txt`);

const generateMocks = (count, contentType) => (
  Array(count).fill({}).map(() => ({
    title: contentType.titles[getRandomInt(0, contentType.titles.length - 1)],
    createdDate: getRandomDate(getRandomInt(0, THREE_MONTHS_MILISECONDS)),
    announce: shuffle(contentType.sentences).slice(0, getRandomInt(1, 6)),
    fullText: shuffle(contentType.sentences).slice(0, getRandomInt(1, contentType.sentences.length - 1)),
    category: shuffle(contentType.categories).slice(0, getRandomInt(1, contentType.categories.length - 1)),
  }))
);

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.split(`\n`).map((item) => item.trim()).filter((item) => item !== ``);
  } catch (error) {
    console.error(`File can't be read, error: ${error}`);
    return [];
  }
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [sentences, titles, categories] = await Promise.all([
      readContent(SENTENCES_PATH), readContent(TITLES_PATH), readContent(CATEGORIES_PATH)
    ]);

    const contentType = {
      sentences, titles, categories,
    };

    const [count] = args;
    const countMocks = Number.parseInt(count, 10) || MIN_ELEMENTS;
    const content = JSON.stringify(generateMocks(countMocks, contentType));

    if (count > MAX_ELEMENTS) {
      console.error(chalk.red(`Нельзя записать в файл больше ${MAX_ELEMENTS} моков`));
      process.exit(ExitCode.FAIL);
    }

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(`${chalk.greenBright(`Запись в файл успешно завершена`)}`);
    } catch (err) {
      console.error(chalk.red(`Произошла ошибка записи файла ${FILE_NAME}, ошибка: ${err}`));
      process.exit(ExitCode.FAIL);
    }
  }
};
