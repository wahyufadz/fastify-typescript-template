import { getManager } from 'typeorm';

export class basicService {
  entityManager = getManager()
  model: any;

  constructor() { }

  async readOne(data: any) {
    return await this.entityManager.findOne(this.model, data);
  }

  async create(data: any) {
    try {
      const newModel = new this.model;
      Object.keys(data).forEach(value => {
        newModel[value] = data[value]
      });
      return await this.entityManager.save(newModel);
    } catch (error) {
      console.log(error)
    }
  }

  update(_data: any) { }
  delete(_data: any) { }
}
