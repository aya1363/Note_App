import mongoose, { Schema, model } from "mongoose";


const noteSchema = new Schema({
    title: {
        type: String,
        lowercase: true ,
        required: true, 
        trim: true,
        
    },
    content: {
        type: String,
        
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
}, {
    timestamps:true
})
const noteModel = mongoose.models.Note||model('Note', noteSchema)
export default noteModel
