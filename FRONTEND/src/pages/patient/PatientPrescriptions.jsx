import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPatientPrescriptions } from "../../store/store";
const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPrescriptions() {
      if (!user?.id) return;

      try {
        const data = await getPatientPrescriptions(user.id);
        setPrescriptions(data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    }

    fetchPrescriptions();
  }, [user]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        prescriptions.map((presc) => (
          <div
            key={presc.id}
            className="bg-white rounded-xl shadow border p-5"
          >
            <h2 className="font-semibold text-lg">
              Diagnosis: {presc.diagnosis}
            </h2>

            <p className="text-sm text-gray-500">
              {new Date(presc.created_at).toLocaleDateString("en-IN")}
            </p>

            <div className="mt-3">
              <h3 className="font-medium">Medicines</h3>

              {presc.medications.map((med, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-2 mt-2"
                >
                  <p><strong>Name:</strong> {med.name}</p>
                  <p><strong>Dosage:</strong> {med.dosage}</p>
                  <p><strong>Frequency:</strong> {med.frequency}</p>
                  <p><strong>Duration:</strong> {med.duration}</p>
                </div>
              ))}
            </div>

            {presc.notes && (
              <p className="mt-3">
                <strong>Notes:</strong> {presc.notes}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PatientPrescriptions
