import { Router } from "express";
import { usersManager } from "../DAO/mongodb/managers/usersManager.js";
import { hashData, compareData, generateToken } from "../utils.js";
import passport from "passport";
import { messagesManager } from "../DAO/mongodb/managers/messagesManager.js";

const router = Router();

router.post("/signup", passport.authenticate("signup"), async (req, res) => {
    const { first_name, last_name, email, password, username } = req.body;
    
    if (!first_name || !last_name || !email || !password || !username) {
    return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const hashedPassword = await hashData(password);
        const existingUser = await usersManager.findByEmail(email);
        const redirectUrl = `/login`;
        if (existingUser) {
            return res.redirect(redirectUrl);
        }
        const createdUser = await usersManager.createOne({...req.body, password:hashedPassword});
        const userId = createdUser.id; 
        
        res.redirect(redirectUrl);
    } catch (error) {
    res.status(500).json({ error });
    }
});

router.post("/login", passport.authenticate("login"),  async (req, res) => {
const { email, password } = req.body;
if (!email || !password) {
    return done(null, false, {message: "Some data is missing"});
}
try {
    const user = await usersManager.findByEmail(email);
    console.log("user", user);
    if (!user) {
        return done(null, false, {message: "Username is not valid"});
    }
    const isPasswordValid = await compareData(password, user.password);
    console.log("password", isPasswordValid);
    if (!isPasswordValid) {
        return done(null, false, {message: "Password is not valid"});
    }
    const userId = user.id;
    console.log("userId", userId);

    /*
    const sessionInfo = (email === "adminCoder@coder.com" && password === "adminCod3r123")
        ? { email, first_name: user.first_name, isAdmin: true, isUser: false, userId}
        : { email, first_name: user.first_name, isAdmin: false, isUser: true, userId };
    req.session.user = sessionInfo;

    res.redirect(`/profile/${userId}`);
    */
    const {first_name, last_name, role} = user; 
    const token = generateToken({first_name, last_name, email, role});
    //res.json({message: "Token", token});
    
    res
        .status(200)
        .cookie("token", token, {maxAge:60000, httpOnly: true})
        .redirect("/products");
} catch (error) {
    done(error);;
}
});

router.get(
    "/current", passport.authenticate("jwt", {session: false}), async(req,res) =>{
        const {name} = req.body;
        console.log("Role de usuario: ", req.user.role);
        if (req.user.role === "user"){
            return res.status(403).json({message: "Hi! you have an user role"});
        }
        if (req.user.role === "admin"){
            return res.status(403).json({message: "Hi! you have an admin role"});
        }
        if (req.user.role === "premium"){
            return res.status(403).json({message: "Hi! you have a premium role"});
        }
        if (!name){
            return res.status(400).json({message: "Name is missing"});
        }
    }
);


/*
// SIGNUP - LOGIN - PASSPORT LOCAL

    
    router.post(
        "/signup",
        passport.authenticate("signup", {
        successRedirect: "/products",
        failureRedirect: "/error",
        })
    );
    
    router.post(
        "/login",
        passport.authenticate("login", {
        successRedirect: "/products",
        failureRedirect: "/error",
        })
    );
    
*/

    // SIGNUP - LOGIN - PASSPORT GITHUB
    
    router.get(
        "/auth/github",
        passport.authenticate("github", { scope: ["user:email"] })
    );
    
    router.get("/callback", passport.authenticate("github"), (req, res) => {
        res.redirect("/products");
    });

    // SIGNUP - LOGIN - PASSPORT GOOGLE

    router.get(
        '/auth/google',
        passport.authenticate('google', { scope:[ 'email', 'profile' ] })
    );

    router.get( 
        '/auth/google/callback',
        passport.authenticate( 'google', { failureRedirect: '/error'}),
        (req, res)=>{
            res.redirect("/products");
        }
        );

router.get("/signout", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/login");
    });
});

router.post("/restaurar", async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await usersManager.findByEmail(email);
        if (!user) {
            return res.redirect("/");
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({message: "Password updated"});
        res.status();
    }catch(error){
        res.status(500).json({error});
    }
});


export default router;


