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
  // TODO: Call backend API for login
  // return await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  throw new Error('Backend not connected. Implement login API.')
}

export async function register(userData) {
  // TODO: Call backend API for registration
  throw new Error('Backend not connected. Implement register API.')
}

export async function logout() {
  // TODO: Call backend API for logout
  localStorage.removeItem('mf_token')
}

export async function getCurrentUser() {
  // TODO: Call backend API to get current user
  return null
}

export function hasToken() {
  return !!localStorage.getItem('mf_token')
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

export async function getPatientAppointments(patientId) {
  // TODO: Call backend API
  return []
}

export async function getDoctorAppointments(doctorId) {
  // TODO: Call backend API
  return []
}

export async function addAppointment(appointmentData) {
  // TODO: Call backend API
  throw new Error('Backend not connected.')
}

export async function updateAppointmentStatus(id, status) {
  // TODO: Call backend API
}

export async function cancelAppointment(id) {
  // TODO: Call backend API
}

// ─────────────────────────────────────────────────────────────
// MEDICAL RECORDS
// ─────────────────────────────────────────────────────────────

export async function getRecords(patientId) {
  // TODO: Call backend API
  return []
}

export async function addRecord(recordData) {
  // TODO: Call backend API
}

export async function deleteRecord(id) {
  // TODO: Call backend API
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
  // TODO: Call backend API
  return []
}

export async function getDoctorById(id) {
  // TODO: Call backend API
  return null
}

export async function updateDoctorStatus(id, active) {
  // TODO: Call backend API
}

// ─────────────────────────────────────────────────────────────
// HOSPITALS
// ─────────────────────────────────────────────────────────────

export async function getHospitals() {
  // TODO: Call backend API
  return []
}

// ─────────────────────────────────────────────────────────────
// EMERGENCY
// ─────────────────────────────────────────────────────────────

export async function getEmergencyResources() {
  // TODO: Call backend API
  return []
}
