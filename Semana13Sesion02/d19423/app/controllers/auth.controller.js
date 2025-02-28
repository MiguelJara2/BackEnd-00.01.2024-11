const db = require('../models');
const bcrypt = require('bcrypt');

const User = db.user;
const Role = db.role;

exports.signup= (req,res)=>{

   try{
        let password =  bcrypt.hashSync(req.body.password, 8)
        
    
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: password
    });
    console.log(user)
    user.save((err,user)=>{
        if(err){
            res.status(500).send({message:err});
            return;
        }
        if(req.body.roles){
            Role.find({
                name: {$in: req.body.roles}
            }),(err,roles)=>{
                if(err){
                    res.status(500).send({message:err});
                    return;
                }
                user.roles = roles.map((role)=>role._id);
                user.save((err)=>{
                    if(err){
                        res.status(500).send({message:err});
                        return;
                    }
                    res.send({message: "Usuario Creado Correctamente"})
                })
            }
        }
        else{
            
            Role.findOne({name:"user"}, (err,role)=>{
                if(err){
                    res.status(500).send({message:err});
                    return;
                }
                console.log(role)
                user.role= [role._id];
                user.save((err)=>{
                    if(err){
                        res.status(500).send({message:err});
                        return;
                    }
                    res.send({message: "Usuario Creado Correctamente"})
                })
            })
        }
    })
   }catch(err){
    console.log(err)
   }
}