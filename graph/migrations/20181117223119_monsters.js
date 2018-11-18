exports.up = (knex) => {
  return knex.schema
    .createTable('monsters', (table) => {
      table.increments('id').primary();
      table.string('name'); // String!
      table.string('size'); // String!
      table.string('type'); // String!
      table.string('subtype'); // String!
      table.string('alignment'); // String!
      table.integer('armor_class'); // Int!
      table.integer('hit_points'); // Int!
      table.string('hit_dice'); // String!
      table.string('speed'); // String!
      table.integer('strength'); // Int!
      table.integer('dexterity'); // Int!
      table.integer('constitution'); // Int!
      table.integer('intelligence'); // Int!
      table.integer('wisdom'); // Int!
      table.integer('charisma'); // Int!
      table.integer('medicine'); // Int!
      table.integer('religion'); // Int!
      table.string('damage_vulnerabilities'); // String!
      table.string('damage_resistances'); // String!
      table.string('damage_immunities'); // String!
      table.string('condition_immunities'); // String!
      table.string('senses'); // String!
      table.string('languages'); // String!
      table.string('challenge_rating'); // Float!
      // table.string('actions'); // [Action]
      // table.string('legendary_actions'); // [Action]
      // table.string('special_abilities'); // [Action]
    })
    .createTable('actions', (table) => {
      table.increments('id').primary();
      table.string('name'); // String!,
      table.string('desc'); // String!,
      table.integer('attack_bonus'); // Int!,
      table.string('damage_dice'); // String,
      table.integer('damage_bonus'); // Int,
      table.integer('actions_id', 10); // .references('monsters.id');
      table.integer('legendary_actions_id', 10); // .references('monsters.id');
      table.integer('special_abilities_id', 10); // .references('monsters.id');
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('actions')
    .dropTable('monsters');
};
