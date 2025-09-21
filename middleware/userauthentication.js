require('dotenv').config();
const jwt = require('jsonwebtoken');

const UserAuthentication = (req,resp,next) =>{
    const header = req.header('Authorization');
    if(!header || !header.startsWith('Bearer ')){
        resp.json({'sts':"1","msg":"Token not found or Invalid"})
    }else{
        const token = header.split(' ')[1]
        try {
            const verified = jwt.verify(token,process.env.User_Token_SECRET_KEY);
            req.user= verified;
            console.log(req.user);
            next();
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = UserAuthentication;