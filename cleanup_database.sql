-- Database Cleanup Script for Sportsbook Backend
-- This script will clean up the corrupted schema and reset the database properly

-- Step 1: Drop all foreign key constraints that reference users table
-- We need to drop these first to allow deletion from users table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT conname, conrelid::regclass 
        FROM pg_constraint 
        WHERE confrelid = 'users'::regclass 
        AND contype = 'f'
    LOOP
        EXECUTE 'ALTER TABLE ' || r.conrelid || ' DROP CONSTRAINT ' || r.conname;
    END LOOP;
END $$;

-- Step 2: Clear all data from tables in the right order
-- Delete from child tables first
DELETE FROM exposure;
DELETE FROM sport_bets;
DELETE FROM result_transaction;
DELETE FROM login_history;

-- Now we can delete from users table
DELETE FROM users;

-- Step 3: Identify and drop duplicate/duplicated columns in tables
-- This will help fix the "1600 columns" issue

-- First, identify tables with excessive columns
-- We'll recreate tables with proper schema instead of trying to fix individual columns

-- Step 4: Drop tables (keeping the order to respect dependencies)
DROP TABLE IF EXISTS login_history CASCADE;
DROP TABLE IF EXISTS result_transaction CASCADE;
DROP TABLE IF EXISTS sport_bets CASCADE;
DROP TABLE IF EXISTS exposure CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS currency CASCADE;
DROP TABLE IF EXISTS sports CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS markets CASCADE;
DROP TABLE IF EXISTS runners CASCADE;
DROP TABLE IF EXISTS white_label CASCADE;
DROP TABLE IF EXISTS sport_stake_settings CASCADE;

-- Step 5: Recreate tables with proper schema using the entity definitions
-- Users table
CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    currency_id uuid,
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

-- Currency table
CREATE TABLE currency (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR UNIQUE NOT NULL,
    code VARCHAR NOT NULL,
    value DECIMAL(10,4) NOT NULL
);

-- Sports table
CREATE TABLE sports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sportId VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    status VARCHAR DEFAULT '1',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    eventId VARCHAR NOT NULL,
    leagueId uuid,
    date TIMESTAMP NOT NULL,
    status VARCHAR DEFAULT '1',
    actualStatus VARCHAR,
    name VARCHAR NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Markets table
CREATE TABLE markets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    marketId VARCHAR NOT NULL,
    marketName VARCHAR NOT NULL,
    marketType VARCHAR NOT NULL,
    marketTime TIMESTAMP,
    status VARCHAR NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Runners table
CREATE TABLE runners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    selectionId VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    status VARCHAR DEFAULT '1',
    actualStatus VARCHAR DEFAULT '1',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sport Bets table
CREATE TABLE sport_bets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    userId uuid REFERENCES users(id),
    currencyId uuid REFERENCES currency(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exposure table
CREATE TABLE exposure (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    is_clear VARCHAR NOT NULL,
    marketType VARCHAR NOT NULL,
    exposure VARCHAR NOT NULL,
    userId uuid REFERENCES users(id),
    marketId uuid REFERENCES markets(id)
);

-- Result Transaction table
CREATE TABLE result_transaction (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    amount DECIMAL(15,2),
    transactionType VARCHAR,
    userId uuid REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login History table
CREATE TABLE login_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    userId uuid REFERENCES users(id),
    ipAddress INET,
    userAgent TEXT,
    loginTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT fk_users_currency FOREIGN KEY (currency_id) REFERENCES currency(id);
ALTER TABLE users ADD CONSTRAINT fk_users_parent FOREIGN KEY (parentId) REFERENCES users(id);
ALTER TABLE sport_bets ADD CONSTRAINT fk_sport_bets_user FOREIGN KEY (userId) REFERENCES users(id);
ALTER TABLE sport_bets ADD CONSTRAINT fk_sport_bets_currency FOREIGN KEY (currencyId) REFERENCES currency(id);
ALTER TABLE exposure ADD CONSTRAINT fk_exposure_user FOREIGN KEY (userId) REFERENCES users(id);
ALTER TABLE exposure ADD CONSTRAINT fk_exposure_market FOREIGN KEY (marketId) REFERENCES markets(id);
ALTER TABLE result_transaction ADD CONSTRAINT fk_result_transaction_user FOREIGN KEY (userId) REFERENCES users(id);
ALTER TABLE login_history ADD CONSTRAINT fk_login_history_user FOREIGN KEY (userId) REFERENCES users(id);

-- Refresh schema
-- This completes the cleanup and reinitialization of the database schema