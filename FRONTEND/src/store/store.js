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

const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function register(userData) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data.user;
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data.user;
}

export function hasToken() {
  return !!localStorage.getItem("token");
}

// ─────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────

export async function getUsers(search = "") {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  const response = await fetch(
    `${API_URL}/api/admin/users?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getUserById(id) {
  // TODO: Call backend API
  return null;
}

// ─────────────────────────────────────────────────────────────
// APPOINTMENTS
// ─────────────────────────────────────────────────────────────

export async function getAppointments(search = "", status = "") {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (status) {
    params.append("status", status);
  }

  const response = await fetch(
    `${API_URL}/api/admin/appointments?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
export async function getPatientAppointments(patientId) {
  const response = await fetch(
    `${API_URL}/api/appointments/patient/${patientId}`,
  );

  const data = await response.json();

  return data;
}

export async function getDoctorAppointments(doctorId) {
  const response = await fetch(
    `${API_URL}/api/doctors/doctor/${doctorId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return await response.json();
}

export async function getPatientMedicalRecords(patientId) {
  const response = await fetch(
    `${API_URL}/api/doctors/patients/${patientId}/records`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function addAppointment(appointmentData) {
  const response = await fetch(`${API_URL}/api/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function updateAppointmentStatus(id, status) {
  const response = await fetch(
    `${API_URL}/api/doctors/appointments/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}
export async function cancelAppointment(id) {
  const response = await fetch(
    `${API_URL}/api/appointments/cancel/${id}`,
    {
      method: "PUT",
    },
  );

  return await response.json();
}

// ─────────────────────────────────────────────────────────────
// MEDICAL RECORDS
// ─────────────────────────────────────────────────────────────

export async function getRecords(patientId) {
  const response = await fetch(
    `${API_URL}/api/records/${patientId}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function addRecord(recordData) {
  const response = await fetch(`${API_URL}/api/records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recordData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteRecord(id) {
  const response = await fetch(`${API_URL}/api/records/${id}`, {
    method: "DELETE",
  });

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
  const response = await fetch(`${API_URL}/api/prescriptions`);

  return await response.json();
}

export async function getPatientPrescriptions(patientId) {
  const response = await fetch(
    `${API_URL}/api/prescriptions/patient/${patientId}`,
  );

  return await response.json();
}

export async function addPrescription(prescriptionData) {
  const response = await fetch(`${API_URL}/api/prescriptions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(prescriptionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

// ─────────────────────────────────────────────────────────────
// DOCTORS
// ─────────────────────────────────────────────────────────────

export async function getDoctors(search = "", specialization = "") {
  const params = new URLSearchParams();
  if (search) {
    params.append("search", search);
  }
  if (specialization) {
    params.append("specialization", specialization);
  }
  const response = await fetch(
    `${API_URL}/api/doctors?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch doctors");
  }

  return data;
}

export async function getAllDoctors(search = "", specialization = "") {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (specialization) {
    params.append("specialization", specialization);
  }

  const response = await fetch(
    `${API_URL}/api/doctors/admin/doctors?${params.toString()}`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getDoctorDashboard(doctorId) {
  const response = await fetch(
    `${API_URL}/api/doctors/${doctorId}/dashboard`,
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getDoctorSlots(id) {
  const response = await fetch(`${API_URL}/api/doctors/slots/${id}`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Failed to fetch slots");
  }

  return await response.json();
}
export async function updateDoctorSlots(id, slots) {
  const response = await fetch(
    `${API_URL}/api/doctors/slots/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slots }),
    },
  );

  return await response.json();
}

export async function getDoctorById(id) {
  const response = await fetch(`${API_URL}/api/doctors/${id}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Doctor Not Found");
  }
  return data;
}

export async function updateDoctorStatus(id, active) {
  const response = await fetch(
    `${API_URL}/api/admin/doctors/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active }),
    },
  );

  return await response.json();
}

export async function approveDoctor(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_URL}/api/admin/doctors/${id}/onboarding`,
    {
      method: "PUT",
      headers: {
        Authorization: token,
      },
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

// ─────────────────────────────────────────────────────────────
// HOSPITALS
// ─────────────────────────────────────────────────────────────

export async function getHospitals() {
  const response = await fetch(`${API_URL}/api/hospitals`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch hospitals");
  }

  return data;
}

// ─────────────────────────────────────────────────────────────
// EMERGENCY
// ─────────────────────────────────────────────────────────────

export async function getEmergencyResources() {
  const response = await fetch(`${API_URL}/api/emergency`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch emergencyResources");
  }

  return data;
}
