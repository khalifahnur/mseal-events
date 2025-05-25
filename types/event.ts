export interface EventData {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  ticketPrice: number;
  availableTickets: number;
  totalTickets: number;
  homeLogoUrl: string;
  opponentLogoUrl: string;
}

export interface EventResponse {
  message: string;
  event?: EventData;
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
  updatedItem: EventData;
  itemId: string;
}
