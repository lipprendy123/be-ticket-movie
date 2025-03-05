import { Request, Response } from "express";

import { teatherSchema } from "../utils/zodSchema";
import Teather from "../models/Teather";

export const getTeather = async(req: Request, res: Response) : Promise<any> => {
    try {
        const teather = await Teather.find()

        return res.status(200).json({
            success: true,
            message: 'Get data teather success',
            data: teather
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

export const getTeatherDetail = async(req: Request, res: Response) : Promise<any> => {
    try {
        const {id} = req.params;

        const teather = await Teather.findById(id)

        return res.status(200).json({
            success: true,
            message: 'Get data teather detail success',
            data: teather
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

export const postTeather = async(req: Request, res: Response) : Promise<any> => {
    try {
        const body = teatherSchema.parse(req.body)

        const teather = new Teather({
            name: body.name,
            city: body.city
        })

        const newData = await teather.save()

        return res.status(201).json({
            success: true,
            message: 'Data teather success created!',
            data: newData
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed to create data',
            data: null
        })
    }
}

export const putTeather = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const body = teatherSchema.parse(req.body)

        await Teather.findByIdAndUpdate(id, {
            name: body.name,
            city: body.city
        })

        const updatedTeather = await Teather.findById(id)

        if (!updatedTeather) {
            return res.status(404).json({
                success: false,
                message: 'Data teather not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Update data teather success',
            data: updatedTeather
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed to update data',
            data: null
        })
    }
}

export const deleteTeather = async(req: Request, res: Response): Promise<any> => {
    try {
        const {id} = req.params;

        const deletedTeather = await Teather.findById(id)

        await Teather.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: 'Deleted data success',
            data: deletedTeather
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: 'failed to delete data',
            data: null
        })
    }
}