import { User } from '../../entity';
import { basicService } from '../basicService';

export class userService extends basicService {
  model = User;
  constructor() {
    super()
  }
}
