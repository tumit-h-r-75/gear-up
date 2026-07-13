export type TRentalItemInput = {
  gearItemId: string;
  quantity?: number;
};

export type TCreateRental = {
  startDate: string;
  endDate: string;
  items: TRentalItemInput[];
};

export type TRentalStatus = "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED";