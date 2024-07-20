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
const cabinSchema = new mongoose.Schema({
  created_at: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
  },
  maxCapacity: {
    type: Number,
    required: true,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Cabin = mongoose.models.Cabin || mongoose.model("Cabin", cabinSchema);

// Get guest by email
async function getCabin(id) {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }

    const cabin = await Cabin.findById(id);
    if (!cabin) {
      throw new Error("Cabin not found");
    }

    return cabin;
  } catch (error) {
    notFound();
    if (error.message === "Invalid ID format") {
      throw new Error("Provided ID is not valid. Please check the ID format.");
    } else if (error.message === "Cabin not found") {
      throw new Error("No cabin found with the given ID.");
    } else {
      throw new Error(
        "An error occurred while retrieving the cabin. Please try again later."
      );
    }
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
async function signIn(id) {
  try {
    await connectDB(); // Ensure DB connection before operations
    let cabin1 = await getCabin(id);
    if (!cabin1) {
      console.log("no cabin there");
    } else {
      console.log("Existing cabin found:", cabin1);
    }
    return true;
  } catch (error) {
    console.error("Failed to look", error);
    return false;
  }
}

// Test the signIn function
(async () => {
  try {
    const result = await signIn("669136be60ce665a39ebd2b0");
    // console.log("Sign in result:", result);
  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
  }
})();
