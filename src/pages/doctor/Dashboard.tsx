import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Activity, Clipboard, Users, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { mockAppointments } from '../../utils/mockData';
import { Appointment } from '../../types/appointment';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    todayPatients: 0,
    weeklyPatients: 0,
    pendingAppointments: 0
  });

  useEffect(() => {
    // Filter appointments for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayAppts = mockAppointments.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === today.getTime() && app.doctorId === user?.id;
    }).sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    // Filter upcoming appointments (excluding today)
    const upcoming = mockAppointments.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() > today.getTime() && app.doctorId === user?.id;
    }).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }).slice(0, 5);
    
    setTodayAppointments(todayAppts);
    setUpcomingAppointments(upcoming);
    
    // Set stats
    setStats({
      todayPatients: todayAppts.length,
      weeklyPatients: 18, // Mock data
      pendingAppointments: upcoming.length
    });
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

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, Dr. {user?.name}</h1>
        <p className="text-gray-600">Here's your schedule and patient overview</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Today's Patients</p>
              <p className="text-3xl font-bold text-gray-800">{stats.todayPatients}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">This Week</p>
              <p className="text-3xl font-bold text-gray-800">{stats.weeklyPatients}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Pending Appointments</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingAppointments}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Today's Schedule
            </h2>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="flex border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center bg-blue-100 px-4">
                    <p className="text-blue-800 font-medium">{appointment.time}</p>
                  </div>
                  <div className="flex-1 p-4 border-l">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{appointment.patientName}, {appointment.patientAge}</h3>
                        <p className="text-sm text-gray-500">{appointment.clinicType}</p>
                      </div>
                      <Link 
                        to={`/doctor/patient/${appointment.patientId}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{appointment.healthCondition}</p>
                  </div>
                </div>
              ))}
              <div className="text-right mt-4">
                <Link 
                  to="/doctor/appointments" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  View all appointments
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No appointments scheduled for today</p>
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-6">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Upcoming Appointments
          </h2>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border-b pb-3 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {appointment.clinicType}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(appointment.date)}
                    <span className="mx-1">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    {appointment.time}
                  </div>
                </div>
              ))}
              <div className="text-right mt-4">
                <Link 
                  to="/doctor/appointments" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                >
                  View calendar
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <Clock className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link 
          to="/doctor/patients"
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-gray-100 hover:border-blue-200 hover:shadow transition-all"
        >
          <div className="p-3 rounded-full bg-blue-50 mr-4">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Patient Records</h3>
            <p className="text-sm text-gray-500">View and manage patients</p>
          </div>
        </Link>
        
        <Link 
          to="/doctor/appointments"
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-gray-100 hover:border-blue-200 hover:shadow transition-all"
        >
          <div className="p-3 rounded-full bg-green-50 mr-4">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Appointment Schedule</h3>
            <p className="text-sm text-gray-500">Manage your calendar</p>
          </div>
        </Link>
        
        <Link 
          to="/doctor/profile"
          className="bg-white p-4 rounded-lg shadow-sm flex items-center border border-gray-100 hover:border-blue-200 hover:shadow transition-all"
        >
          <div className="p-3 rounded-full bg-purple-50 mr-4">
            <Clipboard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Settings</h3>
            <p className="text-sm text-gray-500">Update profile & preferences</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DoctorDashboard;