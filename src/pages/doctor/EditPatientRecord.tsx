import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FileText, User, ClipboardEdit, Calendar, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { mockAppointments, mockMedicalRecords } from '../../utils/mockData';
import { MedicalRecord } from '../../types/medicalRecord';

const EditPatientRecord = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = parseInt(id || '0');

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [healthCondition, setHealthCondition] = useState('');
  const [medications, setMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [medicalHistory, setMedicalHistory] = useState<MedicalRecord[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // In a real app, this would be an API call
    if (patientId) {
      // Find patient from appointments
      const patientAppt = mockAppointments.find(app => app.patientId === patientId);
      
      if (patientAppt) {
        setPatient({
          id: patientAppt.patientId,
          name: patientAppt.patientName,
          age: patientAppt.patientAge,
          // In a real app, you'd have more details
          email: `patient${patientAppt.patientId}@example.com`,
        });
      }
      
      // Get patient's medical records
      const records = mockMedicalRecords
        .filter(record => record.patientId === patientId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      
      setMedicalHistory(records);
      
      // Pre-fill form with latest record if available
      if (records.length > 0) {
        const latest = records[0];
        setHealthCondition(latest.healthCondition || '');
        setMedications(latest.medications || []);
        setDoctorNotes(latest.doctorNotes || '');
        
        if (latest.nextAppointment) {
          const nextDate = new Date(latest.nextAppointment);
          setAppointmentDate(nextDate.toISOString().split('T')[0]);
          setAppointmentTime('10:00');
        }
      }
      
      setLoading(false);
    }
  }, [patientId]);

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setMedications([...medications, newMedication.trim()]);
      setNewMedication('');
    }
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // In a real app, this would be an API call
    setTimeout(() => {
      // Create a new medical record
      const newRecord: MedicalRecord = {
        id: Math.floor(Math.random() * 1000),
        patientId,
        doctorId: 1, // Mock doctor ID
        healthCondition,
        medications,
        doctorNotes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nextAppointment: appointmentDate && appointmentTime 
          ? new Date(`${appointmentDate}T${appointmentTime}`).toISOString() 
          : undefined
      };
      
      // Add to local state (in a real app this would be saved to the database)
      setMedicalHistory([newRecord, ...medicalHistory]);
      
      toast.success('Patient record updated successfully');
      setIsSaving(false);
    }, 1000);
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

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Patient not found. Please check the patient ID and try again.
        </div>
        <button
          onClick={() => navigate('/doctor/patients')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patient List
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/doctor/patients')}
          className="mr-4 p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Record</h1>
          <p className="text-gray-600">Edit medical information for {patient.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1">
          <div className="flex items-center mb-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{patient.name}</h2>
              <p className="text-gray-500">{patient.age} years old</p>
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient ID</p>
                <p className="text-gray-800">#{patient.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Visit</p>
                <p className="text-gray-800">
                  {medicalHistory.length > 0 
                    ? new Date(medicalHistory[0].updatedAt).toLocaleDateString() 
                    : 'No previous visits'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Medical History */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Medical History</h3>
            
            {medicalHistory.length > 0 ? (
              <div className="space-y-4">
                {medicalHistory.map((record, index) => (
                  <div key={record.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800">
                        {new Date(record.updatedAt).toLocaleDateString()}
                      </h4>
                      {index === 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {record.healthCondition}
                    </p>
                    <button
                      onClick={() => {
                        setHealthCondition(record.healthCondition);
                        setMedications(record.medications);
                        setDoctorNotes(record.doctorNotes);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                    >
                      Load this record
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed rounded-lg">
                <FileText className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No medical history</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
            <ClipboardEdit className="mr-2 h-5 w-5 text-blue-500" />
            Update Medical Record
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="healthCondition" className="block text-sm font-medium text-gray-700 mb-1">
                Health Condition
              </label>
              <textarea
                id="healthCondition"
                rows={3}
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe the patient's current health condition"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medications
              </label>
              <div className="mb-2">
                <div className="flex">
                  <input
                    type="text"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    className="block w-full rounded-l-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Add medication and dosage"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="bg-blue-500 text-white px-3 rounded-r-md hover:bg-blue-600"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                {medications.map((medication, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-800">{medication}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {medications.length === 0 && (
                  <p className="text-sm text-gray-500 italic">No medications added</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="doctorNotes" className="block text-sm font-medium text-gray-700 mb-1">
                Doctor's Notes & Instructions
              </label>
              <textarea
                id="doctorNotes"
                rows={4}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Add notes and instructions for the patient"
              ></textarea>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-800 mb-3 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                Schedule Next Appointment
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="appointmentDate"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label htmlFor="appointmentTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select
                    id="appointmentTime"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select time</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="10:30">10:30 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/doctor/patients')}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSaving ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPatientRecord;