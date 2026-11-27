const express = require('express')
const router = express.Router()
const Expense = require('../models/Expense')

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find()
    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create expense
router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create(req.body)
    res.status(201).json(expense)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router