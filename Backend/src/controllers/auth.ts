
import { Request, response, Response } from 'express';
import { prismaClient } from '..';
import { error } from 'console';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { z } from 'zod';
import { request } from 'http';


const signupSchema = z.object({
  email: z.string().email(),
  password_hash: z.string().min(6),
  username: z.string().min(3),
  role_id: z.number().positive(),
});

const loginSchema = z.object({
  username: z.string(),
  password_hash: z.string().min(6),
  // role_id:z.number().positive()
});

export const signup = async (req: Request, res: Response) => {
  console.log("REQUEST BODY: ",req.body)
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: 'Invalid input', errors: result.error.errors });
  }
  else{
    const { email, password_hash, username, role_id } = result.data;

    try {
      let user = await prismaClient.user.findFirst({ where: { email } });
      if (user) {
        return res.status(409).send('User Already exists!');
      }
      const newUser = await prismaClient.user.create({
        data: {
          username,
          email,
          password_hash: hashSync(password_hash, 10),
          role_id,
        },
      });
      console.log(newUser, ":::::::::::");
      res.json(newUser);
    } catch (error) {
      console.log(error, "@@@@@");
      return res.status(500).send({ error });
    }
  };
  
  }
export const login = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: 'Invalid input', errors: result.error.errors });
  }
  else{

    const { username, password_hash } = result.data;

  try {
    let user = await prismaClient.user.findFirst({ where: { username } });
    console.log("USER = ",user);
    if (!user) {
      return res.status(404).send('User does not exist!');
    }

    if (!compareSync(password_hash, user.password_hash)) {
      return res.status(400).send('Incorrect password!');
    }

    const token = jwt.sign(
      { 
        userId: user.user_id,
        username: user.username,
        email: user.email,  
        role_id: user.role_id
      },
      JWT_SECRET
    );
    console.log("token = ",token);
    res.json({ token });
   

  } catch (error) {
    console.log(error, "@@@@@");
    return res.status(500).send({ error });
  }
  }
}
  export const getUserRoles = async (req: Request, res: Response) => {
    try {
      const roles = await prismaClient.user_role.findMany({ where: { is_deleted: false } });
      res.json(roles);
    } catch (error) {
      res.status(500).send({ error });
    }
  }
  export const getUserRoleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const role = await prismaClient.user_role.findUnique({ where: { role_id: Number(id) } });
      if (!role || role.is_deleted) {
        return res.status(404).send('Role not found');
      }
      res.json(role);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
  export const getUsers = async (req: Request, res: Response) => {
    try {
      const users = await prismaClient.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
  
  export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await prismaClient.user.findUnique({ where: { user_id: id } });
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
  export const updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role_name, description } = req.body;
  
    try {
      const updatedRole = await prismaClient.user_role.update({
        where: { role_id: Number(id) },
        data: { role_name, description, updated_at: new Date() },
      });
      res.json(updatedRole);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
  export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, password, role_id } = req.body;
  
    try {
      const updatedUser = await prismaClient.user.update({
        where: { user_id:(id) },
        data: { username, email, password_hash: hashSync(password, 10), role_id, updated_at: new Date() },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send({ error });
    }
  };
  export const deleteUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      await prismaClient.user_role.update({
        where: { role_id: Number(id) },
        data: { is_deleted: true, deleted_at: new Date() },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).send({ error });
    }
  };
  export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      await prismaClient.user.update({
        where: { user_id:(id) },
        data: { is_deleted: true, deleted_at: new Date() },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).send({ error });
    }
  };
    
  