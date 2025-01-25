const express = require("express");
const { Parser } = require("json2csv");
const verifyToken = require("../middlewares/verifyToken");
const Expense = require("../models/Expense");

const router = express.Router();

// Export to CSV
router.get('/export', verifyToken, async (req, res) => {

    const { category, minAmount, maxAmount, startDate, endDate } = req.query;
    const query = { userId: req.user.id };
    // Filtering
    if (category) query.category = category;
    if (minAmount) query.amount = { $gte: minAmount };
    if (maxAmount) query.amount = { ...query.amount, $lte: maxAmount };
    if (startDate) query.date = { $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };
    try {
        const expenses = await Expense.find(query);
        const csv = new Parser().parse(expenses);
        res.header('Content-Type', 'text/csv');
        res.attachment('expenses.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: "Server error" + error.message });
    }
});

// Create a new expense
router.post("/", verifyToken, async (req, res) => {
    const { title, amount, date, category, description } = req.body;

    const categoryMapping = require("../misc/constants").categoryMapping;

    // Keyword-based auto-categorization
    const autoCategory = Object.keys(categoryMapping).find((key) =>
        categoryMapping[key].some((keyword) => title.toLowerCase().includes(keyword)) || description.toLowerCase().includes(keyword)
    ) || "Uncategorized";


    try {
        const newExpense = new Expense({
            userId: req.user.id,
            title: title,
            amount: amount,
            date: date,
            category: category || autoCategory,
            description: description,
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: "Server error " + error.message });
    }
});

// Get all expenses
router.get("/", verifyToken, async (req, res) => {
    const { category, minAmount, maxAmount, startDate, endDate, page = 1, limit = 10, sort = "date", order = "desc" } = req.query;
    const query = { userId: req.user.id };

    // Filtering
    if (category) query.category = category;
    if (minAmount) query.amount = { $gte: minAmount };
    if (maxAmount) query.amount = { ...query.amount, $lte: maxAmount };
    if (startDate) query.date = { $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };

    // Pagination  
    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { [sort]: order === "desc" ? -1 : 1 },
    };

    try {
        const expenses = await Expense.find(query, null, options);
        const totalCount = await Expense.countDocuments(query);
        res.status(200).json({
            expenses,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit),
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" + error.message });
    }
});

// Get a single expense
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
        if (!expense) return res.status(404).json({ error: "Expense not found" });

        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: "Server error" + error.message });
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
        res.status(500).json({ error: "Server error" + error.message });
    }
});

// Delete an expense
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

        if (!deletedExpense) return res.status(404).json({ error: "Expense not found" });

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Server error" + error.message });
    }
});


module.exports = router;