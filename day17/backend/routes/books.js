const express = require('express');
const Book = require('../models/Book');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// READ Books: Reader, Member, Admin
router.get('/', verifyToken, authorizeRoles('Reader', 'Member', 'Admin'), async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books); 
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books.' });
  }
});

// CREATE Book: Member, Admin
router.post('/', verifyToken, authorizeRoles('Member', 'Admin'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const newBook = await Book.create({ title, author });
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create book.' });
  }
});

// UPDATE Book: Member, Admin
router.put('/:id', verifyToken, authorizeRoles('Member', 'Admin'), async (req, res) => {
  try {
    const { title, author } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author }, { new: true });
    if (!updatedBook) return res.status(404).json({ message: 'Book not found.' });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book.' });
  }
});

// DELETE Book: Member, Admin
router.delete('/:id', verifyToken, authorizeRoles('Member', 'Admin'), async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: 'Book not found.' });
    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book.' });
  }
});

module.exports = router;