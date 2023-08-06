const express = require('express')
const router = express.Router()
const userController = require("../controller/user.controller")

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


router.route('/:id')
    .patch(userController.updateUser)
    .delete(userController.deleteUser)

router.route('/')
    .get(userController.getUser)
    // .post(userController.addUser)


router.get('/', userController.getUploadForm);
router.post('/', upload.single('file'), userController.uploadUsers);

module.exports = router;