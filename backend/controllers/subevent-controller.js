import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import SubEvent from "../models/SubEvent.js";
import Event from "../models/Event.js";
import Admin from "../models/Admin.js";

export const addSubEvent = async (req, res, next) => {
    const extractedToken = req.headers.authorization?.split(" ")[1];
    if (!extractedToken || extractedToken.trim() === "") {
        return res.status(404).json({ message: "Token not found" });
    }

    let adminId;
    jwt.verify(extractedToken, process.env.SECRET_KEY, (err, decrypted) => {
        if (err) {
            return res.status(400).json({ message: `${err.message}` });
        } else {
            adminId = decrypted.id;
        }
    });

    const { event, type, description, details } = req.body;

    if (!event || !type || !description || !Array.isArray(details) || details.length === 0) {
        return res.status(422).json({ message: "Invalid inputs" });
    }

    for (const detail of details) {
        if (!detail.date || !detail.time) {
            return res.status(400).json({ message: "Date and Time are required for each sub-event detail" });
        }

        // Ensure gameTitle is required for Gaming sub-events
        if (type === "Gaming" && !detail.gameTitle) {
            return res.status(400).json({ message: "Game title is required for gaming sub-events" });
        }
    }

    let newSubEvent;
    try {
        // Validate event existence
        const existingEvent = await Event.findById(event);
        if (!existingEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        newSubEvent = new SubEvent({
            event,
            type,
            description,
            details,
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        await newSubEvent.save({ session });

        // Associate sub-event with the event
        if (!existingEvent.subEvents) {
            existingEvent.subEvents = [];
        }
        existingEvent.subEvents.push(newSubEvent._id);
        await existingEvent.save({ session });

        // Associate sub-event with admin
        const adminUser = await Admin.findById(adminId);
        if (!adminUser) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (!adminUser.addedSubEvents) {
            adminUser.addedSubEvents = [];
        }
        adminUser.addedSubEvents.push(newSubEvent._id);
        await adminUser.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
    } catch (err) {
        return res.status(500).json({ message: "Sub-event creation failed", error: err.message });
    }

    if (!newSubEvent) {
        return res.status(500).json({ message: "Sub-event creation failed" });
    }

    return res.status(201).json({ message: "Sub-event created successfully", subEvent: newSubEvent });
};

export const getAllSubEvents = async (req, res, next) => {
    let subEvents;

    try {
        subEvents = await SubEvent.find().populate("event");
    } catch (err) {
        return res.status(500).json({ message: "Fetching sub-events failed", error: err.message });
    }

    if (!subEvents || subEvents.length === 0) {
        return res.status(404).json({ message: "No sub-events found" });
    }

    return res.status(200).json({ subEvents });
};

// Get a sub-event by ID
export const getSubEventById = async (req, res, next) => {
    const id = req.params.id;
    let subEvent;

    try {
        subEvent = await SubEvent.findById(id).populate("event");
    } catch (err) {
        return res.status(500).json({ message: "Fetching sub-event failed", error: err.message });
    }

    if (!subEvent) {
        return res.status(404).json({ message: "Sub-event not found" });
    }

    return res.status(200).json({ subEvent });
};

// Update a sub-event
export const updateSubEvent = async (req, res, next) => {
    const extractedToken = req.headers.authorization?.split(" ")[1];
    if (!extractedToken || extractedToken.trim() === "") {
        return res.status(404).json({ message: "Token not found" });
    }

    let adminId;
    try {
        const decoded = jwt.verify(extractedToken, process.env.SECRET_KEY);
        adminId = decoded.id;
    } catch (err) {
        return res.status(400).json({ message: `Token verification failed: ${err.message}` });
    }

    const subEventId = req.params.id;
    const { type, description, details, registrationStatus } = req.body;

    // Ensure required fields are provided for all sub-events
    for (const detail of details) {
        if (!detail.date || !detail.time) {
            return res.status(400).json({ message: "Date and Time are required for each sub-event detail" });
        }

        // Ensure gameTitle is required for Gaming sub-events
        if (type === "Gaming" && !detail.gameTitle) {
            return res.status(400).json({ message: "Game title is required for gaming sub-events" });
        }
    }

    let updatedSubEvent;
    try {
        updatedSubEvent = await SubEvent.findByIdAndUpdate(
            subEventId,
            { type, description, details, registrationStatus },
            { new: true }
        );
    } catch (err) {
        return res.status(500).json({ message: "Updating sub-event failed", error: err.message });
    }

    if (!updatedSubEvent) {
        return res.status(404).json({ message: "Sub-event not found" });
    }

    return res.status(200).json({ message: "Sub-event updated successfully", subEvent: updatedSubEvent });
};


// Delete a sub-event and remove its reference from the Event model
export const deleteSubEvent = async (req, res, next) => {
    const extractedToken = req.headers.authorization?.split(" ")[1];
    if (!extractedToken || extractedToken.trim() === "") {
        return res.status(404).json({ message: "Token not found" });
    }

    let adminId;
    try {
        const decoded = jwt.verify(extractedToken, process.env.SECRET_KEY);
        adminId = decoded.id;
    } catch (err) {
        return res.status(400).json({ message: `Token verification failed: ${err.message}` });
    }

    const subEventId = req.params.id;

    try {
        const subEvent = await SubEvent.findById(subEventId);
        if (!subEvent) {
            return res.status(404).json({ message: "Sub-event not found" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        await Event.updateOne(
            { _id: subEvent.event },
            { $pull: { subEvents: subEventId } },
            { session }
        );

        // Delete sub-event
        await SubEvent.findByIdAndDelete(subEventId, { session });

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({ message: "Sub-event deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Deleting sub-event failed", error: err.message });
    }
};

export const getSubEventsByEvent = async (req, res, next) => {
    const { eventId } = req.params;

    let subEvents;
    try {
        subEvents = await SubEvent.find({ event: eventId }).populate("event");
    } catch (err) {
        return res.status(500).json({ message: "Fetching sub-events failed", error: err.message });
    }

    if (!subEvents || subEvents.length === 0) {
        return res.status(404).json({ message: "No sub-events found for this event" });
    }

    return res.status(200).json({ subEvents });
};
