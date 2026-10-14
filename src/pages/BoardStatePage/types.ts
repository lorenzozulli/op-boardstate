export type CardId = string;
export type TagKind = 'keyword' | 'status';
export type ZoneField = 'bonus' | 'cost' | 'life';

export interface Tag {
  id: number;
  kind: TagKind;
  label: string;
}

export interface CardData {
  name: string;
  bonus: number;
  cost: number;
  life: number;
  used: boolean;
  tags: Tag[];
}
