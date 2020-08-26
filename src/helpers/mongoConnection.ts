/* eslint-disable no-console */
import mongoose from 'mongoose';

const connectionOptions = {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export default (async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGO_DB_CONTAINER_CONNECTION_STRING}`,
      connectionOptions,
    );
    console.info('Connection successful to Mongodb');
  } catch (err) {
    console.error('Connection Wrong to Mongodb', err);
    process.exit();
  }
})();
