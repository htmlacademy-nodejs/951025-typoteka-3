const {getRandomInt, shuffle} = require(`../../utils`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../../const`);
const fs = require(`fs/promises`);
const path = require(`path`);
const sequelize = require(`../lib/sequelize`);
const connectToDb = require(`../lib/connect-to-db`);
const fillDb = require(`../lib/fill-db`);

const MIN_ELEMENTS = 1;
const MAX_ELEMENTS = 1000;
const MAX_COMMENTS = 8;

const PhotoRestrict = {
  MIN: 1,
  MAX: 16,
};

const SENTENCES_PATH = path.join(__dirname, `../../data/sentences.txt`);
const TITLES_PATH = path.join(__dirname, `../../data/titles.txt`);
const CATEGORIES_PATH = path.join(__dirname, `../../data/categories.txt`);
const COMMENTS_PATH = path.join(__dirname, `../../data/comments.txt`);

const users = [
  {
    email: `jackson@example.com`,
    firstName: `Michael`,
    lastName: `Jackson`,
    passwordHash: `ha21nskz83jsnjcxdnqi9123bb1123b12`,
    avatar: `avatar-1.png`,
  },
  {
    email: `williams@example.com`,
    firstName: `Tony`,
    lastName: `Williams`,
    passwordHash: `ha21nskz83jsnjcxdnqi9123bb1123b12`,
    avatar: `avatar-2.png`,
  },
];

const generateComments = (count, comments) => (
  Array(count).fill({}).map(() => ({
    text: shuffle(comments).slice(0, getRandomInt(1, comments.length)).join(` `)
  }))
);

const getPhotoFileName = (number) => {
  if (number < 10) {
    return `item${number.toString().padStart(2, 0)}.jpg`;
  }

  return `item${number.toString()}.jpg`;
};

const generateArticles = (count, contentType) => (
  Array(count).fill({}).map(() => ({
    title: contentType.titles[getRandomInt(0, contentType.titles.length - 1)],
    photo: getPhotoFileName(getRandomInt(PhotoRestrict.MIN), PhotoRestrict.MAX),
    announcement: shuffle(contentType.sentences).slice(0, getRandomInt(1, 6)).join(` `),
    fullText: shuffle(contentType.sentences).slice(0, getRandomInt(1, contentType.sentences.length - 1)).join(` `),
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
  name: `--filldb`,
  async run(args) {
    await connectToDb(sequelize);

    const [sentences, titles, categories, comments] = await Promise.all([
      readContent(SENTENCES_PATH), readContent(TITLES_PATH),
      readContent(CATEGORIES_PATH), readContent(COMMENTS_PATH),
    ]);

    const contentType = {
      sentences, titles, categories, comments
    };

    const [count] = args;
    const countMocks = Number.parseInt(count, 10) || MIN_ELEMENTS;
    const articles = generateArticles(countMocks, contentType);

    if (count > MAX_ELEMENTS) {
      console.error(chalk.red(`Нельзя записать в файл больше ${MAX_ELEMENTS} моков`));
      process.exit(ExitCode.FAIL);
    }

    await fillDb(sequelize, {articles, categories, users});
  }
};
