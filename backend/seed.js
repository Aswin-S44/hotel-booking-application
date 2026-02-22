import bcrypt from "bcryptjs";
import User from "./models/userSchema.js";
import dotenv from "dotenv";
dotenv.config();

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL  ;
    const adminPassword = process.env.ADMIN_PASS ;

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      provider: "local",
    });

    console.log("Admin created successfully");
    return;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default seedAdmin;
