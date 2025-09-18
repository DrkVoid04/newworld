import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3, // changed from 3 to 6 to match the error message
    match: /^[a-zA-Z0-9]+$/,
    validate: {
      validator: (value) => /^[a-zA-Z0-9]+$/.test(value),
      message: 'Username must be alphanumeric'
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/i,
    validate: {
      validator: (value) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/i.test(value),
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password),
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  is_Admin:Boolean,
  mc_name:String,
  dc_Name:String,
  date:String,
  orderId:{
    type: Array,
    default:[]
  },
  token:{
    type: String,
    default: null
  }
});

const User = mongoose.model('User', UserSchema);

export default User;