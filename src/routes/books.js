const express = require('express');
const Book = require('../models/Book');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const validatePagination = (page, limit) => {
  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  if (Number.isNaN(parsedPage) || parsedPage < 1) {
    return { error: 'Page must be a positive integer' };
  }

  if (Number.isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
    return { error: 'Limit must be between 1 and 100' };
  }

  return { parsedPage, parsedLimit };
};

const validateBookPayload = (input) => {
  const { title, author, category, price, inStock } = input || {};

  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    return 'Title must be a string with at least 2 characters';
  }

  if (!author || typeof author !== 'string' || author.trim().length < 2) {
    return 'Author must be a string with at least 2 characters';
  }

  if (!category || typeof category !== 'string') {
    return 'Category is required';
  }

  if (price === undefined || Number.isNaN(Number(price)) || Number(price) < 0) {
    return 'Price must be a non-negative number';
  }

  if (inStock !== undefined && typeof inStock !== 'boolean') {
    return 'inStock must be a boolean value';
  }

  return null;
};

router.get('/', async (req, res, next) => {
  try {
    const { category, author, sort, page = 1, limit = 10 } = req.query;
    const pagination = validatePagination(page, limit);

    if (pagination.error) {
      return res.status(400).json({ message: pagination.error });
    }

    const filters = {};

    if (category) filters.category = category;
    if (author) filters.author = new RegExp(author, 'i');

    const allowedSortFields = ['title', 'author', 'price', 'createdAt'];
    const sortValue = typeof sort === 'string' ? sort.trim() : '';
    const sortField = sortValue && allowedSortFields.includes(sortValue) ? sortValue : 'createdAt';
    const skip = (pagination.parsedPage - 1) * pagination.parsedLimit;

    const books = await Book.find(filters)
      .sort(sortField)
      .skip(skip)
      .limit(pagination.parsedLimit);

    const total = await Book.countDocuments(filters);

    res.status(200).json({
      page: pagination.parsedPage,
      limit: pagination.parsedLimit,
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
    const payloadError = validateBookPayload(req.body);
    if (payloadError) {
      return res.status(400).json({ message: payloadError });
    }

    const { title, author, category, price, inStock } = req.body;
    const book = await Book.create({
      title: title.trim(),
      author: author.trim(),
      category,
      price: Number(price),
      inStock: inStock !== undefined ? inStock : true,
    });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const payloadError = validateBookPayload(req.body);
    if (payloadError) {
      return res.status(400).json({ message: payloadError });
    }

    const { title, author, category, price, inStock } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        author: author.trim(),
        category,
        price: Number(price),
        inStock: inStock !== undefined ? inStock : true,
      },
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
