import { Schema, model, models } from "mongoose";

const MembershipReferenceSchema = new Schema({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: [true, "Organization ID is required"],
  },
  firstName: { type: String, required: true, minlength: 1 },
  lastName: { type: String, required: true, minlength: 1 },
  middleName: String,
  id: { type: String, required: true, minlength: 1 },
  info: { type: String, required: true, minlength: 1 },
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
  badgeUrl: {
    type: String,
    default: null,
  }
});

// Create and export the Mongoose model based on the schema
const MembershipReference =
  models.MembershipReference ||
  model("MembershipReference", MembershipReferenceSchema);

export default MembershipReference;
