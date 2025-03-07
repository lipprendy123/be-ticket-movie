import { Request, Response } from "express";
import { authSchema } from "../utils/zodSchema";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/User";
import Wallet from "../models/Wallet"

export const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const parse = authSchema.omit({ role: true }).safeParse(req.body);

        if (!parse.success) {
            const errorMessages = parse.error.issues.map((err) => err.message);

            return res.status(400).json({
                success: false,
                message: 'Invalid request',
                data: errorMessages
            });
        }

        const emailExisted = await User.findOne({ email: parse.data.email });

        if (emailExisted) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists',
                data: null
            });
        }

        const hashPassword = bcrypt.hashSync(parse.data.password, 12)

        const user = new User({
            name: parse.data.name,
            email: parse.data.email,
            password: hashPassword,
            role: 'customer',
            photo: req.file?.filename
        })
        
        const wallet = new Wallet({
            balance: 0,
            user: user._id
        })

        await user.save()
        await wallet.save()

        return res.status(201).json({
            success: true,
            message: 'Success sign up',
            data: {
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to sign up',
        });
    }
};

export const login = async(req: Request, res: Response): Promise<any> => {
    try {
        const parse = authSchema.omit({
            name: true
        }).parse(req.body)

        const checkUser = await User.findOne({
            email: parse.email,
            role: parse.role
        })

        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: 'Email not registered',
                data: null
            })
        }
        
        if (parse.role && checkUser.role !== parse.role) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role for this account',
                data: null
            })
        }
        
        const comparePassword = bcrypt.compareSync(parse.password, checkUser.password)

        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: 'Email or password incorrect',
                data: null
            })
        }

        const secretKey = process.env.SECRET_KEY ?? ""

        const token = jwt.sign({
            data: checkUser.id
        }, secretKey, {expiresIn: '24h'})
        
        return res.status(200).json({
            success: true,
            message: 'Success login',
            data: {
                name: checkUser.name,
                email: checkUser.email,
                role: checkUser.role,
                photoUrl: checkUser.photoUrl,
                token
            }
        })

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            success: false,
            message: 'Failed to login'
        });
    }
}
