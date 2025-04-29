export interface Event {
  _id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  ticketPrice: number;
  availableTickets: number;
}

export interface EventResponse {
  message: string;
  event?: Event;
}

export interface ErrorResponse {
  message: string;
  statusCode?: number;
  details?: any;
}

export interface DeleteResponse {
  message: string;
  status: number;
}

export interface DeleteEvent {
  itemId: string;
}

export interface EditResponse {
  message: string;
  updatedItem: Event;
}

export interface EditMutationVariables {
  updatedItem: Event;
  itemId:string;
}