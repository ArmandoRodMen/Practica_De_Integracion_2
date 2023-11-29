import passport from "passport";
import { usersManager } from "./DAO/mongodb/managers/usersManager.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { hashData, compareData } from "./utils.js";
import { usersModel } from "./DAO/mongodb/models/users.model.js";

//local
passport.use(
    "signup", 
    new LocalStrategy(
        {passReqToCallback:true},
        async (req, username, password, done)=>{
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email || !password || !username) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData (password);
            const createdUser = await usersManager.createOne({
                ...req.body, 
                password: hashedPassword,
        });
        done(null, createdUser);
        }catch(error){
            done(error);
        }
}));

passport.use("login", new LocalStrategy({usernameField: "email"},async(email, password, done)=>{
    if (!email || !password) {
        done(null, false);
    }
    try {
        const user = await usersManager.findByEmail(email);
        if (!user) {
            return done(null, false);       
        }
        //const isPasswordValid = password === user.password;
        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
            return done(null, false);
        }
        /*
        const userId = user.id;
        console.log("userId", userId);
        const sessionInfo = (email === "adminCoder@coder.com" && password === "adminCod3r123")
            ? { email, first_name: user.first_name, isAdmin: true, isUser: false, userId}
            : { email, first_name: user.first_name, isAdmin: false, isUser: true, userId };
        req.session.user = sessionInfo;
        res.redirect(`/profile/${userId}`);
        */
        done(null,user);
    } catch (error) {
        done(error);
    }
}));

//github

passport.use(
    "github",
    new GithubStrategy(
    {
    clientID: "Iv1.631bd19c0e40fa18",
    clientSecret: "9995c6c0aab4f92864ba67db2055ca86b0ac9257",
    callbackURL: "http://localhost:8080/api/sessions/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try{
        const userDB = await usersManager.findByEmail(profile._json.email);
        if(userDB){
            if(userDB.isGithub){
                return done(null, userDB);
            }else{
                return done(null, false);
            }
        }
        const infoUser={
            first_name:profile._json.name.split(" ")[0],
            last_name:profile._json.name.split(" ")[1],
            email:profile._json.email,
            username:profile._json.login,
            password: " ",
            isGithub: true,
        }
        console.log(infoUser);
        const createdUser = await usersManager.createOne(infoUser);
        done(null, createdUser);
    }catch(error){
        done(error);
    }
}));

//google
passport.use(
    "google", 
    new GoogleStrategy(
    {
        clientID:     "857566804537-26m63sqqp1tirpkpeqa08kgh4is0vi43.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/api/sessions/auth/google/callback",
        usernameField: 'email',
    },
    async function(accessToken, refreshToken, profile, done) {
        try{
            const userDB = await usersManager.findByEmail(profile._json.email);
            if(userDB){
                if(userDB.isGoogle){
                    return done(null, userDB);
                }else{
                    return done(null, false);
                }
            }
            const infoUser={
                first_name:profile._json.given_name,
                last_name:profile._json.family_name,
                email:profile._json.email,
                username: profile._json.email,
                password: " ",
                isGoogle: true,
            }
            console.log(infoUser);
            const createdUser = await usersManager.createOne(infoUser);
            done(null, createdUser);
        }catch(error){
            done(error);
        }
    }
));


passport.serializeUser((user, done) =>{
    done(null, user._id);
});

passport.deserializeUser(async (id, done) =>{
    try{
        const user = await usersManager.findById(id);
        done(null, user);
    }catch(error){
        done(error);
    }
});

/*
//local
passport.use(
    "signup", 
    new LocalStrategy(
        {passReqToCallback:true},
        async (req, username, password, done)=>{
        const { first_name, last_name, email } = req.body;
        if (!first_name || !last_name || !email || !password || !username) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData (password);
            const createdUser = await usersManager.createOne({
                ...req.body, 
                password: hashedPassword,
        });
        done(null, createdUser);
        
        const userId = createdUser.id; 
        const redirectUrl = `/profile/${userId}`;
        //res.redirect(redirectUrl);
        
        }catch(error){
            done(error);
        }
}));
*/