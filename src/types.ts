export interface Submission {
  id: string;
  timestamp: string;
  sender: string;
  department: string;
  picHumas: string;
  programKerja: string;
  jenisPengajuan: string;
  urgency: 'Low' | 'Medium' | 'High';
  deadline: string;
  status: 'Queue' | 'Designing' | 'Revision' | 'Approved' | 'Published';
  details?: string;
  assetLink?: string;
  notes?: string;
  rawBroadcastText?: string;
  pic?: string;
}

export interface Resident {
  id: string;
  name: string;
  role: string;
  division: string;
  whatsapp: string;
  email: string;
  status: 'Online' | 'Away' | 'Offline';
  avatarColor: string;
  adminId?: string;
  committees?: {
    eventName: string;
    department: string;
    role: string;
    division: string;
  }[];
}

export interface OperationalLog {
  id: string;
  task: string;
  department: string;
  jenisPengajuan?: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Pending' | 'Done' | 'Cancelled';
  time: string;
  entityId?: string;
  pic?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  department?: string;
  tag?: string;
  deadline: string;
  urgency?: string;
  subtasks?: string; // e.g. "2/3"
  progress?: number; // e.g. 65
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  pic: string;
  details?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  department?: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  platform: string;
  date: string;
  urgency?: string;
  pic: string;
  imageUrl: string;
  isOverdue?: boolean;
  details?: string;
}

export interface BroadcastCampaign {
  id: string;
  name: string;
  department?: string;
  date: string;
  platform: string;
  recipients: string;
  status: 'Sent' | 'In Progress' | 'Failed' | 'Draft' | 'Cancelled';
  message?: string;
  failedCount?: number;
  pic?: string;
}

export interface MouAgreement {
  id: string;
  institution: string;
  department?: string;
  mouType: 'MoU Satu Periode' | 'MoU Event';
  scope?: string;
  validity: string;
  pdfUrl?: string;
  pic?: string;
  status: 'Active' | 'Waiting TTD' | 'Expired';
}

export interface PublicationItem {
  id: string;
  title: string;
  department?: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube';
  date: string;
  time: string; entityId?: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  details?: string;
  pic?: string;
}

export interface BrandTemplate {
  id: string;
  title: string;
  description: string;
  format: 'PPTX' | 'Figma' | 'DOCX' | 'Assets';
  imageUrl: string;
  downloadUrl: string;
}

export interface ArchiveItem {
  id: string;
  name: string;
  category: string;
  dateCompleted: string;
  pic: string;
  originalData?: any;
}

export interface CalendarEvent {
  id?: string;
  year: number;
  month: number;
  day: number;
  title: string;
  type: 'design' | 'video' | 'broadcast' | 'meeting' | 'publication' | 'other';
  color: string;
  time?: string;
  pic?: string;
  entityId?: string;
  isManual?: boolean;
}

export interface AppSettings {
  cabinetName: string;
  portalName: string;
  portalSubtitle: string;
  logoUrl: string | null;
  hmifLogoUrl?: string | null;
}
