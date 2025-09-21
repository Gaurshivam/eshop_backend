require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const Admin = require('../../models/Admin');
const AdminToken = require('../../models/Admintoken');
const AdminPassReset = require('../../models/AdminPassReset');
const { sendEmail } = require('../../CommonSnips/EmailSender');

const router = express.Router();


// http://localhost:5000/adminloginapi/createadmin
router.post('/createadmin', async (req, resp) => {
    try {
        const newAdmin = new Admin({
            admin_name: req.body.admin_name,
            admin_email: req.body.admin_email,
            admin_pass: await bcrypt.hash(req.body.admin_pass,12),
        })

        const saveAdmin = await newAdmin.save();
        resp.status(200).json(saveAdmin);
    } catch (error) {
        resp.status(500).json({ 'error:': error })
    }
});

// http://localhost:5000/adminloginapi/adminlogin
router.post('/adminlogin',async(req, resp)=>{
    const admin_email = req.body.admin_email;
    const admin_pass = req.body.admin_pass;

    try {
        const login = await Admin.findOne({admin_email});
        if(!login){
            return resp.json({"sts":1,"msg":"Email Id is not found"})
        }else{
            if(await bcrypt.compare(admin_pass,login.admin_pass)){
                const token = jwt.sign({adminId:login._id}, process.env.SECRET_KEY_code,{expiresIn:'1hr'});
                const expiresAt = new Date(Date.now()+(60*60*1000));
                const AdminTokenSave = new AdminToken({
                    adminId:login._id,
                    token, expiresAt
                })

                const aid = login._id;
                const aname = login.admin_name;
                const aemail = login.admin_email

                await AdminTokenSave.save();
                return resp.json({"sts":0,"msg":"Login success",aid,aname,aemail, token});
            }else{
                return resp.json({"sts":2,"msg":"Password is Wrong"}) 
            }
        }
        
    } catch (error) {
        resp.status(500).json({'error':error});
    }
});

// http://localhost:5000/adminloginapi/checktoken
router.post('/checktoken', async (req, resp)=>{
    const token = req.body.token

    try {
        const tokenchk = await AdminToken.findOne({token});
        if(!tokenchk){
            return resp.json({'tokensts':1})//no token found
        }else{
             return resp.json({'tokensts':0})//token found
        }
    } catch (error) {
        console.log(error)
    }
})

// http://localhost:5000/adminloginapi/updatepass
router.post('/updatepass', async (req, resp)=>{
    const admin_email = req.body.admin_email;
    const old_pass = req.body.old_pass;
    const admin_pass = req.body.admin_pass;
    try {
        const passchk = await Admin.findOne({admin_email});
        if(await bcrypt.compare(old_pass,passchk.admin_pass)){
            // console.log({"msg":"old password is matched"})
            const hasadmin_pass = await bcrypt.hash(admin_pass,12)
            const updateAdminPass = await Admin.findOneAndUpdate(
                {admin_email:admin_email},
                {$set:{admin_pass:hasadmin_pass}},
                {new:true}
            )
            resp.json({"cpasssts":0,"msg":"password is changed"})
        }else{
            resp.json({"cpasssts":1,"msg":"password Not changed as old pass don't match"})
        }
    } catch (error) {
        console.log(error)
    }
})

// http://localhost:5000/adminloginapi/logout
router.post('/logout' ,async(req,resp)=>{
    const token = req.body.token
    try {
        const logout = await AdminToken.findOneAndDelete({token});
        if(!logout){
            return resp.json({'logoutsts':1,'msg':"Logout Failed"})
        } else{
            return resp.json({'logoutsts':0,'msg':"Successfully Logout"})
        }
    } catch (error) {
        console.log(error)
    }
})

// http://localhost:5000/adminloginapi/sendresetlink
router.post('/sendresetlink',async(req,resp)=>{
    const admin_email = req.body.admin_email
    try {
        const findadmin = await Admin.findOne({admin_email});
        if(!findadmin){
            return resp.json({'sts':1,'msg':'email not found'})
        }else{
            const subject = "E-shop : Reset Password link";
            const reset_token = shortid.generate();
            const expiresAt = new Date(Date.now()+(60*60*1000));
            const text = `Your Reset password link is : http://localhost:3000/adminpassreset/${reset_token}`;

            const saveResetToken = new AdminPassReset({
                admin_email,
                reset_token,
                expiresAt
            })

            const result = await saveResetToken.save();
            // sendEmail(admin_email,subject,text);
            return resp.json({'sts':'0','msg':'Your reset link has sent','reset_url':`http://localhost:3000/adminpassreset/${reset_token}`})
        }
    } catch (error) {
        console.error(error);
    }
})

// http://localhost:5000/adminloginapi/resetpass
router.post('/resetpass',async(req,resp)=>{
    const reset_token = req.body.reset_token;
    const admin_pass = await bcrypt.hash(req.body.admin_pass,12);
    try {
        const findadmin = await AdminPassReset.findOne({reset_token})
        if(!findadmin){
            return resp.json({"sts":1,"msg":"Your link is expired"});
        }else{
            const admin_email = findadmin.admin_email
            const updateAdminPass = await Admin.findOneAndUpdate(
                {admin_email:admin_email},
                {$set:{admin_pass:admin_pass}},
                {new:true}
            )
            const deltoken = await AdminPassReset.findOneAndDelete({reset_token})
            return resp.json({"sts":0,"msg":"Your password is updated"});
        }
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;