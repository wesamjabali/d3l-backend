// !production content seed
const seedArray = [
  {
    title: "Software Projects",
    course_prefix: "CSC",
    course_number: "394",
    section_number: "801",
  },
  {
    title: "Data Structures",
    course_prefix: "CSC",
    course_number: "301",
    section_number: "801",
  },
  {
    title: "Data Structures II",
    course_prefix: "CSC",
    course_number: "302",
    section_number: "801",
  },
];

exports.seed = async (knex) => {
  // Check if seeds are already done first.
  const results = await knex("d3l_course").select().limit(1);
  
  if (results.length == 0) {
    await knex("d3l_course").insert([...seedArray]);
  }

  return;
};
