export const STUDENT_ROLE_NAME = "Student";
export const SYSTEM_MANAGER_ROLE_NAME = "System Manager";

export const PRIVILEGED_REGISTRATION_ROLES = [
  "Lecturer",
  "HOD",
  "Registrar",
  "Facility Officer",
];

export const PUBLIC_REGISTRATION_ROLES = [
  STUDENT_ROLE_NAME,
  ...PRIVILEGED_REGISTRATION_ROLES,
];

export function getRoleNames(userRoles = []) {
  return userRoles.map(({ role }) => role.name);
}