export enum Language {
  EN = 'en',
  VI = 'vi',
  ES = 'es',
  FR = 'fr',
  DE = 'de',
  JA = 'ja',
  KO = 'ko',
  ZH = 'zh',
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  language: Language;
  userId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
  language: Language;
}

export interface UpdateWorkspaceDto extends Partial<CreateWorkspaceDto> {}
