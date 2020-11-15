import { User } from '../../entity';
import { basicService } from '../basicService';

export class UserService extends basicService {
  model = User;
}
