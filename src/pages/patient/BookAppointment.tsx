import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, CalendarCheck, ChevronLeft, ChevronRight, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { mockClinicTypes } from '../../utils/mockData';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [selectedClinic, setSelectedClinic] = useState('');
  const [healthCondition, setHealthCondition] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Time slots (10am to 12pm, 30 minute intervals)
  const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'];

  // Generate days for the calendar
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
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
      const date = new Date(year, month, i);
      
      // Only include future dates and exclude weekends
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
      
      if (!isPast && !isWeekend) {
        days.push(date);
      } else {
        days.push({ date, disabled: true });
      }
    }
    
    return days;
  };

  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Go to previous month
  const prevMonth = () => {
    // Don't allow going to past months
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const today = new Date();
    if (previousMonth.getMonth() >= today.getMonth() || previousMonth.getFullYear() > today.getFullYear()) {
      setCurrentMonth(previousMonth);
    }
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Check if a date is selected
  const isDateSelected = (date: Date) => {
    return selectedDate && 
      date.getDate() === selectedDate.getDate() && 
      date.getMonth() === selectedDate.getMonth() && 
      date.getFullYear() === selectedDate.getFullYear();
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && !selectedClinic) {
      toast.error('Please select a clinic type');
      return;
    }
    
    if (currentStep === 2 && !healthCondition) {
      toast.error('Please describe your health condition');
      return;
    }
    
    if (currentStep === 3 && (!selectedDate || !selectedTime)) {
      toast.error('Please select both date and time');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  // Handle back step
  const handleBackStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      toast.success('Appointment booked successfully!');
      navigate('/patient/dashboard');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Book an Appointment</h1>
          <p className="text-gray-600">Schedule a visit with our specialists</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`h-2 rounded-l-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
            <div className="flex-1">
              <div className={`h-2 rounded-r-full ${currentStep >= 4 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <div className={`${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Clinic</div>
            <div className={`${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Symptoms</div>
            <div className={`${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Schedule</div>
            <div className={`${currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>Confirm</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Clinic Type */}
          {currentStep === 1 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-blue-500" />
                Select Clinic Type
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {mockClinicTypes.map((clinic) => (
                  <div
                    key={clinic.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedClinic === clinic.name 
                        ? 'border-blue-500 bg-blue-50 shadow-sm' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedClinic(clinic.name)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedClinic === clinic.name ? 'bg-blue-500' : 'bg-gray-100'
                      }`}>
                        <clinic.icon className={`h-5 w-5 ${
                          selectedClinic === clinic.name ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-800">{clinic.name}</h3>
                        <p className="text-sm text-gray-500">{clinic.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Health Condition */}
          {currentStep === 2 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Activity className="mr-2 h-5 w-5 text-blue-500" />
                Describe Your Health Condition
              </h2>

              <div className="mb-6">
                <label htmlFor="healthCondition" className="block text-sm font-medium text-gray-700 mb-1">
                  Please describe your symptoms or reason for visit
                </label>
                <textarea
                  id="healthCondition"
                  rows={5}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="E.g., I've been experiencing headaches for the past week..."
                  value={healthCondition}
                  onChange={(e) => setHealthCondition(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Providing clear details about your symptoms helps the doctor prepare for your visit.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Select Date and Time */}
          {currentStep === 3 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Select Date and Time
              </h2>

              {/* Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">Select Date</h3>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={prevMonth}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <ChevronLeft className="h-4 w-4 text-gray-500" />
                    </button>
                    <span className="mx-2 font-medium">{formatMonth(currentMonth)}</span>
                    <button 
                      type="button"
                      onClick={nextMonth}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {generateCalendarDays().map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="p-2"></div>;
                    }

                    if (typeof day === 'object' && 'disabled' in day) {
                      return (
                        <div 
                          key={`disabled-${index}`}
                          className="p-2 text-center text-gray-300"
                        >
                          {day.date.getDate()}
                        </div>
                      );
                    }

                    const date = day as Date;
                    return (
                      <div 
                        key={`day-${index}`}
                        onClick={() => handleDateSelect(date)}
                        className={`p-2 text-center cursor-pointer rounded-full hover:bg-blue-50 ${
                          isDateSelected(date) 
                            ? 'bg-blue-500 text-white hover:bg-blue-600' 
                            : 'text-gray-700'
                        }`}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Select Time
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => handleTimeSelect(time)}
                      className={`py-3 px-4 border rounded-md text-sm ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review and Confirm */}
          {currentStep === 4 && (
            <div className="animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CalendarCheck className="mr-2 h-5 w-5 text-blue-500" />
                Review and Confirm
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                    <p className="text-gray-800">{user?.name}, {user?.age} years</p>
                  </div>
                  
                  <div className="flex items-start space-x-12">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Clinic Type</h3>
                      <p className="text-gray-800">{selectedClinic}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
                      <p className="text-gray-800">
                        {selectedDate?.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-gray-800">{selectedTime}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Health Condition</h3>
                    <p className="text-gray-800">{healthCondition}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Important:</strong> Please arrive 15 minutes before your appointment time. If you need to cancel, please do so at least 24 hours in advance.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBackStep}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-auto flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-auto px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;