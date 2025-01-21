import handleAsync from "../../utils/handleAsync";
import responseSender from "../../utils/responseSender";
import httpStatus from "http-status";
import { ProductServices } from "./product.service";

const createProduct = handleAsync(async (req, res) => {
  const productData = req.body;
  const result = await ProductServices.createProductIntoDB(productData);

  responseSender(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product created successful",
    data: result,
  });
});

const uploadImage = handleAsync(async (req, res) => {
  const imageUrl = { coverPhoto: req.file?.path };

  responseSender(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Image uploaded successful",
    data: { imageUrl },
  });
});

const getAllProducts = handleAsync(async (req, res) => {
  const result = await ProductServices.getAllProductsFromDB(req.query);
  responseSender(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Products are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

const getAllCategories = handleAsync(async (req, res) => {
  const result = await ProductServices.getAllCategoriesFromDB();

  responseSender(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Products are retrieved successfully",

    data: result,
  });
});

const getSingleProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getSingleProductFromDB(productId);

  responseSender(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product is retrieved successfully",
    data: result,
  });
});

const updateProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;

  const ProductData = req.body;
  const result = await ProductServices.updateProductInDB(
    productId as string,
    ProductData
  );

  responseSender(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successful",
    data: result,
  });
});

const deleteSingleProduct = handleAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.deleteSingleProductFromDB(productId);
  responseSender(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product is deleted successfully",
    data: result,
  });
});

export const ProductController = {
  createProduct,
  uploadImage,
  updateProduct,
  deleteSingleProduct,
  getSingleProduct,
  getAllProducts,
  getAllCategories,
};
