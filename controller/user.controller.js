const User = require("../models/user.model");
const Task = require("../models/user.model")

module.exports.getTask = async (req, res) => {
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


