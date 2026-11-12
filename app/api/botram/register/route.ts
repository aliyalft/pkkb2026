
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET_NAME = "botram-proofs";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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
  let uploadedPath = "";

  try {
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

    // Validasi data peserta
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

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // Validasi kode menu
    if (!menuCode) {
      return NextResponse.json(
        { message: "Silakan pilih menu makanan." },
        { status: 400 }
      );
    }

    // Ambil menu langsung dari database
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

    // Validasi bukti download
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

    // Upload bukti ke Supabase Storage
    const extension = EXTENSION_MAP[proof.type];
    const fileName = `${crypto.randomUUID()}.${extension}`;

    uploadedPath = `registrations/${fileName}`;

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

    // RPC mengklaim kuota dan menyimpan registrasi
    // dalam satu transaksi database.
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
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([uploadedPath]);

      uploadedPath = "";

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

    // Pastikan RPC mengembalikan identitas tiket
    if (
      !registration ||
      !registration.id ||
      !registration.ticketCode
    ) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([uploadedPath]);

      uploadedPath = "";

      console.error(
        "BOTRAM REGISTRATION RESPONSE INVALID:",
        registration
      );

      return NextResponse.json(
        {
          message:
            "Registrasi tersimpan tetapi data tiket tidak lengkap. Silakan hubungi panitia.",
        },
        { status: 500 }
      );
    }

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
    if (uploadedPath) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([uploadedPath]);
    }

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
