import { Request, Response } from "express";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import Transaction from "../models/Transaction";

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

export const getWalletTransactions = async(req: Request, res: Response): Promise<any> => {
    try {
        const transactions = await WalletTransaction.find().populate({
            path: 'wallet',
            select: 'user ._id',
            populate: {
                path: 'user',
                select: 'name'
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Get data wallet transaction success',
            data: transactions
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

export const getTransactions = async(req: Request, res: Response): Promise<any> => {
    try {
        const transactions = await Transaction.find().populate({
            path: 'user',
            select: 'name -_id'
        }).populate({
            path: 'movie',
            select: 'title -_id'
        }).populate({
            path: 'teather',
            select: 'name -_id'
        })

        return res.status(200).json({
            success: true,
            message: 'Get data ticket transaction success',
            data: transactions
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