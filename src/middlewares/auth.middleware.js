export const authMiddleware = (req, res, next) =>{
    const {user} = req;
    if(user.email === "adminCoder@coder.com"){
        next();
    }else{
        res.send("Not authorized");
    }
};