import prismaClient from "../lib/db";
import {randomBytes, createHash} from 'node:crypto'

const createPayload={
    firstName:String,
    lastName:String,
    email:String,
    password:String
};

class UserService{
    createUser(payload){
        const {firstName,lastName,email,password} = payload;

        console.log(payload);

        const salt= randomBytes(32).toString();
        const hashedPassword= createHash('sha256',salt).update(password).digest('hex');

        return prismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                password:hashedPassword,
                salt:"randomeSaltValue",
            }
        })
    }
}

export default new UserService();
export {createPayload};