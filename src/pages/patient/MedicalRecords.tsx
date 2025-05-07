import { useState, useEffect } from 'react';
import { FileText, Calendar, Pill, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockMedicalRecords, mockAppointments } from '../../utils/mockData';
import { MedicalRecord } from '../../types/medicalRecord';
import { Appointment } from '../../types/appointment';

const ViewMedicalRecords = () => {
  const { user } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    if (user?.id) {
      const records = mockMedicalRecords
        .filter(record => record.patientId === user.id)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      const appointments = mockAppointments
        .filter(app => app.patientId === user.id && new Date(app.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setMedicalRecords(records);
      setUpcomingAppointments(appointments);
      setLoading(false);
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
        <p className="text-gray-600">View your health history, medications, and doctor's notes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - medical records */}
        <div className="lg:col-span-2">
          {medicalRecords.length > 0 ? (
            <div className="space-y-6">
              {medicalRecords.map((record) => (
                <div key={record.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-gray-800">
                        Visit: {formatDate(record.updatedAt)}
                      </h2>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />
                        Health Condition
                      </h3>
                      <p className="text-gray-800">{record.healthCondition}</p>
                    </div>
                    
                    {record.medications && record.medications.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <Pill className="h-4 w-4 mr-2 text-green-500" />
                          Prescribed Medications
                        </h3>
                        <ul className="space-y-2">
                          {record.medications.map((med, idx) => (
                            <li key={idx} className="bg-green-50 text-green-800 px-3 py-2 rounded-md text-sm">
                              {med}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {record.doctorNotes && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <ClipboardList className="h-4 w-4 mr-2 text-purple-500" />
                          Doctor's Notes
                        </h3>
                        <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                          <p className="text-gray-800">{record.doctorNotes}</p>
                        </div>
                      </div>
                    )}
                    
                    {record.nextAppointment && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                          Next Appointment
                        </h3>
                        <p className="text-gray-800">
                          {formatDate(record.nextAppointment)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-10 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-800 mb-2">No medical records yet</h2>
              <p className="text-gray-600 mb-6">
                Your medical history will appear here after your first visit to the clinic.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Upcoming Appointments
            </h2>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-blue-500 pl-3 py-2">
                    <p className="font-medium text-gray-800">{formatDate(appointment.date)}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                    <p className="text-sm text-gray-600">{appointment.clinicType}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No upcoming appointments</p>
              </div>
            )}
          </div>

          {/* Health Tips */}
          <div className="bg-blue-600 text-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Health Reminders</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">•</div>
                <span>Take medications as prescribed by your doctor</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">•</div>
                <span>Keep all follow-up appointments</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">•</div>
                <span>Contact the clinic if your symptoms worsen</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMedicalRecords;