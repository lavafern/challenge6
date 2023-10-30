require("dotenv").config()

const express = require("express")
const app = express()
const {PORT} = process.env
const router = require("./routes/index.routes")

app.use(express.json())
app.use("/api/v1",router)

app.get("/",(req,res) => {
    res.json({
        status : "succes",
        message : "hello world",
        data : null
    })
})

app.use((err ,req ,res ,next )  =>  {
    console.log(err);
    if (err.cause === 400) {
        const result = {
            status : "error",
            message : err.message,
            data : null
        }
        return res.status(400).json(result)
    }

    if (err.cause === 401) {
        const result = {
            status : "error",
            message : err.message,
            data : null
        }
        return res.status(401).json(result)
    }

    const result = {
        status : "error",
        message : err.message,
        data : null
    }
    
    res
            .status(500)
            .json(result)
})

app.use((req,res,next) => {
    res.status(404).json({
        status : "error",
        message : "404 not found",
        data : null
    })
})

app.listen(PORT,() => console.log('listening on port',PORT)
 )