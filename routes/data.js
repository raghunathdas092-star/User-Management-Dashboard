const express = require("express");

const router = express.Router();

const FormData =
require("../models/FormData");

const isAuthenticated =
require("../middleware/authMiddleware");

router.post(
"/save",
isAuthenticated,
async(req,res)=>{

    const form = new FormData(req.body);

    await form.save();

    res.send("Data Saved");
});

router.get(
"/all",
isAuthenticated,
async(req,res)=>{

    const data =
    await FormData.find();

    res.json(data);
});

module.exports=router;