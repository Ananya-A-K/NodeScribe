import mongoose from 'mongoose';

// create schema
// model based on schema

const noteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    }
}, 
{timestamps: true} //created, updated at
);

const Note=mongoose.model('Note', noteSchema);

export default Note;