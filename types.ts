
export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: { [key: string]: string };
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: { [key: string]: string };
}

export interface SurahDetail extends Surah {
  ayat: Ayah[];
  suratSebelumnya: { nomor: number; namaLatin: string; } | false;
  suratSelanjutnya: { nomor: number; namaLatin: string; } | false;
}

export interface Kelas {
  id: string;
  nama_kelas: string;
  targetHafalan: {
    dariSurat: number;
    sampaiSurat: number;
  };
}

export interface Hafalan {
  surat: string;
  nilai: number;
  status_pengulangan: 'selesai' | 'perlu ulang';
  tanggal: string;
  catatan: string;
  detailNilai: {
      kelancaran: string;
      makhroj: string;
      tajwid: string;
      mad: string;
  };
}

export interface Santri {
  id: string;
  nama_santri: string;
  kelasId: string;
  hafalanData: Hafalan[];
}

export type Page = 'dashboard' | 'santri' | 'hafalan' | 'murottal' | 'progress' | 'tes' | 'pengaturan';

export interface ToastMessage {
  id: number;
  message: string;
  isError: boolean;
}

export interface ConfirmDialogInfo {
  title: string;
  body: string;
  onConfirm: () => void;
}
