import { getManager } from 'typeorm';

export class basicService {
  entityManager = getManager()
  model: any;

  constructor() { }

  async readOne(data: any) {
    return await this.entityManager.findOne(this.model, data);
  }

  create(_data: any) { }
  update(_data: any) { }
  delete(_data: any) { }
}
