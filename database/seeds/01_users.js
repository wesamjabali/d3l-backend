// !production content seed
const seedArray = [
  {
    username: "admin",
    email: "admin@admin.com",
    password: "$2y$12$CiJb2Z.vjSHY9s2cXWrBb.R73kZS9Sr9UHu/rlxKHUilyr2KZZ.Wi",
    payrate: 20,
    roles: ["super"]
  },
];

exports.seed = async (knex) => {
  // condition before inserting
  const results = await knex("users").select().limit(1);
  if (results.length == 0) {
    // Insert Seeds
    await knex("users").insert([...seedArray]);
  }
  return;
};
