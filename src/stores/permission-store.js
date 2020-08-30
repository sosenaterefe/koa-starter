import { pick } from 'lodash'

const permissionModel = require('../models/permission-model')
const returnFields = permissionModel.attributes
/**
 * User model store.
 *
 * gets the logger injected.
 */
export default function createPermissionStore(logger) {
  let model = permissionModel

  let collectionName = model.collection.name

  return {
    /**
     *
     *
     * @returns
     */
    async find() {
      logger.debug(`Finding ${collectionName}`)
      return model.find({})
    },
    /**
     *
     *
     * @param {*} query
     * @param {*} options
     * @returns
     */
    async paginate(query, options) {
      logger.debug(`Finding and paginating ${collectionName}`)
      return model.paginate(
        query,
        Object.assign(options, { select: returnFields })
      )
    },
    /**
     *
     *
     * @param {*} id
     * @returns
     */
    async get(id) {
      logger.debug(`Getting ${collectionName} with id ${id}`)
      const found = await model.find({
        _id: id.toString()
      })
      if (!found) {
        return null
      }
      return found
    },
    /**
     *
     *
     * @param {*} ids
     * @returns
     */
    async findMany(ids) {
      logger.debug(`Getting ${collectionName} with ids`)
      const founds = await model.find({
        _id: {
          $in: ids
        }
      })
      if (!founds) {
        return null
      }
      return founds
    },
    /**
     *
     *
     * @param {*} data
     * @returns
     */
    async getBy(data) {
      logger.debug(`Getting ${collectionName}`)
      const found = await model.findOne(data)
      if (!found) {
        return null
      }
      return pick(found, [...Object.keys(returnFields)])
    },
    /**
     *
     *
     * @param {*} data
     * @returns
     */
    async create(data) {
      const result = await model.create(data)
      logger.debug(`Created new ${collectionName}`, result)
      return pick(result, [...Object.keys(returnFields)])
    },
    /**
     *
     *
     * @param {*} id
     * @param {*} data
     * @returns
     */
    async update(id, data) {
      const result = await model.findOneAndUpdate(
        { _id: id.toString() },
        data,
        { new: true, select: returnFields }
      )
      logger.debug(`Updated ${collectionName} ${id}`, result)
      return result
    },
    /**
     *
     *
     * @param {*} id
     */
    async remove(id) {
      model.delete(x => x._id === id.toString())
      logger.debug(`Removed ${collectionName} ${id}`)
    }
  }
}
