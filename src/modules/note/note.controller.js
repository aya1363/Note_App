import { Router } from "express";
import * as noteService from "./note.service.js";
const router = Router()

router.post('/', noteService.createNote)
router.patch('/all', noteService.updateAll)
router.get('/note-by-content', noteService.getByContent)
router.get('/aggregate',noteService.getByTitle)
router.get('/note-with-user', noteService.getNotesWithUser);
router.patch('/:id', noteService.updateNote)
router.put('/:id', noteService.replaceNote)
router.delete('/:id', noteService.deleteNote)
router.get('/paginate-sort', noteService.getNote)
router.get('/:id', noteService.noteById)
router.get('/note-by-content', noteService.getByContent)
router.delete('/',noteService.deleteNotes)

export default router
