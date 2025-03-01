import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Sponsor from "../models/Sponsor.js";
import Event from "../models/Event.js";
import Admin from "../models/Admin.js";

export const addSponsor = async (req, res) => {
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

        const { name, type, logo, event } = req.body;
        if (!name || !logo || !event) {
            return res.status(400).json({ message: "Invalid inputs" });
        }

        const eventToUpdate = await Event.findById(event);
        if (!eventToUpdate) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (!Array.isArray(eventToUpdate.sponsors)) {
            eventToUpdate.sponsors = [];
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            
            const newSponsor = new Sponsor({
                name,
                type: type || undefined,
                image: logo,
                event
            });

            await newSponsor.save({ session });

            eventToUpdate.sponsors.push(newSponsor._id);
            await eventToUpdate.save({ session });

            await session.commitTransaction();
            session.endSession();

            return res.status(201).json({ message: "Sponsor added successfully", sponsor: newSponsor });

        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error("Transaction failed:", err);
            return res.status(500).json({ message: "Sponsor creation failed", error: err.message });
        }
    } catch (err) {
        console.error("Error in addSponsor:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};



export const getSponsors = async (req, res) => {
    try {
        const sponsors = await Sponsor.find().populate("event");

        if (!sponsors || sponsors.length === 0) {
            return res.status(404).json({ message: "No sponsors found" });
        }

        return res.status(200).json({ sponsors });
    } catch (err) {
        console.error("Error fetching sponsors:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const getSponsorById = async (req, res) => {
    const id = req.params.id;

    try {
        const sponsor = await Sponsor.findById(id).populate("event");

        if (!sponsor) {
            return res.status(404).json({ message: "Sponsor not found" });
        }

        return res.status(200).json({ sponsor });
    } catch (err) {
        console.error("Error fetching sponsor:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const getSponsorsByEvent = async (req, res) => {
    const { eventId } = req.params;

    try {
        const event = await Event.findById(eventId).populate("sponsors");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ sponsors: event.sponsors });
    } catch (err) {
        console.error("Error fetching sponsors by event:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const updateSponsor = async (req, res) => {
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

    const sponsorId = req.params.id;
    const { name, type, image, event } = req.body;

    try {
        const updatedSponsor = await Sponsor.findByIdAndUpdate(
            sponsorId,
            { name, type, image, event },
            { new: true }
        );

        if (!updatedSponsor) {
            return res.status(404).json({ message: "Sponsor not found" });
        }

        return res.status(200).json({ message: "Sponsor updated successfully", sponsor: updatedSponsor });
    } catch (err) {
        return res.status(500).json({ message: "Updating sponsor failed", error: err.message });
    }
};

export const deleteSponsor = async (req, res) => {
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

    const sponsorId = req.params.id;

    try {
        const sponsor = await Sponsor.findByIdAndDelete(sponsorId);

        if (!sponsor) {
            return res.status(404).json({ message: "Sponsor not found" });
        }

        await Event.updateMany(
            { sponsors: sponsorId },
            { $pull: { sponsors: sponsorId } }
        );

        return res.status(200).json({ message: "Sponsor deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Deleting sponsor failed", error: err.message });
    }
};
