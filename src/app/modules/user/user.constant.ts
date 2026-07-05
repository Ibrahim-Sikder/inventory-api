export const USER_ROLE = {
  admin: 'admin',
  manager: 'manager',
  employee: 'employee',
} as const;

export const USER_ROLE_ARRAY = [
  USER_ROLE.admin,
  USER_ROLE.manager,
  USER_ROLE.employee,
] as const;

export const USER_STATUS = ['active', 'inactive'] as const;
