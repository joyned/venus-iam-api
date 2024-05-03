import { v4 } from 'uuid';
import { User } from '../entities/User';
import { executeQuery } from './BaseRepository';

const FIND = `SELECT id, "name", email, "password", created_at, is_blocked FROM venus."user"`;
const INSERT =
  'INSERT INTO venus."user" (id, "name", email, "password", created_at, is_blocked) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, false);';
const UPDATE =
  'UPDATE venus."user" SET "name"=$2, email=$3, is_blocked=$4 WHERE id=$1';
const DELETE = `DELETE FROM venus."user" WHERE id=$1`;

export class UserRepository {
  async findAll() {
    const result = await executeQuery(FIND);

    return result.rows;
  }

  async findById(id: string) {
    const result = await executeQuery(`${FIND} WHERE id = $1`, [id]);

    return result.rows[0];
  }

  async findByEmail(email: string) {
    const result = await executeQuery(`${FIND} WHERE email = $1`, [email]);
    return result.rows[0];
  }

  async persist(user: User) {
    let result = undefined;

    if (!user.id) {
      user.id = v4();
      user.createdAt = new Date();
      result = await executeQuery(INSERT, [
        user.id,
        user.name,
        user.email,
        user.password,
      ]);
    } else {
      result = await executeQuery(UPDATE, [
        user.id,
        user.name,
        user.email,
        user.isBlocked || false,
      ]);
    }

    if (result.rowCount == 1) {
      return user;
    }

    return undefined;
  }

  async destroy(id: string) {
    const result = await executeQuery(DELETE, [id]);

    if (result.rowCount == 1) {
      return id;
    }

    return undefined;
  }
}
