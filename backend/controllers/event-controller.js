import jwt from 'jsonwebtoken';
import Event from "../models/Event.js"; 
import mongoose from 'mongoose';
import Admin from "../models/Admin.js"; 
import College from '../models/College.js'; 

export const addEvent = async (req, res) => {
    try {
        const extractedToken = req.headers.authorization?.split(" ")[1];
        if (!extractedToken) {
            return res.status(401).json({ message: "Token not found" });
        }

        let adminId;
        try {
            const decoded = jwt.verify(extractedToken, process.env.SECRET_KEY);
            adminId = decoded.id;
        } catch (err) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const {
            title, startDate, endDate, description, college,
            location, maxParticipants, isFeatured, images,
            sponsors, coordinatorsContact 
        } = req.body;

        if (!title || !startDate || !endDate || !description || !college || !location) {
            return res.status(400).json({ message: "Invalid inputs" });
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const newEvent = new Event({
                title,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description,
                college,
                location,
                createdBy: adminId,
                images: images || [], 
                maxParticipants: maxParticipants || 0,
                isFeatured: isFeatured || false,
                sponsors: sponsors || [], 
                coordinatorsContact: coordinatorsContact || [] 
            });

            await newEvent.save({ session });

            // Update admin with new event
            const adminUser = await Admin.findById(adminId);
            if (!adminUser) throw new Error("Admin not found");
            adminUser.addedEvents.push(newEvent._id);
            await adminUser.save({ session });

            // Update college with new event
            const collegeToUpdate = await College.findById(college);
            if (!collegeToUpdate) throw new Error("College not found");
            collegeToUpdate.events.push(newEvent._id);
            await collegeToUpdate.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({ message: "Event created successfully", event: newEvent });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction failed:", err);
            return res.status(500).json({ message: "Event creation failed", error: err.message });
        }
    } catch (err) {
        console.error("Error in addEvent:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};


export const getEvents = async (req, res, next) => {
    let events;

    try {
        events = await Event.find().populate('college'); 
    } catch (err) {
        return console.log(err);
    }

    if (!events || events.length === 0) {
        return res.status(404).json({ message: "No events found" });
    }

    return res.status(200).json({ events });
};

export const getEventById = async (req, res, next) => {
    const id = req.params.id;
    let event;

    try {
        event = await Event.findById(id).populate('college'); 
    } catch (err) {
        return console.log(err);
    }

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ event });
};

export const updateEvent = async (req, res, next) => {
    const eventId = req.params.id;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    let adminId;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        adminId = decoded.id;
    } catch (err) {
        return res.status(400).json({ message: "Invalid token" });
    }

    const {
        title,
        startDate,
        endDate,
        description,
        location,
        maxParticipants,
        isFeatured,
        eventStatus,
        sponsors,
        coordinatorsContact,
        images, // Ensure images are included in the request body
    } = req.body;

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                title,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                description,
                location,
                maxParticipants,
                isFeatured,
                eventStatus,
                sponsors,
                coordinatorsContact,
                images, // ✅ Update images field
            },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (err) {
        console.error("Failed to update event:", err);
        return res.status(500).json({ message: "Failed to update event" });
    }
};



export const deleteEvent = async (req, res, next) => {
    const eventId = req.params.id;
  
    try {
      const event = await Event.findByIdAndDelete(eventId);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      await Admin.updateMany(
        { addedEvents: eventId },
        { $pull: { addedEvents: eventId } }
      );
  
      await College.updateMany(
        { events: eventId },
        { $pull: { events: eventId } }
      );
  
      return res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
      console.error("Failed to delete event:", err);
      return res.status(500).json({ message: "Failed to delete event" });
    }
};
