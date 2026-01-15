-- Recreate the users table with proper schema based on the Users entity
-- Drop and recreate the users table with all expected columns

-- First, make sure foreign key dependencies are handled
-- Drop dependent records
DELETE FROM exposure WHERE user_id IN (SELECT id FROM users);
DELETE FROM sport_bets WHERE user_id IN (SELECT id FROM users);
DELETE FROM result_transaction WHERE user_id IN (SELECT id FROM users);
DELETE FROM login_history WHERE user_id IN (SELECT id FROM users);

-- Then drop the users table
DROP TABLE IF EXISTS users;

-- Create the users table with all expected columns based on the Users entity
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    passwordText VARCHAR,
    token VARCHAR,
    role INTEGER DEFAULT 0,
    emailVerify TIMESTAMP,
    username VARCHAR UNIQUE,
    name VARCHAR,
    birthdate DATE,
    passwordHash VARCHAR,
    parentId VARCHAR,
    currency_id UUID,
    clientShare INTEGER DEFAULT 0,
    casino TEXT[],
    creditReference INTEGER DEFAULT 0,
    balance INTEGER DEFAULT 0,
    system_ip VARCHAR,
    browser_ip VARCHAR,
    status VARCHAR DEFAULT '1',
    betAllow BOOLEAN DEFAULT true,
    exposure DECIMAL(15,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    gap_casino_token VARCHAR
);

-- Add foreign key constraint for currency
ALTER TABLE users ADD CONSTRAINT fk_users_currency 
    FOREIGN KEY (currency_id) REFERENCES currency(id);

-- Add foreign key constraint for parent user (self-reference)
ALTER TABLE users ADD CONSTRAINT fk_users_parent 
    FOREIGN KEY (parentId) REFERENCES users(id);

-- If the currency table doesn't exist, create it
CREATE TABLE IF NOT EXISTS currency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL,
    code VARCHAR NOT NULL,
    value DECIMAL(10,4) NOT NULL
);

-- Create other related tables if they don't exist
CREATE TABLE IF NOT EXISTS exposure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_clear VARCHAR NOT NULL,
    marketType VARCHAR NOT NULL,
    exposure VARCHAR NOT NULL,
    user_id UUID REFERENCES users(id),
    market_id UUID REFERENCES markets(id)
);

CREATE TABLE IF NOT EXISTS sport_bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eventId VARCHAR NOT NULL,
    sportId VARCHAR NOT NULL,
    stake DECIMAL(15,2) NOT NULL,
    selectionType VARCHAR NOT NULL,
    odds DECIMAL(10,2) NOT NULL,
    marketId VARCHAR NOT NULL,
    selection VARCHAR NOT NULL,
    marketType VARCHAR NOT NULL,
    leagueId VARCHAR NOT NULL,
    selectionId VARCHAR NOT NULL,
    marketName VARCHAR NOT NULL,
    bettingType VARCHAR NOT NULL,
    status VARCHAR DEFAULT '1',
    user_id UUID REFERENCES users(id),
    currency_id UUID REFERENCES currency(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS result_transaction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(15,2),
    transactionType VARCHAR,
    user_id UUID REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    ipAddress INET,
    userAgent TEXT,
    loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create other necessary tables
CREATE TABLE IF NOT EXISTS markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    marketId VARCHAR NOT NULL,
    marketName VARCHAR NOT NULL,
    marketType VARCHAR NOT NULL,
    marketTime TIMESTAMP,
    status VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sportId VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    status VARCHAR DEFAULT '1',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    eventId VARCHAR NOT NULL,
    sport_id UUID REFERENCES sports(id),
    date TIMESTAMP NOT NULL,
    status VARCHAR DEFAULT '1',
    actualStatus VARCHAR,
    name VARCHAR NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS runners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    selectionId VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    status VARCHAR DEFAULT '1',
    actualStatus VARCHAR DEFAULT '1',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_parentId ON users(parentId);
CREATE INDEX IF NOT EXISTS idx_exposure_user ON exposure(user_id);
CREATE INDEX IF NOT EXISTS idx_sport_bets_user ON sport_bets(user_id);
CREATE INDEX IF NOT EXISTS idx_result_transaction_user ON result_transaction(user_id);

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON TABLE users TO postgres;
GRANT ALL PRIVILEGES ON TABLE currency TO postgres;
GRANT ALL PRIVILEGES ON TABLE exposure TO postgres;
GRANT ALL PRIVILEGES ON TABLE sport_bets TO postgres;
GRANT ALL PRIVILEGES ON TABLE result_transaction TO postgres;
GRANT ALL PRIVILEGES ON TABLE login_history TO postgres;
GRANT ALL PRIVILEGES ON TABLE markets TO postgres;
GRANT ALL PRIVILEGES ON TABLE sports TO postgres;
GRANT ALL PRIVILITIES ON TABLE events TO postgres;
GRANT ALL PRIVILEGES ON TABLE runners TO postgres;

-- Set proper ownership
ALTER TABLE users OWNER TO postgres;
ALTER TABLE currency OWNER TO postgres;
ALTER TABLE exposure OWNER TO postgres;
ALTER TABLE sport_bets OWNER TO postgres;
ALTER TABLE result_transaction OWNER TO postgres;
ALTER TABLE login_history OWNER TO postgres;
ALTER TABLE markets OWNER TO postgres;
ALTER TABLE sports OWNER TO postgres;
ALTER TABLE events OWNER TO postgres;
ALTER TABLE runners OWNER TO postgres;

-- Done
SELECT 'Users table and related tables have been recreated with proper schema' AS status;