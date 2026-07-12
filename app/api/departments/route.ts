import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Department from "../../../models/Department";

export async function GET() {
  try {
    await dbConnect();
    const departments = await Department.find({});
    return NextResponse.json({
      success: true,
      data: departments
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve departments"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({
        success: false,
        message: "Department Name is required."
      }, { status: 400 });
    }
    if (!body.head || !body.head.trim()) {
      return NextResponse.json({
        success: false,
        message: "Department Head is required."
      }, { status: 400 });
    }

    const newDept = new Department({
      name: body.name.trim(),
      head: body.head.trim(),
      parentDepartment: body.parentDepartment ? body.parentDepartment.trim() : "—",
      status: body.status || "Active"
    });

    await newDept.save();
    return NextResponse.json({
      success: true,
      data: newDept
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: number; name?: string; message?: string; errors?: Record<string, unknown> };
    if (err.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "Department Name already exists."
      }, { status: 409 });
    }
    if (err.name === "ValidationError") {
      return NextResponse.json({
        success: false,
        message: "Validation Error",
        errors: err.errors
      }, { status: 400 });
    }
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to create department"
    }, { status: 500 });
  }
}
