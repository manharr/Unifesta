import axios from 'axios';

export const getAllEvents = async () => {
  try {
    const res = await axios.get('/event').catch((err) => console.log(err));
    if (res.status !== 200) {
      return console.log('No data');
    }
    return res.data;
  } catch (err) {
    console.log(err);
  }
};


export const sendUserAuthRequest = async (data, signup) => {
  try {
      const res = await axios.post(`/user/${signup ? "signup" : "login"}`, {
          name: signup ? data.name : "", 
          email: data.email,
          password: data.password,
      });

      console.log("Response Data:", res.data); 

      return res.data; 

  } catch (err) {
      console.error("API Error:", err.response ? err.response.data : err.message);
      throw err;  
  }
};


export const sendAdminAuthRequest = async(data) =>{
  const res = await axios.post("/admin/login",{
    email: data.email,
    password: data.password,
  }).catch((err)=>console.log(err));

  if(res.status!==200){
    return console.log("Unexpected error");
  }

  const resData = await res.data;
  return resData;
};


//USERS
export const getAllUsers = async (token) => {
  try {
    const res = await axios.get('/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status !== 200) {
      throw new Error('Failed to fetch users');
    }
    return res.data;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
};

export const deleteUser = async (id, token) => {
  try {
    const res = await axios.delete(`/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status !== 200) {
      throw new Error('Failed to delete user');
    }
    return res.data;
  } catch (err) {
    console.error('Error deleting user:', err.response?.data || err.message);
    throw err;
  }
};


export const getUserById = async (userId) => {
  try {
      const response = await axios.get(`/user/${userId}`);
      return response.data;
  } catch (err) {
      console.error("API error in getUserById:", err);
      throw err;
  }
};




export const updateUser = async (id, userData) => {
  try {
      const res = await axios.put(`/user/${id}`, {
          name: userData.name,
          email: userData.email,
          password: userData.password || "defaultPassword",  
          ...(userData.contactNumber && { contactNumber: userData.contactNumber }) 
      });

      if (res.status !== 200) {
          throw new Error("Failed to update user");
      }

      return res.data;
  } catch (err) {
      console.error("Error updating user:", err.response?.data || err.message);
      throw err;
  }
};



// booking/registration 
export const newBooking = async (bookingData) => {
  try {
    const res = await axios.post('/booking', bookingData);
    if (res.status !== 201) {
      throw new Error('Failed to create booking');
    }
    return res.data;
  } catch (err) {
    console.error('Error creating booking:', err);
    throw err;
  }
};

export const getAllBookings = async () => {
  try {
    const res = await axios.get('/booking').catch((err) => console.log(err));
    if (res.status !== 200) {
      return console.log('No data');
    }
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const deleteBooking = async (id) => {
  try {
    const res = await axios.delete(`/booking/${id}`).catch((err) => console.log(err));
    if (res.status !== 200) {
      return console.log('Failed to delete booking');
    }
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const getUserBookings = async (userId) => {
  try {
    const res = await axios.get(`/booking/user/${userId}`);
    return res.data; 
  } catch (err) {
    console.error("Error fetching user bookings:", err);
    return null;
  }
};





// payment
export const createRazorpayOrder = async (bookingData) => {
  try {
      const response = await axios.post("/api/payments/create-order", bookingData);
      return response.data; 
  } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
  }
};

export const newOrder = async (paymentData) => {
  try {
      const response = await axios.post("/api/payments/verify-payment", paymentData);
      return response.data;
  } catch (error) {
      console.error("Error verifying payment:", error);
      throw error;
  }
};

//SPONSOR
// Add a new sponsor
export const addSponsor = async (sponsorData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const res = await axios.post("/sponsor", sponsorData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 201) {
      return res.data;
    }

    throw new Error("Failed to add sponsor");
  } catch (err) {
    console.error("Error adding sponsor:", err);
    throw err;
  }
};

// Fetch all sponsors for an event
export const getSponsorsByEvent = async (eventId) => {
  try {
    const res = await axios.get(`/sponsor/event/${eventId}`);
    if (res.status !== 200) {
      throw new Error("Failed to fetch sponsors");
    }
    return res.data;
  } catch (err) {
    console.error("Error fetching sponsors:", err);
    throw err;
  }
};
export const getSponsorById = async (id) => {
  try {
    const res = await axios.get(`/sponsor/${id}`); 
    if (res.status !== 200) {
      throw new Error("Failed to fetch sponsor");
    }
    return res.data;
  } catch (err) {
    console.error("Error fetching sponsor:", err);
    throw err;
  }
};
// Delete a sponsor by ID
export const deleteSponsor = async (sponsorId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const res = await axios.delete(`/sponsor/${sponsorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Failed to delete sponsor");
  } catch (err) {
    console.error("Error deleting sponsor:", err);
    throw err;
  }
};

export const updateSponsor = async (sponsorId, sponsorData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const res = await axios.put(`/sponsor/${sponsorId}`, sponsorData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Failed to update sponsor");
  } catch (err) {
    console.error("Error updating sponsor:", err);
    throw err;
  }
};








// EVENTS
export const getEventDetails = async(id) =>{
  const res = await axios.get(`/event/${id}`).catch(err=>console.log(err));
  if(res.status !==200){
    return console.log("error");
  }
  const resData = await res.data;
  return resData;
}

export const addEvent = async (eventData) => {
  try {
    const token = localStorage.getItem("token"); 
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const res = await axios.post("/event", eventData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 201) {
      return res.data;
    }

    throw new Error("Failed to add event");
  } catch (err) {
    console.error("Error adding event:", err);
    throw err;
  }
};

export const uploadImage = async (formData) => {
  try {
    const res = await axios.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status !== 201) {
      throw new Error("Failed to upload image");
    }

    return res.data; 
  } catch (err) {
    console.error("Error uploading image:", err);
    throw err;
  }
};




export const deleteEvent = async (id) => {
  try {
    const token = localStorage.getItem("token"); 
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const res = await axios.delete(`/event/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to delete event");
  } catch (err) {
    console.error("Error deleting event:", err);
    throw err;
  }
};

export const updateEventDetails = async (id, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const res = await axios.put(`/event/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Error updating event:", err);
    throw err;
  }
};


export const getEventById = async (id) => {
  try {
    const res = await axios.get(`/event/${id}`);
    if (res.status !== 200) {
      throw new Error("Failed to fetch event details");
    }
    return res.data; 
  } catch (err) {
    console.error("Error fetching event details:", err);
    throw err;
  }
};


// Fetch all sub-events
export const getAllSubEvents = async () => {
  try {
    const res = await axios.get('/subevent');
    if (res.status !== 200) {
      throw new Error('Failed to fetch sub-events');
    }
    return res.data;
  } catch (err) {
    console.error('Error fetching sub-events:', err);
    throw err;
  }
};


export const getSubEventById = async (id) => {
  try {
    const res = await axios.get(`/subevent/${id}`);
    if (res.status !== 200) {
      throw new Error('Failed to fetch sub-event details');
    }
    return res.data;
  } catch (err) {
    console.error('Error fetching sub-event details:', err);
    throw err;
  }
};

export const getSubEventsByEvent = async (eventId) => {
  try {
    const res = await axios.get(`/subevent/event/${eventId}`);
    if (res.status !== 200) {
      throw new Error("Failed to fetch sub-events for this event");
    }
    return res.data.subEvents; 
  } catch (err) {
    console.error("Error fetching sub-events:", err);
    throw err;
  }
};

export const createSubEvent = async (subEventData, token) => {
  try {
    const res = await axios.post('/subevent', subEventData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error('Error creating sub-event:', err);
    throw err;
  }
};

export const updateSubEvent = async (id, updatedData, token) => {
  try {
    const res = await axios.put(`/subevent/${id}`, updatedData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error('Error updating sub-event:', err);
    throw err;
  }
};

export const deleteSubEvent = async (id, token) => {
  try {
    const res = await axios.delete(`/subevent/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      return res.data;
    }

    throw new Error("Failed to delete sub-event");
  } catch (err) {
    console.error("Error deleting sub-event:", err.response?.data || err.message);
    throw err;
  }
};








export const getAllEventsWithRegistrationCount = async () => {
  try {
    const res = await axios.get("/booking");  

    if (res.status !== 200 || !res.data?.bookings) {
      console.log("No bookings data");
      return [];
    }

    const eventRegistrationCount = res.data.bookings.reduce((acc, booking) => {
      const eventId = booking.event?._id;
      if (eventId) {
        acc[eventId] = (acc[eventId] || 0) + 1;
      }
      return acc;
    }, {});

    const eventsRes = await axios.get("/event"); 

    if (eventsRes.status !== 200 || !eventsRes.data?.events) {
      console.log("No events found");
      return [];
    }

    return eventsRes.data.events.map((event) => ({
      ...event,
      registrationCount: eventRegistrationCount[event._id] || 0,
    }));
  } catch (err) {
    console.error("Error fetching events with registration count:", err);
    return [];
  }
};





// COLLEGE 
export const getAllColleges = async () => {
  try {
    const res = await axios.get('/college').catch((err) => console.log(err));
    if (res.status !== 200) {
      return console.log('No data');
    }
    
    const colleges = res.data.colleges.map(college => ({
      ...college,
      eventCount: college.events.length, 
    }));

    return colleges;
  } catch (err) {
    console.log(err);
  }
};


export const createCollege = async (collegeData, token) => {
  try {
    const res = await axios.post("/college", collegeData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err) {
    console.error("Error creating college:", err);
    throw err;
  }
};


export const deleteCollege = async (id, token) => {
  try {
    const res = await axios.delete(`/college/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete college.");
  }
};

export const getCollegeDetails = async (id) => {
  try {
    const res = await axios.get(`/college/${id}`).catch((err) => console.log(err));
    if (res.status !== 200) {
      return console.log('Error fetching college details');
    }
    return res.data.college;  
  } catch (err) {
    console.log(err);
    throw new Error("Failed to fetch college details.");
  }
};

export const updateCollegeDetails = async (id, collegeData, token) => {
  try {
    const res = await axios.put(`/college/${id}`, collegeData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data; 
  } catch (err) {
    console.log(err);
    throw new Error("Failed to update college.");
  }
};