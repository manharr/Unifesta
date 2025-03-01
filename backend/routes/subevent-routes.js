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

subEventRouter.post("/", addSubEvent);

subEventRouter.get("/", getAllSubEvents);

subEventRouter.get("/:id", getSubEventById);

subEventRouter.put("/:id", updateSubEvent);

subEventRouter.delete("/:id", deleteSubEvent);
subEventRouter.get("/event/:eventId", getSubEventsByEvent);

export default subEventRouter;
