const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Auth = require('../models/auth.model');
const saltRounds = 10;

// Register  Route
module.exports.registerUser = async (req, res) => {
    try {
        const user = await Auth.findOne({ username: req.body.username })

        if (user) return res.status(400).send("User already exixt")

        bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
            const newUser = new Auth({
                username: req.body.username,
                password: hash,
            })

            await newUser.save().then((user) => {
                res.send({
                    success: true,
                    message: "User is created successfully",
                    user: {
                        id: user._id,
                        username: user.username
                    }
                })
            }).catch((error) => {
                console.log(error)
                res.send({
                    success: false,
                    message: "User is not created",
                    error: error
                })
            })
        });
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// Login  Route
module.exports.loginUser = async (req, res) => {

    console.log(req.body)

    const user = await Auth.findOne({ username: req.body.username })
    if (!user) {
        return res.status(401).send({
            success: false,
            message: "User is not found"
        })
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).send({
            success: false,
            message: "Incorrect Password"
        })
    }

    const payload = {
        id: user._id,
        username: user.username
    }
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "2d" })

    return res.status(200).send({
        success: true,
        message: "User is login successfully",
        token: "Bearer " + token
    })
}
