const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      minlength: [2, 'Author name must be at least 2 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Fiction', 'Non-Fiction', 'Technology', 'History', 'Fantasy', 'Science'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Book', bookSchema);
