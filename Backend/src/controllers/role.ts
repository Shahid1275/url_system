import{Request,Response} from 'express'
import {prismaClient} from '..'
import { error } from 'console';

export const user_role = async (req:Request, res:Response) => {
    try{
        const {role_name, description} = req.body;
        console.log(req.body);
        
        console.log(role_name);
        let user = await prismaClient.user_role.create ({
    data:{
        role_name: role_name,
        description: description
    }
    });
    
    if(user){
        res.status(200).send({message: "Role created successfully", user})
    }else{
        res.status(500).send({message: "Unable to create role"})
    }  
    }
    catch(err){
       res.status(500).send({error: err})
    }
};