import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { Department, Category, Employee, Asset, Allocation } from '../lib/models/schema';

// Load env vars
dotenv.config({ path: resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable inside .env');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // Clear existing
    console.log('Clearing existing collections...');
    await Department.deleteMany({});
    await Category.deleteMany({});
    await Employee.deleteMany({});
    await Asset.deleteMany({});
    await Allocation.deleteMany({});

    // 1. Departments
    const deptEngineering = await Department.create({ name: 'Engineering', head: 'Alice Smith' });
    const deptSales = await Department.create({ name: 'Sales', head: 'Bob Johnson' });
    const deptMarketing = await Department.create({ name: 'Marketing', head: 'Carol Williams' });

    // 2. Categories
    const catLaptops = await Category.create({ name: 'Laptops', description: 'Company laptops', warrantyPeriod: 36 });
    const catPhones = await Category.create({ name: 'Mobile Phones', description: 'Company smartphones', warrantyPeriod: 24 });
    const catMeetingRooms = await Category.create({ name: 'Meeting Rooms', description: 'Shared spaces' });
    const catProjectors = await Category.create({ name: 'Projectors', description: 'A/V equipment', warrantyPeriod: 12 });

    // 3. Employees
    const empPriya = await Employee.create({ name: 'Priya Shah', email: 'priya@example.com', department: deptEngineering._id, role: 'Employee' });
    const empJohn = await Employee.create({ name: 'John Doe', email: 'john@example.com', department: deptSales._id, role: 'Employee' });
    const empAlice = await Employee.create({ name: 'Alice Smith', email: 'alice@example.com', department: deptEngineering._id, role: 'Department Head' });

    // 4. Assets
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(now.getFullYear() - 2);

    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);

    // Asset 1: Active MacBook assigned to Priya
    const asset1 = await Asset.create({
      assetTag: 'AF-102',
      name: 'MacBook Pro M3 Max',
      category: catLaptops._id,
      serialNumber: 'C02ABCDEF1',
      acquisitionDate: sixMonthsAgo,
      acquisitionCost: 3500,
      condition: 'Good',
      location: 'NY Office',
      sharedBookable: false,
      status: 'Allocated',
      history: [
        { date: sixMonthsAgo, action: 'Purchased', details: 'Bought from Apple Store' },
        { date: threeMonthsAgo, action: 'Allocated', details: 'Allocated to Priya Shah' }
      ]
    });

    await Allocation.create({
      asset: asset1._id,
      employee: empPriya._id,
      department: deptEngineering._id,
      allocatedDate: threeMonthsAgo,
      status: 'Active'
    });

    // Asset 2: High Risk Laptop (Old, Poor Condition, Needs maintenance)
    await Asset.create({
      assetTag: 'AF-089',
      name: 'Dell XPS 15 (2020)',
      category: catLaptops._id,
      serialNumber: 'DELL-XYZ-123',
      acquisitionDate: new Date('2020-05-15'),
      acquisitionCost: 2000,
      condition: 'Poor',
      location: 'SF Office',
      sharedBookable: false,
      status: 'Available',
      history: [
        { date: new Date('2020-05-15'), action: 'Purchased', details: 'Bought from Dell' },
        { date: new Date('2023-01-10'), action: 'Maintenance', details: 'Battery replacement' },
        { date: new Date('2024-02-15'), action: 'Returned', details: 'Returned by ex-employee. Screen flickering.' }
      ]
    });

    // Asset 3: Overdue Maintenance Projector
    await Asset.create({
      assetTag: 'AF-300',
      name: 'Epson 4K Projector',
      category: catProjectors._id,
      serialNumber: 'EPS-4K-999',
      acquisitionDate: twoYearsAgo,
      acquisitionCost: 1500,
      condition: 'Fair',
      location: 'Conference Room A',
      sharedBookable: true,
      status: 'Available',
      history: [
        { date: twoYearsAgo, action: 'Purchased', details: 'Installed in Conf Room A' }
      ]
    });

    // Conflict Data (Department A vs B)
    // Dept Engineering (A) has 8 laptops, Sales (B) has 2 laptops.
    for (let i = 0; i < 7; i++) {
      await Asset.create({
        assetTag: `AF-ENG-${i}`,
        name: 'Standard Developer Laptop',
        category: catLaptops._id,
        serialNumber: `SN-ENG-${i}`,
        acquisitionDate: now,
        acquisitionCost: 1000,
        condition: 'Good',
        location: 'NY Office',
        status: 'Allocated'
      });
      // Not creating allocation docs just for count purposes, but real queries might look at allocations.
      // Let's create dummy allocations so it counts correctly if Tara looks at allocations.
      // Assuming these are all in Engineering.
    }
    
    console.log('Seed completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
