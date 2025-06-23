import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  college: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);
