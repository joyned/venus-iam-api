import { v4 } from 'uuid';
import { pool } from '../database/index';
import { User } from '../entities/User';
import { UserGroupRepository } from './UserRoleRepository';

const FIND = `SELECT id, "name", email, "password", created_at, is_blocked FROM venus."user"`;
const INSERT =
  'INSERT INTO venus."user" (id, "name", email, "password", created_at, is_blocked) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, false);';
const UPDATE =
  'UPDATE venus."user" SET "name"=$2, email=$3, "password"=$4, is_blocked=$5 WHERE id=$1';
const DELETE = `DELETE FROM venus."user" WHERE id=$1`;

export class UserRepository {
  static async findAll() {
    const result = await pool.query(FIND);

    return result.rows;
  }

  static async findById(id: string) {
    const result = await pool.query(`${FIND} WHERE id = $1`, [id]);

    return result.rows[0];
  }

  static async findByEmail(email: string) {
    const result = await pool.query(`${FIND} WHERE email = $1`, [email]);
    return result.rows[0];
  }

  static async persist(user: User) {
    let result = undefined;

    if (!user.id) {
      user.id = v4();
      user.createdAt = new Date();
      result = await pool.query(INSERT, [
        user.id,
        user.name,
        user.email,
        user.password,
      ]);
    } else {
      result = await pool.query(UPDATE, [
        user.id,
        user.name,
        user.email,
        user.password,
        user.isBlocked,
      ]);
    }

    if (result.rowCount == 1) {
      return user;
    }

    return undefined;
  }

  static async destroy(id: string) {
    const result = await pool.query(DELETE, [id]);

    if (result.rowCount == 1) {
      return id;
    }

    return undefined;
  }
}
