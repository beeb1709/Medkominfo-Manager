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

export const initialSubmissions: Submission[] = [
  {
    id: "MDK-2026-001",
    timestamp: "2/5/2026",
    sender: "Naqila",
    department: "Medkominfo",
    picHumas: "Muhammad Habibie Wibisono",
    programKerja: "Penyebaran Informasi",
    jenisPengajuan: "Publikasi Broadcast",
    urgency: "Medium",
    deadline: "Senin, 24 Feb 2026",
    status: "Approved",
    details: "Permohonan broadcast informasi kegiatan rutin organisasi kepada seluruh anggota.",
    assetLink: "https://drive.google.com/drive/folders/asset-mdk-001",
    notes: "Aset gambar lengkap, caption sudah diperiksa humas."
  },
  {
    id: "MDK-2026-002",
    timestamp: "2/19/2026",
    sender: "Piere Valkyrie",
    department: "Kesma",
    picHumas: "Syifa Nafisa",
    programKerja: "NODE",
    jenisPengajuan: "Publikasi Broadcast",
    urgency: "High",
    deadline: "Selasa, 25 Feb 2026",
    status: "Designing",
    details: "Desain poster feed and story untuk program kerja unggulan NODE divisi Kesma.",
    assetLink: "https://drive.google.com/drive/folders/asset-mdk-002",
    notes: "Membutuhkan layout modern dengan kombinasi warna neon."
  },
  {
    id: "MDK-2026-003",
    timestamp: "2/19/2026",
    sender: "Imanuel Rafael Martua E",
    department: "Kesma",
    picHumas: "Rihadatul Aliya",
    programKerja: "Pengabdian Masyarakat",
    jenisPengajuan: "Design (Poster)",
    urgency: "Low",
    deadline: "Rabu, 26 Feb 2026",
    status: "Queue",
    details: "Desain poster pengumuman rekrutmen panitia bakti sosial masyarakat.",
    assetLink: "",
    notes: "Menunggu brief teks lengkap dari pemohon."
  },
  {
    id: "MDK-2026-004",
    timestamp: "2/20/2026",
    sender: "Nabila Putri",
    department: "Hubungan Luar",
    picHumas: "Muhammad Habibie Wibisono",
    programKerja: "Kunjungan Studi",
    jenisPengajuan: "Design (Poster)",
    urgency: "Medium",
    deadline: "Sabtu, 01 Mar 2026",
    status: "Revision",
    details: "Revisi layout logo partner pada poster kunjungan.",
    assetLink: "https://drive.google.com/drive/folders/asset-mdk-004",
    notes: "Ukuran logo partner minta disamakan dengan logo internal."
  },
  {
    id: "MDK-2026-005",
    timestamp: "2/21/2026",
    sender: "Ahmad Fauzi",
    department: "Sosmas",
    picHumas: "Rihadatul Aliya",
    programKerja: "Medkom Mengajar",
    jenisPengajuan: "Video Content",
    urgency: "High",
    deadline: "Jumat, 28 Feb 2026",
    status: "Published", pic: "Raihan Oktoleven Ramadhan",
    details: "Editing video kompilasi keseruan mengajar vol 3.",
    assetLink: "https://drive.google.com/drive/folders/asset-mdk-005",
    notes: "Sudah dipublikasikan di Instagram Reels."
  }
];

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

export const initialLogs: OperationalLog[] = [
  {
    id: "LOG-01",
    task: "Finalize Q3 Social Media Assets",
    department: "Departemen Media Komunikasi dan Informasi",
    jenisPengajuan: "Design",
    status: "Completed",
    time: "10:45 AM"
  },
  {
    id: "LOG-02",
    task: "Upload 'Tech Trends 2026' Video",
    department: "Departemen Pengembangan Sumber Daya Manusia",
    jenisPengajuan: "Video",
    status: "In Progress",
    time: "09:15 AM"
  },
  {
    id: "LOG-03",
    task: "Schedule Weekly Newsletter Blast",
    department: "Departemen Eselon",
    jenisPengajuan: "Broadcast",
    status: "Scheduled", pic: "Dara Dwi Hidayat",
    time: "Yesterday"
  },
  {
    id: "LOG-04",
    task: "Sign Partnership with Univ. Brawijaya",
    department: "Departemen Kesejahteraan Mahasiswa",
    jenisPengajuan: "MoU",
    status: "Pending",
    time: "2 days ago"
  }
];

