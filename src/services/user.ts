import { NotFoundError } from 'elysia';

import ConflictError from '@/domain/exceptions/ConflictError';
import MongoServerError from '@/domain/exceptions/MongoServerError';
import { User } from '@/models/User';

class UserService {
  /**
   * Creates a new user.
   *
   * @param {User} payload - The user data to be created.
   * @returns {Promise<User>} A promise that resolves to the created user.
   * @throws {ConflictError} If a user with the same data already exists.
   * @throws {Error} If an error occurs while creating the user.
   */
  async create(payload: User): Promise<User> {
    try {
      const user = await User.findOne({ email: payload.email });

      if (user) {
        throw new ConflictError('User already exists!');
      }

      return await User.create(payload);
    } catch (e) {
      const error = e as MongoServerError;
      if (error.name === 'MongoServerError' && error.code === 11000) {
        throw new ConflictError('User exists.');
      }

      throw error;
    }
  }

  /**
   * Fetches all users from the database.
   *
   * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
   */
  fetchAll(): Promise<User[]> {
    return User.find();
  }

  /**
   * Fetches a user by id.
   *
   * @param {string} id - The id of the user to fetch.
   * @returns {Promise<User>} A promise that resolves to a User object.
   * @throws {NotFoundError} If no user with the specified ID is found.
   */
  async fetchById(id: string): Promise<User> {
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundError('User not found.');
    }

    return user;
  }
}

export default new UserService();
