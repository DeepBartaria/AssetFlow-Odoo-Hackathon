import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Department from "../../../../models/Department";

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

    const updatedDept = await Department.findByIdAndUpdate(
      id,
      {
        name: body.name.trim(),
        head: body.head.trim(),
        parentDepartment: body.parentDepartment ? body.parentDepartment.trim() : "—",
        status: body.status || "Active"
      },
      { new: true, runValidators: true }
    );

    if (!updatedDept) {
      return NextResponse.json({
        success: false,
        message: "Department not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedDept
    }, { status: 200 });
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
      message: err.message || "Failed to update department"
    }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    // Soft delete: update status to Inactive
    const deletedDept = await Department.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!deletedDept) {
      return NextResponse.json({
        success: false,
        message: "Department not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: deletedDept
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to delete department"
    }, { status: 500 });
  }
}
