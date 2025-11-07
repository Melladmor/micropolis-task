import { AreaNode, SpotDto } from "../../models/areas";

export function collectSpots(nodes: AreaNode[] = []): SpotDto[] {
  const result: SpotDto[] = [];

  const walk = (list: AreaNode[]) => {
    for (const node of list) {
      if (node.area?.spots?.length) {
        result.push(...node.area.spots);
      }
      if (node.areas?.length) {
        walk(node.areas);
      }
    }
  };

  walk(nodes);
  return result.filter((s) => s.latitude && s.longitude);
}
