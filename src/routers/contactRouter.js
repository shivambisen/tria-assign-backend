import { Router } from "express";
import { createContact, deleteContact, getContact, searchContact, updateContact } from "../src/controllers/contactController.js";


const router = Router();

router.get('/contact',getContact);
router.post('/contact',createContact);
router.put('/contact',updateContact);
router.delete('/contact',deleteContact);
router.get("/contact/search", searchContact)

export default router;