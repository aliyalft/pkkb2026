
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET_NAME = "botram-proofs";

// Maksimal 3 MB agar total request lebih aman untuk Vercel.
const MAX_FILE_SIZE = 3 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  let uploadedPath: string | null = null;

  // Menghapus file jika proses registrasi gagal.
  const cleanupUploadedFile = async () => {
    if (!uploadedPath) return;

    const pathToRemove = uploadedPath;
    uploadedPath = null;

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([pathToRemove]);

      if (error) {
        console.error("BOTRAM FILE CLEANUP ERROR:", error);
      }
    } catch (cleanupError) {
      console.error("BOTRAM FILE CLEANUP FAILED:", cleanupError);
    }
  };

  try {
    // Parse form data
    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const city = String(formData.get("city") || "").trim();
    const cityId = String(formData.get("cityId") || "").trim();
    const district = String(formData.get("district") || "").trim();

    const menuCode = String(formData.get("menuCode") || "")
      .trim()
      .toUpperCase();

    const proof = formData.get("proof");

    // ==========================================
    // 1. VALIDASI DATA PESERTA
    // ==========================================

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

    if (!menuCode) {
      return NextResponse.json(
        { message: "Silakan pilih menu makanan." },
        { status: 400 }
      );
    }

    // ==========================================
    // 2. VALIDASI BUKTI FOTO
    // ==========================================

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
        {
          message:
            "Ukuran bukti terlalu besar. Maksimal 3 MB. Silakan kompres foto terlebih dahulu.",
        },
        { status: 413 }
      );
    }

    // ==========================================
    // 3. CEK KETERSEDIAAN MENU
    // ==========================================

    const { data: menu, error: menuError } = await supabase
      .from("botram_menu_stock")
      .select("menu_code, menu_name, quota, claimed_count, is_active")
      .eq("menu_code", menuCode)
      .maybeSingle();

    if (menuError) {
      console.error("BOTRAM MENU VALIDATION ERROR:", menuError);

      return NextResponse.json(
        { message: "Gagal memeriksa ketersediaan menu." },
        { status: 500 }
      );
    }

    if (!menu || !menu.is_active) {
      return NextResponse.json(
        {
          message:
            "Menu tersebut sudah tidak tersedia. Silakan pilih menu lainnya.",
        },
        { status: 400 }
      );
    }

    const available =
      Number(menu.quota) - Number(menu.claimed_count);

    if (available <= 0) {
      return NextResponse.json(
        {
          message:
            "Maaf, stok menu tersebut sudah habis. Silakan pilih menu lainnya.",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // 4. UPLOAD BUKTI KE SUPABASE STORAGE
    // ==========================================

    const extension = EXTENSION_MAP[proof.type];
    const fileName = `${randomUUID()}.${extension}`;

    uploadedPath = `registrations/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uploadedPath, proof, {
        contentType: proof.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("BOTRAM UPLOAD ERROR:", uploadError);

      throw new Error(
        `Upload bukti gagal: ${uploadError.message}`
      );
    }

    // ==========================================
    // 5. SIMPAN REGISTRASI DAN KLAIM STOK
    // ==========================================

    const { data: registration, error: registrationError } =
      await supabase.rpc("register_botram_with_menu", {
        p_name: name,
        p_phone: phone,
        p_email: email || null,
        p_city: city,
        p_city_id: cityId,
        p_district: district,
        p_proof_path: uploadedPath,
        p_menu_code: menuCode,
      });

    if (registrationError) {
      await cleanupUploadedFile();

      if (
        registrationError.message.includes(
          "MENU_STOCK_UNAVAILABLE"
        )
      ) {
        return NextResponse.json(
          {
            message:
              "Menu sudah tidak tersedia atau stoknya baru saja habis. Silakan pilih menu lainnya.",
          },
          { status: 409 }
        );
      }

      console.error(
        "BOTRAM REGISTRATION RPC ERROR:",
        registrationError
      );

      return NextResponse.json(
        {
          message:
            "Registrasi gagal disimpan. Silakan coba kembali.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // 6. VALIDASI HASIL REGISTRASI
    // ==========================================

    if (
      !registration ||
      !registration.id ||
      !registration.ticketCode
    ) {
      console.error(
        "BOTRAM REGISTRATION RESPONSE INVALID:",
        registration
      );

      await cleanupUploadedFile();

      return NextResponse.json(
        {
          message:
            "Registrasi tersimpan tetapi data tiket tidak lengkap. Silakan hubungi panitia.",
        },
        { status: 500 }
      );
    }

    // Registrasi berhasil.
    // Jangan hapus foto yang sudah terhubung dengan database.
    uploadedPath = null;

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil disimpan.",
        id: registration.id,
        ticketCode: registration.ticketCode,
        menuCode: registration.menuCode,
        menuName: registration.menuName,
      },
      { status: 201 }
    );
  } catch (error) {
    await cleanupUploadedFile();

    console.error("BOTRAM REGISTRATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
