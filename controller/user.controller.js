const User = require("../models/user.model");

module.exports.getUser = async (req, res) => {
    try {
        let query = User.find({});

        // Filtering tasks based on parameters
        if (req.query.status) {
            query = query.where('status').equals(req.query.status);
        }


        // Sorting tasks based on parameters
        if (req.query.sort) {
            const sortField = req.query.sort;
            const sortOrder = req.query.order === 'desc' ? -1 : 1;
            query = query.sort({ [sortField]: sortOrder });
        }

        const result = await query.exec();

        res.status(200).json({
            status: "Success",
            message: "Get user successfully",
            data: result
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: "Couldn't get user",
            error: error.message
        });
    }
};


module.exports.updateUser = async (req, res, next) => {
    try {
        const id = req.params.id
        console.log(id)
        const result = await User.updateOne({ _id: id }, req.body, { runValidators: true })
        if (result.nModified === 0) {
            return res.status(200).json({
                status: "Fail",
                message: "Couldn't update the user"
            })
        }
        return res.status(200).json({
            status: "Success",
            message: "Successfully update the user",
            data: result
        })
    } catch (error) {
        console.log(error, "error")
        res.status(200).json({
            status: "Fail",
            message: "Couldn't update the user",
            error: error.message
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.deleteOne({ _id: id })

        if (!result.deletedCount) {
            return res.status(400).json({
                status: "Fail",
                error: "Could't delete the user"
            })
        }
        res.status(200).json({
            status: "Success",
            message: "User Delete Successfully",
            data: result
        })
    } catch (error) {
        res.status(400).json({
            status: "Fail",
            message: "User couldn't Delete Successfully",
            error: error.message
        })
        console.log(error, 'error')
    }
}
