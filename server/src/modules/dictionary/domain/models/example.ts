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

export class Example extends Entity {
  private _text: string;
  private _translationVi?: string;
  private _order: number;
  private _externalId?: string;

  constructor(data: CreateExampleData, id?: string) {
    super(id ?? data.id);
    this._text = data.text;
    this._translationVi = data.translationVi;
    this._order = data.order ?? 0;
    this._externalId = data.externalId;
  }

  get text(): string {
    return this._text;
  }

  get translationVi(): string | undefined {
    return this._translationVi;
  }

  get order(): number {
    return this._order;
  }

  get externalId(): string | undefined {
    return this._externalId;
  }

  update(data: UpdateExampleData): void {
    if (data.text) this._text = data.text;
    if (data.translationVi !== undefined)
      this._translationVi = data.translationVi;
    if (data.order !== undefined) this._order = data.order;

    this.touch();
  }
}
