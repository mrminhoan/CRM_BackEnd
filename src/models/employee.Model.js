const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
// const { default: mongoose } = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        trim: true,
        min: 3,
        max: 30
    },
    lastName: {
        type: String,
        trim: true,
        min: 3,
        max: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hash_password: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        trim: true,
        max: 12
    },
    room_name: {
        type: String,
    },
    role: {
        type: String,
        enum: ['Admin', 'Employee'],
        default: "Employee"
    },
}, { timestamps: true })

employeeSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

employeeSchema.methods = {
    comparePassword: async function (password) {
        return await bcrypt.compare(password, this.hash_password);
    },
};

module.exports = mongoose.model('Employee', employeeSchema)