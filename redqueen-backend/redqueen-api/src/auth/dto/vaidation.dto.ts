export interface JwtSigningPayloadDto {
  username: string;
  sub: string;
}

export interface JwtValidationDto {
  userId: string;
  username: string;
}
