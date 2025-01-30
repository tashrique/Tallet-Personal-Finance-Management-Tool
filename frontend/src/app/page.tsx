"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { AxiosError } from "axios";
import { ExpenseType } from "@/types/structs";

export default function Home() {
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    description: "",
  });

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const res = await api.get("/expense");
        setExpenses(res.data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response) {
          setError(err.response.data.message || "Failed to fetch expenses.");
        } else {
          setError("An unexpected error occurred.");
        }
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Handle form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add expense
  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post("/expense", form);
      setExpenses([...expenses, res.data]);
      setForm({ title: "", amount: "", category: "", description: "" }); // Clear the form
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Failed to add expense.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    try {
      await api.delete(`/expense/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || "Failed to delete expense.");
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-6">Expense Dashboard</h1>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Add Expense Form */}
        <div className="card bg-base-100 shadow-lg mb-6 p-6">
          <h2 className="text-2xl font-bold mb-4">Add Expense</h2>
          <form onSubmit={handleAddExpense} className="grid gap-4">
            <input type="text" name="title" placeholder="Title" className="input input-bordered" value={form.title} onChange={handleInputChange} required />
            <input type="number" name="amount" placeholder="Amount" className="input input-bordered" value={form.amount} onChange={handleInputChange} required />
            <input type="text" name="category" placeholder="Category" className="input input-bordered" value={form.category} onChange={handleInputChange} />
            <textarea name="description" placeholder="Description" className="textarea textarea-bordered" value={form.description} onChange={handleInputChange}></textarea>
            <button className="btn btn-primary">Add Expense</button>
          </form>
        </div>

        {/* Expense List */}
        <div className="card bg-base-100 shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your Expenses</h2>
          {loading ? (
            <p>Loading...</p>
          ) : expenses.length > 0 ? (
            <ul className="space-y-4">
              {expenses.map((expense) => (
                <li key={expense._id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                  <div>
                    <h3 className="text-lg font-bold">{expense.title}</h3>
                    <p>Amount: ${expense.amount}</p>
                    <p>Category: {expense.category}</p>
                    <p>Description: {expense.description || "N/A"}</p>
                  </div>
                  <button className="btn btn-error" onClick={() => handleDeleteExpense(expense._id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No expenses found. Add your first expense!</p>
          )}
        </div>
      </div>
    </div>
  );
}
