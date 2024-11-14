const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const knex = require("knex");
const userRouter = require("./routes/userRouter.js");

const app = express();
const { db } = require("./config/db.js");

app.use(express.json());
app.use(cookieParser());
app.use(compression());
// app.use(cors({
//   credentials:true,
//   origin:["https://space-images-library.onrender.com"]
// }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "https://space-images-library.onrender.com");
  // res.setHeader('Access-Control-Allow-Origin', "http://localhost:5173");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // res.setHeader('Content-Type', 'application/json');
  next();
});

const { PORT } = process.env;

app.listen(PORT || 10000, () => {
  console.log(`run on ${PORT || 10000}`);
});

app.use("/", userRouter);

async function getCategories() {
  try {
    // const data = await db('categories').select('*');
    const data = await db('categories').select("category_id", "category");
    let categories = {};
    for (item of data) {
      categories[item.category] = item.category_id;
    }
    return categories;
  } catch (error) {
    console.log(error);
  }
}

getCategories().then(function(result) {
  app.get('/categories', (req, res) => {
    res.json(result);
  });
});

async function getImageBase() {
  try {
    const data = await db('images').select(
      "id",
      "nasa_id",
      "date_created",
      "image_category",
      "title",
      "description",
      "image_link",
      "fullsize_link",
      "users_likes",
      "href",
    ).where("image_category", ">", 0);
    let imageBase = {};
    for (item of data) {
      imageBase[item.id] = {
        nasa_id: item.nasa_id,
        date_created: item.date_created,
        image_category: item.image_category,
        title: item.title,
        description: item.description,
        image_link: item.image_link,
        fullsize_link: item.fullsize_link,
        users_likes: item.users_likes,
        href: item.href,
      };
    }
    // console.log(JSON.stringify(categories));
    return imageBase;
  } catch (error) {
    console.log(error);
  }
}

getImageBase().then(function(result) {
  app.get('/images', (req, res) => {
    res.json(result);
  });
});

// Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, "./client/dist")));
// app.use(express.static(path.join(__dirname, "./client/dist")));

// All other GET requests not handled before will return our React app
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});