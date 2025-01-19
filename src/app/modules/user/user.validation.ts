import { z } from "zod";

// User validation schema
const createUserSchema = z.object({
  password: z.string().min(6, "At least 6 password is required"),
  name: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address"),
  role: z
    .enum(["admin", "user"], {
      message: "Role must be either admin or user",
    })
    .optional(),
  phone: z
    .string()
    .max(15, "Phone number cannot be more thant 15 characters long"),
  address: z.string().min(1, "Address is required"),

  profilePhoto: z.string().url().optional(),
  coverPhoto: z.string().url().optional(),
  status: z
    .enum(["active", "blocked"], {
      message: "Status must be either active or blocked",
    })
    .optional(),
  isDeleted: z.boolean().optional(),
});

const loginUserSchema = z.object({
  password: z.string().nonempty("Password cannot be empty"),
  email: z.string().email("Invalid email address"),
});

const changePasswordValidationSchema = z.object({
  oldPassword: z.string({
    required_error: "Old password is required",
  }),
  newPassword: z.string({ required_error: "Password is required" }),
});

const forgetPasswordValidationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordValidationSchema = z.object({
  userId: z.string({
    required_error: "userId is required",
  }),
  newPassword: z.string({ required_error: "Password is required" }),
});

export const userSchema = {
  createUserSchema,
  loginUserSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
