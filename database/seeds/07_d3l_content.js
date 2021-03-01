// !production content seed
const seedArray = [
  {
    course_id: "1",
    title: "Ungraded",
    body: "This isn't graded content.",
    file_url: "NONE",
    file_name: "NONE",
    points_total: "-1"
  },
  {
    course_id: "1",
    title: "Graded",
    body: "This is graded content.",
    file_url: "NONE",
    file_name: "NONE",
    points_total: "100"
  },
  {
    course_id: "1",
    title: "Not yet graded content.",
    body: "This is graded content.",
    file_url: "NONE",
    file_name: "NONE",
    points_total: "100"
  },
];


exports.seed = async (knex) => {
  // Check if seeds are already done first.
  const results = await knex("d3l_content").select().limit(1);

  if (results.length == 0) {
    await knex("d3l_content").insert([...seedArray]);
  }

  return;
};
