import { Entity } from '@app/domain';

export interface CreateExampleData {
  id?: string;
  text: string;
  translationVi?: string;
  order?: number;
  externalId?: string;
}

export interface UpdateExampleData {
  text?: string;
  translationVi?: string;
  order?: number;
}

export class WordExample extends Entity {
  text: string;
  translationVi?: string;
  order: number;
  externalId?: string;

  constructor(data: CreateExampleData, id?: string) {
    super(id ?? data.id);
    this.text = data.text;
    this.translationVi = data.translationVi;
    this.order = data.order ?? 0;
    this.externalId = data.externalId;
  }

  update(data: UpdateExampleData): void {
    if (data.text) this.text = data.text;
    if (data.translationVi !== undefined)
      this.translationVi = data.translationVi;
    if (data.order !== undefined) this.order = data.order;

    this.touch();
  }
}
