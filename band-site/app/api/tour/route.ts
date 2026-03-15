import { NextResponse } from "next/server";
import { tourDates } from "@/data/site";

export async function GET() {
  return NextResponse.json(tourDates);
}
