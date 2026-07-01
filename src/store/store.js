/**
 * store.js
 * ---------
 * This file provides functions that components use to interact with data.
 * Your backend teammate will implement the actual API calls.
 *
 * Replace these placeholder functions with real API calls when backend is ready.
 */

// ─────────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────────

export async function login(email, password) {
  const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Login failed"
    );
  }

  return data;
}

export async function register(userData) {
  const response = await fetch(
    "http://localhost:5000/api/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Registration failed"
    );
  }

  return data.user;
}

export async function logout() {
  // TODO: Call backend API for logout
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  console.log("Token:", token);

  const response = await fetch(
    "http://localhost:5000/api/auth/me",
    {
      headers: {
        Authorization: token
      }
    }
  );

  const data = await response.json();

  console.log("Current User:", data);

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.user;
}

export function hasToken() {
  return !!localStorage.getItem('token')
}

// ─────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────

export async function getUsers() {
  // TODO: Call backend API
  return []
}

export async function getUserById(id) {
  // TODO: Call backend API
  return null
}

// ─────────────────────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────────────────────

export async function getAppointments() {
  // TODO: Call backend API
  return []
}

export async function
getPatientAppointments(
 patientId
){
 const response =
 await fetch(
 `http://localhost:5000/api/appointments/patient/${patientId}`
 );

 const data =
 await response.json();

 return data;
}

export async function getDoctorAppointments(doctorId) {
  // TODO: Call backend API
  return []
}

export async function addAppointment(
 appointmentData
){
 const response =
 await fetch(
 "http://localhost:5000/api/appointments",
 {
   method:"POST",
   headers:{
     "Content-Type":"application/json"
   },
   body:JSON.stringify(
     appointmentData
   )
 });

 const data =
 await response.json();

 if(!response.ok){
   throw new Error(
     data.message
   );
 }

 return data;
}

export async function updateAppointmentStatus(id, status) {
  // TODO: Call backend API
}

export async function
cancelAppointment(id){

 const response =
 await fetch(
 `http://localhost:5000/api/appointments/cancel/${id}`,
 {
   method:"PUT"
 });

 return await response.json();
}

// ─────────────────────────────────────────────────────────────
// MEDICAL RECORDS
// ─────────────────────────────────────────────────────────────

export async function getRecords(patientId) {
  const response = await fetch(
    `http://localhost:5000/api/records/${patientId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function addRecord(recordData) {
  const response = await fetch(
    "http://localhost:5000/api/records",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(recordData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteRecord(id) {
  const response = await fetch(
    `http://localhost:5000/api/records/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

// ─────────────────────────────────────────────────────────────
// PRESCRIPTIONS
// ─────────────────────────────────────────────────────────────

export async function getPrescriptions() {
  // TODO: Call backend API
  return []
}

export async function getPatientPrescriptions(patientId) {
  // TODO: Call backend API
  return []
}

export async function addPrescription(prescriptionData) {
  // TODO: Call backend API
}

// ─────────────────────────────────────────────────────────────
// DOCTORS
// ─────────────────────────────────────────────────────────────

export async function getDoctors() {
  const response = await fetch(
    "http://localhost:5000/api/doctors"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch doctors"
    );
  }

  return data;
}

export async function getDoctorSlots(id) {
  const response = await fetch(
    `http://localhost:5000/api/doctors/slots/${id}`
  );

  return await response.json();
}

export async function updateDoctorSlots(
  id,
  slots
) {
  const response = await fetch(
    `http://localhost:5000/api/doctors/slots/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slots }),
    }
  );

  return await response.json();
}

export async function getDoctorById(id) {
  const response=await fetch(`http://localhost:5000/api/doctors/${id}`);
  const data=await response.json();
  if(!response.ok){
    throw new Error(
      data.message || "Doctor Not Found"
    );
  }
  return data;
}

export async function updateDoctorStatus(id, active) {
  // TODO: Call backend API
}

// ─────────────────────────────────────────────────────────────
// HOSPITALS
// ─────────────────────────────────────────────────────────────

export async function getHospitals() {
  const response = await fetch(
    "http://localhost:5000/api/hospitals"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to fetch hospitals"
    );
  }

  return data;
}

// ─────────────────────────────────────────────────────────────
// EMERGENCY
// ─────────────────────────────────────────────────────────────

export async function getEmergencyResources() {
  const response=await fetch(
    "http://localhost:5000/api/emergency"
  );
  const data=await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
      "Failed to fetch emergencyResources"
    );
  }

  return data;
}
