const User = require('../../models/user.Model')
const OTP = require('../../models/otp.Model')
const bcrypt = require('bcrypt');
const env = require('dotenv')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
// const { getMaxListeners } = require("process");
// const { read } = require('fs');
const otpGenerator = require('otp-generator');
const req = require('express/lib/request');
env.config()

exports.signup = async (req, res) => {
    try {
        const userFind = await User.findOne({ email: req.body.email })
        if (userFind) {
            return res.status(400).json({
                Message: 'User already registered'
            })
        } else {
            const password = await bcrypt.hash(req.body.password, 10);
            // const newUser = new User({
            //     firstName: req.body.firstName,
            //     lastName: req.body.lastName,
            //     email: req.body.email,
            //     hash_password: password,
            //     phone_number: req.body.phone_number,
            //     sex: req.body.sex,
            //     date_of_birth: req.body.date_of_birth,
            //     employee: req.body.employee
            // })
            // if (req.file) {
            //     newUser.userImage = req.file.filename
            // }

            let firstName = req.body.firstName
            let lastName = req.body.lastName
            let email = req.body.email
            let hash_password = password
            let phone_number = req.body.phone_number
            let sex = req.body.sex
            let date_of_birth = req.body.date_of_birth
            let employee = req.body.employee
            if (req.file) {
                let userImage = req.file.filename
            }

            const newOTP = otpGenerator.generate(6,
                { digits: true, alphabets: false, upperCaseAlphabets: false, specialChars: false }
            )
            const newOtp = new OTP({
                otp: newOTP,
                firstName: firstName,
                lastName: lastName,
                email: email,
                hash_password: hash_password,
                phone_number: phone_number,
                sex:sex,
                date_of_birth: date_of_birth,
                employee: employee
            })
            const saveOtp = await newOtp.save()
            res.status(200).json({ saveOtp })
        }
    } catch (error) {
        res.status(500).json({ error })
    }
}

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
            const isPassword = await user.comparePassword(req.body.password)
            if (isPassword) {
                const token = await jwt.sign({ _id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '2h' })
                const { _id,
                    firstName,
                    lastName,
                    fullName,
                    email,
                    phone_number,
                    sex,
                    date_of_birth,
                    address,
                    employee,
                    role } = user
                res.status(200).json({
                    token,
                    user: {
                        _id,
                        firstName,
                        lastName,
                        fullName,
                        email,
                        phone_number,
                        sex,
                        date_of_birth,
                        address,
                        employee,
                        role
                    }
                })
            } else {
                return res.status(404).json({
                    Message: 'Password is Wrong'
                })
            }

        } else {
            return res.status(404).json({
                Message: 'User is not Found'
            })
        }

    } catch (error) {
        res.status(500).json({ error })
    }
}

//  Update User Information
exports.updateUser = async (req, res) => {
    try {
        const userUpdate = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone_number: req.body.phone_number,
            sex: req.body.sex,
            date_of_birth: req.body.date_of_birth,
            address: req.body.address
        }
        if (req.body.password) {
            const password = await bcrypt.hash(req.body.password, 10);
            userUpdate.hash_password = password
        }
        if (req.file) {
            userUpdate.userImage = req.file.name
        }
        const user = await User.findOneAndUpdate({ email: req.body.email }, userUpdate, { new: true })
        if (user) {
            res.status(200).json({
                Message: "Update Successfully",
                UserUpdated: user
            })
        } else {
            res.status(400).json({
                Message: "Update Failure"
            })
        }
    } catch (error) {
        res.status(500).json({ Error: error })
    }
}

// User Send Mail
exports.userSendMail = async (req, res) => {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'minhhoangv190200@gmail.com', // generated ethereal user
            pass: '39859592aA', // generated ethereal password
        },
    });

    const mailOptions = {
        from: req.body.email, // sender address
        to: "minhhoangv190200@gmail.com", // list of receivers
        subject: `Message From ${req.body.email}`, // Subject line
        text: req.body.message, // plain text body
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.status(500).json({
                error: error
            })
        }

        res.status(200).json({
            message: 'Send Mail Successfully'
        })
    })
}