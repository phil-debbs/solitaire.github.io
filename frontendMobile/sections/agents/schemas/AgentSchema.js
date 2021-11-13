import {ObjectId} from 'bson';

class Agent {
  /**
   *
   * @param {string} name The name of the Agent
   * @param {string status The status of the community. Default value is "Open"
   * @param {ObjectId} id The ObjectId to create this community with
   */
  constructor({
    name,
    phone,
    address,
    partition,
    isActive = true,
    id = new ObjectId(),
  }) {
    this._partition = partition;
    this._id = id;
    this.name = name;
    this.phone = phone;
    this.address = address;
    this.isActive = isActive;
  }

  // TODO: implement schema
  static schema = {
    name: 'Agent',
    properties: {
      _id: 'objectId',
      name: 'string',
      phone: 'string',
      address: 'string',
      isActive: 'bool',
    },
    primaryKey: '_id',
  };
}

export {Agent};
