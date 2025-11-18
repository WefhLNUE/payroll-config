import { Types } from 'mongoose';

export class DummyContext {
  users: Types.ObjectId[] = [];
  employees: Types.ObjectId[] = [];
  approvers: Types.ObjectId[] = [];
  departments: Types.ObjectId[] = [];
  positions: Types.ObjectId[] = [];

  static initialize(): DummyContext {
    const context = new DummyContext();

    // Create shared users
    context.users = Array.from({ length: 10 }, () => new Types.ObjectId());

    // Employees are subset of users
    context.employees = context.users.slice(0, 5);

    // Approvers (managers/admins)
    context.approvers = context.users.slice(5, 8);

    // Departments
    context.departments = [
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
    ];

    // Positions
    context.positions = [
      new Types.ObjectId(),
      new Types.ObjectId(),
      new Types.ObjectId(),
    ];

    return context;
  }
}
