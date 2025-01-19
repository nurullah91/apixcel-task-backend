import { model, Schema } from "mongoose";
import { TProduct } from "./product.interface";

const PostSchema: Schema = new Schema<TProduct>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    photos: {
      thumbnail: { type: String, required: true },
      cover: { type: String, required: true },
    },
    category: { type: String, required: true },

    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    discount: { type: Number, required: true },
    ratings: { type: [Number], default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Query Middleware
PostSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

PostSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

export const Product = model<TProduct>("Product", PostSchema);