export const initialTasks: TaskItem[] = [
  {
    id: "TSK-001",
    title: "Poster Open Recruitment Divisi IT 2026",
    category: "Design",
    tag: "IG POST",
    deadline: "Due Tomorrow",
    status: "To Do",
    pic: "Dara Dwi Hidayat"
  },
  {
    id: "TSK-002",
    title: "Teaser Video Profile Medkominfo",
    category: "Video",
    deadline: "Oct 15",
    status: "To Do",
    pic: "Evans Adams Kristanto"
  },
  {
    id: "TSK-003",
    title: "Virtual Background Monthly Meeting",
    category: "Design",
    tag: "URGENT",
    subtasks: "2/3",
    progress: 65,
    deadline: "Due Today",
    status: "In Progress",
    pic: "Raihan Oktoleven Ramadhan"
  },
  {
    id: "TSK-004",
    title: "Dashboard Redesign Mockups V1",
    category: "Design",
    tag: "UI/UX",
    deadline: "Oct 18",
    status: "Review",
    pic: "Naurah Mecca Mairi"
  },
  {
    id: "TSK-005",
    title: "Logo Refresh Assets",
    category: "Design",
    deadline: "Completed Oct 10",
    status: "Done",
    pic: "Dara Dwi Hidayat"
  },
  {
    id: "TSK-006",
    title: "Video Recap Welcoming Party",
    category: "Video",
    deadline: "Completed Oct 08",
    status: "Done",
    pic: "Evans Adams Kristanto"
  }
];

export const initialVideos: VideoProject[] = [
  {
    id: "VID-001",
    title: "Monthly Update: Q3 Objectives & Key Results",
    status: "In Progress",
    platform: "Vlog",
    date: "Oct 12",
    pic: "Dara Dwi Hidayat",
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "VID-002",
    title: "\"Did You Know?\" - Data Center Security",
    status: "To Do",
    platform: "YouTube Shorts",
    date: "Oct 15",
    pic: "Naurah Mecca Mairi",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "VID-003",
    title: "Campus Tour Snippets",
    status: "Review",
    platform: "Instagram",
    date: "Overdue",
    pic: "Raihan Oktoleven Ramadhan",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80",
    isOverdue: true
  },
  {
    id: "VID-004",
    title: "CEO Address: 2026 Vision",
    status: "Done",
    platform: "YouTube",
    date: "Oct 10",
    pic: "Dara Dwi Hidayat",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=400&q=80"
  }
];

export const initialCampaigns: BroadcastCampaign[] = [
  {
    id: "BC-01",
    name: "Undangan Rapat Kerja Tahunan",
    date: "Oct 24, 2026 09:00 AM",
    platform: "WA",
    recipients: "1,250",
    status: "Sent", pic: "Raihan Oktoleven Ramadhan",
    message: "Halo semuanya, jangan lupa Raker besok jam 09:00 di Auditorium."
  },
  {
    id: "BC-02",
    name: "Newsletter Edisi Oktober",
    date: "Oct 22, 2026 02:30 PM",
    platform: "Email",
    recipients: "3,420",
    status: "Sent"
  },
  {
    id: "BC-03",
    name: "Pengumuman Maintenance Server",
    date: "Oct 26, 2026 Scheduled",
    platform: "WA",
    recipients: "45",
    status: "In Progress"
  },
  {
    id: "BC-04",
    name: "Tagihan Iuran Q3 2026",
    date: "Oct 20, 2026 10:00 AM",
    platform: "Email",
    recipients: "120",
    status: "Failed", pic: "Dara Dwi Hidayat",
    failedCount: 12
  },
  {
    id: "BC-05",
    name: "Ucapan Selamat Hari Raya",
    date: "Draft",
    platform: "WA",
    recipients: "-",
    status: "Draft", pic: "Naurah Mecca Mairi"
  }
];

export const initialMous: MouAgreement[] = [
  {
    id: "MOU-01",
    institution: "Universitas Gadjah Mada",
    mouType: "MoU Satu Periode",
    validity: "01 Jan 2026 - 31 Dec 2026",
    pic: "Raihan Oktoleven Ramadhan",
    status: "Active"
  },
  {
    id: "MOU-02",
    institution: "TechCorp Indonesia",
    mouType: "MoU Event",
    validity: "15 Feb 2026 - 15 Aug 2026",
    pic: "Naurah Mecca Mairi",
    status: "Waiting TTD"
  },
  {
    id: "MOU-03",
    institution: "Kompas Media",
    mouType: "MoU Satu Periode",
    validity: "01 Mar 2025 - 01 Mar 2026",
    pic: "Dara Dwi Hidayat",
    status: "Expired"
  }
];

