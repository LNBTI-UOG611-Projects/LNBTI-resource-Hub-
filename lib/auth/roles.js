export const PUBLIC_REGISTRATION_ROLES = [
  "Student",
];

export function getRoleNames(userRoles = []) {
  return userRoles.map(({ role }) => role.name);
}