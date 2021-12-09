const {getRandomInt, shuffle} = require(`../../utils`);
const chalk = require(`chalk`);
const {ExitCode} = require(`../../const`);
const fs = require(`fs/promises`);
const path = require(`path`);

const MIN_ELEMENTS = 1;
const MAX_COMMENTS = 4;
const FILE_NAME = `fill-db.sql`;
const SENTENCES_PATH = path.join(__dirname, `../../data/sentences.txt`);
const TITLES_PATH = path.join(__dirname, `../../data/titles.txt`);
const CATEGORIES_PATH = path.join(__dirname, `../../data/categories.txt`);
const COMMENTS_PATH = path.join(__dirname, `../../data/comments.txt`);

const generateComments = (count, articleId, userCount, comments) => (
  Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);

const PhotoRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPhotoFileName = (number) => {
  if (number < 10) {
    return `item${number.toString().padStart(2, 0)}.jpg`;
  }

  return `item${number.toString()}.jpg`;
};

const generateArticles = (count, userCount, contentType) => (
  Array(count).fill({}).map((_, index) => ({
    title: contentType.titles[getRandomInt(0, contentType.titles.length - 1)],
    photo: getPhotoFileName(getRandomInt(PhotoRestrict.MIN), PhotoRestrict.MAX),
    announcement: shuffle(contentType.sentences).slice(0, getRandomInt(1, 6)).join(` `),
    fullText: shuffle(contentType.sentences).slice(0, getRandomInt(1, contentType.sentences.length - 1)).join(` `),
    category: shuffle(contentType.categories).slice(0, getRandomInt(1, contentType.categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), index + 1, userCount, contentType.comments),
    userId: getRandomInt(1, userCount),
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
  name: `--fill`,
  async run(args) {
    const [sentences, titles, categories, commentsSentences] = await Promise.all([
      readContent(SENTENCES_PATH),
      readContent(TITLES_PATH),
      readContent(CATEGORIES_PATH),
      readContent(COMMENTS_PATH),
    ]);

    const contentType = {
      sentences, titles, categories, commentsSentences
    };

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || MIN_ELEMENTS;

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

    const articles = generateArticles(countArticles, users.length, contentType);
    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: article.category[0]}));

    const userValues = users.map(
        ({email, firstName, lastName, passwordHash, avatar}) =>
          `('${email}', '${firstName}', '${lastName}', '${passwordHash}', '${avatar}')`
    ).join(`,\n`);

    const categoryValues = categories.map((category) => `('${category}')`).join(`,\n`);

    const articleValues = articles.map(
        ({title, photo, announcement, fullText, userId}) =>
          `('${title}', '${photo}', '${announcement}', '${fullText}', '${userId}')`
    ).join(`,\n`);

    const articleCategoriesValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `('${articleId}', '${categoryId}')`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({userId, articleId, text}) =>
          `('${userId}', '${articleId}', '${text}')`
    ).join(`,\n`);

    const content = `
      INSERT INTO users(email, first_name, last_name, password_hash, avatar) VALUES
      ${userValues};
      INSERT INTO categories(name) VALUES
      ${categoryValues};
      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(title, photo, announcement, full_text, user_id) VALUES
      ${articleValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;
      ALTER TABLE article_categories DISABLE TRIGGER ALL;
      INSERT INTO article_categories(article_id, category_id) VALUES
      ${articleCategoriesValues};
      ALTER TABLE article_categories ENABLE TRIGGER ALL;
      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO comments(user_id, article_id, text) VALUES
      ${commentValues}
      ALTER TABLE comments ENABLE TRIGGER ALL;
    `;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(`${chalk.greenBright(`Запись в файл успешно завершена`)}`);
    } catch (err) {
      console.error(chalk.red(`Произошла ошибка записи файла ${FILE_NAME}, ошибка: ${err}`));
      process.exit(ExitCode.FAIL);
    }
  }
};
