export type TLoginPayload = {
  email: string;
  password: string;
};

export type TChangeOwnPassword = {
  oldPassword: string;
  newPassword: string;
};

export type TAdminChangePassword = {
  userId: string;
  newPassword: string;
};

export type TTokenPayload = {
  userId: string;
  roleName: string;
  permissions: string[];
};
