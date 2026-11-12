
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Pastikan pengguna sudah login.
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Silakan login terlebih dahulu.",
        },
        { status: 401 }
      );
    }

    // 2. Pastikan akun memiliki akses admin.
    const { data: admin, error: adminError } = await supabase
      .from("botram_admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (adminError || !admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Akses ditolak. Akun bukan admin.",
        },
        { status: 403 }
      );
    }

    // 3. Ambil kode tiket.
    const body = await request.json();
    const ticketCode =
      typeof body.ticketCode === "string"
        ? body.ticketCode.trim().toUpperCase()
        : "";

    if (!ticketCode || ticketCode.length > 100) {
      return NextResponse.json(
        {
          success: false,
          status: "INVALID_INPUT",
          message: "Kode tiket tidak valid.",
        },
        { status: 400 }
      );
    }

    // 4. Validasi sekaligus redeem dan check-in.
    const { data, error } = await supabase.rpc(
      "redeem_botram_ticket",
      {
        p_ticket_code: ticketCode,
      }
    );

    if (error) {
      console.error("REDEEM RPC ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal memproses tiket.",
        },
        { status: 500 }
      );
    }

    const statusCode =
      data.status === "REDEEMED"
        ? 200
        : data.status === "NOT_FOUND"
          ? 404
          : 409;

    return NextResponse.json(data, {
        status: statusCode,
    });
  } catch (error) {
    console.error("REDEEM API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
