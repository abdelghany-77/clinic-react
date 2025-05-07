export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientAge: number;
  doctorId: number;
  doctorName: string;
  clinicType: string;
  healthCondition: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}