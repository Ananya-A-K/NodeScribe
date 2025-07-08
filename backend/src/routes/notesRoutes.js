import express from "express";
import {getNotes,createNote,updateNote,deleteNote, getNoteById} from "../controllers/notesController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router=express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

router.get("/",getNotes);
router.get("/:id",getNoteById);
router.post("/",createNote);
router.put("/:id",updateNote);
router.delete("/:id",deleteNote);

export default router;
