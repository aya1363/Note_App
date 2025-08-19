import userModel from "../../DB/models/User.model.js"
import mongoose from "mongoose"


export const signup = async (req, res, next) => {
    try {
        const user = await userModel.create([req.body])
    
    return  res.status(201).json({ message: 'sign up successfully', user })
    } catch (error) {
        if (error.code === 11000) {
        return res.status(409).json({ message: 'email exist'})
        }
        return  res.status(500).json({ message: 'server error', error, info: error.message, stack: error.stack })
    } 
}
export const login = async (req, res, next) => {
    try {
        const{email} = req.body
        const checkUserExist = await userModel.findOne({ email })
        if (!checkUserExist) {
            return res.status(404).json({ message: 'Invalid email or password' })
        }
        return res.status(200).json({ message: 'sign in successfully' , checkUserExist })

    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}

export const updateUser = async (req, res, next) => {
    try {

        const{id}= req.params
        const checkEmailExist = await userModel.findByIdAndUpdate(id, req.body , {new:true})
        if (!checkEmailExist) {
            return res.status(404).json({ message: 'user not exist' })
        }
        return res.status(200).json({ message: 'user updated successfully' , checkEmailExist })

    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }

}

export const deleteUser = async(req, res, next) => {
    
    try {
        const{id}= req.params
        const { email } = req.body
        const deleteOne = await userModel.findByIdAndDelete(id)
        if (!deleteOne) {
            return res.status(404).json({ message: 'user not exist' })
        }
        return res.status(200).json({ message: 'user deleted successfully'})

    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
    
    
}
export const allUsers = async (req, res, next) => {
    try {
        const users = await userModel.find()
    
    return res.status(200).json({message:' all users',users})
}
    catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}