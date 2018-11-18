import Model from '..';
import Monster from './monster';

class Action extends Model {
  static get tableName() {
    return 'actions';
  }

  static get relationMappings() {
    return {
      actions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'actions.actions_id',
          to: 'monsters.id',
        },
      },
      legendary_actions: {
        relation: Model.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'actions.legendary_actions_id',
          to: 'monsters.id',
        },
      },
      special_abilities: {
        relation: Model.BelongsToOneRelation,
        modelClass: Monster,
        join: {
          from: 'actions.special_abilities_id',
          to: 'monsters.id',
        },
      },
    };
  }
}

export default Action;
