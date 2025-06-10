import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  category: { type: String, enum: ["Receita", "Despesa"], required: true },
  dateTime: { type: Date, default: Date.now },
});

export const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
