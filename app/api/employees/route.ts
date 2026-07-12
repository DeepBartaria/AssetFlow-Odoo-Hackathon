import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Employee from "../../../models/Employee";
import Department from "../../../models/Department";

export async function GET() {
  try {
    await dbConnect();
    const employees = await Employee.find({}).populate("department");
    return NextResponse.json({
      success: true,
      data: employees
    }, { status: 200 });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json({
      success: false,
      message: err.message || "Failed to retrieve employees"
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
        message: "Employee Name is required."
      }, { status: 400 });
    }
    if (!body.email || !body.email.trim()) {
      return NextResponse.json({
        success: false,
        message: "Email is required."
      }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email.trim())) {
      return NextResponse.json({
        success: false,
        message: "Invalid email format."
      }, { status: 400 });
    }
    if (!body.department) {
      return NextResponse.json({
        success: false,
        message: "Department reference is required."
      }, { status: 400 });
    }
    if (!body.role) {
      return NextResponse.json({
        success: false,
        message: "Role is required."
      }, { status: 400 });
    }

    // Verify Department exists
    const deptExists = await Department.findById(body.department);
    if (!deptExists) {
      return NextResponse.json({
        success: false,
        message: "Department does not exist."
      }, { status: 400 });
    }

    const newEmp = new Employee({
      name: body.name.trim(),
      email: body.email.trim(),
      department: body.department,
      role: body.role,
      status: body.status || "Active"
    });

    await newEmp.save();
    return NextResponse.json({
      success: true,
      data: newEmp
    }, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: number; name?: string; message?: string; errors?: Record<string, unknown> };
    if (err.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "Email already exists in the employee directory."
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
      message: err.message || "Failed to create employee"
    }, { status: 500 });
  }
}
