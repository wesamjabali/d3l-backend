// !production content seed
const seedArray = [
  {
    course_id: "1",
    team_name: "Wesam's Team",
  },
  {
    course_id: "2",
    team_name: "Course 2 Team",
  },
  {
    course_id: "3",
    team_name: "John Doe's Team",
  },
];

exports.seed = async (knex) => {
  // Check if seeds are already done first.
  const results = await knex("d3l_team").select().limit(1);

  if (results.length == 0) {
    await knex("d3l_team").insert([...seedArray]);
  }

  return;
};
