const { db } = require("../config/db.js");
const bcrypt = require("bcrypt");

module.exports = {
  useLike: async (user_id, item_id, value, likes_list) => {
    const trx = await db.transaction();
    console.log("trx:",user_id, item_id, value, likes_list);
    try {
      const like = await db("images")
      .update({ users_likes: likes_list }, ['users_likes'])
      .where({ id: item_id })
      .transacting(trx);
      await trx.commit();      
      console.log("Likes:", like);
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw error;
    }
  },

  createUser: async (password, email) => {
    const trx = await db.transaction();
    try {
      /** hash password */
      const hashPassword = await bcrypt.hash(password + "", 10);

      const [user] = await trx("users").insert(
        {
          email: email.toLowerCase(),
          password: hashPassword,
        },
        ["email", "id"]
      );

      await trx.commit();

      return user;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      throw error;
    }
  },
  getUserByEmail: async (email) => {
    console.log(email);
    try {
      const user = await db("users")
        .select("id", "email", "password")
        .where({ email: email.toLowerCase() })
        .first();
      return user;
    } catch (error) {
      throw error;
    }
  },
  getUsers: async () => {
    try {
      const users = await db("users").select("id", "email");
      return users;
    } catch (error) {
      throw error;
    }
  },
};