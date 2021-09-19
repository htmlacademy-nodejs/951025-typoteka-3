const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {modifiedArticle} = require(`../helpers/articles`);
const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img`;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const arcticlesRoutes = new Router();

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,

  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const upload = multer({storage});

const currentPost = async (req, res) => {
  try {
    const article = await api.getArticle(req.params.id);
    res.render(`post`, {article: modifiedArticle(article)});
  } catch (error) {
    console.log(error);
  }
};

arcticlesRoutes.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));

arcticlesRoutes.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

arcticlesRoutes.get(`/edit/:id`, currentPost);
arcticlesRoutes.get(`/:id`, currentPost);

module.exports = arcticlesRoutes;
