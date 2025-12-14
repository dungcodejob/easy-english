import type { CreateWordDto } from "./create-word";

export interface UpdateWordDto extends Partial<CreateWordDto> {}