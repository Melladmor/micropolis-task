export interface SpotDto {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  streamUrl?: string;
  streamWebUrl?: string;
}

export interface AreaNode {
  area: {
    id: number;
    name: string;
    parentId?: number | null;
    spots?: SpotDto[];
  };
  areas?: AreaNode[];
}
