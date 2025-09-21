require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../../models/User');

const uauth = require('../../middleware/userauthentication')

// http://localhost:5000/userlogreg/userreg
router.post('/userreg', async(req,resp)=>{
    const uname = req.body.uname
    const uemail = req.body.uemail
    const upass = await bcrypt.hash(req.body.upass,12);
    try {
        const UserData = new User({
            "uname":uname,
            "uemail":uemail,
            "upass":upass
        })
        const saveUser = await UserData.save();
        resp.json(saveUser);
    } catch (error) {
        console.log(error);
    }
})

// http://localhost:5000/userlogreg/userlog
router.post('/userlog', async(req,resp)=>{
    const uemail = req.body.uemail
    const upass = req.body.upass;
    try {
        const UserLogin = await User.findOne({uemail})
        if(!UserLogin){
            resp.json({'sts':1,"msg":"User Not Found"})
        }else{
            const ismatch = await bcrypt.compare(upass,UserLogin.upass);
            if(!ismatch){
                resp.json({'sts':2,"msg":"User Password is Wrong"})
            }else{
                const token = jwt.sign({id:UserLogin._id}, process.env.User_Token_SECRET_KEY,{expiresIn:'1hr'});
                resp.json({'sts':0,"token":token});
            }
        }
    } catch (error) {
        console.log(error);
    }
})

router.get('/testauth',uauth, async(req,resp)=>{
    resp.json({"msg":"This Route Called Success"})
})

module.exports = router;