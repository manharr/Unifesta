import express from "express";
import { 
    addSponsor, 
    deleteSponsor, 
    getSponsorById, 
    getSponsors, 
    getSponsorsByEvent, 
    updateSponsor 
} from "../controllers/sponsor-controller.js";

const sponsorRouter = express.Router();

sponsorRouter.get("/", getSponsors); 
sponsorRouter.get("/:id", getSponsorById);  
sponsorRouter.post("/", addSponsor);  
sponsorRouter.put("/:id", updateSponsor); 
sponsorRouter.delete("/:id", deleteSponsor); 
sponsorRouter.get("/event/:eventId", getSponsorsByEvent); 

export default sponsorRouter;
