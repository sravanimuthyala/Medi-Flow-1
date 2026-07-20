import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  User,
  X,
  Plus,
  Loader,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import {
  getPatientAppointments,
  cancelAppointment,
  getDoctors,
  getHospitals,
} from "../../store/store.js";

const ALL_TABS = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

const statusBadge = {
  pending: "badge-yellow",
  confirmed: "badge-blue",
  completed: "badge-green",
  cancelled: "badge-red",
};

export default function MyAppointments() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  const [allAppts, setAllAppts] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        setLoading(true);

        const [appts, docs, hosp] = await Promise.all([
          getPatientAppointments(user.id),
          getDoctors(),
          getHospitals(),
        ]);

        setAllAppts(appts);
        setDoctors(docs);
        setHospitals(hosp);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const filtered = allAppts.filter(
    (a) =>
      activeTab === "All" ||
      a.status === activeTab.toLowerCase()
  );

  const groupedAppointments = filtered.reduce((acc, appt) => {
    if (!acc[appt.doctor_id]) {
      acc[appt.doctor_id] = [];
    }

    acc[appt.doctor_id].push(appt);

    return acc;
  }, {});

  async function handleCancel(id) {
    try {
      await cancelAppointment(id);

      const updated = await getPatientAppointments(user.id);

      setAllAppts(updated);
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold">
            My Appointments
          </h1>

          <p className="text-sm text-gray-500">
            {allAppts.length} total appointments
          </p>
        </div>

        <Link
          to="/patient/find-doctors"
          className="btn-primary text-sm px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          Book New
        </Link>

      </div>

      {/* Tabs */}

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">

        {ALL_TABS.map((tab) => (

          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
              ? "bg-white shadow-sm"
              : "text-gray-500"
              }`}
          >
            {tab}
          </button>

        ))}

      </div>

      {filtered.length === 0 ? (

        <div className="card text-center py-16">

          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />

          <p className="text-gray-400">
            No appointments found
          </p>

        </div>

      ) : (

        <div className="space-y-6">

          {Object.entries(groupedAppointments).map(
            ([doctorId, appointments]) => {

              const doc = doctors.find(
                (d) => Number(d.id) === Number(doctorId)
              );

              const hosp = hospitals.find(
                (h) =>
                  Number(h.id) === Number(doc?.hospital_id)
              );

              return (

                <div
                  key={doctorId}
                  className="card p-5 hover:shadow-md transition-all"
                >{/* Doctor Header */}

                  <div className="flex items-start gap-4">

                    {/* Doctor Image */}

                    {doc?.image ? (
                      <img
                        src={doc.image}
                        alt={doc.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
                        {doc?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Doctor Details */}

                    <div className="flex-1">

                      <div className="flex justify-between items-start">

                        <div>

                          <h2 className="text-lg font-bold text-gray-900">
                            {doc?.name}
                          </h2>

                          <p className="text-sm text-blue-600">
                            {doc?.specialization}
                          </p>

                          {hosp && (
                            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <MapPin className="w-3 h-3" />
                              {hosp.name}
                            </p>
                          )}

                        </div>

                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          {appointments.length} Appointment
                          {appointments.length > 1 ? "s" : ""}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* Appointment History */}

                  <div className="mt-6 space-y-4">

                    {appointments.map((appt) => {

                      const canCancel =
                        appt.status === "pending" ||
                        appt.status === "confirmed";

                      return (

                        <div
                          key={appt.id}
                          className="border rounded-xl p-4 bg-gray-50"
                        >

                          <div className="flex justify-between items-center">

                            <h4 className="font-semibold text-gray-700">
                              Appointment History
                            </h4>

                            <span className={statusBadge[appt.status]}>
                              {appt.status}
                            </span>

                          </div>

                          <div className="flex flex-wrap gap-4 mt-4">

                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <Calendar className="w-3.5 h-3.5" />

                              {new Date(appt.date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}

                            </span>

                            <span className="flex items-center gap-1 text-xs text-gray-600">
                              <Clock className="w-3.5 h-3.5" />
                              {appt.time}
                            </span>

                            <span className="flex items-center gap-1 text-xs text-gray-600">

                              {appt.type === "teleconsultation" ? (
                                <>
                                  <Video className="w-3.5 h-3.5" />
                                  Teleconsultation
                                </>
                              ) : (
                                <>
                                  <User className="w-3.5 h-3.5" />
                                  In-Person
                                </>
                              )}

                            </span>

                          </div>

                          {appt.reason && (

                            <div className="mt-3">

                              <p className="text-xs text-gray-400">
                                Reason
                              </p>

                              <p className="text-sm text-gray-700 italic">
                                "{appt.reason}"
                              </p>

                            </div>

                          )}        {/* Fee + Payment */}

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">

                            <div>

                              <p className="text-xs text-gray-400">
                                Consultation Fee
                              </p>

                              <p className="font-semibold text-gray-800">
                                ₹{appt.fee}
                              </p>

                            </div>



                          </div>

                          {/* Cancel Button */}

                          {canCancel && (

                            <div className="mt-4 flex justify-end">

                              <button
                                onClick={() => handleCancel(appt.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Cancel Appointment
                              </button>

                            </div>

                          )}

                        </div>

                      );

                    })}

                  </div>

                </div>

              );

            })}

        </div>

      )}

    </div>

  );

}