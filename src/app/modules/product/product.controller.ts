import handleAsync from "../../utils/handleAsync";
import responseSender from "../../utils/responseSender";
import httpStatus from "http-status";
import { Express } from "express";
import { ProductServices } from "./product.service";

const createProduct = handleAsync(async (req, res) => {
  const images = req.files as Express.Multer.File[];

  const ProductData = req.body;
  if (images?.length) {
    ProductData.ProductPhotos = images.map((image) => image.path);
  }
  const result = await ProductServices.createProductIntoDB(ProductData);

  responseSender(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product created successful",
    data: result,
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
  const images = req.files as Express.Multer.File[];

  const ProductData = req.body;

  if (images?.length) {
    ProductData.ProductPhotos = images.map((image) => image.path);
  }

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
  updateProduct,
  deleteSingleProduct,
  getSingleProduct,
  getAllProducts,
};
