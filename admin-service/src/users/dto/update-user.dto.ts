export class UpdateUserDto {
  email?: string;
  password?: string;
  username?: string;
  name?: string;
  role?: number;
  parentId?: string;
  currency_id?: string;
  clientShare?: number;
  creditReference?: number;
  balance?: number;
  status?: string;
  betAllow?: boolean;
}