export const initialPublications: PublicationItem[] = [
  {
    id: "PUB-01",
    title: "Weekly Recap Vlog",
    platform: "YouTube",
    date: "Today",
    time: "19:00",
    status: "Published", pic: "Raihan Oktoleven Ramadhan"
  },
  {
    id: "PUB-02",
    title: "Infographic: AI Trends",
    platform: "Instagram",
    date: "Tomorrow",
    time: "10:00",
    status: "Scheduled", pic: "Dara Dwi Hidayat"
  },
  {
    id: "PUB-03",
    title: "Behind the Scenes Reels",
    platform: "TikTok",
    date: "Nov 5",
    time: "15:30",
    status: "Draft", pic: "Naurah Mecca Mairi"
  }
];

export const initialTemplates: BrandTemplate[] = [
  {
    id: "TMP-01",
    title: "Presentation Deck",
    description: "Official master deck for strategic reports. Includes 40+ slide layouts.",
    format: "PPTX",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
    downloadUrl: "#download-pptx"
  },
  {
    id: "TMP-02",
    title: "Social Feed Templates",
    description: "Square layouts (1080x1080) for operational updates and announcements.",
    format: "Figma",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80",
    downloadUrl: "#use-figma"
  },
  {
    id: "TMP-03",
    title: "Story Highlights",
    description: "Vertical layouts (1080x1920) for quick internal broadcasts.",
    format: "Figma",
    imageUrl: "https://images.unsplash.com/photo-1611224885990-ab7363d1f2a9?auto=format&fit=crop&w=400&q=80",
    downloadUrl: "#use-figma"
  },
  {
    id: "TMP-04",
    title: "Document Headers",
    description: "Standardized letterheads for official memos and policy drafts.",
    format: "DOCX",
    imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80",
    downloadUrl: "#download-docx"
  },
  {
    id: "TMP-05",
    title: "Video Lower-Thirds",
    description: "Broadcast-ready graphic overlays for interviews and statements.",
    format: "Assets",
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
    downloadUrl: "#download-assets"
  }
];

export const initialArchives: ArchiveItem[] = [
  {
    id: "ARC-01",
    name: "Annual Report Q4 Layout",
    category: "Design",
    dateCompleted: "Oct 15, 2025",
    pic: "Andrian Hidayah Nurfajrin"
  },
  {
    id: "ARC-02",
    name: "Campaign Promo Video - Tech Summit",
    category: "Video",
    dateCompleted: "Oct 12, 2025",
    pic: "Naqila Syaniwa"
  },
  {
    id: "ARC-03",
    name: "Press Release: Partnership Announcement",
    category: "Publication",
    dateCompleted: "Oct 08, 2025",
    pic: "Raihan Oktoleven Ramadhan"
  },
  {
    id: "ARC-04",
    name: "Social Media Graphics Pack Vol. 4",
    category: "Design",
    dateCompleted: "Sep 28, 2025",
    pic: "Andrian Hidayah Nurfajrin"
  }
];

import { CalendarEvent } from './types';
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export const initialEvents: CalendarEvent[] = [
  { id: 'EV-1', year: currentYear, month: currentMonth, day: 1, title: "Briefing Tim Baru", type: 'meeting', color: "bg-slate-800 text-slate-300 border-slate-600" },
  { id: 'EV-2', year: currentYear, month: currentMonth, day: 10, title: "Rapat Kerja Medkominfo", type: 'meeting', color: "bg-rose-900/50 text-rose-400 border-rose-800" },
  { id: 'EV-3', year: currentYear, month: currentMonth, day: 15, title: "Teaser Video Profile", type: 'video', color: "bg-purple-900/50 text-purple-400 border-purple-800" },
  { id: 'EV-4', year: currentYear, month: currentMonth, day: 18, title: "Dashboard Redesign Review", type: 'design', color: "bg-blue-900/50 text-blue-400 border-blue-800" },
  { id: 'EV-5', year: currentYear, month: currentMonth, day: 24, title: "Blast Undangan Raker", type: 'broadcast', color: "bg-amber-900/50 text-amber-400 border-amber-800" },
  { id: 'EV-6', year: currentYear, month: currentMonth, day: 28, title: "Vlog Reels Release", type: 'video', color: "bg-emerald-900/50 text-emerald-400 border-emerald-800" }
];

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
