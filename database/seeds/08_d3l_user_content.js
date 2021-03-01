// !production content seed
const seedArray = [
  {
    user_id: "3",
    content_id: "2",
    course_id: "1",
    points_earned: "75",
  },
];

exports.seed = async (knex) => {
  // Check if seeds are already done first.
  const results = await knex("d3l_user_content").select().limit(1);

  if (results.length == 0) {
    await knex("d3l_user_content").insert([...seedArray]);
  }

  return;
};
