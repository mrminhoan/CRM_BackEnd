const Employee = require('../../models/employee.Model')
const Demartment = require('../../models/department.Model')
const env = require('dotenv')

exports.createDepartment = async (req, res) => {
    try {
        const newDepartment = new Demartment({
            name: req.body.name
        })
        await newDepartment.save()
        res.status(200).json({
            newDepartment
        })
    } catch (error) {
        res.status(400).json({error})
    }
}

exports.getDepartment = async (req, res) => {
    try {
        const department = await Demartment.find({})
        res.status(200).json(department)
    } catch (error) {
        res.status(400).json({error})
    }
}