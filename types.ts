
export enum Sunlight {
  LOW = 'Low',
  MEDIUM = 'Medium',
  FULL = 'Full'
}

export enum Element {
  EARTH = 'Earth (පඨවි)',
  WATER = 'Water (ආපෝ)',
  FIRE = 'Fire (තේජෝ)',
  AIR = 'Air (වායෝ)',
  SPACE = 'Space (ආකාශ)'
}

export enum Direction {
  NORTH = 'North',
  NE = 'North-East',
  EAST = 'East',
  SE = 'South-East',
  SOUTH = 'South',
  SW = 'South-West',
  WEST = 'West',
  NW = 'North-West',
  CENTER = 'Center'
}

export enum Category {
  INDOOR = 'Indoor',
  OUTDOOR = 'Outdoor',
  HERB = 'Herb',
  FRUIT = 'Fruit',
  FLOWER = 'Flower'
}

export enum SafetyStatus {
  YES = 'Yes',
  NO = 'No',
  UNKNOWN = 'Unknown'
}

export interface Plant {
  plant_id: string;
  order_index: number;
  name_si: string;
  name_en: string;
  scientific_name?: string;
  category: Category[];
  directions: Direction[];
  element: Element;
  sunlight: Sunlight;
  benefits: string[];
  care_tips?: string;
  cautions: string[];
  pet_safe: SafetyStatus;
  kids_safe: SafetyStatus;
  avoid_if_kids_pets: boolean;
  image_links: string[];
  image_search_links: string[];
  last_updated?: string;
  updated_by?: string;
}

export interface GuideSection {
  title_si: string;
  title_en: string;
  content: string[];
  tips?: string[];
}
