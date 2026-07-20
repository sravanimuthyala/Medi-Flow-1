import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FileText,
    Calendar,
    Tag,
    Loader,
    ArrowLeft,
} from "lucide-react";
import { getPatientMedicalRecords } from "../../store/store";

const typeBadge = {
    "Lab Report": "badge-blue",
    Prescription: "badge-green",
    Scan: "badge-yellow",
    "X-Ray": "badge-gray",
    "Discharge Summary": "badge-red",
    General: "badge-gray",
};

export default function DoctorMedicalRecords() {
    const navigate = useNavigate();
    const { patientId } = useParams();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRecords() {
            try {
                const data = await getPatientMedicalRecords(patientId);
                setRecords(data);
            } catch (error) {
                console.error("Failed to load medical records:", error);
            } finally {
                setLoading(false);
            }
        }

        loadRecords();
    }, [patientId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 text-teal-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="mb-9 flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-4 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Patients
                </button>

                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-7 h-7 text-teal-600" />
                    Patient Medical Records
                </h1>

                <p className="text-gray-500 text-sm mt-1">
                    Medical history and uploaded reports
                </p>
            </div>

            {/* Empty State */}
            {records.length === 0 ? (
                <div className="card text-center py-16">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">
                        No medical records available
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                        This patient has not uploaded any records yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {records.map((record) => (
                        <div
                            key={record.id}
                            className="card border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all"
                        >
                            {/* Top */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {record.title}
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        {record.description || "No description provided"}
                                    </p>
                                </div>

                                <span
                                    className={
                                        typeBadge[record.type] ||
                                        "px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                                    }
                                >
                                    {record.type}
                                </span>
                            </div>

                            {/* Bottom */}
                            <div className="flex flex-wrap gap-6 mt-5 pt-4 border-t border-gray-100 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-teal-600" />
                                    {new Date(record.date).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-teal-600" />
                                    {record.type}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}