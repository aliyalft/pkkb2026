
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const method = body.method;
    const value = String(body.value || "").trim();

    if (!["email", "phone"].includes(method)) {
      return NextResponse.json(
        {
          success: false,
          message: "Metode pencarian tidak valid.",
        },
        { status: 400 }
      );
    }

    if (!value) {
      return NextResponse.json(
        {
          success: false,
          message: "Masukkan email atau nomor HP kamu.",
        },
        { status: 400 }
      );
    }

    if (method === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return NextResponse.json(
        {
          success: false,
          message: "Format email tidak valid.",
        },
        { status: 400 }
      );
    }

    if (method === "phone" && value.replace(/\D/g, "").length < 9) {
      return NextResponse.json(
        {
          success: false,
          message: "Nomor HP tidak valid.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "find_botram_ticket",
      {
        p_method: method,
        p_value: value,
      }
    );

    if (error) {
      console.error("FIND BOTRAM TICKET ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Terjadi kesalahan saat mencari tiket.",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tiket tidak ditemukan. Periksa kembali email atau nomor HP yang digunakan saat registrasi.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        ticketId: data,
        message: "Tiket berhasil ditemukan.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("FIND BOTRAM TICKET API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}
