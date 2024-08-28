import { Router } from 'express'
import { signup, login ,getUserRoles, getUserRoleById, getUsers, getUserById, updateUserRole, updateUser, deleteUserRole, deleteUser } from '../controllers/auth';
const authRoutes:Router = Router();
import {user_role} from "../controllers/role"

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/user_role', user_role)
//user roles routes
authRoutes.get('/roles',getUserRoles)
authRoutes.get('/roles/:id', getUserRoleById);
authRoutes.put('/roles/:id', updateUserRole);
authRoutes.delete('/roles/:id', deleteUserRole);

//user routes
authRoutes.get('/users', getUsers);
authRoutes.get('/users/:id', getUserById);
authRoutes.put('/users/:id', updateUser);
authRoutes.delete('/users/:id', deleteUser);


export default authRoutes;
