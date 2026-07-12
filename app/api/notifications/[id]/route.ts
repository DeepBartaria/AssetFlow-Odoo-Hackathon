import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Notification from "../../../../models/Notification";

interface Params {
  id: string;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const updatedNotif = await Notification.findByIdAndUpdate(
      id,
      { read: body.read !== undefined ? body.read : true },
      { new: true }
    );

    if (!updatedNotif) {
      return NextResponse.json({
        success: false,
        message: "Notification not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedNotif
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to update notification"
    }, { status: 500 });
  }
}
