// permissions.ts
export const rolePermissions: Record<string, any> = {
  authenticated: {
    'my-users': {
      read: true,
      create: true,
      edit: true,
      delete: true,
      show: true,
    },
    products: {
      read: true,
      create: true,
      edit: true,
      delete: true,
      show: true,
    },
    videos: {
      read: true,
      create: true,
      edit: true,
      delete: true,
      show: true,
    },
  },
  public: {
    'my-users': {
      read: true,     
      show: true,     
      create: false,
      edit: false,
      delete: false,
    },
    products: {
      read: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
    videos: {
      read: true,
      show: true,
      create: false,
      edit: false,
      delete: false,
    },
  },
};
