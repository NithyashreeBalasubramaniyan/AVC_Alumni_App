-- Create database (run this separately in PostgreSQL)
-- CREATE DATABASE student_verification;

-- Use this database and create tables
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    register_number VARCHAR(50) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_register_number ON students(register_number);
CREATE INDEX IF NOT EXISTS idx_phone_number ON students(phone_number);

-- Insert sample data (optional)
INSERT INTO students (name, register_number, phone_number, date_of_birth, password, is_verified) 
VALUES 
('Vimal Dharshan', '820322104059', '9842764239', '2005-01-02', '$2a$10$example_hashed_password', true)
ON CONFLICT (register_number) DO NOTHING; 