const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    monthBilled: { type: String, default: "0" },
    isAdmin: { type: Boolean, default: false },
    isFrozen: { type: Boolean, default: false },
    lat: { type: String, required: true },
    lon: { type: String, required: true },
  },
  { timestamps: true }
);

// Virtual for user's full name
UserSchema.virtual("fullName").get(function () {
  return this.firstName + " " + this.lastName;
});

module.exports = mongoose.model("User", UserSchema);
