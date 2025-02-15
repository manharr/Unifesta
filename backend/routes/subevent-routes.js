import express from 'express';
import {
    addSubEvent,
    getAllSubEvents,
    getSubEventById,
    updateSubEvent,
    deleteSubEvent,
    getSubEventsByEvent
} from '../controllers/subevent-controller.js';

const subEventRouter = express.Router();

// Create a new sub-event
subEventRouter.post("/", addSubEvent);

// Get all sub-events
subEventRouter.get("/", getAllSubEvents);

// Get a specific sub-event by ID
subEventRouter.get("/:id", getSubEventById);

// Update a sub-event
subEventRouter.put("/:id", updateSubEvent);

// Delete a sub-event
subEventRouter.delete("/:id", deleteSubEvent);
// Get all sub-events of a specific event
subEventRouter.get("/event/:eventId", getSubEventsByEvent);

export default subEventRouter;
