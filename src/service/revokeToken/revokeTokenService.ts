import { RevokeToken } from '../../entity/revoke-token/revokeToken';
import { basicService } from '../basicService';

export class RevokeTokenService extends basicService {
  model = RevokeToken;
}
