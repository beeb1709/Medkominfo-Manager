import React, { useState, useEffect } from 'react';
import PublicRosterSection from './public-portal/PublicRosterSection';
import RichTextArea from './RichTextArea';
import MarkdownRenderer from './MarkdownRenderer';
import { AppSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, 
  Send, 
  Users, 
  Calendar, 
  Instagram, 
  Youtube, 
  CheckCircle, 
  HelpCircle, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  FileText,
  Video,
  ArrowRight,
  ExternalLink,
  ClipboardList,
  Compass,
  Link2,
  Clock,
  ShieldCheck,
  Award,
  Flame,
  Layers,
  AlertCircle,
  Image,
  Upload,
  Trash2,
  Paperclip,
  ChevronDown,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Info,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';
import { Submission, Resident, PublicationItem, VideoProject, CalendarEvent } from '../types';

interface PublicPortalTabProps {
  appSettings?: AppSettings;
  events: CalendarEvent[];
  submissions: Submission[];
  residents: Resident[];
  publications: PublicationItem[];
  videos: VideoProject[];
  onAddSubmission: (sub: Submission) => void;
  onTriggerNotification: (msg: string) => void;
  onNavigateToTab: (tab: string) => void;
  onSelectResidentForProfile?: (res: Resident) => void;
  currentUser?: { name: string; email?: string; role: 'admin' | 'public'; nim?: string; jabatan?: string } | null;
}

export default function PublicPortalTab({
  appSettings,
  events,
  submissions,
  residents,
  publications,
  videos,
  onAddSubmission,
  onTriggerNotification,
  onNavigateToTab,
  onSelectResidentForProfile,
  currentUser
}: PublicPortalTabProps) {
  
  // Public Form state
  const [jenisPengajuan, setJenisPengajuan] = useState<'Design' | 'Konten Video' | 'Publikasi Konten' | 'Publikasi Broadcast'>('Design');

  const getUrgencyFromDeadline = (deadlineStr, jenis) => {
    if (!deadlineStr) return null;
    const now = new Date();
    const deadline = new Date(deadlineStr);
    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (jenis === 'Design') {
      if (diffDays <= 3) return 'High';
      if (diffDays <= 5) return 'Medium';
      return 'Low';
    } else if (jenis === 'Konten Video') {
      if (diffDays <= 3) return 'High';
      if (diffDays <= 5) return 'Medium';
      return 'Low';
    } else if (jenis === 'Publikasi Konten') {
      if (diffDays <= 1) return 'High';
      if (diffDays <= 3) return 'Medium';
      return 'Low';
    } else if (jenis === 'Publikasi Broadcast') {
      if (diffHours <= 3) return 'High';
      if (diffHours <= 6) return 'Medium';
      return 'Low';
    }
    return 'Low';
  };




  // States for Design
  const [designJudul, setDesignJudul] = useState('');
  const [designJenis, setDesignJenis] = useState('Feeds Instagram');
  const [designDeskripsi, setDesignDeskripsi] = useState('');
  const [designTingkatUrgensi, setDesignTingkatUrgensi] = useState('7');
  const [designDeadline, setDesignDeadline] = useState('');

  // Rich states for Template Design (PDF alignment)
  const [designTema, setDesignTema] = useState('');
  const [designJudulUtama, setDesignJudulUtama] = useState('');
  
  // Slide Content for "Feeds Instagram"
  const [designSlides, setDesignSlides] = useState<{ id: string; num: string; isi: string; img: string }[]>([
    { id: '1', num: 'Slide 1 (Cover)', isi: '', img: '' },
    { id: '2', num: 'Slide 2', isi: '', img: '' }
  ]);
  
  // Custom Detail/Content areas for non-Feeds templates
  const [designIsiUmum, setDesignIsiUmum] = useState('');
  const [designImgUmum, setDesignImgUmum] = useState(''); // Link Google Drive
  
  // For certificates
  const [designIsiTandaTangan, setDesignIsiTandaTangan] = useState('sediakan 2 tempat untuk kahim(Dimas Rasyach Nur Fathi) dan kadept medkom(Andrian Hidayah Nurfajrin)');
  
  // For Merch
  const [designTipeMerch, setDesignTipeMerch] = useState('Keychain / Totebag / Sticker');
  
  // Size/Dimensions
  const [designUkuran, setDesignUkuran] = useState('1080 x 1080 pixel');
  
  // Additional Detail (Daftar Tambahan)
  const [designReferensi, setDesignReferensi] = useState('');
  const [designDaftarPustaka, setDesignDaftarPustaka] = useState('');
  const [designAssetVector, setDesignAssetVector] = useState('');
  const [designDetailLainnya, setDesignDetailLainnya] = useState('');
  
  // Footer Information (Contact Person)
  const [designCpNama, setDesignCpNama] = useState('');
  const [designCpKontak, setDesignCpKontak] = useState('');
  const [designCpDepartemen, setDesignCpDepartemen] = useState('');

  // Auto-populate default sizes from PDF guidelines
  useEffect(() => {
    if (designJenis === 'Feeds Instagram') {
      setDesignUkuran('1080 x 1080 pixel / 1080 x 1350 pixel');
    } else if (designJenis === 'Story Instagram') {
      setDesignUkuran('1080 x 1920 pixel');
    } else if (designJenis === 'Thumbnail Reels / Shorts / Tiktok') {
      setDesignUkuran('1080 x 1920 pixel');
    } else if (designJenis === 'Thumbnail Youtube') {
      setDesignUkuran('1280 x 720 pixel (16:9)');
    } else if (designJenis === 'Poster') {
      setDesignUkuran('1080 x 1920 pixel');
    } else if (designJenis === 'Banner') {
      setDesignUkuran('300 x 100 cm');
    } else if (designJenis === 'Sertifikat') {
      setDesignUkuran('A4 (21 x 29.7 cm)');
    } else if (designJenis === 'Background Zoom') {
      setDesignUkuran('1920 x 1080 pixel');
    } else if (designJenis === 'Merch') {
      setDesignUkuran('30 x 10 cm');
    } else {
      setDesignUkuran('');
    }
  }, [designJenis]);

  // States for Konten Video
  const [videoJudul, setVideoJudul] = useState('');
  const [videoJenis, setVideoJenis] = useState('Reels / Shorts / Tiktok');
  const [videoRasio, setVideoRasio] = useState('Portrait 9:16');
  const [videoDeskripsi, setVideoDeskripsi] = useState('');
  const [videoTingkatUrgensi, setVideoTingkatUrgensi] = useState('7');
  const [videoDeadline, setVideoDeadline] = useState('');
  const [videoTema, setVideoTema] = useState('');
  const [videoIsi, setVideoIsi] = useState('');
  const [videoCc, setVideoCc] = useState('Ya');
  const [videoImg, setVideoImg] = useState('');
  const [videoReferensi, setVideoReferensi] = useState('');
  const [videoSoundEffect, setVideoSoundEffect] = useState('');
  const [videoMusik, setVideoMusik] = useState('');
  const [videoDetailLainnya, setVideoDetailLainnya] = useState('');
  const [videoCpNama, setVideoCpNama] = useState('');
  const [videoCpKontak, setVideoCpKontak] = useState('');
  const [videoCpDepartemen, setVideoCpDepartemen] = useState('');

  // Auto-populate ratio based on video type
  useEffect(() => {
    if (videoJenis === 'Reels / Shorts / Tiktok') {
      setVideoRasio('Portrait 9:16');
    } else if (videoJenis === 'Video Youtube') {
      setVideoRasio('Landscape 16:9');
    } else if (videoJenis === 'After Movie') {
      setVideoRasio('Landscape 16:9');
    }
  }, [videoJenis]);

  // Auto-calculate deadlines based on Tingkat Urgensi
  useEffect(() => {
    const calculateDeadline = (urgency: string) => {
      let addDays = 7;
      if (urgency === '3') addDays = 3;
      else if (urgency === '5') addDays = 5;

      const date = new Date();
      date.setDate(date.getDate() + addDays);
      
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      
      return `${dd}/${mm}/${yyyy}`;
    };

    setDesignDeadline(calculateDeadline(designTingkatUrgensi));
  }, [designTingkatUrgensi]);

  useEffect(() => {
    const calculateDeadline = (urgency: string) => {
      let addDays = 7;
      if (urgency === '3') addDays = 3;
      else if (urgency === '5') addDays = 5;

      const date = new Date();
      date.setDate(date.getDate() + addDays);
      
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      
      return `${dd}/${mm}/${yyyy}`;
    };

    setVideoDeadline(calculateDeadline(videoTingkatUrgensi));
  }, [videoTingkatUrgensi]);

  // States for Publikasi Konten
  const [publikasiJudul, setPublikasiJudul] = useState('');
  const [publikasiJenis, setPublikasiJenis] = useState('Feeds Instagram');
  const [publikasiDeskripsi, setPublikasiDeskripsi] = useState('');
  const [publikasiTanggal, setPublikasiTanggal] = useState('');

  // Detailed Publikasi Konten fields (matching PDF specifications)
  const [pubLinkDrive, setPubLinkDrive] = useState('');
  const [pubCaption, setPubCaption] = useState('');
    const [pubHashtag, setPubHashtag] = useState('');
  const [pubCapHeader, setPubCapHeader] = useState('');
  const [pubCapSalam, setPubCapSalam] = useState('');
  const [pubCapHook, setPubCapHook] = useState('');
  const [pubCapTopik, setPubCapTopik] = useState('');
  const [pubCapTanggal, setPubCapTanggal] = useState('');
  const [pubCapWaktu, setPubCapWaktu] = useState('');
  const [pubCapTempat, setPubCapTempat] = useState('');
  const [pubCapCpNama, setPubCapCpNama] = useState('');
  const [pubCapCpKontak, setPubCapCpKontak] = useState('');
  const [pubCapCpNama2, setPubCapCpNama2] = useState('');
  const [pubCapCpKontak2, setPubCapCpKontak2] = useState('');
  const [pubMusik, setPubMusik] = useState('');
  const [pubAkun, setPubAkun] = useState('');
  const [pubTeksStory, setPubTeksStory] = useState('');
  const [pubLinkStory, setPubLinkStory] = useState('');
  const [pubStickers, setPubStickers] = useState('');
  const [pubThumbnail, setPubThumbnail] = useState('');
  const [pubJudulYoutube, setPubJudulYoutube] = useState('');
  const [pubDaftarPustaka, setPubDaftarPustaka] = useState('');
  const [pubDetailLain, setPubDetailLain] = useState('');
  const [pubCpNama, setPubCpNama] = useState('');
  const [pubCpKontak, setPubCpKontak] = useState('');
  const [pubCpDepartemen, setPubCpDepartemen] = useState('');

  // States for Publikasi Broadcast
  const [broadcastJudul, setBroadcastJudul] = useState('');
  const [broadcastMedia, setBroadcastMedia] = useState('WA HIMA IF');
  const [broadcastDeskripsi, setBroadcastDeskripsi] = useState('');
  const [broadcastTanggal, setBroadcastTanggal] = useState('');

  // Detailed Broadcast fields for Real-Time Live Preview
  const [bcHeader, setBcHeader] = useState('');
  const [bcSalam, setBcSalam] = useState('');
  const [bcHook, setBcHook] = useState('');
  const [bcTopik, setBcTopik] = useState('');
  const [bcTanggalAcara, setBcTanggalAcara] = useState('');
  const [bcWaktuAcara, setBcWaktuAcara] = useState('');
  const [bcTempat, setBcTempat] = useState('');
  const [bcDresscode, setBcDresscode] = useState('');
  const [bcVirtualBackground, setBcVirtualBackground] = useState('');
  const [bcPenutup, setBcPenutup] = useState('');
  const [bcCp, setBcCp] = useState('');
  const [bcCpNama, setBcCpNama] = useState('');
  const [bcCpKontak, setBcCpKontak] = useState('');
  const [bcCpNama2, setBcCpNama2] = useState('');
  const [bcCpKontak2, setBcCpKontak2] = useState('');
  const [bcDepartemen, setBcDepartemen] = useState('Departemen Media Komunikasi dan Informasi');
  const [bcJadwalKirim, setBcJadwalKirim] = useState('');
  const [bcFiles, setBcFiles] = useState<{ id: string; name: string; size: string; type: string; dataUrl?: string }[]>([]);

  const [selectedDepartemen, setSelectedDepartemen] = useState<string[]>(['Departemen Media Komunikasi dan Informasi']);
  const [selectedMedia, setSelectedMedia] = useState<string[]>(['Whatsapp (HIMA IF)']);

  useEffect(() => {
    setBcDepartemen(selectedDepartemen.join(' dan '));
  }, [selectedDepartemen]);

  useEffect(() => {
    setBroadcastMedia(selectedMedia.join(', '));
  }, [selectedMedia]);

useEffect(() => {
    if (currentUser) {
      let defaultDept = currentUser.jabatan || 'Departemen Program Kerja';
      
      // If the user is an admin, their actual department is Medkominfo
      if (currentUser.role === 'admin' || defaultDept.includes('Admin')) {
        defaultDept = 'Departemen Media Komunikasi dan Informasi';
      } else {
        // Try to map known abbreviations to the full department names
        const lowerDept = defaultDept.toLowerCase();
        if (lowerDept.includes('kesma') || lowerDept.includes('kesejahteraan')) {
          defaultDept = 'Departemen Kesejahteraan Mahasiswa';
        } else if (lowerDept.includes('ekraf') || lowerDept.includes('ekonomi')) {
          defaultDept = 'Departemen Ekonomi Kreatif';
        } else if (lowerDept.includes('psdm') || lowerDept.includes('sumber daya')) {
          defaultDept = 'Departemen Pengembangan Sumber Daya Manusia';
        } else if (lowerDept.includes('pengembangan mahasiswa') || lowerDept.includes('bangma')) {
          defaultDept = 'Departemen Pengembangan Mahasiswa';
        } else if (lowerDept.includes('eselon')) {
          defaultDept = 'Departemen Eselon';
        } else if (lowerDept.includes('medkom') || lowerDept.includes('media')) {
          defaultDept = 'Departemen Media Komunikasi dan Informasi';
        }
      }

      setDesignCpNama(currentUser.name);
      setDesignCpDepartemen(defaultDept);
      setVideoCpNama(currentUser.name);
      setVideoCpDepartemen(defaultDept);
      setPubCpNama(currentUser.name);
      setPubCpDepartemen(defaultDept);
    }
  }, [currentUser]);

  const [activePortalSection, setActivePortalSection] = useState<'overview' | 'form' | 'calendar' | 'roster'>('overview');
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  
  const currentYear = calendarDate.getFullYear();
  const currentMonth = calendarDate.getMonth();
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startOffset = new Date(currentYear, currentMonth, 1).getDay(); // Sunday=0, Monday=1...
  
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const offsetArray = Array.from({ length: startOffset }, () => null);
  const gridCells = [...offsetArray, ...daysArray];

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCalendarDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() - 1);
      return next;
    });
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCalendarDate(prev => {
      const next = new Date(prev);
      next.setMonth(next.getMonth() + 1);
      return next;
    });
    setSelectedDay(null);
  };

  const computedDeadline = jenisPengajuan === 'Design' ? designDeadline : jenisPengajuan === 'Konten Video' ? videoDeadline : jenisPengajuan === 'Publikasi Konten' ? publikasiTanggal : bcJadwalKirim;
  const urgency = (jenisPengajuan === 'Design' || jenisPengajuan === 'Konten Video') ? 
    ((jenisPengajuan === 'Design' ? designTingkatUrgensi : videoTingkatUrgensi) === '3' ? 'High' : (jenisPengajuan === 'Design' ? designTingkatUrgensi : videoTingkatUrgensi) === '5' ? 'Medium' : 'Low') 
    : (getUrgencyFromDeadline(computedDeadline, jenisPengajuan) || 'Low');

  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [sopSubTab, setSopSubTab] = useState<'alur' | 'prioritas' | 'kuota'>('alur');

  const handleAddSlide = () => {
    setDesignSlides(prev => {
      const nextNum = prev.length + 1;
      return [...prev, { id: String(Date.now() + Math.random()), num: `Slide ${nextNum}`, isi: '', img: '' }];
    });
  };

  const handleRemoveSlide = (id: string) => {
    setDesignSlides(prev => {
      if (prev.length <= 1) return prev;
      const filtered = prev.filter(s => s.id !== id);
      return filtered.map((s, idx) => ({
        ...s,
        num: idx === 0 ? 'Slide 1 (Cover)' : `Slide ${idx + 1}`
      }));
    });
  };

  const handleSlideChange = (id: string, field: 'isi' | 'img', val: string) => {
    setDesignSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const formatBoldText = (text: string) => {
    const parts = text.split('*');
    return parts.map((part, pIdx) => {
      if (pIdx % 2 === 1) {
        return (
          <strong key={pIdx} className="font-extrabold text-slate-950 dark:text-white">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

    const getRawBroadcastText = (
    header: string,
    salam: string,
    hook: string,
    topik: string,
    tanggal: string,
    waktu: string,
    tempat: string,
    departemen: string,
    cpNama: string,
    cpKontak: string,
    cpNama2?: string,
    cpKontak2?: string,
    customHashtag?: string,
    dresscode?: string,
    virtualBackground?: string,
    penutup?: string
  ) => {
    let formattedDate = '';
    if (tanggal) {
      try {
        const dateObj = new Date(tanggal);
        if (!isNaN(dateObj.getTime())) {
          const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
          formattedDate = `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
        } else {
          formattedDate = tanggal;
        }
      } catch (e) {
        formattedDate = tanggal;
      }
    }

    const lines: string[] = [];
    lines.push(header ? header : '⚙️[KERNEL SESSION MEI 2026]⚙️');
    lines.push(salam ? salam : 'Halo Informartikans! @all');
    lines.push(hook ? hook : 'KERNEL SESSION IS BACK!!');
    lines.push(topik ? topik : 'Bulan ini KERNEL Session hadir dengan topik:\n💻 Programming & Informatics Technical Skills 💻');

    // Tanggal, Waktu dan Tempat pelaksanaan
    const hasDetails = formattedDate || waktu || tempat || dresscode || virtualBackground;
    if (hasDetails) {
      const detailLines = ['Kegiatan akan diselenggarakan pada:'];
      if (formattedDate) detailLines.push(`📆 : ${formattedDate}`);
      if (waktu) detailLines.push(`⏰ : ${waktu}`);
      if (dresscode) detailLines.push(`👔 Dresscode: ${dresscode}`);
      if (virtualBackground) detailLines.push(`🖼️ Virtual Background: ${virtualBackground}`);
      if (tempat) detailLines.push(`📍 : ${tempat}`);
      lines.push(detailLines.join('\n'));
    }

    // Contact Person
    if (cpNama || cpKontak || cpNama2 || cpKontak2) {
      const cpLines = ['📞 Contact Person:'];
      if (cpNama || cpKontak) {
        let line = '';
        if (cpNama && cpKontak) {
          if (cpNama.includes('\n') || cpKontak.includes('\n')) {
            line = `${cpNama}\n${cpKontak}`;
          } else {
            line = `${cpNama} : ${cpKontak}`;
          }
        } else {
          line = cpNama || cpKontak;
        }
        cpLines.push(line);
      }
      if (cpNama2 || cpKontak2) {
        let line = '';
        if (cpNama2 && cpKontak2) {
          if (cpNama2.includes('\n') || cpKontak2.includes('\n')) {
            line = `${cpNama2}\n${cpKontak2}`;
          } else {
            line = `${cpNama2} : ${cpKontak2}`;
          }
        } else {
          line = cpNama2 || cpKontak2;
        }
        cpLines.push(line);
      }
      lines.push(cpLines.join('\n'));
    }

    if (penutup) {
      lines.push(penutup);
    }

    const deptName = departemen || 'Departemen Media Komunikasi dan Informasi';
    
    // Footer formatting with hashtags
    let hashtags = '#BergerakBersama\n#CiptaKarya';
    if (header.includes('PRE-ORDER') || header.includes('MERCHANDISE')) {
      hashtags = '#BergerakBersama\n#CiptaKarya\n#MerchandiseHMIF2026';
    }

    if (customHashtag && customHashtag.trim() !== '') {
      hashtags += '\n' + customHashtag;
    }

    const footer = `Best regards,\n${deptName}\n${appSettings?.cabinetName || 'Kabinet Citta Prakarsa'}\n${hashtags}`;
    lines.push(footer);

    return lines.join('\n\n');
  };

  const getRawDesignBriefText = () => {
    let text = `================================================
DEPARTEMEN MEDKOMINFO - ${appSettings?.cabinetName ? appSettings.cabinetName.toUpperCase() : 'KABINET CITTA PRAKARSA'}
{appSettings?.portalName || 'HMIF UPNVJ 2026'}
================================================
TEMPLATE PENGAJUAN DESIGN: ${designJenis.toUpperCase()}

*Note : Bagian yang tidak diperlukan dapat dihapus*

------------------------------------------------
DETAIL KONTEN DESAIN
------------------------------------------------
Tema Design   : ${designTema || '-'}
`;

    if (['Poster', 'Banner', 'Sertifikat', 'Merch'].includes(designJenis)) {
      text += `Ukuran/Dimensi: ${designUkuran || '-'}\n`;
    }
    if (designJenis === 'Merch') {
      text += `Tipe Merch    : ${designTipeMerch || '-'}\n`;
    }
    if (designJenis !== 'Feeds Instagram' && designJenis !== 'Sertifikat' && designJenis !== 'Powerpoint') {
      text += `Judul Utama   : ${designJudulUtama || '-'}\n`;
    }

    if (designJenis === 'Feeds Instagram') {
      text += `\nSLIDES CONTENT:\n`;
      designSlides.forEach((s) => {
        text += `[${s.num}]\nIsi: ${s.isi || '(Kosong)'}\nGambar/Foto: ${s.img || '-'}\n\n`;
      });
    } else {
      text += `Isi Konten    :\n${designIsiUmum || '(Kosong)'}\n`;
      if (designJenis === 'Sertifikat') {
        text += `Isi Tanda Tangan: ${designIsiTandaTangan || '-'}\n`;
      }
    }

    text += `
------------------------------------------------
DETAIL TAMBAHAN (OPSIONAL)
------------------------------------------------
Referensi     : ${designReferensi || '-'}
Asset Vector  : ${designAssetVector || '-'}
Daftar Pustaka: ${designDaftarPustaka || '-'}
Detail Lainnya: ${designDetailLainnya || '-'}

------------------------------------------------
CONTACT PERSON & FOOTER
------------------------------------------------
CP Nama       : ${designCpNama || '-'}
CP Kontak     : ${designCpKontak || '-'}
Departemen    : ${designCpDepartemen || '-'}
`;
    return text;
  };

  const getRawVideoBriefText = () => {
    let text = `================================================
DEPARTEMEN MEDKOMINFO - ${appSettings?.cabinetName ? appSettings.cabinetName.toUpperCase() : 'KABINET CITTA PRAKARSA'}
{appSettings?.portalName || 'HMIF UPNVJ 2026'}
================================================
TEMPLATE PENGAJUAN KONTEN VIDEO: ${videoJenis.toUpperCase()}

*Note : Bagian yang tidak diperlukan dapat dihapus*

------------------------------------------------
DETAIL VIDEO
------------------------------------------------
Tema Video    : ${videoTema || '-'}
Isi Konten    :
${videoIsi || '(Kosong)'}

Pakai CC? (Closed Caption): ${videoCc || '-'}
Gambar/Foto (opsional)    : ${videoImg || '-'}
Referensi     : ${videoReferensi || '-'}

------------------------------------------------
DETAIL TAMBAHAN (OPSIONAL)
------------------------------------------------
Sound Effect  : ${videoSoundEffect || '-'}
Musik / Lagu  : ${videoMusik || '-'}
Detail Lainnya: ${videoDetailLainnya || '-'}

------------------------------------------------
CONTACT PERSON & FOOTER
------------------------------------------------
CP Nama       : ${videoCpNama || '-'}
CP Kontak     : ${videoCpKontak || '-'}
Departemen    : ${videoCpDepartemen || '-'}
`;
    return text;
  };

  const getRawPublikasiBriefText = () => {
    const isStructured = publikasiJenis === 'Feeds Instagram' || publikasiJenis === 'Reels / Shorts / Tiktok';
    let compiledCaption = isStructured && (pubCapHeader || pubCapTopik) ? getRawBroadcastText(
      pubCapHeader, pubCapSalam, pubCapHook, pubCapTopik, pubCapTanggal, pubCapWaktu, pubCapTempat, pubCpDepartemen, pubCapCpNama, pubCapCpKontak, pubCapCpNama2, pubCapCpKontak2, pubHashtag
    ) : (publikasiJenis === 'Story Instagram' ? (pubTeksStory || '(Kosong)') : (pubCaption || '(Kosong)'));

    if (!(isStructured && (pubCapHeader || pubCapTopik))) {
      if (publikasiJenis !== 'Story Instagram') {
        const hTags = `#BergerakBersama\n#CiptaKarya${pubHashtag ? '\n' + pubHashtag : ''}`;
        if (compiledCaption === '(Kosong)') {
          compiledCaption = hTags;
        } else {
          compiledCaption += `\n\n${hTags}`;
        }
      }
    }

    let text = `================================================
DEPARTEMEN MEDKOMINFO - ${appSettings?.cabinetName ? appSettings.cabinetName.toUpperCase() : 'KABINET CITTA PRAKARSA'}
{appSettings?.portalName || 'HMIF UPNVJ 2026'}
================================================
TEMPLATE PENGAJUAN PUBLIKASI KONTEN: ${publikasiJenis.toUpperCase()}
*Note : Bagian yang tidak diperlukan dapat dihapus*

------------------------------------------------
DETAIL PENGAJUAN KONTEN
------------------------------------------------
Judul Konten  : ${publikasiJudul || '-'}
Jenis Konten  : ${publikasiJenis}
Tanggal Upload: ${publikasiTanggal ? new Date(publikasiTanggal).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }) : '-'}
Link Drive (Bahan): ${pubLinkDrive || '-'}
Caption / Teks:
${compiledCaption}`;

    if (publikasiJenis === 'Feeds Instagram') {
      text += `

------------------------------------------------
DETAIL TAMBAHAN (OPSIONAL)
------------------------------------------------
Musik Tersemat: ${pubMusik || '-'}
Akun Tersemat : ${pubAkun || '-'}
Detail Lainnya: ${pubDetailLain || '-'}`;
    } else if (publikasiJenis === 'Story Instagram') {
      text += `

------------------------------------------------
DETAIL TAMBAHAN (OPSIONAL)
------------------------------------------------
Link Tersemat : ${pubLinkStory || '-'}
Musik Tersemat: ${pubMusik || '-'}
Akun Tersemat : ${pubAkun || '-'}
Stickers      : ${pubStickers || '-'}
Detail Lainnya: ${pubDetailLain || '-'}`;
    } else if (publikasiJenis === 'Reels / Shorts / Tiktok') {
      text += `

------------------------------------------------
DETAIL TAMBAHAN (OPSIONAL)
------------------------------------------------
Thumbnail     : ${pubThumbnail || '-'}
Musik Tersemat: ${pubMusik || '-'}
Akun Tersemat : ${pubAkun || '-'}
Detail Lainnya: ${pubDetailLain || '-'}`;
    } else if (publikasiJenis === 'Video Youtube') {
      text += `

------------------------------------------------
DETAIL TAMBAHAN (OPSIONAL)
------------------------------------------------
Judul Video   : ${pubJudulYoutube || '-'}
Thumbnail     : ${pubThumbnail || '-'}
Daftar Pustaka: ${pubDaftarPustaka || '-'}
Detail Lainnya: ${pubDetailLain || '-'}`;
    }

    text += `

------------------------------------------------
CONTACT PERSON & FOOTER
------------------------------------------------
CP Nama       : ${pubCpNama || '-'}
CP Kontak     : ${pubCpKontak || '-'}
Departemen    : ${pubCpDepartemen || '-'}`;

    return text;
  };

  const loadBroadcastTemplate = (type: 'kernel') => {
    if (type === 'kernel') {
      setBcHeader('⚙️[KERNEL SESSION MEI 2026]⚙️');
      setBcSalam('Halo Informartikans! @all');
      setBcHook('KERNEL SESSION IS BACK!!');
      setBcTopik('Bulan ini KERNEL Session hadir dengan topik:\n💻 Programming & Informatics Technical Skills 💻');
      setBcTanggalAcara('2026-05-08');
      setBcWaktuAcara('19.00 WIB – selesai');
      setBcTempat('Zoom Meeting');
      setBcCpNama('Shera');
      setBcCpKontak('088223959773 (WhatsApp)');
      setBcCpNama2('');
      setBcCpKontak2('');
      setSelectedDepartemen(['Departemen Media Komunikasi dan Informasi']);
    }
    onTriggerNotification(`Berhasil memuat template broadcast!`);
  };

  const handleFileSelection = (files: File[]) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    
    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        onTriggerNotification(`Format file "${file.name}" tidak didukung. Harap pilih Foto atau PDF.`);
        return;
      }
      
      let formattedSize = '';
      if (file.size < 1024) {
        formattedSize = `${file.size} B`;
      } else if (file.size < 1024 * 1024) {
        formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
      } else {
        formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      const id = `FILE-${Math.floor(1000 + Math.random() * 9000)}`;

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setBcFiles(prev => [...prev, {
            id,
            name: file.name,
            size: formattedSize,
            type: file.type,
            dataUrl: e.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        setBcFiles(prev => [...prev, {
          id,
          name: file.name,
          size: formattedSize,
          type: file.type
        }]);
      }
    });
  };

  const renderChatAttachments = () => {
    if (bcFiles.length === 0) return null;
    return (
      <div className="space-y-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        {bcFiles.map((file) => (
          <div key={file.id} className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg text-[11px] font-semibold text-slate-700 dark:text-slate-300 max-w-full">
            {file.type.startsWith('image/') ? (
              <div className="space-y-1 w-full text-left">
                {file.dataUrl && (
                  <img 
                    src={file.dataUrl} 
                    alt={file.name} 
                    className="max-h-24 object-cover rounded-md border border-slate-200 dark:border-slate-800" 
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500">
                  <Image className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate max-w-[150px]">{file.name}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 w-full text-left">
                <div className="p-1 bg-red-100 text-red-700 rounded-md shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="truncate flex-1">
                  <p className="truncate text-[10px] text-slate-800 dark:text-slate-200 font-bold leading-none">{file.name}</p>
                  <p className="text-[8px] text-slate-600 dark:text-slate-400 font-bold mt-0.5">{file.size} • PDF Document</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFormattedBroadcast = (
    header: string,
    salam: string,
    hook: string,
    topik: string,
    tanggal: string,
    waktu: string,
    tempat: string,
    departemen: string,
    cpNama: string,
    cpKontak: string,
    cpNama2?: string,
    cpKontak2?: string,
    dresscode?: string,
    virtualBackground?: string,
    penutup?: string
  ) => {
    const rawText = getRawBroadcastText(
      header,
      salam,
      hook,
      topik,
      tanggal,
      waktu,
      tempat,
      departemen,
      cpNama,
      cpKontak,
      cpNama2,
      cpKontak2,
      undefined,
      dresscode,
      virtualBackground,
      penutup
    );

    return (
      <div className="text-left select-text">
        <MarkdownRenderer content={rawText} />
      </div>
    );
  };

  const handlePublicSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedSender = '';
    let computedDepartment = '';

    if (jenisPengajuan === 'Design') {
      computedSender = designCpNama;
      computedDepartment = designCpDepartemen;
    } else if (jenisPengajuan === 'Konten Video') {
      computedSender = videoCpNama;
      computedDepartment = videoCpDepartemen;
    } else if (jenisPengajuan === 'Publikasi Konten') {
      computedSender = pubCpNama;
      computedDepartment = pubCpDepartemen;
    } else if (jenisPengajuan === 'Publikasi Broadcast') {
      computedSender = bcCpNama;
      computedDepartment = bcDepartemen;
    }

    if (!computedSender.trim() || !computedDepartment.trim()) {
      onTriggerNotification("Harap lengkapi Nama CP dan Departemen.");
      return;
    }

    let detailsString = '';
    let rawBroadcastMessageStr = '';
    let assetLinkString = '';
    let deadlineString = '';

    // Collect variables based on selected jenisPengajuan
    let jsonOutput: any = {
      sender: computedSender,
      programKerja: computedDepartment,
      jenisPengajuan,
      urgency,
    };

    if (jenisPengajuan === 'Design') {
      jsonOutput.tingkat_urgensi = designTingkatUrgensi === '3' ? 'Mendesak' : designTingkatUrgensi === '5' ? 'Menengah' : 'Standar (Sangat Direkomendasikan)';
      jsonOutput.tanggal_deadline = designDeadline;
      
      if (!designJudul.trim() || !designTema.trim() || !designDeadline.trim()) {
        onTriggerNotification("Harap lengkapi Judul, Tema, dan Deadline Desain.");
        return;
      }
      
      let detailBody = `Format Desain: ${designJenis}
Judul Desain: ${designJudul}
Tema Desain: ${designTema}
Dimensi/Ukuran: ${designUkuran}
`;

      if (designJenis === 'Feeds Instagram') {
        detailBody += `\nDetail Slide:\n` + designSlides.map(s => `- ${s.num}:\n  Isi: ${s.isi || '(Kosong)'}\n  Gambar: ${s.img || '-'}`).join('\n');
      } else {
        detailBody += `\nDetail Konten:\n- Judul Utama: ${designJudulUtama}\n- Isi Konten: ${designIsiUmum}`;
        if (designJenis === 'Sertifikat') {
          detailBody += `\n- Isi Tanda Tangan: ${designIsiTandaTangan}`;
        } else if (designJenis === 'Merch') {
          detailBody += `\n- Tipe Merch: ${designTipeMerch}`;
        }
      }

      detailBody += `\n\nDetail Tambahan:\n- Referensi: ${designReferensi || '-'}\n- Asset Vector: ${designAssetVector || '-'}`;
      if (designJenis === 'Feeds Instagram') {
        detailBody += `\n- Daftar Pustaka: ${designDaftarPustaka || '-'}`;
      }
      detailBody += `\n- Detail Lainnya: ${designDetailLainnya || '-'}`;
      detailBody += `\n\nContact Person:\n- Nama: ${designCpNama}\n- Kontak: ${designCpKontak}\n- Departemen: ${designCpDepartemen}`;

      detailsString = detailBody;
      assetLinkString = designReferensi || "Form Desain Real-Time Generated";
      deadlineString = designDeadline;

      jsonOutput.design = {
        judul: designJudul,
        jenis: designJenis,
        tema: designTema,
        judulUtama: designJudulUtama,
        isiUmum: designIsiUmum,
        imgUmum: designImgUmum,
        slides: designSlides,
        isiTandaTangan: designIsiTandaTangan,
        tipeMerch: designTipeMerch,
        ukuran: designUkuran,
        referensi: designReferensi,
        daftarPustaka: designDaftarPustaka,
        assetVector: designAssetVector,
        detailLainnya: designDetailLainnya,
        cpNama: designCpNama,
        cpKontak: designCpKontak,
        cpDepartemen: designCpDepartemen,
        deadline: designDeadline
      };
    } else if (jenisPengajuan === 'Konten Video') {
      jsonOutput.tingkat_urgensi = videoTingkatUrgensi === '3' ? 'Mendesak' : videoTingkatUrgensi === '5' ? 'Menengah' : 'Standar (Sangat Direkomendasikan)';
      jsonOutput.tanggal_deadline = videoDeadline;

      if (!videoJudul.trim() || !videoDeadline.trim() || !videoTema.trim() || !videoIsi.trim() || !videoCpNama.trim() || !videoCpKontak.trim() || !videoCpDepartemen) {
        onTriggerNotification("Harap lengkapi field wajib Kebutuhan Video (Judul, Tema, Isi Konten, CP Nama, CP Kontak, dan Departemen).");
        return;
      }
      const rawVideoBrief = getRawVideoBriefText();
      detailsString = rawVideoBrief;
      assetLinkString = videoReferensi || videoImg || 'None';
      deadlineString = videoDeadline;
      jsonOutput.video = {
        judul: videoJudul,
        jenis: videoJenis,
        rasio: videoRasio,
        tema: videoTema,
        isi: videoIsi,
        cc: videoCc,
        gambarFoto: videoImg,
        referensi: videoReferensi,
        soundEffect: videoSoundEffect,
        musikLagu: videoMusik,
        detailLainnya: videoDetailLainnya,
        cpNama: videoCpNama,
        cpKontak: videoCpKontak,
        cpDepartemen: videoCpDepartemen,
        deadline: videoDeadline
      };
    } else if (jenisPengajuan === 'Publikasi Konten') {
      if (!publikasiJudul.trim() || !publikasiTanggal.trim() || !pubCpNama.trim() || !pubCpKontak.trim() || !pubCpDepartemen) {
        onTriggerNotification("Harap lengkapi Judul Konten, Tanggal Upload, Nama CP, Kontak CP, dan Departemen.");
        return;
      }
      const isStructured = publikasiJenis === 'Feeds Instagram' || publikasiJenis === 'Reels / Shorts / Tiktok';
      if (isStructured && (!pubCapCpNama.trim() || !pubCapCpKontak.trim())) {
        onTriggerNotification("Harap lengkapi Nama CP 1 dan Kontak CP 1 pada Narahubung Acara.");
        return;
      }
      detailsString = getRawPublikasiBriefText();
      assetLinkString = pubLinkDrive;
      deadlineString = publikasiTanggal;
      jsonOutput.publikasi = {
        judul: publikasiJudul,
        jenis: publikasiJenis,
        linkDrive: pubLinkDrive,
        caption: (publikasiJenis === 'Feeds Instagram' || publikasiJenis === 'Reels / Shorts / Tiktok') ? ((pubCapHeader || pubCapTopik) ? getRawBroadcastText(
          pubCapHeader, pubCapSalam, pubCapHook, pubCapTopik, pubCapTanggal, pubCapWaktu, pubCapTempat, pubCpDepartemen, pubCapCpNama, pubCapCpKontak, pubCapCpNama2, pubCapCpKontak2, pubHashtag
        ) : '') : pubCaption,
        hashtag: pubHashtag,
        musik: pubMusik,
        akun: pubAkun,
        teksStory: pubTeksStory,
        linkStory: pubLinkStory,
        stickers: pubStickers,
        thumbnail: pubThumbnail,
        judulYoutube: pubJudulYoutube,
        daftarPustaka: pubDaftarPustaka,
        detailLainnya: pubDetailLain,
        cpNama: pubCpNama,
        cpKontak: pubCpKontak,
        cpDepartemen: pubCpDepartemen,
        tanggalUpload: publikasiTanggal
      };
    } else if (jenisPengajuan === 'Publikasi Broadcast') {
      if (!bcHeader.trim() || !bcJadwalKirim || !bcCpNama.trim() || !bcCpKontak.trim() || !bcTopik.trim()) {
        onTriggerNotification("Harap lengkapi Judul Proker, Topik/Deskripsi, Jadwal Kirim, Nama CP 1, dan Kontak CP 1 (Wajib).");
        return;
      }
      rawBroadcastMessageStr = getRawBroadcastText(
        bcHeader,
        bcSalam,
        bcHook,
        bcTopik,
        bcTanggalAcara,
        bcWaktuAcara,
        bcTempat,
        bcDepartemen,
        bcCpNama,
        bcCpKontak,
        bcCpNama2,
        bcCpKontak2,
        undefined,
        bcDresscode,
        bcVirtualBackground,
        bcPenutup
      );
      const formattedMessage = rawBroadcastMessageStr;
      
      const fileListStr = bcFiles.length > 0 
        ? `\n\nDokumen Terlampir:\n` + bcFiles.map((f, i) => `${i + 1}. ${f.name} (${f.size}) [${f.type}]`).join('\n')
        : '';

      detailsString = `Media: ${broadcastMedia}\nJudul: ${bcHeader}\nJadwal Kirim: ${bcJadwalKirim}\n\nTeks Broadcast:\n${formattedMessage}${fileListStr}`;
      assetLinkString = bcFiles.length > 0 ? `${bcFiles.length} file terlampir` : "Form Teks Broadcast Real-Time Generated";
      deadlineString = bcJadwalKirim;
      jsonOutput.broadcast = {
        judulHeader: bcHeader,
        salamPembuka: bcSalam,
        hook: bcHook,
        topikKegiatan: bcTopik,
        tanggalAcara: bcTanggalAcara,
        waktuAcara: bcWaktuAcara,
        tempatPlatform: bcTempat,
        cpNama: bcCpNama,
        cpKontak: bcCpKontak,
        cpNama2: bcCpNama2,
        cpKontak2: bcCpKontak2,
        dresscode: bcDresscode,
        virtualBackground: bcVirtualBackground,
        penutup: bcPenutup,
        departemenPengirim: bcDepartemen,
        jadwalPenyebaran: bcJadwalKirim,
        mediaPenyebaran: broadcastMedia,
        fullText: formattedMessage,
        lampiranFiles: bcFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      };
    }

    // Print JSON output simulating ready to send via fetch to Google Apps Script
    console.log("%c[SIMULASI FETCH API KE GOOGLE APPS SCRIPT]", "color: #3b82f6; font-weight: bold; font-size: 14px;");
    console.log("JSON Payload yang siap dikirim:", JSON.stringify(jsonOutput, null, 2));

    let computedProgramKerja = '';

    if (jenisPengajuan === 'Design') {
      computedProgramKerja = designJudul;
    } else if (jenisPengajuan === 'Konten Video') {
      computedProgramKerja = videoJudul;
    } else if (jenisPengajuan === 'Publikasi Konten') {
      computedProgramKerja = publikasiJudul;
    } else if (jenisPengajuan === 'Publikasi Broadcast') {
      computedProgramKerja = bcHeader;
    }

    const newSub: Submission = {
      id: `SUB-P${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      sender: computedSender,
      department: computedDepartment,
      picHumas: 'Unassigned',
      programKerja: computedProgramKerja,
      jenisPengajuan: jenisPengajuan,
      urgency: urgency,
      deadline: deadlineString.replace('T', ' '),
      status: 'Queue',
      details: detailsString,
      rawBroadcastText: jenisPengajuan === 'Publikasi Broadcast' ? rawBroadcastMessageStr : undefined,
      assetLink: assetLinkString || 'None provided',
      notes: `Form Pengajuan Dinamis: ${jenisPengajuan}`
    };

    onAddSubmission(newSub);
    setSubmitSuccess(true);
    onTriggerNotification(`Pengajuan ${jenisPengajuan} berhasil dikirim ke Pengurus Medkominfo!`);
    
    // Reset fields
    if (jenisPengajuan === 'Design') {
      setDesignJudul('');
      setDesignDeskripsi('');
      setDesignTema('');
      setDesignJudulUtama('');
      setDesignIsiUmum('');
      setDesignImgUmum('');
      setDesignSlides([
        { id: '1', num: 'Slide 1 (Cover)', isi: '', img: '' },
        { id: '2', num: 'Slide 2', isi: '', img: '' }
      ]);
      setDesignIsiTandaTangan('sediakan 2 tempat untuk kahim(Dimas Rasyach Nur Fathi) dan kadept medkom(Andrian Hidayah Nurfajrin)');
      setDesignTipeMerch('Keychain / Totebag / Sticker');
      setDesignUkuran('');
      setDesignReferensi('');
      setDesignDaftarPustaka('');
      setDesignAssetVector('');
      setDesignDetailLainnya('');
      setDesignDeadline('');
    } else if (jenisPengajuan === 'Konten Video') {
      setVideoJudul('');
      setVideoDeskripsi('');
      setVideoDeadline('');
      setVideoTema('');
      setVideoIsi('');
      setVideoCc('Ya');
      setVideoImg('');
      setVideoReferensi('');
      setVideoSoundEffect('');
      setVideoMusik('');
      setVideoDetailLainnya('');
    } else if (jenisPengajuan === 'Publikasi Konten') {
      setPublikasiJudul('');
      setPublikasiDeskripsi('');
      setPublikasiTanggal('');
      setPubLinkDrive('');
      setPubCaption('');
      setPubHashtag('');
      setPubMusik('');
      setPubAkun('');
      setPubTeksStory('');
      setPubLinkStory('');
      setPubStickers('');
      setPubThumbnail('');
      setPubJudulYoutube('');
      setPubDaftarPustaka('');
      setPubDetailLain('');
      setPubCpNama('');
      setPubCpKontak('');
      setPubCpDepartemen('');
    } else if (jenisPengajuan === 'Publikasi Broadcast') {
      setBroadcastJudul('');
      setBroadcastDeskripsi('');
      setBroadcastTanggal('');
      setBcHeader('');
      setBcSalam('');
      setBcHook('');
      setBcTopik('');
      setBcTanggalAcara('');
      setBcWaktuAcara('');
      setBcTempat('');
      setBcCp('');
      setBcCpNama('');
      setBcCpKontak('');
      setBcCpNama2('');
      setBcCpKontak2('');
      setBcDepartemen('Departemen Media Komunikasi dan Informasi');
      setSelectedDepartemen(['Departemen Media Komunikasi dan Informasi']);
      setSelectedMedia(['Whatsapp (HIMA IF)']);
      setBcFiles([]);
      setBcJadwalKirim('');
    }

    setTimeout(() => {
      setSubmitSuccess(false);
    }, 6000);
  };

  // Filter content that is marked as "Published" or "Scheduled" for the public mading
  const publicPosts = publications.filter(p => p.status === 'Published');
  const publicVideos = videos.filter(v => v.status === 'Done');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-cyan-600 via-blue-600 to-blue-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 text-white p-6 md:p-10 shadow-xl border border-cyan-400/30 dark:border-slate-700">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-52 h-52 bg-cyan-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex gap-4">
            {appSettings?.logoUrl && (
              <img src={appSettings.logoUrl} alt="Logo Dept" className="w-16 h-16 object-contain mb-4 rounded-xl shadow-lg" />
            )}
            {appSettings?.hmifLogoUrl && (
              <img src={appSettings.hmifLogoUrl} alt="Logo HMIF" className="w-16 h-16 object-contain mb-4 rounded-xl shadow-lg" />
            )}
          </div>
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full text-xs font-bold text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Portal Publik Resmi Anggota {appSettings?.portalName || 'HMIF UPNVJ 2026'}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            Sinergi Komunikasi <br/> 
            <span className="text-blue-300">HMIF & Warga Informatika</span>
          </h1>
          
          <p className="text-xs md:text-sm text-blue-100 leading-relaxed max-w-2xl font-medium">
            Selamat datang di Portal Anggota. Halaman ini disediakan khusus untuk seluruh mahasiswa Informatika UPN Veteran Jakarta 
            untuk menyuarakan pengajuan, mengajukan publikasi konten/desain acara, memantau kalender kegiatan kemahasiswaan, serta mengenal tim Medkominfo kabinet kita.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            <button
              onClick={() => setActivePortalSection('form')}
              className="bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Ajukan Desain / Pengajuan
            </button>
            <button
              onClick={() => setActivePortalSection('roster')}
              className="bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              Kenali Tim Medkom
            </button>
          </div>
        </div>
      </div>

      {/* Mini Portal Navigation Controls */}
      <div className="flex flex-wrap md:flex-nowrap border-b border-slate-200 dark:border-slate-800 gap-1 md:overflow-x-auto pb-px">
        <button
          onClick={() => setActivePortalSection('overview')}
          className={`px-4 md:px-5 py-2.5 md:py-3 text-[11px] md:text-xs font-bold transition-all border-b-2 shrink-0 grow md:grow-0 text-center ${
            activePortalSection === 'overview'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          💡 Layanan & Informasi Utama
        </button>
        <button
          onClick={() => setActivePortalSection('form')}
          className={`px-4 md:px-5 py-2.5 md:py-3 text-[11px] md:text-xs font-bold transition-all border-b-2 shrink-0 flex items-center gap-1.5 grow md:grow-0 text-center justify-center ${
            activePortalSection === 'form'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📝 Ajukan Kebutuhan / Pengajuan
          {submissions.length > 0 && (
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
          )}
        </button>
        <button
          onClick={() => setActivePortalSection('calendar')}
          className={`px-4 md:px-5 py-2.5 md:py-3 text-[11px] md:text-xs font-bold transition-all border-b-2 shrink-0 grow md:grow-0 text-center ${
            activePortalSection === 'calendar'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📅 Kalender Medkominfo
        </button>
        <button
          onClick={() => setActivePortalSection('roster')}
          className={`px-4 md:px-5 py-2.5 md:py-3 text-[11px] md:text-xs font-bold transition-all border-b-2 shrink-0 grow md:grow-0 text-center ${
            activePortalSection === 'roster'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          👥 Hubungi Pengurus Medkominfo
        </button>
      </div>

      {/* PORTAL SECTIONS RENDERING */}
      
      {/* 1. OVERVIEW & GUIDELINES */}
      {activePortalSection === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Informative Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Medkominfo Functions card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Kanal Pelayanan & Peran Medkominfo HMIF
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Divisi Media, Komunikasi, dan Informasi (Medkominfo) memiliki fungsi sebagai penyaji konten edukatif, informatif, dan apresiatif bagi internal maupun eksternal HMIF UPNVJ. Kami melayani beberapa pengajuan publikasi berikut:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1.5 hover:border-blue-200 transition-colors">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">🎨 Desain Publikasi</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Bantu pembuatan pamflet, poster kegiatan, instastory ucapan hari raya, hingga feeds kustom departemen Anda.</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1.5 hover:border-emerald-200 transition-colors">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">🎥 Produksi Video</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Liputan acara himpunan, pembuatan reels promosi, bumper video, dokumenter, hingga konten TikTok interaktif.</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1.5 hover:border-purple-200 transition-colors">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">💬 Broadcast Informasi</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Penyebaran info akademik, beasiswa, lomba, kuesioner, hingga undangan resmi lewat Line (Kema IF, Kema FIK) dan WhatsApp.</p>
                </div>
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1.5 hover:border-amber-200 transition-colors">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">📥 Kotak Pengajuan Informatika</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Kritik, saran konstruktif, pengaduan fasilitas perkuliahan, atau pengajuan pengembangan program studi Informatika.</p>
                </div>
              </div>
            </div>

            {/* Redesigned SOP & Ketentuan Card */}
            <div className="bg-white dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              {/* Header */}
              <div className="p-5 md:p-6 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    SOP & Ketentuan Pengajuan Medkominfo
                  </h3>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">Batas pengerjaan, lead time prioritas, dan kuota publikasi harian</p>
                </div>
                
                {/* Sub tabs */}
                <div className="flex bg-slate-200 dark:bg-slate-700/60 p-1 rounded-xl gap-0.5 self-start sm:self-center">
                  <button
                    onClick={() => setSopSubTab('alur')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      sopSubTab === 'alur'
                        ? 'bg-slate-900 text-indigo-400 shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    🗺️ Alur
                  </button>
                  <button
                    onClick={() => setSopSubTab('prioritas')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      sopSubTab === 'prioritas'
                        ? 'bg-slate-900 text-indigo-400 shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    ⏱️ Prioritas
                  </button>
                  <button
                    onClick={() => setSopSubTab('kuota')}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      sopSubTab === 'kuota'
                        ? 'bg-slate-900 text-indigo-400 shadow-xs font-black'
                        : 'text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    📊 Kuota
                  </button>
                </div>
              </div>

              {/* Sub Tab Content with Transitions */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {sopSubTab === 'alur' && (
                    <motion.div
                      key="sop-alur"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-5"
                    >
                      <div className="p-3 bg-blue-50/40 border border-blue-100/50 rounded-xl flex gap-2.5 items-start">
                        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-700 leading-relaxed font-medium">
                          Gunakan alur 4 langkah terstruktur di bawah ini untuk mengajukan publikasi atau pembuatan desain ke tim Medkominfo HMIF.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-100 transition-colors bg-linear-to-b from-white to-slate-50/20">
                          <div className="w-7 h-7 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center font-black text-xs shadow-xs mb-3">1</div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Isi Form Pengajuan</span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Anggota / panitia mengisi form kebutuhan lengkap dengan rincian materi, link referensi Google Docs/Drive, dan harapan tanggal rilis.
                          </p>
                        </div>

                        <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-100 transition-colors bg-linear-to-b from-white to-slate-50/20">
                          <div className="w-7 h-7 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center font-black text-xs shadow-xs mb-3">2</div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Review Humas & Kadept</span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Admin Medkominfo meninjau kelayakan berkas, memetakan penanggung jawab (PIC) desainer/videografer, serta memvalidasi kesesuaian kuota.
                          </p>
                        </div>

                        <div className="relative p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-100 transition-colors bg-linear-to-b from-white to-slate-50/20">
                          <div className="w-7 h-7 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center font-black text-xs shadow-xs mb-3">3</div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Proses Kreatif & Produksi</span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Penugasan masuk antrean desainer. Hasil draf awal akan dikirimkan kepada pemohon untuk mendapatkan persetujuan akhir atau revisi minor.
                          </p>
                        </div>

                        <div className="relative p-4 rounded-2xl border border-emerald-100 hover:border-emerald-200 transition-colors bg-emerald-50/5">
                          <div className="w-7 h-7 bg-emerald-50 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-black text-xs shadow-xs mb-3">✓</div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">Finalisasi & Publikasi</span>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                            Berkas final yang sudah disetujui akan diunggah di kanal resmi Instagram, TikTok, YouTube, atau dipancarkan ke grup-grup broadcast mahasiswa.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {sopSubTab === 'prioritas' && (
                    <motion.div
                      key="sop-prioritas"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex gap-2.5 items-start">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                        <div>
                          <span className="text-xs font-black text-amber-800 block">⏱️ 1. Skala Prioritas & Batas Waktu (Lead Time)</span>
                          <p className="text-xs text-amber-700 leading-relaxed mt-1 font-semibold">
                            Pengajuan wajib dilakukan dengan memperhatikan batas waktu dari hari H publikasi/kegiatan agar hasil produksi dapat maksimal.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-1">
                        {/* 1. Prioritas Standar */}
                        <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                          <div className="flex gap-2.5 items-center">
                            <span className="w-3.5 h-3.5 bg-emerald-500 border-4 border-emerald-100 rounded-full shrink-0"></span>
                            <div>
                              <span className="font-extrabold text-slate-850 text-xs block">🟢 Prioritas Standar (Low)</span>
                              <p className="text-xs text-slate-500 font-semibold">Untuk kegiatan reguler & non-mendesak</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 md:justify-end">
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              🎨 Desain & Video: <strong className="text-emerald-700 font-extrabold">Maks H-7</strong>
                            </span>
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              📢 Publikasi Konten: <strong className="text-emerald-700 font-extrabold">Maks H-6</strong>
                            </span>
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              💬 Broadcast: <strong className="text-emerald-700 font-extrabold">Maks H-12 Jam</strong>
                            </span>
                          </div>
                        </div>

                        {/* 2. Prioritas Menengah */}
                        <div className="p-4 bg-amber-50/30 border border-amber-100 rounded-2xl flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                          <div className="flex gap-2.5 items-center">
                            <span className="w-3.5 h-3.5 bg-amber-500 border-4 border-amber-100 rounded-full shrink-0"></span>
                            <div>
                              <span className="font-extrabold text-slate-850 text-xs block">🟡 Prioritas Menengah (Medium)</span>
                              <p className="text-xs text-slate-500 font-semibold">Beban pengerjaan standar & terjadwal</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 md:justify-end">
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              🎨 Desain & Video: <strong className="text-amber-700 font-extrabold">Maks H-5</strong>
                            </span>
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              📢 Publikasi Konten: <strong className="text-amber-700 font-extrabold">Maks H-3</strong>
                            </span>
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              💬 Broadcast: <strong className="text-amber-700 font-extrabold">Maks H-6 Jam</strong>
                            </span>
                          </div>
                        </div>

                        {/* 3. Prioritas Mendesak */}
                        <div className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                          <div className="flex gap-2.5 items-center">
                            <span className="w-3.5 h-3.5 bg-rose-500 border-4 border-rose-100 rounded-full shrink-0"></span>
                            <div>
                              <span className="font-extrabold text-slate-855 text-xs block">🔴 Prioritas Mendesak (High)</span>
                              <p className="text-xs text-rose-600 font-bold">Butuh penanganan prioritas / mendadak</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 md:justify-end">
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              🎨 Desain & Video: <strong className="text-rose-700 font-extrabold">Maks H-3</strong>
                            </span>
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              📢 Publikasi Konten: <strong className="text-rose-700 font-extrabold">Maks H-1</strong>
                            </span>
                            <span className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              💬 Broadcast: <strong className="text-rose-700 font-extrabold">Maks H-3 Jam</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {sopSubTab === 'kuota' && (
                    <motion.div
                      key="sop-kuota"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex gap-2.5 items-start">
                        <Layers className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] font-bold text-indigo-800 block">📊 2. Kuota Harian Pengajuan & Publikasi</span>
                          <p className="text-[10px] text-indigo-700 leading-relaxed mt-0.5 font-medium">
                            Untuk menjaga kualitas visual dan menghindari penumpukan (overload) antrean pengerjaan, Medkominfo menetapkan batas kuota berikut:
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {/* 1. Desain Grafis */}
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 hover:border-indigo-100 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">🎨</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Desain Grafis</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Maksimal <strong className="text-slate-800 dark:text-slate-200 font-extrabold">3 pengajuan</strong> di tanggal pengerjaan yang sama.
                          </p>
                        </div>

                        {/* 2. Konten Video */}
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 hover:border-indigo-100 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">🎬</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Konten Video</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Maksimal <strong className="text-slate-800 dark:text-slate-200 font-extrabold">1 pengajuan</strong> di tanggal pengerjaan yang sama.
                          </p>
                        </div>

                        {/* 3. Publikasi Medsos */}
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 hover:border-indigo-100 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">📱</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Publikasi Media Sosial</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Kuota harian: <strong className="text-slate-800 dark:text-slate-200 font-bold">3 Instagram Story, 1 Feeds, dan 1 Reels</strong>.
                          </p>
                        </div>

                        {/* 4. Publikasi Broadcast */}
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 hover:border-indigo-100 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs">💬</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">Publikasi Broadcast (BC)</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Maksimal <strong className="text-slate-800 dark:text-slate-200">3 kali penyebaran</strong> sehari. <br />
                            <span className="text-[10px] text-slate-600 dark:text-slate-400 italic block mt-0.5">
                              *BC ke-4 diizinkan jika target audiens tidak sama persis.
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* Right sidebar info */}
          <div className="space-y-6">
            
            {/* Quick stats on citizen interactions */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-widest block">Interaksi Portal Publik</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl text-center">
                  <span className="text-xl font-black text-slate-800 dark:text-slate-200 block">{submissions.length}</span>
                  <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase block mt-0.5">Total Pengajuan</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl text-center">
                  <span className="text-xl font-black text-emerald-600 block">
                    {submissions.filter(s => s.status === 'Approved' || s.status === 'Published').length}
                  </span>
                  <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase block mt-0.5">Disetujui / Rilis</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Antrean Saat Ini:</span>
                  <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    {submissions.filter(s => s.status === 'Queue' || s.status === 'Designing').length} berkas
                  </span>
                </div>
              </div>
            </div>

            {/* Quick External links tree */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-600" />
                Linktree Utama HMIF
              </h4>

              <div className="space-y-2">
                <a 
                  href="https://www.instagram.com/hmif_upnvj?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-500" />
                    Instagram @hmif_upnvj
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                </a>

                <a 
                  href="https://youtube.com/@hmifupnvj?si=0RZO4uBkespwNJ41" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/60 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-500" />
                    YouTube HMIF UPNVJ
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                </a>

                <button 
                  onClick={() => onNavigateToTab('links')}
                  className="w-full text-center py-2.5 bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-black rounded-xl transition-all block"
                >
                  Lihat Semua Dokumen HUMAS
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. PUBLIC SUBMISSION / SUGGESTION FORM */}
      {activePortalSection === 'form' && (
        <div className={`mx-auto w-full bg-white dark:bg-slate-900 p-4 md:p-8 rounded-2xl md:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 md:space-y-6 transition-all duration-300 ${
          jenisPengajuan === 'Publikasi Broadcast' ? 'max-w-6xl' : 'max-w-3xl'
        }`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              Kotak Pengajuan Layanan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Formulir resmi ini akan langsung diteruskan ke tim antrean admin Medkominfo HMIF UPNVJ secara real-time.</p>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-800 animate-pulse">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">Pengajuan Berhasil Terkirim!</span>
                <p className="text-xs text-emerald-600 mt-1">
                  Terima kasih atas kontribusi Anda. Pengurus Medkominfo telah menerima berkas Anda. Silakan cek konsol developer browser (F12) untuk melihat format Payload JSON yang disimulasikan siap dikirim ke Google Apps Script backend.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handlePublicSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Pilih Jenis Pengajuan</label>
                <select
                  value={jenisPengajuan}
                  onChange={(e) => setJenisPengajuan(e.target.value as any)}
                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-bold text-blue-600 bg-blue-50/40"
                >
                  <option value="Design">Design</option>
                  <option value="Konten Video">Konten Video</option>
                  <option value="Publikasi Konten">Publikasi Konten</option>
                  <option value="Publikasi Broadcast">Publikasi Broadcast</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Hari Pengajuan</label>
                <div className="mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 font-bold">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Dynamic fields with transitions */}
            <AnimatePresence mode="wait">
              {jenisPengajuan === 'Design' && (
                <motion.div
                  key="design"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 p-5 bg-blue-50/20 border border-blue-200 rounded-3xl text-left"
                >
                  <div className="border-b border-blue-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-blue-100 text-blue-700 rounded-xl text-xs font-bold">🎨</span>
                      <h4 className="text-xs font-black text-blue-800 uppercase tracking-wider">Form Kebutuhan Desain Medkominfo</h4>
                    </div>
                  </div>

                  {/* Section 1: Informasi Dasar Desain */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">📌</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Langkah 1: Informasi Dasar</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Pengajuan Desain</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Feeds Edukasi Cyber Security"
                          value={designJudul}
                          onChange={(e) => setDesignJudul(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jenis Template Desain</label>
                        <select
                          value={designJenis}
                          onChange={(e) => setDesignJenis(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <option value="Feeds Instagram">Feeds Instagram</option>
                          <option value="Story Instagram">Story Instagram</option>
                          <option value="Thumbnail Reels / Shorts / Tiktok">Thumbnail Reels / Shorts / Tiktok</option>
                          <option value="Thumbnail Youtube">Thumbnail Youtube</option>
                          <option value="Poster">Poster</option>
                          <option value="Banner">Banner</option>
                          <option value="Sertifikat">Sertifikat</option>
                          <option value="Powerpoint">Powerpoint</option>
                          <option value="Background Zoom">Background Zoom</option>
                          <option value="Merch">Merch</option>
                          <option value="Isi Sendiri">Isi Sendiri</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tema Desain</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Edukasi Kesadaran Password"
                          value={designTema}
                          onChange={(e) => setDesignTema(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Ukuran / Dimensi Desain</label>
                        <input
                          type="text"
                          placeholder="e.g. 1080 x 1080 px"
                          value={designUkuran}
                          onChange={(e) => setDesignUkuran(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Tingkat Urgensi</label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setDesignTingkatUrgensi('7')}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                            designTingkatUrgensi === '7' 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400 shadow-sm ring-1 ring-blue-500' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Info className={`w-5 h-5 mb-1.5 ${designTingkatUrgensi === '7' ? 'text-blue-500' : 'text-slate-400'}`} />
                          <span className="text-[11px] font-black uppercase tracking-wide">Standar</span>
                          <span className={`text-[10px] font-bold mt-0.5 ${designTingkatUrgensi === '7' ? 'text-blue-600' : 'text-slate-400'}`}>(H+7)</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setDesignTingkatUrgensi('5')}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                            designTingkatUrgensi === '5' 
                            ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-400 shadow-sm ring-1 ring-amber-500' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <AlertTriangle className={`w-5 h-5 mb-1.5 ${designTingkatUrgensi === '5' ? 'text-amber-500' : 'text-slate-400'}`} />
                          <span className="text-[11px] font-black uppercase tracking-wide">Menengah</span>
                          <span className={`text-[10px] font-bold mt-0.5 ${designTingkatUrgensi === '5' ? 'text-amber-600' : 'text-slate-400'}`}>(H+5)</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setDesignTingkatUrgensi('3')}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                            designTingkatUrgensi === '3' 
                            ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500 dark:text-rose-400 shadow-sm ring-1 ring-rose-500' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <AlertOctagon className={`w-5 h-5 mb-1.5 ${designTingkatUrgensi === '3' ? 'text-rose-500' : 'text-slate-400'}`} />
                          <span className="text-[11px] font-black uppercase tracking-wide">Mendesak</span>
                          <span className={`text-[10px] font-bold mt-0.5 ${designTingkatUrgensi === '3' ? 'text-rose-600' : 'text-slate-400'}`}>(H+3)</span>
                        </button>
                      </div>
                      
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 mt-2 text-left">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tanggal Deadline (Kalkulasi):</span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 ml-auto">{designDeadline}</span>
                        </div>
                        {designTingkatUrgensi === '3' && (
                          <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-1.5 border-t border-slate-200 dark:border-slate-800 pt-1.5">
                            * Apabila pengajuan mendesak, silahkan hubungi Kadept dan Wakadept.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Konten Detail Desain (Dinamis Sesuai Pilihan) */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">📝</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Langkah 2: Detail Konten ({designJenis})
                      </span>
                    </div>

                    {designJenis === 'Feeds Instagram' ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">Daftar Slide Konten Feeds:</span>
                          <button
                            type="button"
                            onClick={handleAddSlide}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah Slide
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {designSlides.map((slide) => (
                            <div key={slide.id} className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                                  {slide.num}
                                </span>
                                {designSlides.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSlide(slide.id)}
                                    className="text-[10px] text-red-600 hover:text-red-800 font-extrabold flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                                  </button>
                                )}
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Isi Konten Slide</label>
                                <RichTextArea
                                  rows={2}
                                  placeholder="e.g. Masukkan pokok pikiran atau teks yang tertulis pada slide ini"
                                  value={slide.isi}
                                  onChange={(e) => handleSlideChange(slide.id, 'isi', e.target.value)}
                                  className="w-full mt-1 px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-300 transition-colors"
                                />
                              </div>

                              <div>
                                <label className="text-[9px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Link Gambar / Foto Pendukung (Opsional)</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Link Google Drive asset gambar"
                                  value={slide.img}
                                  onChange={(e) => handleSlideChange(slide.id, 'img', e.target.value)}
                                  className="w-full mt-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-mono focus:outline-none focus:border-blue-300 transition-colors"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {!['Powerpoint', 'Sertifikat'].includes(designJenis) && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Utama Konten</label>
                            <input
                              type="text"
                              placeholder="e.g. SEMINAR NASIONAL 2026"
                              value={designJudulUtama}
                              onChange={(e) => setDesignJudulUtama(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            {designJenis === 'Story Instagram' && 'Isi Konten Story'}
                            {designJenis === 'Thumbnail Reels / Shorts / Tiktok' && 'Isi Konten Thumbnail'}
                            {designJenis === 'Thumbnail Youtube' && 'Isi Konten Thumbnail'}
                            {designJenis === 'Poster' && 'Isi Konten Poster'}
                            {designJenis === 'Banner' && 'Isi Konten Banner'}
                            {designJenis === 'Sertifikat' && 'Isi Redaksi Sertifikat'}
                            {designJenis === 'Powerpoint' && 'Penjelasan Rinci Slide PPT'}
                            {designJenis === 'Background Zoom' && 'Isi Konten Zoom BG'}
                            {designJenis === 'Merch' && 'Penjelasan Desain Merchandise'}
                            {designJenis === 'Isi Sendiri' && 'Isi Detail Desain'}
                          </label>
                          <RichTextArea
                            rows={4}
                            required
                            placeholder="Masukkan draf tulisan, materi, atau instruksi tata letak visual di sini..."
                            value={designIsiUmum}
                            onChange={(e) => setDesignIsiUmum(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-medium text-slate-700 dark:text-slate-300"
                          />
                        </div>

                        {designJenis === 'Sertifikat' && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Isi Tanda Tangan (Sediakan Berapa Tempat)</label>
                            <input
                              type="text"
                              value={designIsiTandaTangan}
                              onChange={(e) => setDesignIsiTandaTangan(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        )}

                        {designJenis === 'Merch' && (
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tipe Merch</label>
                            <input
                              type="text"
                              value={designTipeMerch}
                              onChange={(e) => setDesignTipeMerch(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Link Gambar / Foto Pendukung (Opsional)</label>
                          <input
                            type="text"
                            placeholder="e.g. https://drive.google.com/..."
                            value={designImgUmum}
                            onChange={(e) => setDesignImgUmum(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Section 3: Detail Tambahan */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">📂</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Langkah 3: Detail Tambahan & Referensi</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Link Referensi Desain</label>
                        <input
                          type="text"
                          placeholder="e.g. Link Pinterest, Behance, atau Drive"
                          value={designReferensi}
                          onChange={(e) => setDesignReferensi(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors text-slate-800 dark:text-slate-200 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Asset Vector / Gambar</label>
                        <input
                          type="text"
                          placeholder="e.g. Link logo kementerian, ikon pendukung"
                          value={designAssetVector}
                          onChange={(e) => setDesignAssetVector(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors text-slate-800 dark:text-slate-200 font-medium"
                        />
                      </div>
                    </div>

                    {designJenis === 'Feeds Instagram' && (
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Daftar Pustaka (Wajib Untuk Konten Edukasi)</label>
                        <RichTextArea
                          rows={2}
                          placeholder="Sebutkan link referensi buku, artikel, atau web info sebagai rujukan edukasi..."
                          value={designDaftarPustaka}
                          onChange={(e) => setDesignDaftarPustaka(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-medium text-slate-700 dark:text-slate-300"
                        />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detail Lainnya (Catatan Tambahan)</label>
                      <RichTextArea
                        rows={2}
                        placeholder="Tuliskan catatan khusus atau preferensi warna tertentu untuk desainer..."
                        value={designDetailLainnya}
                        onChange={(e) => setDesignDetailLainnya(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-medium text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Section 4: Kontak Pengirim (Footer Dokumen) */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">👤</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Langkah 4: Kontak Penanggung Jawab</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama Lengkap (Contact Person)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Naqila Syaniwa"
                          value={designCpNama}
                          onChange={(e) => setDesignCpNama(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kontak WA / ID Line</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 0812-3456-7890 / @lineid"
                          value={designCpKontak}
                          onChange={(e) => setDesignCpKontak(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Asal Departemen <span className="text-amber-600 font-extrabold">*</span> <span className="text-[9px] text-blue-600 font-extrabold">(Pilih 1)</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                        {[
                          'Departemen Eselon',
                          'Departemen Kesejahteraan Mahasiswa',
                          'Departemen Pengembangan Mahasiswa',
                          'Departemen Pengembangan Sumber Daya Manusia',
                          'Departemen Ekonomi Kreatif',
                          'Departemen Media Komunikasi dan Informasi'
                        ].map((dept) => {
                          const checked = designCpDepartemen === dept;
                          return (
                            <button
                              type="button"
                              key={dept}
                              onClick={() => {
                                setDesignCpDepartemen(dept);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-left text-xs font-semibold transition-all select-none cursor-pointer ${
                                checked
                                  ? 'border-blue-500 bg-blue-50/80 text-blue-700 shadow-2xs'
                                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950'
                              }`}
                            >
                              <span>{dept}</span>
                              {checked ? (
                                <span className="text-[10px] bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0">✓</span>
                              ) : (
                                <span className="border border-slate-200 dark:border-slate-800 rounded-full w-4 h-4 shrink-0"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>


                </motion.div>
              )}

              {jenisPengajuan === 'Konten Video' && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 p-5 bg-emerald-50/20 border border-emerald-200 rounded-3xl text-left"
                >
                  <div className="border-b border-emerald-100 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold">🎥</span>
                      <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Form Kebutuhan Produksi Konten Video</h4>
                    </div>
                  </div>

                  {/* Section 1: Informasi Dasar Video */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">📌</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Langkah 1: Informasi Dasar</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Pengajuan Video</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Aftermovie Seminar Nasional"
                          value={videoJudul}
                          onChange={(e) => setVideoJudul(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jenis Template Video</label>
                        <select
                          value={videoJenis}
                          onChange={(e) => setVideoJenis(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <option value="Reels / Shorts / Tiktok">Reels / Shorts / Tiktok</option>
                          <option value="After Movie">After Movie</option>
                          <option value="Video Youtube">Video Youtube</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rasio Konten Video</label>
                        <select
                          value={videoRasio}
                          onChange={(e) => setVideoRasio(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <option value="Portrait 9:16">Portrait 9:16 (Vertikal)</option>
                          <option value="Landscape 16:9">Landscape 16:9 (Horizontal)</option>
                          <option value="Square 1:1">Square 1:1 (Kotak)</option>
                        </select>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Tingkat Urgensi</label>
                        <div className="grid grid-cols-3 gap-3">
                          <button
                            type="button"
                            onClick={() => setVideoTingkatUrgensi('7')}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                              videoTingkatUrgensi === '7' 
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Info className={`w-5 h-5 mb-1.5 ${videoTingkatUrgensi === '7' ? 'text-emerald-500' : 'text-slate-400'}`} />
                            <span className="text-[11px] font-black uppercase tracking-wide">Standar</span>
                            <span className={`text-[10px] font-bold mt-0.5 ${videoTingkatUrgensi === '7' ? 'text-emerald-600' : 'text-slate-400'}`}>(H+7)</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setVideoTingkatUrgensi('5')}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                              videoTingkatUrgensi === '5' 
                              ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-400 shadow-sm ring-1 ring-amber-500' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <AlertTriangle className={`w-5 h-5 mb-1.5 ${videoTingkatUrgensi === '5' ? 'text-amber-500' : 'text-slate-400'}`} />
                            <span className="text-[11px] font-black uppercase tracking-wide">Menengah</span>
                            <span className={`text-[10px] font-bold mt-0.5 ${videoTingkatUrgensi === '5' ? 'text-amber-600' : 'text-slate-400'}`}>(H+5)</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setVideoTingkatUrgensi('3')}
                            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
                              videoTingkatUrgensi === '3' 
                              ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500 dark:text-rose-400 shadow-sm ring-1 ring-rose-500' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <AlertOctagon className={`w-5 h-5 mb-1.5 ${videoTingkatUrgensi === '3' ? 'text-rose-500' : 'text-slate-400'}`} />
                            <span className="text-[11px] font-black uppercase tracking-wide">Mendesak</span>
                            <span className={`text-[10px] font-bold mt-0.5 ${videoTingkatUrgensi === '3' ? 'text-rose-600' : 'text-slate-400'}`}>(H+3)</span>
                          </button>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 mt-2 text-left">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tanggal Deadline (Kalkulasi):</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto">{videoDeadline}</span>
                          </div>
                          {videoTingkatUrgensi === '3' && (
                            <div className="text-[10px] text-rose-600 dark:text-rose-400 mt-1.5 border-t border-slate-200 dark:border-slate-800 pt-1.5">
                              * Apabila pengajuan mendesak, silahkan hubungi Kadept dan Wakadept.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Detail Konten (Dinamis Sesuai Pilihan) */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">📝</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Langkah 2: Detail Konten ({videoJenis})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          {videoJenis === 'After Movie' ? 'Tema After Movie' : 'Tema Video'}
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Edukasi IT atau Keseruan Highlight Acara"
                          value={videoTema}
                          onChange={(e) => setVideoTema(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pakai CC ? (Closed Caption)</label>
                        <select
                          value={videoCc}
                          onChange={(e) => setVideoCc(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <option value="Ya">Ya (Menggunakan Teks CC)</option>
                          <option value="Tidak">Tidak</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {videoJenis === 'After Movie' ? 'Isi After Movie (Script/Outline)' : 'Isi Konten Video (Script/Outline)'}
                      </label>
                      <RichTextArea
                        rows={4}
                        required
                        placeholder="Masukkan naskah, urutan adegan (storyboard), draf obrolan, materi presentasi, atau instruksi transisi video secara rinci..."
                        value={videoIsi}
                        onChange={(e) => setVideoIsi(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-medium text-slate-700 dark:text-slate-300"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Link Gambar/Foto Pendukung (Opsional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Link Google Drive asset gambar/foto"
                          value={videoImg}
                          onChange={(e) => setVideoImg(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-mono text-slate-850"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Referensi Video</label>
                        <input
                          type="text"
                          placeholder="e.g. Link referensi video Instagram / TikTok"
                          value={videoReferensi}
                          onChange={(e) => setVideoReferensi(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-medium text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Detail Tambahan & Efek */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">🎵</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Langkah 3: Detail Tambahan & Efek (Opsional)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Link Sound Effect</label>
                        <input
                          type="text"
                          placeholder="e.g. Link sound effect Google Drive"
                          value={videoSoundEffect}
                          onChange={(e) => setVideoSoundEffect(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors text-slate-800 dark:text-slate-200 font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Link Musik / Lagu</label>
                        <input
                          type="text"
                          placeholder="e.g. Link Spotify atau Youtube musik"
                          value={videoMusik}
                          onChange={(e) => setVideoMusik(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors text-slate-800 dark:text-slate-200 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detail Lainnya (Catatan Tambahan)</label>
                      <RichTextArea
                        rows={2}
                        placeholder="Tuliskan catatan khusus, tipe transisi, atau nuansa video (vibe ceria, dramatis, formal, dsb.) untuk video editor..."
                        value={videoDetailLainnya}
                        onChange={(e) => setVideoDetailLainnya(e.target.value)}
                        className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-medium text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Section 4: Kontak Pengirim (Footer Dokumen) */}
                  <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                      <span className="text-xs">👤</span>
                      <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Langkah 4: Kontak Penanggung Jawab</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama Lengkap (Contact Person)</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Naqila Syaniwa"
                          value={videoCpNama}
                          onChange={(e) => setVideoCpNama(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kontak WA / ID Line</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 0812-3456-7890 / @lineid"
                          value={videoCpKontak}
                          onChange={(e) => setVideoCpKontak(e.target.value)}
                          className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-emerald-300 transition-colors font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Asal Departemen <span className="text-amber-600 font-extrabold">*</span> <span className="text-[9px] text-emerald-600 font-extrabold">(Pilih 1)</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                        {[
                          'Departemen Eselon',
                          'Departemen Kesejahteraan Mahasiswa',
                          'Departemen Pengembangan Mahasiswa',
                          'Departemen Pengembangan Sumber Daya Manusia',
                          'Departemen Ekonomi Kreatif',
                          'Departemen Media Komunikasi dan Informasi'
                        ].map((dept) => {
                          const checked = videoCpDepartemen === dept;
                          return (
                            <button
                              type="button"
                              key={dept}
                              onClick={() => {
                                setVideoCpDepartemen(dept);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-left text-xs font-semibold transition-all select-none cursor-pointer ${
                                checked
                                  ? 'border-emerald-500 bg-emerald-50/80 text-emerald-700 shadow-2xs'
                                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950'
                              }`}
                            >
                              <span>{dept}</span>
                              {checked ? (
                                <span className="text-[10px] bg-emerald-600 text-white rounded-full w-4 h-4 flex items-center justify-center shrink-0">✓</span>
                              ) : (
                                <span className="border border-slate-200 dark:border-slate-800 rounded-full w-4 h-4 shrink-0"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>


                </motion.div>
              )}

              {jenisPengajuan === 'Publikasi Konten' && (
                <motion.div
                  key="publikasi_konten"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="max-w-4xl mx-auto items-start">
                    
                    {/* Form Input Pengajuan */}
                    <div className="col-span-full space-y-4 p-5 bg-purple-50/10 border border-purple-200 rounded-3xl">
                      
                      {/* Form Header */}
                      <div className="border-b border-purple-100 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-purple-100 text-purple-700 rounded-xl text-xs font-bold">📢</span>
                          <h4 className="text-xs font-black text-purple-800 uppercase tracking-wider">Form Pengajuan Publikasi Konten Media</h4>
                        </div>

                      </div>

                      {/* Section 1: Informasi Utama Pengajuan */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">📝</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Informasi Utama Pengajuan</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Konten <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Publikasi Opini Mahasiswa Berprestasi"
                              value={publikasiJudul}
                              onChange={(e) => setPublikasiJudul(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jenis Publikasi Konten <span className="text-red-500">*</span></label>
                            <select
                              value={publikasiJenis}
                              onChange={(e) => setPublikasiJenis(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-bold text-slate-700 dark:text-slate-300"
                            >
                              <option value="Feeds Instagram">Feeds Instagram</option>
                              <option value="Story Instagram">Story Instagram</option>
                              <option value="Reels / Shorts / Tiktok">Reels / Shorts / Tiktok</option>
                              <option value="Video Youtube">Video Youtube</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                          <div className="col-span-1 md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tanggal & Waktu Upload Konten <span className="text-red-500">*</span></label>
                            <input
                              type="datetime-local"
                              required
                              value={publikasiTanggal}
                              onChange={(e) => setPublikasiTanggal(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                            />
                            
                            {/* SLA info block with strict logic */}
                            <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 mt-2 text-left">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-purple-500" />
                                <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tingkat Urgensi Pengajuan (Otomatis):</span>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${urgency === 'High' ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500 dark:text-rose-400 shadow-sm ring-1 ring-rose-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-400'}`}>
                                  <AlertOctagon className={`w-4 h-4 mb-1 ${urgency === 'High' ? 'text-rose-500' : 'text-slate-400'}`} />
                                  <span className="text-[10px] font-black uppercase tracking-wide">Mendesak</span>
                                  <span className="text-[9px] font-bold mt-0.5">Maks H-1</span>
                                </div>
                                <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${urgency === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-400 shadow-sm ring-1 ring-amber-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-400'}`}>
                                  <AlertTriangle className={`w-4 h-4 mb-1 ${urgency === 'Medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                                  <span className="text-[10px] font-black uppercase tracking-wide">Menengah</span>
                                  <span className="text-[9px] font-bold mt-0.5">Maks H-3</span>
                                </div>
                                <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${urgency === 'Low' ? 'bg-purple-50 border-purple-500 text-purple-700 dark:bg-purple-900/20 dark:border-purple-500 dark:text-purple-400 shadow-sm ring-1 ring-purple-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-400'}`}>
                                  <Info className={`w-4 h-4 mb-1 ${urgency === 'Low' ? 'text-purple-500' : 'text-slate-400'}`} />
                                  <span className="text-[10px] font-black uppercase tracking-wide">Standar</span>
                                  <span className="text-[9px] font-bold mt-0.5">Maks H-6</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Detail Pengisian Konten Sesuai Jenis */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">📋</span>
                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                              Detail Pengajuan: {publikasiJenis}
                            </span>
                          </div>
                        </div>

                        {/* Common Field: Link Google Drive */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Link Google Drive Bahan / File Publikasi <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Berisi foto/video HD)</span>
                          </label>
                          <input
                            type="url"
                            placeholder="e.g. https://drive.google.com/drive/folders/..."
                            value={pubLinkDrive}
                            onChange={(e) => setPubLinkDrive(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-mono text-slate-800 dark:text-slate-200"
                          />
                        </div>

                        {/* FEEDS INSTAGRAM & REELS STRUCTURED CAPTION */}
                        {(publikasiJenis === 'Feeds Instagram' || publikasiJenis === 'Reels / Shorts / Tiktok') && (
                          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                              <span className="text-sm">📝</span>
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detail Caption Publikasi</span>
                            </div>
                            
                            {/* Judul Proker / Header */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Proker / Header <span className="text-purple-600 font-extrabold">*</span></label>
                              <RichTextArea
                                rows={2}
                                required
                                placeholder="e.g. ⚙️[KERNEL SESSION MEI 2026]⚙️"
                                value={pubCapHeader}
                                onChange={(e) => setPubCapHeader(e.target.value)}
                                className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                              />
                            </div>

                            {/* Salam Pembuka & Kalimat Penarik (Hook) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Salam Pembuka <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. Halo Informatikans! @all"
                                  value={pubCapSalam}
                                  onChange={(e) => setPubCapSalam(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kalimat Penarik (Hook) <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. KERNEL SESSION IS BACK!!"
                                  value={pubCapHook}
                                  onChange={(e) => setPubCapHook(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                />
                              </div>
                            </div>

                            {/* Topik / Deskripsi Kegiatan */}
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Topik / Deskripsi Kegiatan <span className="text-purple-600 font-extrabold">*</span></label>
                              <RichTextArea
                                rows={4}
                                required
                                placeholder="Jelaskan mengenai isi agenda kegiatan, detail, dan apa saja yang didapatkan oleh peserta di sini..."
                                value={pubCapTopik}
                                onChange={(e) => setPubCapTopik(e.target.value)}
                                className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-sans resize-none text-slate-800 dark:text-slate-200 shadow-3xs font-semibold"
                              />
                            </div>

                            {/* Detail Pelaksanaan Acara */}
                            <div className="pt-2">
                              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-4">
                                <span className="text-base">📅</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detail Pelaksanaan Acara (Opsional)</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tanggal Acara</label>
                                  <input
                                    type="date"
                                    value={pubCapTanggal}
                                    onChange={(e) => setPubCapTanggal(e.target.value)}
                                    className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Waktu Acara</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 19.00 WIB - selesai"
                                    value={pubCapWaktu}
                                    onChange={(e) => setPubCapWaktu(e.target.value)}
                                    className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tempat / Platform</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Zoom Meeting"
                                    value={pubCapTempat}
                                    onChange={(e) => setPubCapTempat(e.target.value)}
                                    className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Narahubung / Contact Person (CP) Caption */}
                            <div className="pt-2">
                              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-4">
                                <span className="text-base">📞</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Narahubung Acara</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama CP 1 <span className="text-red-500">*</span></label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Shera"
                                    value={pubCapCpNama}
                                    onChange={(e) => setPubCapCpNama(e.target.value)}
                                    className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kontak CP 1 <span className="text-red-500">*</span></label>
                                  <input
                                    type="text"
                                    placeholder="e.g. 088223959773 (WhatsApp)"
                                    value={pubCapCpKontak}
                                    onChange={(e) => setPubCapCpKontak(e.target.value)}
                                    className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800/60 pt-3 mt-3">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Nama CP 2</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Farhan"
                                    value={pubCapCpNama2}
                                    onChange={(e) => setPubCapCpNama2(e.target.value)}
                                    className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Kontak CP 2</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. farhan_123 (Line)"
                                    value={pubCapCpKontak2}
                                    onChange={(e) => setPubCapCpKontak2(e.target.value)}
                                    className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Hashtag Umum (Tampil untuk semua kecuali Story Instagram) */}
                        {publikasiJenis !== 'Story Instagram' && (
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hashtag <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Bebas diisi, opsional)</span></label>
                            <input
                              type="text"
                              placeholder="e.g. #HMIF2026 #CittaPrakarsa #InformatikaJaya"
                              value={pubHashtag}
                              onChange={(e) => setPubHashtag(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                            />
                          </div>
                        )}

                                                {/* Musik Tersemat (Tampil untuk semua kecuali Video Youtube) */}
                        {publikasiJenis !== 'Video Youtube' && (
                          <div className="pt-2">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pemilihan Lagu / Musik Tersemat <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                            <input
                              type="text"
                              placeholder="e.g. Overcrest - LANY / link audio"
                              value={pubMusik}
                              onChange={(e) => setPubMusik(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                            />
                          </div>
                        )}

                        {publikasiJenis === 'Feeds Instagram' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Akun Tersemat / Tag <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. @hmifupnvj @upnveteranjakarta"
                                  value={pubAkun}
                                  onChange={(e) => setPubAkun(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* STORY INSTAGRAM FIELDS */}
                        {publikasiJenis === 'Story Instagram' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Teks / Copy dalam Story <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                              <RichTextArea
                                placeholder="Tuliskan draf teks yang akan ditampilkan di dalam Story..."
                                value={pubTeksStory}
                                onChange={(e) => setPubTeksStory(e.target.value)}
                                rows={2}
                                className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Link Tersemat / Link Sticker <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                                <input
                                  type="url"
                                  placeholder="e.g. https://linktr.ee/hmifupnvj"
                                  value={pubLinkStory}
                                  onChange={(e) => setPubLinkStory(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-mono text-slate-700 dark:text-slate-300"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Stickers / Fitur IG <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. Add Yours, Poll (Yes/No), Question Box"
                                  value={pubStickers}
                                  onChange={(e) => setPubStickers(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Akun Tersemat / Tag <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. @hmifupnvj"
                                  value={pubAkun}
                                  onChange={(e) => setPubAkun(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* REELS / SHORTS / TIKTOK FIELDS */}
                        {publikasiJenis === 'Reels / Shorts / Tiktok' && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Deskripsi Thumbnail / Cover Video <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                              <input
                                type="text"
                                placeholder="e.g. Teks di cover: 'Cara Cepat Belajar Coding' / link gambar cover"
                                value={pubThumbnail}
                                onChange={(e) => setPubThumbnail(e.target.value)}
                                className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Akun Tersemat / Tag <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. @hmifupnvj"
                                  value={pubAkun}
                                  onChange={(e) => setPubAkun(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VIDEO YOUTUBE FIELDS */}
                        {publikasiJenis === 'Video Youtube' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Video YouTube</label>
                                <input
                                  type="text"
                                  placeholder="e.g. COMPANY PROFILE {appSettings?.portalName || 'HMIF UPNVJ 2026'}"
                                  value={pubJudulYoutube}
                                  onChange={(e) => setPubJudulYoutube(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Thumbnail Video <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                                <input
                                  type="text"
                                  placeholder="e.g. Link Google Drive file gambar thumbnail"
                                  value={pubThumbnail}
                                  onChange={(e) => setPubThumbnail(e.target.value)}
                                  className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Caption / Deskripsi Video YouTube</label>
                              <RichTextArea
                                placeholder="Tuliskan deskripsi video di sini..."
                                value={pubCaption}
                                onChange={(e) => setPubCaption(e.target.value)}
                                rows={4}
                                className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Daftar Pustaka <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Wajib untuk konten edukasi)</span></label>
                              <RichTextArea
                                placeholder="Tuliskan daftar pustaka atau referensi link terkait informasi yang didapatkan..."
                                value={pubDaftarPustaka}
                                onChange={(e) => setPubDaftarPustaka(e.target.value)}
                                rows={2}
                                className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-700 dark:text-slate-300"
                              />
                            </div>
                          </div>
                        )}

                        {/* Common Field: Detail Lainnya */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Detail Tambahan Lainnya <span className="text-slate-600 dark:text-slate-400 font-normal text-[9px]">(Opsional)</span></label>
                          <RichTextArea
                            placeholder="Masukkan detail tambahan yang kamu inginkan..."
                            value={pubDetailLain}
                            onChange={(e) => setPubDetailLain(e.target.value)}
                            rows={1}
                            className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium text-slate-800 dark:text-slate-200"
                          />
                        </div>
                      </div>

                      {/* Section 3: Kontak Penanggung Jawab */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">👤</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kontak Penanggung Jawab (CP)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Nama Lengkap (Contact Person) <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Naqila Syaniwa"
                              value={pubCpNama}
                              onChange={(e) => setPubCpNama(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kontak WA / ID Line <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 08xx-xxxx-xxxx / id_line"
                              value={pubCpKontak}
                              onChange={(e) => setPubCpKontak(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-purple-400 focus:bg-white dark:focus:bg-slate-900 transition-all font-semibold text-slate-800 dark:text-slate-200"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                            Asal Departemen <span className="text-red-500">*</span> <span className="text-[9px] text-pink-600 font-extrabold">(Pilih 1)</span>
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[180px] overflow-y-auto pr-1">
                            {[
                              'Departemen Eselon',
                              'Departemen Kesejahteraan Mahasiswa',
                              'Departemen Pengembangan Mahasiswa',
                              'Departemen Pengembangan Sumber Daya Manusia',
                              'Departemen Ekonomi Kreatif',
                              'Departemen Media Komunikasi dan Informasi'
                            ].map((dept) => {
                              const checked = pubCpDepartemen === dept;
                              return (
                                <button
                                  type="button"
                                  key={dept}
                                  onClick={() => {
                                    setPubCpDepartemen(dept);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-left text-xs font-semibold transition-all select-none cursor-pointer ${
                                    checked
                                      ? 'bg-pink-50 border-pink-400 text-pink-700 shadow-xs'
                                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/30'
                                  }`}
                                >
                                  <span className="truncate pr-2">{dept}</span>
                                  <div className={`w-4 h-4 rounded-full border-[4px] flex-shrink-0 ${checked ? 'border-pink-500 bg-white dark:bg-slate-900' : 'border-slate-800 bg-slate-950'}`} />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>



                    </div>

                  </div>
                </motion.div>
              )}

              {jenisPengajuan === 'Publikasi Broadcast' && (
                <motion.div
                  key="publikasi_broadcast"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Column: Form Input Pengajuan */}
                    <div className="lg:col-span-7 space-y-4 p-5 bg-amber-50/20 border border-amber-200 rounded-3xl">
                      <div className="border-b border-amber-100/60 pb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-amber-100 text-amber-700 rounded-xl text-xs font-bold">💬</span>
                          <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider">Form Kebutuhan Broadcast Medkominfo</h4>
                        </div>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-extrabold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span> Live Preview
                        </span>
                      </div>

                      {/* Section 1: Saluran & Pengirim */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">📢</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Saluran & Pengirim</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                              Media Penyebaran <span className="text-amber-600 font-extrabold">*</span>
                            </label>
                            <div className="space-y-1.5">
                              {['Line (Kema IF)', 'Whatsapp (Kema IF)', 'Whatsapp (HIMA IF)', 'Line (Kema FIK)'].map((opt) => {
                                const checked = selectedMedia.includes(opt);
                                return (
                                  <button
                                    type="button"
                                    key={opt}
                                    onClick={() => {
                                      if (checked) {
                                        if (selectedMedia.length > 1) {
                                          setSelectedMedia(selectedMedia.filter((m) => m !== opt));
                                        } else {
                                          onTriggerNotification("Harap pilih minimal satu Media Penyebaran.");
                                        }
                                      } else {
                                        setSelectedMedia([...selectedMedia, opt]);
                                      }
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 border rounded-xl text-left text-xs font-semibold transition-all select-none cursor-pointer ${
                                      checked
                                        ? 'border-amber-500 bg-amber-50/40 text-amber-800 shadow-3xs font-bold'
                                        : 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950'
                                    }`}
                                  >
                                    <span>{opt}</span>
                                    {checked ? (
                                      <span className="text-[10px] bg-amber-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-black">✓</span>
                                    ) : (
                                      <span className="border border-slate-200 dark:border-slate-800 rounded-full w-4 h-4"></span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <div className="bg-slate-50 dark:bg-slate-950/50 p-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                              Asal Departemen <span className="text-amber-600 font-extrabold">*</span> <span className="text-[9px] text-amber-600 font-extrabold">(Pilih 1)</span>
                            </label>
                            <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                              {[
                                'Departemen Eselon',
                                'Departemen Kesejahteraan Mahasiswa',
                                'Departemen Pengembangan Mahasiswa',
                                'Departemen Pengembangan Sumber Daya Manusia',
                                'Departemen Ekonomi Kreatif',
                                'Departemen Media Komunikasi dan Informasi'
                              ].map((dept) => {
                                const checked = selectedDepartemen.includes(dept);
                                return (
                                  <button
                                    type="button"
                                    key={dept}
                                    onClick={() => {
                                      setSelectedDepartemen([dept]);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-1.5 border rounded-xl text-left text-xs font-semibold transition-all select-none cursor-pointer ${
                                      checked
                                        ? 'border-amber-500 bg-amber-50/40 text-amber-800 shadow-3xs font-bold'
                                        : 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950'
                                    }`}
                                  >
                                    <span className="truncate">{dept}</span>
                                    {checked ? (
                                      <span className="text-[10px] bg-amber-600 text-white rounded-full w-4 h-4 flex items-center justify-center font-black shrink-0">✓</span>
                                    ) : (
                                      <span className="border border-slate-200 dark:border-slate-800 rounded-full w-4 h-4 shrink-0"></span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Konten Utama Broadcast */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">📝</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Konten Utama Broadcast</span>
                        </div>

                        {/* Judul Proker / Header */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Judul Proker / Header <span className="text-amber-600 font-extrabold">*</span></label>
                          <RichTextArea
                            rows={2}
                            required
                            placeholder="e.g. ⚙️[KERNEL SESSION MEI 2026]⚙️"
                            value={bcHeader}
                            onChange={(e) => setBcHeader(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                          />
                        </div>

                        {/* Salam Pembuka & Kalimat Penarik (Hook) */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Salam Pembuka <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span></label>
                            <RichTextArea
                              rows={2}
                              placeholder="e.g. Halo Informatikans! @all"
                              value={bcSalam}
                              onChange={(e) => setBcSalam(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Kalimat Penarik (Hook) <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span></label>
                            <RichTextArea
                              rows={2}
                              placeholder="e.g. KERNEL SESSION IS BACK!!"
                              value={bcHook}
                              onChange={(e) => setBcHook(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                            />
                          </div>
                        </div>

                        {/* Topik / Deskripsi Kegiatan */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Topik / Deskripsi Kegiatan <span className="text-amber-600 font-extrabold">*</span></label>
                          <RichTextArea
                            rows={4}
                            required
                            placeholder="Jelaskan mengenai isi agenda kegiatan, detail, dan apa saja yang didapatkan oleh peserta di sini..."
                            value={bcTopik}
                            onChange={(e) => setBcTopik(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-sans resize-none text-slate-800 dark:text-slate-200 shadow-3xs font-semibold"
                          />
                        </div>
                      </div>

                      {/* Section 3: Detail Pelaksanaan Acara */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">📅</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Detail Pelaksanaan Acara (Opsional)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tanggal Acara</label>
                            <input
                              type="date"
                              value={bcTanggalAcara}
                              onChange={(e) => setBcTanggalAcara(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Waktu Acara</label>
                            <RichTextArea
                              rows={2}
                              placeholder="e.g. 19.00 WIB - selesai"
                              value={bcWaktuAcara}
                              onChange={(e) => setBcWaktuAcara(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Dresscode <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span></label>
                            <RichTextArea
                              rows={2}
                              placeholder="e.g. PDH + Lanyard & Bawahan Bebas Sopan"
                              value={bcDresscode}
                              onChange={(e) => setBcDresscode(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Virtual Background <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span></label>
                            <RichTextArea
                              rows={2}
                              placeholder="e.g. bit.ly/VBG-KERNEL"
                              value={bcVirtualBackground}
                              onChange={(e) => setBcVirtualBackground(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tempat / Platform</label>
                            <RichTextArea
                              rows={2}
                              placeholder="e.g. Zoom Meeting"
                              value={bcTempat}
                              onChange={(e) => setBcTempat(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section Tambahan: Kalimat Penutup */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">📝</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Kalimat Penutup / Info Tambahan</span>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Teks Penutup <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span></label>
                          <RichTextArea
                            rows={3}
                            placeholder="e.g. Jangan lupa untuk selalu pantau grup angkatan untuk informasi terbaru ya!"
                            value={bcPenutup}
                            onChange={(e) => setBcPenutup(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs resize-none font-sans"
                          />
                        </div>
                      </div>

                      {/* Section 4: Narahubung / Contact Person (CP) */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">📞</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Narahubung / Contact Person (CP)</span>
                        </div>
                        
                        {/* CP 1 (Wajib) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Nama CP 1 <span className="text-amber-600 font-extrabold">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Shera"
                              value={bcCpNama}
                              onChange={(e) => setBcCpNama(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Kontak CP 1 <span className="text-amber-600 font-extrabold">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 088223959773 (WhatsApp)"
                              value={bcCpKontak}
                              onChange={(e) => setBcCpKontak(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                            />
                          </div>
                        </div>

                        {/* CP 2 (Opsional) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800/60 pt-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                              Nama CP 2 <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Sean"
                              value={bcCpNama2}
                              onChange={(e) => setBcCpNama2(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                              Kontak CP 2 <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">(Opsional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 0877-7509-6134 (WhatsApp)"
                              value={bcCpKontak2}
                              onChange={(e) => setBcCpKontak2(e.target.value)}
                              className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 5: Jadwal & Lampiran */}
                      <div className="bg-white dark:bg-slate-900 p-5 border border-slate-200 dark:border-slate-800/60 rounded-2xl shadow-xs space-y-4 text-left">
                        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                          <span className="text-base">📅</span>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">Jadwal Kirim & Lampiran Dokumen</span>
                        </div>

                        {/* Jadwal Penyebaran Broadcast */}
                        <div className="col-span-1 md:col-span-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Jadwal Kirim <span className="text-amber-600 font-extrabold">*</span></label>
                          <input
                            type="datetime-local"
                            required
                            value={bcJadwalKirim}
                            onChange={(e) => setBcJadwalKirim(e.target.value)}
                            className="w-full mt-1.5 px-3 py-2.5 bg-slate-50 dark:bg-slate-950/30 hover:bg-slate-50 dark:hover:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-400 transition-all font-semibold text-slate-800 dark:text-slate-200 shadow-3xs"
                          />
                          
                          {/* SLA info block with strict logic */}
                          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 mt-2 text-left">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-amber-500" />
                              <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tingkat Urgensi Pengajuan (Otomatis):</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${urgency === 'High' ? 'bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-900/20 dark:border-rose-500 dark:text-rose-400 shadow-sm ring-1 ring-rose-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-400'}`}>
                                <AlertOctagon className={`w-4 h-4 mb-1 ${urgency === 'High' ? 'text-rose-500' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-black uppercase tracking-wide">Mendesak</span>
                                <span className="text-[9px] font-bold mt-0.5">Maks H-3 Jam</span>
                              </div>
                              <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${urgency === 'Medium' ? 'bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-500 dark:text-amber-400 shadow-sm ring-1 ring-amber-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-400'}`}>
                                <AlertTriangle className={`w-4 h-4 mb-1 ${urgency === 'Medium' ? 'text-amber-500' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-black uppercase tracking-wide">Menengah</span>
                                <span className="text-[9px] font-bold mt-0.5">Maks H-6 Jam</span>
                              </div>
                              <div className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 ${urgency === 'Low' ? 'bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-400 shadow-sm ring-1 ring-blue-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-50 text-slate-500 dark:text-slate-400'}`}>
                                <Info className={`w-4 h-4 mb-1 ${urgency === 'Low' ? 'text-blue-500' : 'text-slate-400'}`} />
                                <span className="text-[10px] font-black uppercase tracking-wide">Standar</span>
                                <span className="text-[9px] font-bold mt-0.5">Maks H-12 Jam</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lampiran Dokumen */}
                        <div className="bg-slate-50 dark:bg-slate-950/30 p-4 border border-slate-200 dark:border-slate-800/60 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                              📂 Lampiran Dokumen (Foto / PDF)
                            </label>
                            <span className="text-[9px] text-slate-600 dark:text-slate-400 font-medium">Opsional</span>
                          </div>
                          
                          <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                handleFileSelection(Array.from(e.dataTransfer.files));
                              }
                            }}
                            className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-slate-900/80 hover:bg-amber-50/10 rounded-2xl p-4 transition-all text-center cursor-pointer relative group"
                          >
                            <input 
                              type="file" 
                              multiple 
                              accept="image/*,application/pdf"
                              onChange={(e) => {
                                if (e.target.files) {
                                  handleFileSelection(Array.from(e.target.files));
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center space-y-1">
                              <Upload className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-amber-500 transition-colors" />
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Tarik berkas foto/PDF ke sini atau <span className="text-amber-600">pilih dari folder</span></p>
                              <p className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold">Mendukung format Foto (PNG, JPG, WEBP) atau Dokumen PDF</p>
                            </div>
                          </div>

                          {bcFiles.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {bcFiles.map((file) => (
                                <div key={file.id} className="flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold shadow-3xs">
                                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate max-w-[80%]">
                                    {file.type.startsWith('image/') ? (
                                      <Image className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : (
                                      <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                                    )}
                                    <span className="truncate">{file.name}</span>
                                    <span className="text-[9px] text-slate-600 dark:text-slate-400 font-bold">({file.size})</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setBcFiles(bcFiles.filter(f => f.id !== file.id))}
                                    className="text-slate-600 dark:text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>


                    </div>

                    {/* Right Column: Live Chat Bubble Preview */}
                    <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-6">
                      <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">Visual Live Chat Preview</label>
                        <div className="flex items-center gap-1.5">

                          <span className="text-[9px] text-indigo-400 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg font-bold">
                            {broadcastMedia.toLowerCase().includes('line') ? 'LINE Theme' : 'WhatsApp Theme'}
                          </span>
                        </div>
                      </div>

                      {broadcastMedia.toLowerCase().includes('line') ? (
                        /* LINE THEME LIVE PREVIEW */
                        <div className="rounded-3xl shadow-md border border-slate-300 overflow-hidden bg-[#758fa6] aspect-[4/5] flex flex-col font-sans relative">
                          {/* Line Top Bar */}
                          <div className="bg-[#2d3a4b] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700/30">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#00b900] text-white font-extrabold text-[10px] flex items-center justify-center shadow-xs">
                                LINE
                              </div>
                              <div>
                                <span className="font-extrabold text-xs block truncate max-w-[150px]">{broadcastMedia}</span>
                                <span className="text-[8px] text-slate-700 dark:text-slate-300 font-semibold block mt-0.5">Antrean Broadcast Resmi HMIF</span>
                              </div>
                            </div>
                            <div className="flex gap-3 text-slate-700 dark:text-slate-300 text-xs">
                              <span>🔍</span>
                              <span>☰</span>
                            </div>
                          </div>

                          {/* Line Chat Area */}
                          <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            <div className="text-center">
                              <span className="bg-[#5c7285] text-white text-[8px] px-2.5 py-0.5 rounded-full font-bold">
                                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                              </span>
                            </div>

                            <div className="flex items-start gap-2">
                              <div className="w-7 h-7 rounded-full bg-slate-300 flex items-center justify-center font-black text-[9px] text-slate-700 dark:text-slate-300">
                                HM
                              </div>
                              <div className="flex-1 max-w-[85%]">
                                <span className="text-[9px] font-bold text-slate-900 dark:text-white block mb-0.5">{broadcastMedia}</span>
                                <div className="flex items-end gap-1.5">
                                  {/* Message Bubble */}
                                  <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3.5 rounded-2xl rounded-tl-none shadow-xs text-xs space-y-1">
                                    {renderFormattedBroadcast(bcHeader, bcSalam, bcHook, bcTopik, bcTanggalAcara, bcWaktuAcara, bcTempat, bcDepartemen, bcCpNama, bcCpKontak, bcCpNama2, bcCpKontak2, bcDresscode, bcVirtualBackground, bcPenutup)}
                                    {renderChatAttachments()}
                                  </div>
                                  <span className="text-[8px] text-slate-800 dark:text-slate-200 shrink-0 mb-1 font-bold">
                                    Read
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* WHATSAPP THEME LIVE PREVIEW */
                        <div className="rounded-3xl shadow-md border border-slate-300 dark:border-slate-800 overflow-hidden bg-[#efeae2] dark:bg-[#0b141a] aspect-[4/5] flex flex-col font-sans relative">
                          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#128c7e_1px,transparent_1px)] [background-size:16px_16px]"></div>

                          {/* WhatsApp Top Bar */}
                          <div className="bg-[#075e54] dark:bg-[#202c33] text-white px-4 py-3 flex items-center justify-between z-10 border-b border-black/10">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#128c7e] text-white font-black text-xs flex items-center justify-center">
                                WA
                              </div>
                              <div>
                                <span className="font-extrabold text-xs block truncate max-w-[150px]">{broadcastMedia}</span>
                                <span className="text-[8px] text-emerald-100 dark:text-slate-300 font-semibold block mt-0.5">Online • Ketuk untuk info grup</span>
                              </div>
                            </div>
                            <div className="flex gap-3 text-slate-100 text-xs font-bold">
                              <span>🎥</span>
                              <span>📞</span>
                              <span>⋮</span>
                            </div>
                          </div>

                          {/* WhatsApp Chat Area */}
                          <div className="flex-1 p-4 overflow-y-auto space-y-3 z-10">
                            <div className="text-center">
                              <span className="bg-[#e1f3fc] dark:bg-[#182229] text-slate-600 dark:text-slate-400 text-[8px] px-3 py-1 rounded-lg font-extrabold uppercase shadow-xs">
                                HARI INI
                              </span>
                            </div>

                            <div className="flex justify-end">
                              <div className="bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-800 dark:text-slate-100 p-3.5 rounded-2xl rounded-tr-xs shadow-xs text-xs relative max-w-[90%]">
                                {renderFormattedBroadcast(bcHeader, bcSalam, bcHook, bcTopik, bcTanggalAcara, bcWaktuAcara, bcTempat, bcDepartemen, bcCpNama, bcCpKontak, bcCpNama2, bcCpKontak2, bcDresscode, bcVirtualBackground, bcPenutup)}
                                {renderChatAttachments()}
                                
                                <div className="flex items-center justify-end gap-1 text-[8px] text-slate-600 dark:text-slate-300 font-bold mt-2 float-right">
                                  <span>{new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                  <span className="text-blue-500 font-extrabold">✓✓</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10 mt-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Kirim Berkas Pengajuan ke Medkominfo
            </button>
          </form>
        </div>
      )}

      {/* 3. CALENDAR SECTION */}
      {activePortalSection === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-4 md:p-6 max-w-6xl mx-auto overflow-x-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 tracking-tight">Kalender Aktivitas Medkominfo</h2>
              <p className="text-sm text-slate-500 mt-1">Jadwal kegiatan, publikasi, dan deadline Medkominfo.</p>
            </div>
    
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{MONTH_NAMES[currentMonth]} {currentYear}</span>
              <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-w-[700px]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-2.5 text-center text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-r border-slate-200 dark:border-slate-800 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 grid-rows-5 bg-slate-200 dark:bg-slate-800 gap-px min-w-[700px]">
              {gridCells.map((day, idx) => {
                const isToday = day === new Date().getDate() && 
                                currentMonth === new Date().getMonth() && 
                                currentYear === new Date().getFullYear();
                
                const isSelected = day === selectedDay;
                
                const dayEvents = day ? events.filter(e => e.year === currentYear && e.month === currentMonth && e.day === day) : [];

                return (
                  <div 
                    key={idx}
                    onClick={() => day && setSelectedDay(day)}
                    className={`min-h-[100px] p-2 flex flex-col transition-all cursor-pointer ${
                      isSelected ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-500 z-10 relative shadow-sm' : 
                      isToday ? 'bg-purple-50 dark:bg-slate-900 ring-1 ring-inset ring-purple-300' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950'
                    }`}
                  >
                    {day && (
                      <>
                        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                          isToday ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400'
                        }`}>
                          {day}
                        </span>
                        
                        <div className="flex-1 space-y-1 overflow-y-auto max-h-[120px] pr-1">
                          {dayEvents.map(evt => (
                            <div 
                              key={evt.id} 
                              className={`text-[9px] font-bold px-1.5 py-1 rounded border shadow-sm truncate ${evt.color}`}
                            >
                              {evt.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedDay && (
            <div className="mt-6 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mb-4 uppercase tracking-wider">
                {selectedDay} {MONTH_NAMES[currentMonth].toUpperCase()}
              </h3>
              
              {(() => {
                const selectedEvents = events.filter(e => e.year === currentYear && e.month === currentMonth && e.day === selectedDay);
                
                if (selectedEvents.length === 0) {
                  return <p className="text-sm text-slate-500 italic">Tidak ada aktivitas pada tanggal ini.</p>;
                }
                
                return (
                  <div className="space-y-4">
                    {selectedEvents.map(evt => (
                      <div key={evt.id} className="flex items-start gap-3">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                          evt.type === 'broadcast' ? 'bg-amber-500' : 
                          evt.type === 'design' ? 'bg-blue-500' : 
                          evt.type === 'video' ? 'bg-emerald-500' : 
                          evt.type === 'publication' ? 'bg-purple-500' : 'bg-slate-9500'
                        }`} />
                        <div>
                          <p className={`font-bold text-sm ${
                            evt.type === 'broadcast' ? 'text-amber-700' : 
                            evt.type === 'design' ? 'text-blue-700' : 
                            evt.type === 'video' ? 'text-emerald-700' : 
                            evt.type === 'publication' ? 'text-purple-700' : 'text-slate-300'
                          }`}>
                            {evt.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                            {evt.time && <span>{evt.time}</span>}
                            {evt.time && evt.pic && <span>•</span>}
                            {evt.pic && <span>PIC: {evt.pic}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      )}

      {/* 4. MEDKOM STAFF ROSTER */}
      {activePortalSection === 'roster' && (
        <PublicRosterSection residents={residents} onSelectResidentForProfile={onSelectResidentForProfile} />
      )}

    </div>
  );
}
