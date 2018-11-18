import Model from '..';
import Action from './action';

const ALL_RELATIONS = '[actions,legendary_actions,special_abilities]';

class Monster extends Model {
  static get tableName() {
    return 'monsters';
  }

  static get relationMappings() {
    return {
      actions: {
        relation: Model.HasManyRelation,
        modelClass: Action,
        join: {
          from: 'monsters.id',
          to: 'actions.actions_id',
        },
      },
      legendary_actions: {
        relation: Model.HasManyRelation,
        modelClass: Action,
        join: {
          from: 'monsters.id',
          to: 'actions.legendary_actions_id',
        },
      },
      special_abilities: {
        relation: Model.HasManyRelation,
        modelClass: Action,
        join: {
          from: 'monsters.id',
          to: 'actions.special_abilities_id',
        },
      },
    };
  }
}

export default Monster;
export {
  ALL_RELATIONS,
};
