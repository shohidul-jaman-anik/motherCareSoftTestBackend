
const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
})

const Auth = mongoose.model("authentication", authSchema)


module.exports = Auth

