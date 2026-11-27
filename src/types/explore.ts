export const ROOM_TYPES = [
  'All Rooms',
  'Living Room',
  'Bedroom',
  'Kitchen',
  'Home Office',
  'Dining Area',
] as const;

export type RoomTypeFilter = (typeof ROOM_TYPES)[number];
export type RoomType = Exclude<RoomTypeFilter, 'All Rooms'>;

export const INTERIOR_STYLES = [
  'All Styles',
  'Japandi',
  'Warm Minimalism',
  'Scandinavian',
  'Organic Modern',
  'Mid-Century',
] as const;

export type InteriorStyleFilter = (typeof INTERIOR_STYLES)[number];
export type InteriorStyle = Exclude<InteriorStyleFilter, 'All Styles'>;

export interface ExploreConcept {
  id: string;
  title: string;
  roomType: RoomType;
  interiorStyle: InteriorStyle;
  summary: string;
  palette: string[];
  materials: string[];
  estimatedTier: string;
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  featured?: boolean;
}