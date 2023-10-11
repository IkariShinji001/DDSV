const { Pool } = require("pg");

class PostgreSQLDatabase {
  constructor() {
    this.pool = new Pool({
      user: "postgres",
      host: "localhost",
      database: "StudentManagement",
      password: "duyduy2003",
      port: 5432,
    });
  }

  async query(sql, params) {
    try {
      const client = await this.pool.connect();
      const result = await client.query(sql, params);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PostgreSQLDatabase;
