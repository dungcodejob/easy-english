export interface AuthResultDto {

  user: {
    id: string,
    name: string,
  };

  accessToken: string;

  refreshToken: string;
}

