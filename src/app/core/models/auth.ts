interface LoginResponse {
  data: {
    token: string;
    type: string;
    refreshToken: string;
    id: number;
    username: string;
    email: string;
    roles: string[];
  };
  message: string;
  code: number;
}
