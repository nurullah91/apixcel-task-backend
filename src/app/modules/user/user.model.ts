import { model, Schema } from "mongoose";
import { TUser, IUserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";
const userSchema: Schema = new Schema<TUser>(
  {
    password: { type: String, required: true, select: 0 },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "user"], default: "admin" },
    phone: { type: String, required: true },
    address: { type: String, required: true },

    profilePhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/dbwftcxvx/image/upload/v1727985302/image_8_sdrdqj.jpg",
    },
    coverPhoto: {
      type: String,
      default:
        "https://res.cloudinary.com/dbwftcxvx/image/upload/v1727985302/image_9_k8zz66.jpg",
    },

    isDeleted: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    passwordChangedAt: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

// Hashing password before save to DB
userSchema.pre("save", async function (next) {
  if (typeof this.password === "string") {
    this.password = await bcrypt.hash(
      this.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  next();
});

// Filter out deleted user
userSchema.pre("find", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
userSchema.pre("findOne", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});
userSchema.pre("findOneAndUpdate", function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// check user exist or not
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

// check password wrong or not
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// Check user's token is issued before password changed or not
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};
export const User = model<TUser, IUserModel>("User", userSchema);
