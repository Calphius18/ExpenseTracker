const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    profileImageUrl: {
      type: String,
      default: null,
    },

    // 🧩 Role-Based Access Control Fields
    role: {
      type: String,
      enum: ["admin", "user", "viewer"], // valid roles
      default: "viewer", // everyone starts as read-only viewer
    },

    // User requests to become admin (handled by existing admins)
    pendingAdminRequest: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
