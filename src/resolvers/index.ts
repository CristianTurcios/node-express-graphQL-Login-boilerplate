import getUsers, {
  getUserById, postUser, deleteUser, updateUser,
} from './user';

export default {
  Query: {
    User: getUserById,
    Users: getUsers,
  },
  Mutation: {
    postUser,
    updateUser,
    deleteUser,
  },
};
