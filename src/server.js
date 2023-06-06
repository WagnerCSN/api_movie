require("express-async-errors")

const express = require("express");
const AppError = require("./utils/AppError")
const route = require("./routes");
const migrationsRun = require("./database/sqlite/migrations")
const uploadConfig = require("./configs/upload");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(route)

migrationsRun()
app.use((error, request, response, next) => {
    if(error instanceof AppError) //erro gerado pelo criente
     {
         return response.status(error.statusCode).json({
             message: error.message,
             status: "error"
         })
     }

     console.error(error);

     return response.status(500).json({
        status: "error",
        message: "Internal server error"
     })
});


const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));