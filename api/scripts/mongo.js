/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const COLLECTION = 'TodoConnectionTest';

// Run mongo with `docker compose up mongodb`
const URI = 'mongodb://mongo:MongoPass@localhost:27017/';

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      minlength: 1,
      maxlength: 40,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: null,
    },
    createdAt: {
      type: String,
    },
    updatedAt: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    virtuals: true,
  }
);

TodoSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
TodoSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

const main = async () => {
  // Connect to db
  mongoose.connect(URI);

  // Create a model
  const TodoDb = mongoose.model(COLLECTION, TodoSchema);

  // Delete existing data
  //await TodoDb.deleteMany({});

  // Using create
  const saveResult1 = await TodoDb.create({
    title: 'first todo',
    description: 'description',
    createdAt: new Date().toISOString(),
  });
  const transformed1 = saveResult1.toJSON();
  console.log('Created lean--------------------------------');
  console.log(transformed1);

  // Using create
  const getResult1 = await TodoDb.findById(transformed1.id).exec();
  console.log('Get --------------------------------');
  console.log(getResult1.toJSON());

  // Using create
  const saveResult2 = await TodoDb.create({
    title: '2 todo',
    description: '2 description',
    createdAt: new Date().toISOString(),
  });
  console.log('Created lean --------------------------------');
  console.log(saveResult2.toJSON());

  // Using create
  const saveResult3 = await TodoDb.create({
    title: '3 todo',
    description: '3 description',
    createdAt: new Date().toISOString(),
  });
  console.log('Created lean --------------------------------');
  console.log(saveResult3.toJSON());

  // Get all
  const allTodos = await TodoDb.find({}).exec();
  console.log('allTodos---------------------------');
  console.log(allTodos);

  // Using find by id and update
  const upsert = false;
  const lean = true;
  const id = saveResult2._id;
  const update = {
    title: 'updated lean ' + saveResult2.title + ' ' + Math.random(),
    description: saveResult2.description + ' updated' + Math.random(),
    createdAt: saveResult2.createdAt,
    updatedAt: new Date().toISOString(),
  };
  console.log('Updating lean 1---------------------------');
  console.log(update);
  const updateResult2 = await TodoDb.findByIdAndUpdate(id, update, {
    //lean,
    //upsert,
    //includeResultMetadata: true,
    new: true,
  });
  console.log('Updated lean 2');
  console.log(updateResult2.toJSON());

  // Get all
  const allTodosAfterUpdate = await TodoDb.find({}).exec();
  console.log('allTodosAfterUpdate---------------------------');
  console.log(allTodosAfterUpdate);

  const skip = 0;

  // Get with aggregation
  const sort = { $sort: { title: -1 } };

  const transformations = {
    $project: {
      id: {
        $toString: '$_id',
      },
      _id: 0,
      title: 1,
      description: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  };

  const pipeline = [transformations, sort];
  const allTodosAgg = await TodoDb.aggregate(pipeline).skip(skip).exec();
  console.log('allTodosAgg---------------------------');
  console.log(allTodosAgg);
};

main()
  .then(() => {
    console.log('done');
    mongoose.disconnect();
  })
  .catch((e) => {
    console.log(e);
  });
