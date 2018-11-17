import monsters from '../srd-monsters.json';
import { AuthenticationError } from 'apollo-server';

const resolvers = {
  Query: {
    monster: (obj, args) => monsters.find((monster) => monster.id == args.id),
    monsters: (obj, args, context, param4) => {
      const { user } = context;
      if (user && !user.roles.includes('steve')) {
        console.log('no auth!');
        // throw new AuthenticationError('Needs authorization');
      }

      if (args.names) {
        return monsters.filter((monster) => {
          return args.names.reduce((pre, name) => {
            if (pre) return pre;
            return monster.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
          }, false);
        });
      }
      if (args.name) {
        return monsters.filter((monster) => {
          return monster.name.toLowerCase().indexOf(args.name.toLowerCase()) !== -1;
        });
      }

      return monsters;
    },
  },
};

export default resolvers;