const express = require('express')
const router = express.Router()

const userController = require("../controller/user.controller")

router.route('/:id')
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/')
    .get(userController.getUser)


module.exports = router;