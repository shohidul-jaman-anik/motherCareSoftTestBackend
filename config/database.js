const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO_URL, 
//     {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
// }
).then(() => {
    console.log("Database is Connected")
}).catch((error) => {
    console.log(error.message)
    process.exit(1)
})