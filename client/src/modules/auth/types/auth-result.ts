export type AuthResult = {
  tokens: Tokens;
};

type Tokens = {
  access: string;
  refresh: string;
};
