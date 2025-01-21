import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/sendEmail";
import { USER_ROLE } from "./user.constant";
import { createToken } from "../../utils/jwtToken";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const createUserIntoDB = async (payload: TUser) => {
  // check if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is already exist");
  }
  payload.role = USER_ROLE.admin;

  const newUser = await User.create(payload);

  const jwtPayload = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    phone: newUser.phone,
    address: newUser.address,
    profilePhoto: newUser.profilePhoto,
    coverPhoto: newUser.coverPhoto,
    passwordChangedAt: newUser.passwordChangedAt,
    status: newUser.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return { accessToken, refreshToken };
};

const getSingleUserFromDB = async (id: string) => {
  const user = User.findById(id);
  return user;
};

const updateUserInDB = async (userId: string, payload: Partial<TUser>) => {
  // Check if the user exists by ID
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  // Update user data
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
  });

  if (!updatedUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update user"
    );
  }

  // Return updated tokens and updated user
  return updatedUser;
};
const deleteUserFromDB = async (userId: string) => {
  // Check if the user exists by ID
  const updateUser = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    {
      new: true,
    }
  );

  if (!updateUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to delete user");
  }

  // Return updated tokens and updated user
  return {};
};

const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(payload?.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //create token and sent to the  client
  const jwtPayload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    profilePhoto: user.profilePhoto,
    coverPhoto: user.coverPhoto,
    passwordChangedAt: user.passwordChangedAt,
    status: user.status,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userData.email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  //checking if the password is correct
  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched");

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      email: userData.email,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

const forgetPassword = async (email: string) => {
  // checking if the user is exist
  try {
    const user = await User.isUserExistsByEmail(email);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
    }

    // checking if the user is blocked
    const userStatus = user?.status;
    if (userStatus === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
    }

    const jwtPayload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      profilePhoto: user.profilePhoto,
      coverPhoto: user.coverPhoto,
      passwordChangedAt: user.passwordChangedAt,
      status: user.status,
    };

    const resetToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      "20m"
    );

    const resetPasswordLink = `${config.reset_pass_ui_link}/reset-password/?id=${user._id}&resetToken=${resetToken}`;

    const htmlTemplate = `<div
     style="
      font-family: 'Arial',
      sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
      color: #333;
      ">
        <div style="
         width: 90%;
         padding: 20px;
         margin: 20px auto;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        ">
          <div style="
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            line-height: 1.6;
            ">
            <div style="
              font-size: 28px;
              font-weight: bold;
              color: #2967a7;
              margin-bottom: 20px;
              ">
              Reset Your Password at APIXcel
            </div>
      <p style="font-size: 18px; font-weight: bold;">
        Hello, ${user?.name}
      </p>
     <p style="
       font-size: 16px;
       margin-bottom: 20px;
       color: #555;
       "> 
        You requested to reset your password for your APIXcel account. Click the button below within 20 minutes to reset it. 
      </p>
      <a href="${resetPasswordLink}" style="display: inline-block; padding: 12px 24px; font-size: 16px; font-weight: bold; color: #ffffff !important; background-color: #2967a7; text-decoration: none; border-radius: 8px; transition: background-color 0.3s ease;">Reset Password</a>
      <p style="font-size: 16px; margin-bottom: 20px; color: #555;"> If you didn't request a password reset, please ignore this email. </p>
      <div style="margin-top: 40px; font-size: 14px; color: #aaa;"> &copy; 2024 <span style="cursor: pointer; text-decoration: underline; color: #1a2235 !important;">
      <a href="https://apixcel-frontend-five.vercel.app/" style="text-decoration: none; color: inherit;">APIXcel</a> 
      </span> . All rights reserved. </div>
       </div> 
       </div>
    </div>`;

    const mailInfo = await sendEmail(user.email, htmlTemplate);
    return mailInfo;
  } catch {
    throw new AppError(httpStatus.FORBIDDEN, "Failed to send email");
  }
};

// Reset Password by forget method
const resetPassword = async (
  token: string,
  payload: { userId: string; newPassword: string }
) => {
  const user = await User.findById(payload.userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  // checking if the user is blocked
  const userStatus = user?.status;
  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  if (payload.userId !== decoded._id) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked!");
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findByIdAndUpdate(payload.userId, {
    password: newHashedPassword,
    passwordChangedAt: new Date(),
  });

  return null;
};

export const UserService = {
  createUserIntoDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
  loginUser,
  changePassword,
  forgetPassword,
  resetPassword,
};
