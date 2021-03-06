import { NotFound, BadRequest } from 'fejl'
import { pick } from 'lodash'

// Prefab assert function.
const assertId = BadRequest.makeAssert('No id given')

// Prevent overposting.
const pickProps = data => pick(data, ['name', 'permissions'])

/**
 * User Service.
 */
export default class RoleService {
  constructor(roleStore) {
    this.store = roleStore
  }

  /**
   *
   *
   * @param {*} params
   * @returns
   * @memberof RoleService
   */
  async find(params) {
    const query = {}

    const options = {
      page: parseInt(params.page) || 1,
      sort: params.sort || { date: -1 },
      lean: false,
      limit: parseInt(params.limits) || 50
    }

    const results = await this.store.paginate(query, options)

    if (!results) {
      throw new Error('There was an error retrieving roles.')
    } else {
      return results
    }
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof RoleService
   */
  async get(id) {
    assertId(id)
    // If `Store.get()` returns a falsy value, we throw a
    // NotFound error with the specified message.
    return this.store
      .get(id)
      .then(NotFound.makeAssert(`Role with id "${id}" not found`))
  }

  /**
   *
   *
   * @param {*} data
   * @returns
   * @memberof RoleService
   */
  async create(data) {
    BadRequest.assert(data, 'No role payload given')
    BadRequest.assert(data.name, 'Role name is required')

    return this.store.create(pickProps(data))
  }

  /**
   *
   *
   * @param {*} id
   * @param {*} data
   * @returns
   * @memberof RoleService
   */
  async update(id, data) {
    assertId(id)
    BadRequest.assert(data, 'No role payload given')

    // Make sure the model exists by calling `get`.
    await this.get(id)

    // Prevent overposting.
    const picked = pickProps(data)
    return this.store.update(id, picked)
  }

  /**
   *
   *
   * @param {*} id
   * @returns
   * @memberof RoleService
   */
  async remove(id) {
    // Make sure the model exists by calling `get`.
    return this.store.remove(await this.get(id))
  }
}
