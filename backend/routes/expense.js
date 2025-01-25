const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const Expense = require("../models/Expense");

const router = express.Router();

// Create a new expense
router.post("/", verifyToken, async (req, res) => {
    const { title, amount, date, category, description } = req.body;
    console.log(Expense);
    try {
        const newExpense = new Expense({
            userId: req.user.id,
            title: title,
            amount: amount,
            date: date,
            category: category,
            description: description,
        });

        console.log(Expense);

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: "Server error " + error.message });
    }
});

// Get all expenses
router.get("/", verifyToken, async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user.id });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get a single expense
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
        if (!expense) return res.status(404).json({ error: "Expense not found" });

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Update an expense
router.put("/:id", verifyToken, async (req, res) => {
    const { title, amount, date, category, description } = req.body;

    try {
        const updatedExpense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { title, amount, date, category, description },
            { new: true }
        );

        if (!updatedExpense) return res.status(404).json({ error: "Expense not found" });

        res.status(200).json(updatedExpense);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Delete an expense
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!deletedExpense) return res.status(404).json({ error: "Expense not found" });

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;