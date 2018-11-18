import { AuthenticationError } from 'apollo-server';
import Monster, { ALL_RELATIONS } from '../app/models/monster';

const handleFetch = (resolve, defaultData = null) => (data) => {
  if (data && data.toJSON) {
    // console.log(data.toJSON());
    resolve(data.toJSON());
  }

  resolve(defaultData);
};

const resolvers = {
  Query: {
    monster: async (obj, args) => {
      const monster = await Monster
        .query()
        .where('id', args.id)
        .eager(ALL_RELATIONS);

      return monster[0];
    },
    monsters: async (obj, args, context) => {
      const { user } = context;
      if (user && !user.roles.includes('user')) {
        console.log('no auth!');
        // throw new AuthenticationError('Needs authorization');
      }

      if (args.names) {
        return await Monster
          .query()
          .where('name', 'REGEXP', `${args.names.join('|')}`)
          .eager(ALL_RELATIONS);
      }

      if (args.name) {
        return await Monster
          .query()
          .where('name', 'LIKE', `%${args.name}%`)
          .eager(ALL_RELATIONS);
      }

      return await Monster
        .query()
        .eager(ALL_RELATIONS);
    },
  },
};

export default resolvers;
