// !production content seed
const seedArray = [
  {
    user_id: "1",
    course_id: "1",
  },
  {
    user_id: "1",
    course_id: "2",
  },
  {
    user_id: "1",
    course_id: "3",
  },
  {
    user_id: "2",
    course_id: "2",
  },
  {
    user_id: "3",
    course_id: "1",
  },
  {
    user_id: "3",
    course_id: "2",
  },
];

exports.seed = async (knex) => {
  // Check if seeds are already done first.
  const results = await knex("d3l_user_course").select().limit(1);

  if (results.length == 0) {
    await knex("d3l_user_course").insert([...seedArray]);
  }

  return;
};
