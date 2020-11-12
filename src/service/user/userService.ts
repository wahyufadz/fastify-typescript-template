import { User } from '../../entity/user/user';
import { basicService } from '../basicService';

export class UserService extends basicService {
  model = User;
}
