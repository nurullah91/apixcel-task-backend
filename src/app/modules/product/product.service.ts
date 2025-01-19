import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TProduct } from "./product.interface";
import { Product } from "./product.model";
import QueryBuilder from "../../builder/QueryBuilder";

const createProductIntoDB = async (payload: TProduct) => {
  const result = await Product.create(payload);

  return result;
};

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const allProductsQuery = new QueryBuilder(
    Product.find({ isDeleted: false }),
    query
  )
    .search(["title", "category", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await allProductsQuery.countTotal();
  const result = await allProductsQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};

const updateProductInDB = async (
  productId: string,
  payload: Partial<TProduct>
) => {
  // Check if the Product exists by ID
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Update Product
  const result = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
  });

  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update Product"
    );
  }

  // Return updated Product
  return result;
};

const deleteSingleProductFromDB = async (id: string) => {
  const result = await Product.findByIdAndUpdate(
    id,
    {
      isDeleted: true,
    },
    {
      new: true,
    }
  );

  return result;
};

export const ProductServices = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteSingleProductFromDB,
};
