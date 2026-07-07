import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  frontend_link: process.env.FRONTEND_LINK,
  admin_email: process.env.ADMIN_EMAIL,
  admin_phone: process.env.ADMIN_PHONE,
  admin_pass: process.env.ADMIN_PASS,
  manager_email: process.env.MANAGER_EMAIL,
  manager_phone: process.env.MANAGER_PHONE,
  manager_pass: process.env.MANAGER_PASS,
  employee_email: process.env.EMPLOYEE_EMAIL,
  employee_phone: process.env.EMPLOYEE_PHONE,
  employee_pass: process.env.EMPLOYEE_PASS,
};
