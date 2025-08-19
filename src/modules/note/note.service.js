import noteModel from "../../DB/models/note.model.js"
import userModel from "../../DB/models/User.model.js"


export const createNote = async(req, res, next) => {
    try {
        const { title, userId, content } = req.body
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'En-valid user'})  
        }
        const note = await noteModel.create([req.body])
        return res.status(201).json({message: 'note created successfully', note})
    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}
export const updateNote = async (req, res, next) => {

    try {
        const {id} = req.params
        const { title, userId, content } = req.body
        const user = await userModel.findById(userId)
        console.log(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'En-valid user'})  
        }
        const note = await noteModel.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not allowed to edit this note' });
        }
        const noteUpdates = await noteModel.findByIdAndUpdate(id, { title, content },
            { new: true })
        return res.status(200).json({message:'note updates successfully',noteUpdates})

    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }

}
export const replaceNote = async (req, res, next) => {
    try {
            const {id} = req.params
        const { title, userId, content } = req.body
        const user = await userModel.findById(userId)
        console.log(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'En-valid user'})  
        }
        const note = await noteModel.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not allowed to edit this note' });
        }
        const noteReplaced = await noteModel.replaceOne({ id }, req.body)
        return res.status(200).json({message:'note replaced successfully',noteReplaced})
        
        
    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}
export const updateAll =async (req, res, next) => {

    try {
        const { title, userId, content } = req.body
        const user = await userModel.findById(userId)
        console.log(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'En-valid user'})  
        }
        const notes = await noteModel.updateMany(
            { userId },
            { $set: { title, content } }); 
    return res.status(200).json({message:'notes updated successfully',notes})
    
    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}
export const deleteNote = async (req, res, next) => {
    try {
        const {id}= req.params
        const { userId } = req.body
        const user = await userModel.findById(userId)
        if (!user) {
            res.status(404).json({message:'in-valid user'})
        }
        const note = await noteModel.findById(id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        if (note.userId.toString() !== userId) {
            return res.status(403).json({ message: 'You are not allowed to edit this note' });
        }

        const deleteOne = await noteModel.findByIdAndDelete(id)
        return res.status(200).json({message:'note deleted successfully',deleteOne})

        
    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}
export const getNote = async(req, res, next) => {
    try {

        const { userId, limit = 3, page = 2 } = req.query   
        if (!userId) {
            return res.status(404).json({message: 'user Id required'})
        }
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({message:' invalid user'})
        }
        const parsePage = parseInt(page)
        const parseLimit = parseInt(limit)
        const notes = await noteModel
        .find({ userId })
        .sort({ createdAt: -1 })      
        .limit(parseLimit);


const total = await noteModel.countDocuments({ userId });

    return res.status(200).json({
        message: 'Notes retrieved successfully',
        page: parsePage,
        limit: parseLimit,
        total,
        notes
    });
    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}
export const noteById = async (req, res, next) => {
    
    try {
    const { id } = req.params
        const note = await noteModel.findById(id).populate('userId', 'name email')

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
    }
    return res.status(200).json({message: 'Note retrieved successfully',note})
} catch (error) {
    return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
}
}
export const getByContent = async(req, res, next) => {

    try {
        const { content } = req.query
        const noteContent = await noteModel.findOne({  content: { $regex: content, $options: 'i' } })
        if (!noteContent) {
            return res.status(404).json({message:'note not found'})
        }
        res.status(200).json({message:'note found successfully',noteContent})

    } catch (error) {
        return res.status(500).json({ message: 'server error',error,info:error.message ,stack:error.stack })
    }
}


export const getNotesWithUser = async (req, res , next) => {
    try {
    const notes = await noteModel.find().populate('userId', 'name email') 

    return res.status(200).json({ message: 'Notes retrieved successfully',total: notes.length, notes
    })

    } catch (error) {
    return res.status(500).json({message: 'Server error',error: error.message,stack: error.stack})
}
}

export const getByTitle = async (req, res, next) => {
    try {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ message: 'Title query parameter is required' });
    }

    const note = await noteModel.aggregate([{$match: {title: { $regex: new RegExp(title, 'i') }  }}]);

    if (note.length === 0) {
        return res.status(404).json({ message: 'Note not found' })
    }

    return res.status(200).json(note);
    } catch (error) {
    return res.status(500).json({ message: 'Server error',error: error.message,stack: error.stack })}
}

export const deleteNotes = async(req, res, next) => {
    try {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'userId is required' })
    }

    const result = await noteModel.deleteMany({ userId })

    return res.status(200).json({  message: 'All notes for this user have been deleted.',result});
} catch (error) {
    return res.status(500).json({ message: 'Server error',error: error.message})}
    
}






