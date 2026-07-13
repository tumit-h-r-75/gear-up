import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL as string,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY as string,
  clientSuccessUrl: process.env.CLIENT_SUCCESS_URL as string,
  clientCancelUrl: process.env.CLIENT_CANCEL_URL as string,
  default_admin_email : process.env.DEFAULT_ADMIN_EMAIL,
  default_admin_password:process.env.DEFAULT_ADMIN_PASSWORD
};