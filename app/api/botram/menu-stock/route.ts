
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("botram_menu_stock")
      .select(`
        menu_code,
        menu_name,
        store_name,
        quota,
        claimed_count,
        is_active,
        sort_order,
        description
      `)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("menu_name", { ascending: true });

    if (error) {
      console.error("BOTRAM MENU STOCK ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data menu.",
          menus: [],
        },
        { status: 500 }
      );
    }

    const menus = (data ?? []).map((menu) => ({
      code: menu.menu_code,
      name: menu.menu_name,
      store: menu.store_name,
      quota: Number(menu.quota),
      claimed: Number(menu.claimed_count),
      available: Math.max(
        0,
        Number(menu.quota) - Number(menu.claimed_count)
      ),
      description: menu.description ?? "",
      sortOrder: Number(menu.sort_order),
    }));

    return NextResponse.json(
      {
        success: true,
        count: menus.length,
        menus,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("BOTRAM MENU STOCK SERVER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
        menus: [],
      },
      { status: 500 }
    );
  }
}
