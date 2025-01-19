import { Express } from "express";

export type TImageFiles = { [fieldname: string]: Express.Multer.File[] };

export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
