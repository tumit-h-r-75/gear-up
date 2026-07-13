export type TCreateGear = {
  name: string;
  description: string;
  brand?: string;
  pricePerDay: number;
  stock?: number;
  imageUrl?: string;
  categoryId: string;
};

export type TUpdateGear = Partial<TCreateGear> & {
  isAvailable?: boolean;
};

export type TGearQuery = {
  category?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
};