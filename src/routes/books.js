const express = require('express');
const Book = require('../models/Book');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { category, author, sort, page = 1, limit = 10 } = req.query;
    const filters = {};

    if (category) filters.category = category;
    if (author) filters.author = new RegExp(author, 'i');

    const sortField = sort ? sort.split(',').join(' ') : 'createdAt';
    const skip = (Number(page) - 1) * Number(limit);

    const books = await Book.find(filters)
      .sort(sortField)
      .skip(skip)
      .limit(Number(limit));

    const total = await Book.countDocuments(filters);

    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      total,
      data: books,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { title, author, category, price, inStock } = req.body;

    if (!title || !author || !category || price === undefined) {
      return res.status(400).json({ message: 'Title, author, category, and price are required' });
    }

    const book = await Book.create({ title, author, category, price, inStock });
    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { title, author, category, price, inStock } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, category, price, inStock },
      { new: true, runValidators: true },
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
