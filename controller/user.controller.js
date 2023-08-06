const User = require("../models/user.model");




const fs = require('fs');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');

exports.getUploadForm = (req, res) => {
    res.render('uploadForm'); // Render the uploadForm.ejs view
  };
  
  exports.uploadUsers = async (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send('No file selected.');
    }
  
    const filePath = file.path;
    const fileExtension = file.originalname.split('.').pop();
  
    try {
      if (fileExtension === 'csv') {
        // For CSV files
        const usersData = await handleCSV(filePath);
        await User.insertMany(usersData);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // For XLXS or XLS files
        const usersData = await handleXLXS(filePath);
        await User.insertMany(usersData);
      } else {
        return res.status(400).send('Invalid file format.');
      }
  
      // Remove the uploaded file from the server
      fs.unlinkSync(filePath);
  
      return res.status(200).send('File uploaded successfully.');
    } catch (error) {
      console.error('Error saving users to the database:', error);
      return res.status(500).send('Error saving users to the database.');
    }
  };
  
  function handleCSV(filePath) {
    return new Promise((resolve, reject) => {
      const usersData = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          usersData.push({
            name: row.name,
            age: parseInt(row.age),
            email: row.email,
            phone: row.phone,
            gender: row.gender,
          });
        })
        .on('end', () => {
          resolve(usersData);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }
  
  function handleXLXS(filePath) {
    return new Promise((resolve, reject) => {
      const usersData = [];
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
      sheetData.forEach((row) => {
        usersData.push({
          name: row.name,
          age: parseInt(row.age),
          email: row.email,
          phone: row.phone,
          gender: row.gender,
        });
      });
  
      resolve(usersData);
    });
  }
  



module.exports.getUser = async (req, res) => {
    try {
        let query = User.find({});

        // Filtering tasks based on parameters
        if (req.query.status) {
            query = query.where('gender').equals(req.query.status);
        }


        // Sorting tasks based on parameters
        if (req.query.sort) {
            const sortField = req.query.sort;
            const sortOrder = req.query.order === 'desc' ? -1 : 1;
            query = query.sort({ [sortField]: sortOrder });
        }

         // Search by name, age, or email
         if (req.query.search) {
            const searchRegex = new RegExp(req.query.search, 'i');
            query = query.or([
                { name: searchRegex },
                { age: searchRegex },
                { email: searchRegex },
            ]);
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

// module.exports.addUser = async (req, res) => {
//     try {
//         const result = await User.create(req.body)

//         res.status(200).json({
//             status: "Success",
//             message: "Insert user successfully"
//         })
//     } catch (error) {

//         res.status(400).json({
//             status: "fail",
//             message: "User couldn't insert",
//             error: error.message
//         })
//     }
// }