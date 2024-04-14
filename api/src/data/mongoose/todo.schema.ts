import { Schema } from 'mongoose';
import { Todo } from '../todo.types';

/**
 * CreatedAt default works for batch upload
 */
export const TodoSchema = new Schema<Todo>(
  {
    title: {
      type: String,
      required: true,
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
      default: new Date().toISOString(),
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
