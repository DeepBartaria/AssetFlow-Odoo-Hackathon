import mongoose, { Schema, Document } from 'mongoose';

// ------------------------------
// Department
// ------------------------------
export interface IDepartment extends Document {
  name: string;
  head?: string;
  parentDepartment?: mongoose.Types.ObjectId;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true },
  head: { type: String },
  parentDepartment: { type: Schema.Types.ObjectId, ref: 'Department' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// ------------------------------
// Category
// ------------------------------
export interface ICategory extends Document {
  name: string;
  description?: string;
  warrantyPeriod?: number; // months
  status: 'Active' | 'Inactive';
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  warrantyPeriod: { type: Number },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// ------------------------------
// Employee
// ------------------------------
export interface IEmployee extends Document {
  name: string;
  email: string;
  department: mongoose.Types.ObjectId;
  role: 'Employee' | 'Department Head' | 'Asset Manager';
  status: 'Active' | 'Inactive';
}

const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  role: { type: String, enum: ['Employee', 'Department Head', 'Asset Manager'], default: 'Employee' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// ------------------------------
// Asset
// ------------------------------
export interface IAsset extends Document {
  assetTag: string;
  name: string;
  category: mongoose.Types.ObjectId;
  serialNumber: string;
  acquisitionDate: Date;
  acquisitionCost: number;
  condition: 'New' | 'Good' | 'Fair' | 'Poor';
  location: string;
  sharedBookable: boolean;
  status: 'Available' | 'Allocated' | 'Reserved' | 'Under Maintenance' | 'Lost' | 'Retired' | 'Disposed';
  history: Array<{
    date: Date;
    action: string;
    details: string;
    performedBy?: string;
  }>;
}

const AssetSchema = new Schema<IAsset>({
  assetTag: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  serialNumber: { type: String, required: true, unique: true },
  acquisitionDate: { type: Date, required: true },
  acquisitionCost: { type: Number, required: true },
  condition: { type: String, enum: ['New', 'Good', 'Fair', 'Poor'], default: 'New' },
  location: { type: String, required: true },
  sharedBookable: { type: Boolean, default: false },
  status: { type: String, enum: ['Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed'], default: 'Available' },
  history: [{
    date: { type: Date, default: Date.now },
    action: { type: String },
    details: { type: String },
    performedBy: { type: String }
  }]
}, { timestamps: true });

// ------------------------------
// Allocation
// ------------------------------
export interface IAllocation extends Document {
  asset: mongoose.Types.ObjectId;
  employee: mongoose.Types.ObjectId;
  department: mongoose.Types.ObjectId;
  allocatedDate: Date;
  expectedReturnDate?: Date;
  returnedDate?: Date;
  conditionOnReturn?: string;
  status: 'Active' | 'Returned' | 'Overdue' | 'Inactive';
}

const AllocationSchema = new Schema<IAllocation>({
  asset: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  allocatedDate: { type: Date, default: Date.now },
  expectedReturnDate: { type: Date },
  returnedDate: { type: Date },
  conditionOnReturn: { type: String },
  status: { type: String, enum: ['Active', 'Returned', 'Overdue', 'Inactive'], default: 'Active' }
}, { timestamps: true });

// ------------------------------
// Export Models (prevent hot-reload overwrite errors)
// ------------------------------
export const Department = mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
export const Employee = mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
export const Asset = mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
export const Allocation = mongoose.models.Allocation || mongoose.model<IAllocation>('Allocation', AllocationSchema);
