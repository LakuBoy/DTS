-- 1. DEFINE ROLES ENUM
CREATE TYPE user_role AS ENUM (
    'super_admin', 
    'admin', 
    'client', 
    'client_receiver', 
    'client_receiver_admin'
);

-- 2. TENANTS / COMPANIES TABLE
CREATE TABLE companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    company_name VARCHAR(100) NOT NULL,
    account_status VARCHAR(20) DEFAULT 'active', 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS TABLE
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(company_id) ON DELETE SET NULL, 
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. CUSTOMERS TABLE (The people calling into the system)
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE, 
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_customer_per_company UNIQUE (company_id, phone_number)
);

-- 5. TICKETS TABLE
CREATE TABLE tickets (
    ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(user_id) ON DELETE SET NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'open', 
    priority VARCHAR(20) DEFAULT 'medium', 
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. CALLS TABLE (Tracks metadata for every single call event)
CREATE TABLE calls (
    call_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES companies(company_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(customer_id) ON DELETE SET NULL,
    agent_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    ticket_id UUID REFERENCES tickets(ticket_id) ON DELETE SET NULL,
    call_direction VARCHAR(10) NOT NULL, 
    call_status VARCHAR(20) NOT NULL,    
    duration_seconds INT DEFAULT 0,
    recording_url TEXT,                  
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. TICKET UPDATES / HISTORY TABLE (For live feeds and auditing)
CREATE TABLE ticket_updates (
    update_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(ticket_id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    update_type VARCHAR(20) NOT NULL,    
    note_text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------
-- PERFORMANCE INDEXES
-- -----------------------------------------------------------------
CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_customers_phone_company ON customers(company_id, phone_number);
CREATE INDEX idx_tickets_company_status ON tickets(company_id, status);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);
CREATE INDEX idx_calls_company ON calls(company_id);

-- -----------------------------------------------------------------
-- AUTOMATION: AUTOMATICALLY UPDATE TIMESTAMPS
-- -----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_companies_modtime BEFORE UPDATE ON companies FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON customers FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tickets_modtime BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE PROCEDURE update_modified_column();