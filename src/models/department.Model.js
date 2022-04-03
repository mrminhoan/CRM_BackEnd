const mongoose = require('mongoose')

const DepartmentSchema = new mongoose.Schema({
    name:{
        type: String,
        enum:["Marketing", "CSKH"]
    },
    demartmentID:{
        type: String
    }
})


module.exports = mongoose.model('Department', DepartmentSchema)