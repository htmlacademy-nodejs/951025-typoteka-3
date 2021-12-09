const {getRandomInt, getRandomDate, shuffle} = require(`../../utils`);
const chalk = require(`chalk`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../const`);
const fs = require(`fs/promises`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const MIN_ELEMENTS = 1;
const MAX_ELEMENTS = 1000;
const MAX_COMMENTS = 8;
const FILE_NAME = `mocks.json`;
const THREE_MONTHS_MILISECONDS = 7889229;
const SENTENCES_PATH = path.join(__dirname, `../../data/sentences.txt`);
const TITLES_PATH = path.join(__dirname, `../../data/titles.txt`);
const CATEGORIES_PATH = path.join(__dirname, `../../data/categories.txt`);
const COMMENTS_PATH = path.join(__dirname, `../../data/comments.txt`);

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments).slice(0, getRandomInt(1, comments.length))
  }))
);

const generateMocks = (count, contentType) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: contentType.titles[getRandomInt(0, contentType.titles.length - 1)],
    createdDate: getRandomDate(getRandomInt(0, THREE_MONTHS_MILISECONDS)),
    announce: shuffle(contentType.sentences).slice(0, getRandomInt(1, 6)),
    fullText: shuffle(contentType.sentences).slice(0, getRandomInt(1, contentType.sentences.length - 1)),
    category: shuffle(contentType.categories).slice(0, getRandomInt(1, contentType.categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), contentType.comments)
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
    if (count > MAX_ELEMENTS) {
      console.error(chalk.red(`Нельзя записать в файл больше ${MAX_ELEMENTS} моков`));
      process.exit(ExitCode.FAIL);
    }

    const [sentences, titles, categories, comments] = await Promise.all([
      readContent(SENTENCES_PATH), readContent(TITLES_PATH),
      readContent(CATEGORIES_PATH), readContent(COMMENTS_PATH),
    ]);

    const contentType = {
      sentences, titles, categories, comments
    };

    const [count] = args;
    const countMocks = Number.parseInt(count, 10) || MIN_ELEMENTS;
    const content = JSON.stringify(generateMocks(countMocks, contentType));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(`${chalk.greenBright(`Запись в файл успешно завершена`)}`);
    } catch (err) {
      console.error(chalk.red(`Произошла ошибка записи файла ${FILE_NAME}, ошибка: ${err}`));
      process.exit(ExitCode.FAIL);
    }
  }
};
