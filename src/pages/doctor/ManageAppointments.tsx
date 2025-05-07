import { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from 'lucide-react';
import { mockAppointments } from '../../utils/mockData';
import { Appointment } from '../../types/appointment';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ManageAppointments = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call
    setLoading(true);
    
    // Filter appointments for the selected date
    const filteredApps = mockAppointments.filter(app => {
      const appDate = new Date(app.date);
      return (
        appDate.getDate() === selectedDate.getDate() &&
        appDate.getMonth() === selectedDate.getMonth() &&
        appDate.getFullYear() === selectedDate.getFullYear()
      );
    }).sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
    
    setAppointments(filteredApps);
    setLoading(false);
  }, [selectedDate]);

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Generate days for the calendar
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1);
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Create an array for all days in the month
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Check if a date has appointments
  const hasAppointments = (date: Date) => {
    return mockAppointments.some(app => {
      const appDate = new Date(app.date);
      return (
        appDate.getDate() === date.getDate() &&
        appDate.getMonth() === date.getMonth() &&
        appDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handle appointment status update
  const handleStatusUpdate = (appointmentId: number, status: 'completed' | 'cancelled') => {
    // In a real app, this would be an API call
    setAppointments(prev => 
      prev.map(app => 
        app.id === appointmentId ? { ...app, status } : app
      )
    );
    
    toast.success(`Appointment ${status === 'completed' ? 'marked as completed' : 'cancelled'}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Appointments</h1>
        <p className="text-gray-600">View and manage your appointment schedule</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={prevMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">{formatMonth(currentDate)}</h2>
            <button 
              onClick={nextMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {generateCalendarDays().map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-10"></div>;
              }
              
              const date = day as Date;
              const hasApps = hasAppointments(date);
              
              return (
                <div 
                  key={`day-${index}`}
                  onClick={() => setSelectedDate(date)}
                  className={`h-10 flex items-center justify-center cursor-pointer rounded-full hover:bg-blue-50 relative ${
                    isDateSelected(date) 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : isToday(date)
                      ? 'text-blue-600 font-bold'
                      : 'text-gray-700'
                  }`}
                >
                  {date.getDate()}
                  {hasApps && !isDateSelected(date) && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-600"></span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Date</h3>
            <div className="bg-blue-50 text-blue-800 p-3 rounded-md">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            
            <div className="mt-4 text-sm text-gray-600 flex items-center">
              <div className="mr-4 flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span>Has appointments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments for selected date */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-500" />
              Appointments for {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric'
              })}
            </h2>
            
            <button className="text-sm text-blue-600 hover:text-blue-800">
              Print Schedule
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg overflow-hidden">
                  <div className="flex">
                    {/* Time column */}
                    <div className="bg-blue-50 text-blue-800 p-4 flex flex-col items-center justify-center w-24">
                      <Clock className="h-5 w-5 mb-1" />
                      <span className="font-medium">{appointment.time}</span>
                    </div>
                    
                    {/* Content column */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
                            <p className="text-sm text-gray-500">Age: {appointment.patientAge}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 md:mt-0 flex items-center">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {appointment.clinicType}
                          </span>
                          
                          <div className="ml-4 flex items-center">
                            <Link 
                              to={`/doctor/patient/${appointment.patientId}`}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View Record
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {appointment.healthCondition}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                          className="inline-flex items-center px-3 py-1.5 border border-green-700 text-xs rounded-md text-green-700 bg-green-50 hover:bg-green-100"
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Mark Completed
                        </button>
                        
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          className="inline-flex items-center px-3 py-1.5 border border-red-700 text-xs rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Cancel
                        </button>
                        
                        <button className="inline-flex items-center px-3 py-1.5 border border-purple-700 text-xs rounded-md text-purple-700 bg-purple-50 hover:bg-purple-100">
                          <AlertCircle className="h-3.5 w-3.5 mr-1" />
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-lg">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-gray-500 text-lg mb-1">No Appointments</h3>
              <p className="text-gray-400">There are no appointments scheduled for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;