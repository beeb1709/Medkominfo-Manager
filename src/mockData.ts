import { 
  Submission, 
  Resident, 
  OperationalLog, 
  TaskItem, 
  VideoProject, 
  BroadcastCampaign, 
  MouAgreement, 
  PublicationItem, 
  BrandTemplate, 
  ArchiveItem 
} from './types';

export const initialSubmissions: Submission[] = [];

export const initialResidents: Resident[] = [
  {
    id: "MK-2026-001",
    adminId: "admin-1",
    name: "Andrian Hidayah Nurfajrin",
    role: "Super Admin",
    division: "Kadept",
    whatsapp: "+62 882-1358-1282",
    email: "andrian@medkominfo.org",
    status: "Online",
    avatarColor: "bg-blue-600 text-white"
  },
  {
    id: "MK-2026-002",
    adminId: "admin-5",
    name: "Naqila Syaniwa",
    role: "Super Admin",
    division: "Wakadept",
    whatsapp: "+62 813-8493-5380",
    email: "naqilla@medkominfo.org",
    status: "Away",
    avatarColor: "bg-emerald-600 text-white"
  },
  {
    id: "MK-2026-010",
    adminId: "admin-2",
    name: "Dara Dwi Hidayat",
    role: "Admin Multimedia",
    division: "Multimedia",
    whatsapp: "+62 878-7664-9993",
    email: "dara@medkominfo.org",
    status: "Online",
    avatarColor: "bg-indigo-600 text-white"
  },
  {
    id: "MK-2026-011",
    adminId: "admin-3",
    name: "Evans Adams Kristanto",
    role: "Admin Multimedia",
    division: "Multimedia",
    whatsapp: "+62 813-1914-5075",
    email: "epan@medkominfo.org",
    status: "Offline",
    avatarColor: "bg-rose-600 text-white"
  },
  {
    id: "MK-2026-012",
    adminId: "admin-7",
    name: "Raihan Oktoleven Ramadhan",
    role: "Admin Multimedia",
    division: "Multimedia",
    whatsapp: "+62 897-8388-150",
    email: "leto@medkominfo.org",
    status: "Online",
    avatarColor: "bg-amber-600 text-white"
  },
  {
    id: "MK-2026-013",
    adminId: "admin-6",
    name: "Naurah Mecca Mairi",
    role: "Admin Multimedia",
    division: "Multimedia",
    whatsapp: "+62 812-7394-4031",
    email: "naurah@medkominfo.org",
    status: "Away",
    avatarColor: "bg-purple-600 text-white"
  },
  {
    id: "MK-2026-020",
    adminId: "admin-4",
    name: "Muhammad Habibie Wibisono",
    role: "Admin Humas",
    division: "Humas",
    whatsapp: "+62 811-1907-337",
    email: "habib@medkominfo.org",
    status: "Online",
    avatarColor: "bg-sky-600 text-white"
  },
  {
    id: "MK-2026-021",
    adminId: "admin-8",
    name: "Rihadatul Aliya",
    role: "Admin Humas",
    division: "Humas",
    whatsapp: "+62 895-6180-50653",
    email: "riha@medkominfo.org",
    status: "Offline",
    avatarColor: "bg-teal-600 text-white"
  },
  {
    id: "MK-2026-022",
    adminId: "admin-9",
    name: "Syifa Nafisa",
    role: "Admin Humas",
    division: "Humas",
    whatsapp: "+62 821-5784-1200",
    email: "syifa@medkominfo.org",
    status: "Online",
    avatarColor: "bg-pink-600 text-white"
  }
];

export const initialLogs: OperationalLog[] = [];

export const initialTasks: TaskItem[] = [];

export const initialVideos: VideoProject[] = [];

export const initialCampaigns: BroadcastCampaign[] = [];

export const initialMous: MouAgreement[] = [];

export const initialPublications: PublicationItem[] = [];

export const initialTemplates: BrandTemplate[] = [];

export const initialArchives: ArchiveItem[] = [];

import { CalendarEvent } from './types';
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export const initialEvents: CalendarEvent[] = [];

export const initialAdmins = [
  { id: 'admin-1', name: 'Andrian Hidayah Nurfajrin', nim: '2310511011', jabatan: 'Super Admin' },
  { id: 'admin-2', name: 'Dara Dwi Hidayat', nim: '2410511084', jabatan: 'Admin Multimedia' },
  { id: 'admin-3', name: 'Evans Adams Kristanto', nim: '2510511083', jabatan: 'Admin Multimedia' },
  { id: 'admin-4', name: 'Muhammad Habibie Wibisono', nim: '2410511138', jabatan: 'Admin Humas' },
  { id: 'admin-5', name: 'Naqila Syaniwa', nim: '2410511099', jabatan: 'Super Admin' },
  { id: 'admin-6', name: 'Naurah Mecca Mairi', nim: '2510511016', jabatan: 'Admin Multimedia' },
  { id: 'admin-7', name: 'Raihan Oktoleven Ramadhan', nim: '2410511106', jabatan: 'Admin Multimedia' },
  { id: 'admin-8', name: 'Rihadatul Aliya', nim: '2510511025', jabatan: 'Admin Humas' },
  { id: 'admin-9', name: 'Syifa Nafisa', nim: '24105511088', jabatan: 'Admin Humas' },
  { id: 'admin-10', name: 'Dimas Rasyach Nur Fathi', nim: '2310511043', jabatan: 'Pengawas' },
  { id: 'admin-11', name: 'Andika Rafa Akbar', nim: '2410511026', jabatan: 'Pengawas' }
];

