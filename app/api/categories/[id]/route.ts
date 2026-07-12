import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/mongodb";
import Category from "../../../../models/Category";

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
        message: "Category Name is required."
      }, { status: 400 });
    }
    if (!body.description || !body.description.trim()) {
      return NextResponse.json({
        success: false,
        message: "Description is required."
      }, { status: 400 });
    }
    if (body.warrantyPeriod === undefined || body.warrantyPeriod === null) {
      return NextResponse.json({
        success: false,
        message: "Warranty Period is required."
      }, { status: 400 });
    }
    const num = Number(body.warrantyPeriod);
    if (isNaN(num) || num <= 0 || !Number.isInteger(num)) {
      return NextResponse.json({
        success: false,
        message: "Warranty Period must be a positive integer."
      }, { status: 400 });
    }

    const updatedCat = await Category.findByIdAndUpdate(
      id,
      {
        name: body.name.trim(),
        description: body.description.trim(),
        warrantyPeriod: num,
        status: body.status || "Active"
      },
      { new: true, runValidators: true }
    );

    if (!updatedCat) {
      return NextResponse.json({
        success: false,
        message: "Category not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedCat
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { code?: number; name?: string; message?: string; errors?: Record<string, unknown> };
    if (err.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "Category Name already exists."
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
      message: err.message || "Failed to update category"
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
    const deletedCat = await Category.findByIdAndUpdate(
      id,
      { status: "Inactive" },
      { new: true }
    );

    if (!deletedCat) {
      return NextResponse.json({
        success: false,
        message: "Category not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: deletedCat
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to delete category"
    }, { status: 500 });
  }
}
