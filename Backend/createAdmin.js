const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define User Schema
const userSchema = new mongoose.Schema(
    {
        firstname: String,
        lastname: String,
        email: String,
        mobile: String,
        password: String,
        role: { type: String, default: "user" },
        isBlocked: { type: Boolean, default: false },
        cart: { type: Array, default: [] },
        address: String,
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        refreshToken: String,
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
    },
    { timestamps: true },
);

const User = mongoose.model("User", userSchema);

async function createAdmin() {
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({
            email: "messaoudifarouk@gmail.com",
        });
        if (existingAdmin) {
            console.log("Admin already exists!");
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash("farouk123", salt);

        // Create admin user
        const admin = await User.create({
            firstname: "Farouk",
            lastname: "Messaoudi",
            email: "messaoudifarouk@gmail.com",
            mobile: "2129999999",
            password: hashedPassword,
            role: "admin",
            isBlocked: false,
        });

        console.log("✅ Admin created successfully!");
        console.log("Email: messaoudifarouk@gmail.com");
        console.log("Password: farouk123");
        console.log("Admin ID:", admin._id);

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
}

createAdmin();
