const TokenKey = 'token';
const UserRole = 'userRole';

/** TokenKey **/
export const getToken = _ => uni.getStorageSync(TokenKey);
export const setToken = token => uni.setStorageSync(TokenKey, token)
export const removeToken = _ => uni.removeStorageSync(token)

/** userRole **/
export const getUserRole = _ => uni.getStorageSync(UserRole);
export const setUserRole = key => uni.setStorageSync(UserRole, key)
export const removeUserRole = _ => uni.removeStorageSync(UserRole)

export const ROLES = {
  gas: 0b1,
  transfer: 0b10,
  aspirator: 0b100,
  plural: 0b1000,
  transferPerson: 0b10000,
};
export function hasRole(...roles) {
  const userRole = getUserRole()
  return roles.some((role) => userRole & ROLES[role]);
}