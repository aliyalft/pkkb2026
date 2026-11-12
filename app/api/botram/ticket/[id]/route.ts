
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    // Validasi UUID registrasi
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { success: false, message: "ID tiket tidak valid." },
        { status: 400 }
      );
    }

    // Ambil data tiket melalui RPC
    const { data, error } = await supabase.rpc(
      "get_botram_ticket",
      {
        p_registration_id: id,
      }
    );

    if (error) {
      console.error("BOTRAM TICKET RPC ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data tiket.",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Tiket tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        ticket: data,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("BOTRAM TICKET API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
