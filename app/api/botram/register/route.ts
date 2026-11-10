import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

const BUCKET_NAME = "botram-proofs";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  let uploadedPath = "";

  try {
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const cityId = String(formData.get("cityId") || "").trim();
    const district = String(formData.get("district") || "").trim();

    const proof = formData.get("proof");

    if (!name || !phone || !city || !cityId || !district) {
      return NextResponse.json(
        { message: "Data pendaftaran belum lengkap." },
        { status: 400 }
      );
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
      return NextResponse.json(
        { message: "Format nomor WhatsApp tidak valid." },
        { status: 400 }
      );
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (!(proof instanceof File) || proof.size === 0) {
      return NextResponse.json(
        { message: "Bukti download wajib diunggah." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(proof.type)) {
      return NextResponse.json(
        { message: "Format bukti harus JPG, PNG, atau WEBP." },
        { status: 400 }
      );
    }

    if (proof.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Ukuran bukti maksimal 5 MB." },
        { status: 400 }
      );
    }

    const extensionMap: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    const extension = extensionMap[proof.type];
    const fileName = `${crypto.randomUUID()}.${extension}`;

    uploadedPath = `registrations/${fileName}`;

    // Upload bukti ke Supabase Storage.
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uploadedPath, proof, {
        contentType: proof.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(
        `Upload bukti gagal: ${uploadError.message}`
      );
    }

    // Simpan data pendaftaran ke database.
    const { error: insertError } = await supabase
      .from("botram_registrations")
      .insert({
        name,
        phone,
        email: email || null,
        city,
        city_id: cityId,
        district,
        proof_path: uploadedPath,
      });

    if (insertError) {
      // Hapus file jika penyimpanan data gagal.
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([uploadedPath]);

      throw new Error(
        `Penyimpanan data gagal: ${insertError.message}`
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil disimpan.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("BOTRAM REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}