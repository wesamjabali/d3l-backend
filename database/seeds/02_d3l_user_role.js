// !production content seed
const seedArray = [
    {
      user_id: 1,
      role: "admin"
    },
    {
      user_id: 2,
      role: "faculty"
    }
  ];
  
  exports.seed = async (knex) => {
    // Check if the seed has already been done to avoid duplicates
    const results = await knex("d3l_user_role").select().limit(1);
    if (results.length == 0) {
      // Insert Seeds
      await knex("d3l_user_role").insert([...seedArray]);
    }
    
    return;
  };