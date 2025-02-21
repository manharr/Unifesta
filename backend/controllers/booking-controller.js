import mongoose from "mongoose";
import Bookings from "../models/Bookings.js";
import Event from "../models/Event.js";
import SubEvent from "../models/SubEvent.js";
import User from "../models/User.js";

export const newBooking = async (req, res, next) => {
    const { event, user, subEvent, college, additionalInfo, contact } = req.body; // Added contact field

    let existingEvent, existingUser, existingSubEvent;
    try {
        existingEvent = await Event.findById(event);
        existingUser = await User.findById(user);
        existingSubEvent = await SubEvent.findById(subEvent);

        if (!existingSubEvent) {
            return res.status(404).json({ message: "Sub-event not found" });
        }

        // ✅ Ensure venue exists (to avoid database errors)
        if (!existingSubEvent.venue) {
            existingSubEvent.venue = "Default Venue"; // Set a fallback value
            await existingSubEvent.save(); // Save only if venue was missing
        }
    } catch (err) {
        return res.status(500).json({ message: "Error fetching event/user/subEvent", error: err.message });
    }

    if (!existingEvent) return res.status(404).json({ message: "Event not found" });
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    let booking;
    try {
        booking = new Bookings({
            event,
            user,
            subEvent,
            college,
            contact, // Added contact field in booking
            additionalInfo: additionalInfo || "",
            registeredOn: new Date(),
        });

        const session = await mongoose.startSession();
        session.startTransaction();

        existingUser.bookings.push(booking);
        existingEvent.bookings.push(booking);
        existingSubEvent.bookings.push(booking);

        // For Gaming Events, find the game based on additionalInfo (Game 1 or Game 2) and increment registeredParticipants
        if (existingSubEvent.type === "Gaming") {
            const selectedGame = existingSubEvent.details.find(d => d.gameTitle === additionalInfo);
            if (selectedGame) {
                selectedGame.registeredParticipants += 1;
            } else {
                return res.status(404).json({ message: "Selected game not found in subEvent details" });
            }
        } else {
            // For Non-Gaming Events, just increment the general registeredParticipants for the subEvent
            const subEventDetails = existingSubEvent.details.find(d => d);
            if (subEventDetails) {
                subEventDetails.registeredParticipants += 1;
            } else {
                return res.status(404).json({ message: "Sub-event details not found" });
            }
        }

        await existingUser.save({ session });
        await existingEvent.save({ session });
        await existingSubEvent.save({ session });
        await booking.save({ session });

        await session.commitTransaction();
    } catch (err) {
        return res.status(500).json({ message: "Unable to create a booking", error: err.message });
    }

    return res.status(201).json({ booking, ticketNumber:booking.ticketNumber });
};



export const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Bookings.find()
            .populate("event", "title")
            .populate("subEvent", "type description")
            .populate("user", "name email");
            

        if (!bookings.length) return res.status(404).json({ message: "No bookings found" });

        return res.status(200).json({ bookings });
    } catch (err) {
        return res.status(500).json({ message: "Fetching bookings failed", error: err.message });
    }
};

// Get booking by ID
export const getBookingById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const booking = await Bookings.findById(id)
            .populate("event", "title")
            .populate("subEvent", "type description")
            .populate("user", "name email");

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        return res.status(200).json({ booking });
    } catch (err) {
        return res.status(500).json({ message: "Fetching booking failed", error: err.message });
    }
};

// Get bookings by user
// Get bookings by user
export const getBookingsByUser = async (req, res, next) => {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
        return res.status(400).json({ message: "Invalid user ID." });
    }

    try {
        const bookings = await Bookings.find({ user: userId })
            .populate({
                path: "event",
                select: "title college", 
                populate: { path: "college", select: "name" } 

            })            
            .populate({
                path: "subEvent",
                select: "type description details venue", // Include details in the response
            });
            

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found for this user" });
        }

        return res.status(200).json({ bookings });
    } catch (err) {
        console.error("Error fetching user bookings:", err);
        return res.status(500).json({ message: "Fetching user bookings failed", error: err.message });
    }
};

// Delete a booking
export const deleteBooking = async (req, res, next) => {
    const { id } = req.params;
    let booking;

    try {
        booking = await Bookings.findById(id).populate("user event subEvent");

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Remove booking reference from User
            booking.user.bookings.pull(booking._id);
            await booking.user.save({ session });

            // Remove booking reference from Event
            booking.event.bookings.pull(booking._id);
            await booking.event.save({ session });

            // Remove booking reference from SubEvent and decrement registeredParticipants
            if (booking.subEvent) {
                booking.subEvent.bookings.pull(booking._id);

                // Decrement registeredParticipants if sub-event has details
                const subEventDetails = booking.subEvent.details.find(d => d);
                if (subEventDetails && subEventDetails.registeredParticipants > 0) {
                    subEventDetails.registeredParticipants -= 1;
                }

                await booking.subEvent.save({ session });
            }

            // Delete the booking itself
            await Bookings.findByIdAndDelete(id);

            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
            return res.status(500).json({ message: "Transaction failed", error: err.message });
        } finally {
            session.endSession();
        }

        return res.status(200).json({ message: "Booking deleted successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Unable to delete booking", error: err.message });
    }
};
