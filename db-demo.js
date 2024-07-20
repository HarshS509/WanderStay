const mongoose = require("mongoose");

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://harshsojitra222:2PNCdrpIE2WjR31b@cluster0.qizer0g.mongodb.net/abc"
    );
    // console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Guest Schema
const guestSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  nationality: {
    type: String,
  },
  nationalId: {
    type: String,
  },
  countryFlag: {
    type: String,
  },
});

const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);

// Get guest by email
async function getGuest(mail) {
  try {
    const guest = await Guest.findOne({ email: mail });
    if (!guest) {
      // console.log(`Guest not found for email: ${mail}`);
      return null;
    }
    return guest;
  } catch (error) {
    console.error("Error in getGuest:", error);
    throw new Error("Failed to retrieve guest");
  }
}

// Create new guest
async function createGuest(newGuest) {
  try {
    const guest = new Guest(newGuest);
    const savedGuest = await guest.save();
    // console.log("New guest created:", savedGuest);
    return savedGuest;
  } catch (error) {
    console.error("Error in createGuest:", error);
    throw new Error("Guest could not be created");
  }
}

// Sign in function
async function signIn({ user }) {
  try {
    await connectDB(); // Ensure DB connection before operations
    let guest = await getGuest(user.email);
    if (!guest) {
      // console.log("Creating new guest:", user.email);
      guest = await createGuest({ email: user.email, fullName: user.name });
    } else {
      // console.log("Existing guest found:", guest);
    }
    return true;
  } catch (error) {
    console.error("Failed to sign in:", error);
    return false;
  }
}

// Test the signIn function
(async () => {
  try {
    const result = await signIn({
      user: {
        name: "John Doe",
        email: "john.doe123@example.com",
      },
    });
    // console.log("Sign in result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
})();
