import { Request, Response } from "express";
import User from "../models/User";

export const getCustomers = async(req: Request, res: Response): Promise<any> => {
    try {
        const customers = await User.find({role: 'customer'}).select('name email')

        return res.status(200).json({
            success: true,
            message: 'Get data cusomers success',
            data: customers
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed',
            data: null
        })
    }
}