import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../model.ts/userModel";
import jwt from "jsonwebtoken";
import sendEmail from "../helpers/Email";





class UserController {

    async signUp(req: Request, res: Response) {
        try {
            const { name, mail, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await UserModel.findOne({ where: { mail: mail } });
            if (existingUser) return res.status(409).send({ message: "User Already Exists" })


            const user = await UserModel.create({ name, mail, password: hashedPassword });
            const id = user.id
            res.status(200).json({ message: "User Registered Successfully", user,id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred during signup.' });
        }
    };


    async updateUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const upDetails = req.body
           
            if(upDetails.password){
                const upHashPass = await bcrypt.hash(upDetails.password, 10);
                upDetails.password = upHashPass
            }

            const checkUser = await UserModel.findByPk(id);
            if (!checkUser) {
                return res.status(404).json({ message: "Data Not Found" });
            }
            await checkUser.update(upDetails);
            res.status(200).json({ message: "Updated", data: checkUser })
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Server Error..." });
        }
    }


    async deleteUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const checkUser = await UserModel.findByPk(id);
            if (!checkUser) {
                return res.status(404).json({ message: "Data Not Found" });
            }
            await checkUser.destroy();
            res.status(200).json({ message: "Deleted", })
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Server Error..." });
        }
    }


    async getUser(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const checkUser = await UserModel.findByPk(id);
            if (!checkUser) {
                return res.status(404).json({ message: "Data Not Found" });
            }
            res.status(200).json({ userData: checkUser });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Server Error..." });
        }
    }




    async getAllUser(req: Request, res: Response) {
        try {
            const allUsers = await UserModel.findAll();
            if (!allUsers) {
                return res.status(404).json({ message: "Data Not Found" });
            }
            res.status(200).json({ allData: allUsers });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: "Server Error..." });
        }
    }



async userSign (req:Request,res:Response){
    try{
        const userDetail = {
            mail:req.body.mail,
            password:req.body.password
        }
        const existingUser = await UserModel.findOne({where:{mail:userDetail.mail}});
        if(!existingUser) {
        return res.status(200).json(`User Does Not Exists`);}
        else{
            const hash = await bcrypt.compareSync(userDetail.password, existingUser.password);
            if (existingUser.mail = userDetail.mail && hash){
                const token = jwt.sign(userDetail.mail, process.env.secretToken as string);
                return res.status(200).json({message:"User login Successfull",token});
            }else{
                return res.status(200).json({message:"User login Failed"});
            }
        }


    }catch(err){
        console.error(err)
        return res.status(500).json({message:"Server Error"})
    }
}


async passRequest (req:Request,res:Response){
    try{
        const existingUser = await UserModel.findOne({where:{mail:req.body.mail}});
        if(!existingUser) {
        return res.status(200).json(`User Does Not Exists`);}
        else{
            const resetToken = jwt.sign(req.body.mail, process.env.secretToken as string);
            const link = `http://localhost:${process.env.PORT as any}/api/PassChange/${resetToken}`;
            sendEmail(existingUser.mail, 'Password Reset Request', link);
            return res.status(200).json({ message: "Password reset link sent successfully" });
        }
    }catch(err){
        console.error(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}


async passChange (req:Request,res:Response){
    try{
        const decodedToken = (req as any).user
        console.log(decodedToken)
        const existingUser = await UserModel.findOne({ where: { mail: decodedToken } });
        console.log(existingUser)
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashedPassword)
        await existingUser.update({password:hashedPassword});
        return res.status(200).json({ message: "Password changed successfully" });
    }catch(err){
        console.error(err)
        return res.status(500).json({message:"Internal Server Error"})
    }
}

}


export default new UserController();