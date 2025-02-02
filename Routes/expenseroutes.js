const express = require('express');
const expenseSchema = require('../Models/Expense');
const router = express.Router();
const VerifyToken = require('../middleware/middleware');


// Route to add a new expense
router.post('/addexpense',VerifyToken, async (req, res) => {
  console.log("Adding expenses");
  const { des, amount, category, date } = req.body;
  try {
    const expense = await expenseSchema.create({
      amount: amount,
      category: category,
      des: des,
      date: date,
    });
    res.status(200).json(expense);
  } catch (error) {
    console.error("Error caught:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// Route to get all expenses



// for this pagination taking help from GPT 



router.get("/allExpense",VerifyToken, async (req, res) => {
  try {
    const { page, limit, category } = req.query;

    // Ensure valid values
    const pageValue = Math.max(parseInt(page) || 1, 1);
    const limitValue = Math.max(parseInt(limit) || 10, 1);

    // Convert category query to an array
    const categoryArray = category ? category.split(",").map(ct => ct.trim()) : [];

    // Apply filter before any transformations
    const filter = categoryArray.length > 0 
      ? { category: { $in: categoryArray.map(ct => new RegExp(`^${ct}$`, "i")) } } 
      : {};

    // Fetch expenses with pagination
    const expenses = await expenseSchema.find(filter)
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);

    const totalExpenses = await expenseSchema.countDocuments(filter);
    const totalPages = Math.ceil(totalExpenses / limitValue);

    res.json({ data: expenses, totalPages });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).send("Server error");
  }
});





// Route to delete a single expense by ID
router.delete('/deleteExpense/:id',VerifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const expense = await expenseSchema.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error caught:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



// Route to update an existing expense by ID
router.patch('/updateExpense/:id',VerifyToken, async (req, res) => {
  const id = req.params.id;
  const { des, amount, category, date } = req.body;

  try {
    const updatedExpense = await expenseSchema.findByIdAndUpdate(
      id,
      { des, amount, category, date },
      { new: true } // `new: true` will return the updated document
    );

    if (!updatedExpense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({ message: "Expense updated successfully", updatedExpense });
  } catch (error) {
    console.error("Error caught:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


router.get('/getByDate', VerifyToken, async (req, res) => {

  const { startDate, endDate } = req.query;
  try {
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const expenses = await expenseSchema.find(
      {
        date: { $gte: start, $lte: end }
      },
      {  _id: 0,
        category: 1,
        amount: 1
      }
    );

    res.json(expenses);
  } catch (error) {
    console.error("Error caught:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/getByYear', VerifyToken,async (req, res) => {
  const { startDate, endDate } = req.query;

  const start = new Date(`${startDate}-01-01`);
  const end = new Date(`${endDate}-12-31`);

  if (isNaN(start) || isNaN(end)) {
    console.log("Hlo-02");
    return res.status(400).json({ error: "Invalid date format" });
  }

  try {
    const data = await expenseSchema.find(
      { date: { $gte: start, $lte: end } },
      { date: 1, _id: 0, amount: 1 }
    );

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const transformedData = data.map((entry) => ({
      month: monthNames[new Date(entry.date).getMonth()],
      amount: entry.amount,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error caught:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
