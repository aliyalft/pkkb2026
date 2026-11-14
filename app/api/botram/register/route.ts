
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

    // ==========================================
    // 1. VALIDASI DATA PESERTA
    // ==========================================

    if (!name || !phone || !city || !cityId || !district) {
      return NextResponse.json(
        { success: false, message: "Data pendaftaran belum lengkap." },
        { status: 400 }
      );
    }

    if (!/^[0-9+\-\s()]{8,20}$/.test(phone)) {
      return NextResponse.json(
        { success: false, message: "Format nomor WhatsApp tidak valid." },
        { status: 400 }
      );
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { success: false, message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    if (!menuCode) {
      return NextResponse.json(
        { success: false, message: "Silakan pilih menu makanan." },
        { status: 400 }
      );
    }

    // ==========================================
    // 2. CEK KETERSEDIAAN MENU
    // ==========================================

    const { data: menu, error: menuError } = await supabase
      .from("botram_menu_stock")
      .select("menu_code, menu_name, quota, claimed_count, is_active")
      .eq("menu_code", menuCode)
      .maybeSingle();

    if (menuError) {
      console.error("BOTRAM MENU VALIDATION ERROR:", menuError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memeriksa ketersediaan menu.",
        },
        { status: 500 }
      );
    }

    if (!menu || !menu.is_active) {
      return NextResponse.json(
        {
          success: false,
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
          success: false,
          message:
            "Maaf, stok menu tersebut sudah habis. Silakan pilih menu lainnya.",
        },
        { status: 409 }
      );
    }

    // ==========================================
    // 3. SIMPAN REGISTRASI DAN KLAIM STOK
    // ==========================================

    const { data: registration, error: registrationError } =
      await supabase.rpc("register_botram_with_menu", {
        p_name: name,
        p_phone: phone,
        p_email: email || null,
        p_city: city,
        p_city_id: cityId,
        p_district: district,
        p_proof_path: null,
        p_menu_code: menuCode,
      });

    if (registrationError) {
      if (
        registrationError.message.includes(
          "MENU_STOCK_UNAVAILABLE"
        )
      ) {
        return NextResponse.json(
          {
            success: false,
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
          success: false,
          message:
            "Registrasi gagal disimpan. Silakan coba kembali.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // 4. VALIDASI HASIL REGISTRASI
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

      return NextResponse.json(
        {
          success: false,
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