export const initialWarga = [
  { id: 'warga-1', name: 'Imanuel Rafael Martua Banjarnahor', jabatan: 'Kesma', password: 'RS8I1D' },
  { id: 'warga-2', name: 'Sean Nicholas Aginta', jabatan: 'Ekraf', password: 'Y2SN4Y' },
  { id: 'warga-3', name: 'Hendry Hermawan', jabatan: 'Pengembangan Mahasiswa', password: 'YDMHEQ' },
  { id: 'warga-4', name: 'Piere Valkyrie', jabatan: 'KESMA', password: 'WH52X6' },
  { id: 'warga-5', name: 'Muhammad Hanif Awliya', jabatan: 'PSDM', password: 'QGZ9U3' },
  { id: 'warga-6', name: 'Mohammad Yomandiguna Zakaria', jabatan: 'Ekonomi Kreatif', password: 'UIN8JU' },
  { id: 'warga-7', name: 'Marselia Yura Alinski', jabatan: 'ESELON', password: 'LIV8NR' },
  { id: 'warga-8', name: 'Jilan Atrida Wavi', jabatan: 'Eselon', password: 'YJSQM0' },
  { id: 'warga-9', name: 'Gina Roselia', jabatan: 'PSDM', password: '3SKL8T' },
  { id: 'warga-10', name: 'Kayla Ishmah Rasyidah Mumtaz', jabatan: 'Departemen PSDM', password: 'FLFXW0' },
  { id: 'warga-11', name: 'Auliana Maharani', jabatan: 'Eselon', password: 'IWSYZL' },
  { id: 'warga-12', name: 'Amanda Meira Zalika', jabatan: 'Eselon', password: 'FRMTK9' },
  { id: 'warga-13', name: 'Raffi Anggi Rachman Budianto', jabatan: 'KESMA', password: 'JGIWBL' },
  { id: 'warga-14', name: 'Athar Fajle Mawla Wicaksono', jabatan: 'Kesejahteraan Masyarakat', password: 'PN6T8Q' },
  { id: 'warga-15', name: 'Muhammad Adya Damara', jabatan: 'Pengembangan Mahasiswa', password: 'IV6MCC' },
  { id: 'warga-17', name: 'Mochammad Dunde Dharmawan Yusuf Daywin', jabatan: 'Kesma', password: 'LOGKSZ' },
  { id: 'warga-18', name: 'Daffa Aditya Putra Ellyas', jabatan: 'Pengembangan Mahasiswa', password: 'LLFCGG' },
  { id: 'warga-19', name: 'Angelique Gabriel Firmansyah', jabatan: 'Ekonomi Kreatif', password: 'TWV00J' },
  { id: 'warga-20', name: 'Amanda Puspitarina', jabatan: 'Ekonomi Kreatif', password: 'GJD1S8' },
  { id: 'warga-21', name: 'Dasril Al Rafi', jabatan: 'Pengembangan Mahasiswa', password: 'VD9XBY' },
  { id: 'warga-22', name: 'Syamil Hafizh', jabatan: 'Pengembangan Mahasiswa', password: 'HR3JTF' },
  { id: 'warga-23', name: 'Putra Bagas Parasian Manihuruk', jabatan: 'PSDM', password: 'JMQGM3' },
  { id: 'warga-24', name: 'Stefen Shelinten', jabatan: 'PSDM', password: 'AI6H2I' },
  { id: 'warga-25', name: 'Muhammad Rizky Ramadhan', jabatan: 'Pengembangan Sumber Daya Manusia', password: '2RPPAI' },
  { id: 'warga-27', name: 'Salma Diandra Syawalia', jabatan: 'Pengembangan Mahasiswa', password: 'LUZCW7' },
  { id: 'warga-28', name: 'Shera Delpi Safitri', jabatan: 'PSDM', password: 'DUC06V' },
  { id: 'warga-29', name: 'Akbar Fitri Andhika', jabatan: 'Ekonomi Kreatif', password: 'SZEIQB' },
  { id: 'warga-30', name: 'Wicandry Dame Lumban Gaol', jabatan: 'Kesma', password: 'VGHV9L' },
  { id: 'warga-31', name: 'Nur Nabila', jabatan: 'Pengembangan Mahasiswa', password: 'C6F6MF' },
  { id: 'warga-32', name: 'Nathanael Dova Mumpuni', jabatan: 'Pengembangan Mahasiswa', password: 'IVMARC' }];
