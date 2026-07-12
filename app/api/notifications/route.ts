import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Notification from "../../../models/Notification";

export async function GET() {
  try {
    await dbConnect();
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      data: notifications
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve notifications"
    }, { status: 500 });
  }
}

export async function PUT() {
  try {
    await dbConnect();
    await Notification.updateMany({ read: false }, { read: true });
    return NextResponse.json({
      success: true,
      message: "All notifications marked as read"
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to update notifications"
    }, { status: 500 });
  }
}
