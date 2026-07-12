import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Category from "../../../models/Category";

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json({
      success: true,
      data: categories
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve categories"
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

    const newCat = new Category({
      name: body.name.trim(),
      description: body.description.trim(),
      warrantyPeriod: num,
      status: body.status || "Active"
    });

    await newCat.save();
    return NextResponse.json({
      success: true,
      data: newCat
    }, { status: 201 });
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
      message: err.message || "Failed to create category"
    }, { status: 500 });
  }
}
