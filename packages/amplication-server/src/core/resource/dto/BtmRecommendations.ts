interface BtmEntityRecommendation {
  id: string;

  name: string;

  fields: string[];

  originalEntityId: string;
}

interface BtmResourceRecommendations {
  id: string;

  name: string;

  description?: string | null;

  entities: BtmEntityRecommendation[];
}

export interface BtmRecommendations {
  microservices: BtmResourceRecommendations[];
}
