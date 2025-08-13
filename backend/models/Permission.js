const mongoose = require('mongoose');

// Check if model is already compiled to prevent OverwriteModelError
const Permission = mongoose.models.Permission || mongoose.model('Permission', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true }));

module.exports = Permission;