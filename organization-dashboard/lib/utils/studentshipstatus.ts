import { Schema, model, models } from "mongoose";

// Create the Mongoose schema based on StudentshipStatusValidation
const StudentshipStatusSchema = new Schema({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: [true, "Organization ID is required"],
  },
  firstName: { type: String, required: true, minlength: 1 },
  lastName: { type: String, required: true, minlength: 1 },
  middleName: String,
  currentLevel: { type: String, required: true, minlength: 1 },
  courseOfStudy: { type: String, required: true, minlength: 1 },
  studentId: { type: String, required: true, minlength: 1 },
  info: String,
  faculty: { type: String, required: true, minlength: 1 },
  entryYear: { type: Date, required: true, max: Date.now() },
  exitYear: Date,
  image: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User collection
  },
  issued: {
    type: Boolean,
    default: false,
    required: true,
  },
  dateIssued: {
    type: Date,
    default: Date.now,
  },
  dateRequested: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Mongoose model based on the schema
const StudentshipStatus =
  models.StudentshipStatus ||
  model("StudentshipStatus", StudentshipStatusSchema);

export default StudentshipStatus;
