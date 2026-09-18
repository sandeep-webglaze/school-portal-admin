export interface ErrorResponse {
  code: number;
  message: string;
  displayMessage?: string;
}

export interface Response<Res> {
  data?: Res;
  error?: ErrorResponse;
  totalCount?: number;
}

export interface ErrorResponseSchema {
  error?: ErrorResponse;
}
