export const formatDateIndonesian = (tanggal: string): string => {
  if (!tanggal) return '';
  try {
    const dateObj = new Date(tanggal);
    if (!isNaN(dateObj.getTime())) {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      return `${days[dateObj.getDay()]}, ${dateObj.getDate()} ${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    }
  } catch (e) {
    // fallback
  }
  return tanggal;
};

export const checkPermission = (role: string | undefined, taskCategory: string): boolean => {
  if (!role) return false;
  if (role === 'Super Admin') return true;
  if (role === 'Admin Multimedia' && (taskCategory === 'Design' || taskCategory === 'Video')) return true;
  if (role === 'Admin Humas' && (taskCategory === 'Content Publication' || taskCategory === 'Broadcast' || taskCategory === 'MoU')) return true;
  return false;
};
