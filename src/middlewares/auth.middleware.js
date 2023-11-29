/*
export const authMiddleware = (req, res, next) =>{
    const {user} = req;
    if(user.email === "adminCoder@coder.com"){
        next();
    }else{
        res.send("Not authorized");
    }
};*/

export const authMiddleware = (role) =>{
    return(req, res, next)=>{
        if(req.user.role !== role){
            return res.status(403).json("Not authorized");
        }
        next();
    };
};