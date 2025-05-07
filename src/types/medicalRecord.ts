export interface MedicalRecord {
  id: number;
  patientId: number;
  doctorId: number;
  healthCondition: string;
  medications: string[];
  doctorNotes: string;
  createdAt: string;
  updatedAt: string;
  nextAppointment?: string;
}