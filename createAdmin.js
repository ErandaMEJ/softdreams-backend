import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";
import bcrypt from "bcrypt";

dotenv.config();

const createAdminUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@softdreams.com" });

        if (existingAdmin) {
            console.log("Admin user already exists!");
            console.log("Email: admin@softdreams.com");
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const adminUser = new User({
            firstName: "Admin",
            lastName: "SoftDreams",
            email: "admin@softdreams.com",
            password: hashedPassword,
            role: "admin",
            isEmailVerified: true
        });

        await adminUser.save();
        console.log("✅ Admin user created successfully!");
        console.log("Email: admin@softdreams.com");
        console.log("Password: admin123");
        console.log("\nYou can now login to the admin panel!");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

createAdminUser();
