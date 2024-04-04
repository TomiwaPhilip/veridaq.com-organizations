import { Schema, model, models } from 'mongoose';

const RoleSchema = new Schema({
    email: {
        type: String,
        unique: [true, 'Email already exists!'],
        required: [true, 'Email is required!'],
      },
    firstName: {
        type: String,
        required: [true, 'Firstname is required!'],
    },
    lastName: {
        type: String,
        required: [true, 'LastName is required!'],
    },
    role: {
        type: String,
        enum: ['admin', 'workRefVeridaqRole', 'memStatusVeridaqRole', 'docRefVeridaqRole', 'stdStatusVeridaqRole'],
        required: [true, 'ADminsitrative role is required!']
    },
    loginType: {
        type: String,
        enum: ['email', 'google', 'linkedin'],
        // required: [true, 'The login type is required']
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: 'Organization'
    }
});

const Role = models.Role || model("Role", RoleSchema);

export default Role;