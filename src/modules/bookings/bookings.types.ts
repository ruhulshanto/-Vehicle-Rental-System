export interface ICreateBooking {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

export interface IUpdateBooking {
  status?: 'cancelled' | 'returned';
}