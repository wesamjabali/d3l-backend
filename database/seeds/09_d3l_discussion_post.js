// !production content seed
const seedArray = [
  {
    user_id: "1",
    course_id: "1",
    parent_id: null,
    title: "Parent title",
    body: "Parent body",
  },
  {
    user_id: "1",
    course_id: "1",
    parent_id: "1",
    title: "child title",
    body: "child body",
  },
  {
    user_id: "1",
    course_id: "1",
    parent_id: "2",
    title: "child 2 title",
    body: "child 2 body",
  },
  {
    user_id: "1",
    course_id: "1",
    parent_id: null,
    title: "Parent 2 title",
    body: "Parent 2 body",
  },
  {
    user_id: "1",
    course_id: "1",
    parent_id: "4",
    title: "child for parent 2 title",
    body: "child body",
  },
  {
    user_id: "1",
    course_id: "1",
    parent_id: "4",
    title: "child 2 for parent 2 title",
    body: "child 2 body",
  },
];

// user_id BIGINT,
// course_id BIGINT,
// parent_id BIGINT,
// content_id BIGINT,
// title text NOT NULL,
// body text,

exports.seed = async (knex) => {
  // Check if seeds are already done first.
  const results = await knex("d3l_discussion_post").select().limit(1);

  if (results.length == 0) {
    await knex("d3l_discussion_post").insert([...seedArray]);
  }

  return;
};
