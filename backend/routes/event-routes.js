import express from 'express';
import { addEvent, deleteEvent, getEventById, getEvents, updateEvent } from '../controllers/event-controller.js';

const eventRouter = express.Router();

eventRouter.get("/", getEvents);
eventRouter.get("/:id", getEventById);
eventRouter.post("/", addEvent);
eventRouter.put("/:id", updateEvent); 
eventRouter.delete("/:id", deleteEvent); 


export default eventRouter; 