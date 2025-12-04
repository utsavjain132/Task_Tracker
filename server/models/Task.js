const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      default: '',
    },

    dueDate: {
      type: Date,
      validate: {
        validator: function (value) {

          if (!value) return true;
          return value > new Date();
        },
        message: 'Due date must be in the future',
      },
    },

    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: 'Priority must be low, medium or high',
      },
      default: 'medium',
      lowercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: {
        values: ['to do', 'in progress', 'done'],
        message: 'Status must be one of: To Do, In Progress, Done',
      },
      default: 'to do',
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, transform: docToJSON },
    toObject: { virtuals: true },
  }
);


function docToJSON(doc, ret) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  return ret;
}

taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate) return false;
  return new Date(this.dueDate) < new Date();
});


taskSchema.pre('save', function (next) {
  if (this.status && typeof this.status === 'string') {
    this.status = this.status.toString().trim().toLowerCase();
  }

  if (this.priority && typeof this.priority === 'string') {
    this.priority = this.priority.toString().trim().toLowerCase();
  }

  next();
});


taskSchema.methods.markDone = function () {
  this.status = 'done';
  return this.save();
};

module.exports = mongoose.model('Task', taskSchema);
