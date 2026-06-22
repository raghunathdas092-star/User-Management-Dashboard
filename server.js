require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.use(session({
secret:process.env.SESSION_SECRET,
resave:false,
saveUninitialized:false
}));
mongoose.connect(process.env.MONGO_URI, {
serverSelectionTimeoutMS: 10000
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
app.use("/",require("./routes/auth"));
app.use("/data",require("./routes/data"));
app.listen(process.env.PORT,()=>{
console.log(`Server Running`);
});