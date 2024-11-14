const jwt = require("jsonwebtoken");
require("dotenv").config();

const { ACCESS_TOKEN_SECRET } = process.env;

const verifyToken = (req, res, next) => {
  const token = req.cookies["token"] || req.headers["x-access-token"];

  if (!token) return res.status(401).json({ message: "unauthorized" });

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "forbidden", err: err.message });

    const { userid, email } = decoded;
    console.log(userid, email);

    /** valided with db - email and id */

    req.userinfo = { userid, email };

    next();
  });
};

module.exports = {
  verifyToken,
};
