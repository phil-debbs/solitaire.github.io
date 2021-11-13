import {ObjectId} from 'bson';

class Community {
  /**
   *
   * @param {string} name The name of the community
   * @param {string status The status of the community. Default value is "Open"
   * @param {ObjectId} id The ObjectId to create this community with
   */
  constructor({name, partition, isActive = true, id = new ObjectId()}) {
    this._partition = partition;
    this._id = id;
    this.name = name;
    this.isActive = isActive;
  }

  // TODO: implement schema
  static schema = {
    name: 'Community',
    properties: {
      _id: 'objectId',
      name: 'string',
      isActive: 'bool',
    },
    primaryKey: '_id',
  };
}

export {Community};
