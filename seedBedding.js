import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import { nanoid } from "nanoid";

dotenv.config();

const sampleProducts = [
    {
        productID: "BED-001",
        name: "Luxury Egyptian Cotton Sheet Set",
        description: "Experience the ultimate comfort with our 100% Egyptian Cotton sheet set. 1000 Thread Count. Silky smooth and breathable. Includes 1 flat sheet, 1 fitted sheet, and 2 pillowcases.",
        price: 12500,
        labelledPrice: 15000,
        images: ["https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=800"],
        category: "Bedsheets",
        model: "Queen Size",
        brand: "SoftDreams Luxe",
        stock: 50,
        isAvailable: true,
    },
    {
        productID: "PLW-001",
        name: "CloudSoft Memory Foam Pillow",
        description: "Premium memory foam pillow that contours to your neck and head for perfect support. Hypoallergenic cover.",
        price: 4500,
        labelledPrice: 5500,
        images: ["https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800"],
        category: "Pillows",
        model: "Standard",
        brand: "SleepEasy",
        stock: 100,
        isAvailable: true,
    },
    {
        productID: "DUV-001",
        name: "All-Season Microfiber Duvet",
        description: "Lightweight yet warm, this microfiber duvet is perfect for year-round use. Soft, fluffy, and machine washable.",
        price: 9500,
        labelledPrice: 12000,
        images: ["https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800"],
        category: "Duvets",
        model: "King Size",
        brand: "CozyNights",
        stock: 30,
        isAvailable: true,
    },
    {
        productID: nanoid(),
        name: "Satin Silk Bedding Set",
        description: "Add a touch of romance and luxury to your bedroom with this silky satin bedding set. Smooth texture prevents hair frizz and skin creases.",
        price: 18000,
        labelledPrice: 22000,
        category: "Bedsheets",
        images: [
            "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/545034/pexels-photo-545034.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        rating: 0,
        numReviews: 0,
        isAvailable: true,
        stock: 50
    },
    {
        productID: nanoid(),
        name: "Cloud Comfort Pillow Set",
        description: "Experience the ultimate neck and head support with our Cloud Comfort Pillow Set. Premium memory foam adapts to your unique sleeping position.",
        price: 5500,
        labelledPrice: 7000,
        category: "Pillows",
        images: [
            "https://images.pexels.com/photos/271711/pexels-photo-271711.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1267338/pexels-photo-1267338.jpeg?auto=compress&cs=tinysrgb&w=800"
        ],
        model: "Standard",
        brand: "SleepEasy",
        stock: 80,
        isAvailable: true,
        rating: 0,
        numReviews: 0
    },
    {
        productID: "ACC-001",
        name: "Waterproof Mattress Protector",
        description: "Keep your mattress distinct and clean with our 100% waterproof protector. Breathable fabric ensuring a cool sleep.",
        price: 6500,
        labelledPrice: 8000,
        images: ["https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800"],
        category: "Accessories",
        model: "Queen Size",
        brand: "SleepGuard",
        stock: 75,
        isAvailable: true,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Clear existing products
        await Product.deleteMany({});
        console.log("Cleared existing products");

        // Insert new products
        await Product.insertMany(sampleProducts);
        console.log("Seeded bedding products");

        process.exit();
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
