import knexfile from '../../knexfile';
const { Model } = require('objection');
const knex = require('knex');

Model.knex(knex(knexfile));

export { Model, knex };
export default Model;
