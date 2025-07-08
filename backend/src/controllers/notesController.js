import Note from '../models/Note.js';

export async function getNotes (req,res) { // req=_ to skip an argument  
    try {
        const notes=await Note.find({ userId: req.user.uid }).sort({createdAt:-1}); //get all notes.. newest first 
        res.status(200).json(notes);
    } catch (error) {
        console.log("Error in getAllNotes controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function getNoteById (req,res) {   
    try {
        //const note=await Note.findById(req.params.id); //get specific note 
        const note = await Note.findOne({ _id: req.params.id, userId: req.user.uid });
        if(!note)   return res.status(404).json({message:"Note not found"});
        res.status(200).json(note);
    } catch (error) {
        console.log("Error in getNoteById controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export async function createNote (req,res) {
    try {
        const {title,content}=req.body; // {title,content would be undefined if json parsing middleware not added}
        const note=new Note({
            title,
            content,
            userId: req.user.uid
        });
        const savedNote=await note.save();
        res.status(201).json(savedNote);
        //res.status(201).json({message:"Note created successfully"});
    } catch (error) {
        console.log("Error in createNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};
export async function updateNote(req,res) {  
    try {
        const {title,content}=req.body;
        // const updatedNote=await Note.findByIdAndUpdate(
        //     req.params.id,
        //     {title,content},
        //     {
        //         new: true,
        //     }
        // );
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.uid },
            {title, content},
            { new: true }
        );
        if(!updatedNote) return res.status(404).json({message:"Note not found"});
        res.status(200).json(updatedNote);
    } catch (error) {
        console.log("Error in updateNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
    //res.status(200).json({message:"Note updated sucessfully"});
};

export async function deleteNote(req,res) {  
    try {
        //const deletedNote = await Note.findByIdAndDelete(req.params.id);
        const deletedNote = await Note.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user.uid 
        });
        if (!deletedNote) return res.status(404).json({ message: "Note not found" });
        res.status(200).json({message:"Note deleted successfully"});
    } catch (error) {
        console.log("Error in deleteNote controller", error);
        res.status(500).json({message:"Internal server error"});
    }
};