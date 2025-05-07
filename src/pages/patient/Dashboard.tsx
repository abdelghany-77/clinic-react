import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Activity, Pill, FileText, ChevronRight, UserRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments, mockMedicalRecords } from '../../utils/mockData';

// Types
import { Appointment } from '../../types/appointment';
import { MedicalRecord } from '../../types/medicalRecord';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [latestRecord, setLatestRecord] = useState<MedicalRecord | null>(null);

  useEffect(() => {
    // In a real app, these would be API calls
    const appointments = mockAppointments.filter(
      app => app.patientId === user?.id && new Date(app.date) >= new Date()
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    setUpcomingAppointments(appointments.slice(0, 2));

    const records = mockMedicalRecords.filter(record => record.patientId === user?.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    if (records.length > 0) {
      setLatestRecord(records[0]);
    }
  }, [user]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  // Format time for display
  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h1>
        <p className="text-gray-600">Here's a summary of your health information and upcoming appointments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Health Status Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Health Overview</h2>
              <Activity className="h-5 w-5 text-green-500" />
            </div>

            {latestRecord ? (
              <>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Current Health Condition</h3>
                  <p className="text-gray-800">{latestRecord.healthCondition}</p>
                </div>

                {latestRecord.medications && latestRecord.medications.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Current Medications</h3>
                    <ul className="list-disc list-inside text-gray-800">
                      {latestRecord.medications.map((med, idx) => (
                        <li key={idx}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {latestRecord.doctorNotes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Doctor's Notes</h3>
                    <p className="text-gray-800">{latestRecord.doctorNotes}</p>
                  </div>
                )}
                
                <div className="mt-4 text-right">
                  <Link 
                    to="/patient/medical-records" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-end"
                  >
                    View all records
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No medical records yet</p>
              </div>
            )}
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>

            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{appointment.clinicType}</p>
                        <p className="text-sm text-gray-600">Dr. {appointment.doctorName}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatTime(appointment.time)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-right">
                  <Link 
                    to="/patient/book-appointment" 
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center justify-end"
                  >
                    Book new appointment
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No upcoming appointments</p>
                <Link 
                  to="/patient/book-appointment" 
                  className="mt-3 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Book an appointment
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/patient/book-appointment"
                className="flex items-center p-3 rounded-lg bg-blue-50 text-blue-700 transition-colors hover:bg-blue-100"
              >
                <Calendar className="h-5 w-5 mr-3" />
                <span>Book Appointment</span>
              </Link>
              <Link 
                to="/patient/medical-records"
                className="flex items-center p-3 rounded-lg bg-green-50 text-green-700 transition-colors hover:bg-green-100"
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>View Medical Records</span>
              </Link>
              <Link 
                to="/patient/profile"
                className="flex items-center p-3 rounded-lg bg-purple-50 text-purple-700 transition-colors hover:bg-purple-100"
              >
                <UserRound className="h-5 w-5 mr-3" />
                <span>Update Profile</span>
              </Link>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
            <h2 className="text-lg font-semibold mb-3">Health Tips</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">•</div>
                <span>Stay hydrated by drinking at least 8 glasses of water daily</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">•</div>
                <span>Aim for at least 30 minutes of physical activity each day</span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 mt-0.5">•</div>
                <span>Remember to take your medications as prescribed</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;