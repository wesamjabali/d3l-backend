// !production content seed
const seedArray = [
  {
    email: "admin@admin.com",
    password: "$2y$12$5YQUIpndI8hM4vRUBWI96efu6gMsj.EfPNei5TIcMn35PYWJIbDQ.", //admin
    first_name: "admin",
    last_name: "account",
    phone: "7737737737",
    address: "o3i24uoir oiwero984"
  },
];

exports.seed = async (knex) => {
  // condition before inserting
  const results = await knex("d3l_user").select().limit(1);
  if (results.length == 0) {
    // Insert Seeds
    await knex("d3l_user").insert([...seedArray]);
  }
  return;
};
