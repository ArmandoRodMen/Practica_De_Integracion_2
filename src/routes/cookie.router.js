import { Router } from "express";

const router = Router();

//Cookie
/*
router.post("/", (req, res) =>{
    const {email} = req.body;
    res.cookie("user", email,{maxAge:10000}).send("Cookie created");
});*/

//Session
router.post("/", (req, res) =>{
    const {name, email} = req.body;
    req.session.name= name;
    req.session.email = email;
    res.send("session");
});

router.get("/view", (req, res)=>{
    console.log("view",req.cookies);
    res.send("View cookies");
});

export default router;