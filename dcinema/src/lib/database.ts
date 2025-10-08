import Database from 'better-sqlite3';
import path from 'path';

// Create database instance
const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create users table if it doesn't exist
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

db.exec(createUsersTable);

// Create indexes for better performance
db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
db.exec('CREATE INDEX IF NOT EXISTS idx_users_id ON users(id)');

export default db;
