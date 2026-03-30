import {
    IsNotEmpty,
    IsString,
    IsUUID,
    IsDateString,
    IsArray,
    IsOptional
} from 'class-validator';

export class CreateSuratDto {
    @IsUUID('4', { message: 'ID Siswa harus berupa UUID yang valid' })
    @IsNotEmpty({ message: 'ID Siswa tidak boleh kosong' })
    id_siswa: string;

    @IsString()
    @IsNotEmpty({ message: 'Nomor Surat tidak boleh kosong' })
    no_surat: string;

    @IsString()
    @IsNotEmpty({ message: 'Permasalahan tidak boleh kosong' })
    permasalahan: string;

    @IsDateString({}, { message: 'Tanggal Panggilan harus berformat YYYY-MM-DD' })
    @IsNotEmpty({ message: 'Tanggal Panggilan tidak boleh kosong' })
    tanggal_panggilan: string;

    @IsString()
    @IsOptional()
    waktu_panggilan?: string;

    @IsString()
    @IsOptional()
    tempat?: string;

    @IsArray({ message: 'ID Penandatangan harus berupa array' })
    @IsUUID('4', { each: true, message: 'Setiap ID Penandatangan harus berupa UUID' })
    @IsNotEmpty({ message: 'Data Penandatangan tidak boleh kosong' })
    id_penandatangan: string[];
}
