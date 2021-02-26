// !production content seed
const seedArray = [
  {
    user_id: "1",
    team_id: "1",
  },
  {
    user_id: "1",
    team_id: "2",
  },
  {
    user_id: "3",
    team_id: "1",
  },
  {
    user_id: "2",
    team_id: "2",
  },
];

exports.seed = async (knex) => {
  // Check if seeds are already done first.
  const results = await knex("d3l_user_team").select().limit(1);

  if (results.length == 0) {
    await knex("d3l_user_team").insert([...seedArray]);
  }

  return;
};
