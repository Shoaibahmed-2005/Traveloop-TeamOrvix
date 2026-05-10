-- USERS
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  country VARCHAR(100),
  profile_photo VARCHAR(500),
  additional_info TEXT,
  google_id VARCHAR(255),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- Add google_id to existing tables (idempotent)
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255);
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;


-- CITIES
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  country VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  description TEXT,
  image_url VARCHAR(500),
  cost_index DECIMAL(5,2) DEFAULT 1.00,
  popularity_score INTEGER DEFAULT 0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ACTIVITIES
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  duration_hours DECIMAL(5,2),
  image_url VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TRIPS
CREATE TABLE IF NOT EXISTS trips (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cover_photo VARCHAR(500),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_budget DECIMAL(12,2) DEFAULT 0,
  spent_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  is_public BOOLEAN DEFAULT false,
  share_token VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- TRIP STOPS
CREATE TABLE IF NOT EXISTS trip_stops (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id),
  stop_order INTEGER NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ITINERARY SECTIONS
CREATE TABLE IF NOT EXISTS itinerary_sections (
  id SERIAL PRIMARY KEY,
  trip_stop_id INTEGER REFERENCES trip_stops(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  section_type VARCHAR(50) DEFAULT 'activity' CHECK (section_type IN ('activity', 'hotel', 'transport', 'meal', 'other')),
  description TEXT,
  start_date DATE,
  end_date DATE,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  section_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TRIP ACTIVITIES
CREATE TABLE IF NOT EXISTS trip_activities (
  id SERIAL PRIMARY KEY,
  trip_stop_id INTEGER REFERENCES trip_stops(id) ON DELETE CASCADE,
  activity_id INTEGER REFERENCES activities(id),
  itinerary_section_id INTEGER REFERENCES itinerary_sections(id),
  scheduled_date DATE,
  scheduled_time TIME,
  actual_cost DECIMAL(10,2),
  notes TEXT,
  status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'skipped')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- EXPENSES
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  trip_stop_id INTEGER REFERENCES trip_stops(id),
  category VARCHAR(50) CHECK (category IN ('transport', 'hotel', 'food', 'activity', 'shopping', 'other')),
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  quantity INTEGER DEFAULT 1,
  unit_cost DECIMAL(10,2),
  expense_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- PACKING CHECKLIST
CREATE TABLE IF NOT EXISTS packing_items (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  item_name VARCHAR(200) NOT NULL,
  category VARCHAR(50) DEFAULT 'other' CHECK (category IN ('clothing', 'documents', 'electronics', 'toiletries', 'medicine', 'other')),
  is_packed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- TRIP NOTES
CREATE TABLE IF NOT EXISTS trip_notes (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  trip_stop_id INTEGER REFERENCES trip_stops(id),
  title VARCHAR(255),
  content TEXT NOT NULL,
  note_type VARCHAR(30) DEFAULT 'general' CHECK (note_type IN ('general', 'hotel', 'reminder', 'contact', 'day-specific')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- COMMUNITY POSTS
CREATE TABLE IF NOT EXISTS community_posts (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- SAVED DESTINATIONS
CREATE TABLE IF NOT EXISTS saved_destinations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  city_id INTEGER REFERENCES cities(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, city_id)
);

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_city_id ON activities(city_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_trip_id ON community_posts(trip_id);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
