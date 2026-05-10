-- ADMIN USER (password: Admin@123)
INSERT INTO users (first_name, last_name, email, password_hash, role, city, country) VALUES
('Admin', 'Traveloop', 'admin@traveloop.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhN3yGf4r0c5r5oXjEQzOe', 'admin', 'Mumbai', 'India')
ON CONFLICT (email) DO NOTHING;

-- SAMPLE USERS (password: Test@123)
INSERT INTO users (first_name, last_name, email, password_hash, role, city, country) VALUES
('Arjun', 'Sharma', 'arjun@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Mumbai', 'India'),
('Priya', 'Mehta', 'priya@example.com', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Delhi', 'India')
ON CONFLICT (email) DO NOTHING;

-- CITIES (24 Indian + 8 International)
INSERT INTO cities (name, country, region, description, cost_index, popularity_score, latitude, longitude) VALUES
-- North India
('New Delhi', 'India', 'North India', 'India''s capital — a mesmerizing blend of Mughal heritage, modern ambition, and incredible street food.', 0.60, 97, 28.6139, 77.2090),
('Jaipur', 'India', 'North India', 'The Pink City — majestic forts, vibrant bazaars, and Rajasthani hospitality at its finest.', 0.50, 95, 26.9124, 75.7873),
('Agra', 'India', 'North India', 'Home to the Taj Mahal — one of the Seven Wonders and India''s most iconic landmark.', 0.45, 96, 27.1767, 78.0081),
('Varanasi', 'India', 'North India', 'The spiritual heart of India — ancient ghats, evening aarti, and 5000 years of living history.', 0.35, 92, 25.3176, 83.0068),
('Rishikesh', 'India', 'North India', 'Yoga capital of the world — nestled in the Himalayan foothills along the sacred Ganges.', 0.30, 88, 30.0869, 78.2676),
('Shimla', 'India', 'North India', 'The Queen of Hill Stations — colonial charm, pine forests, and snow-capped mountain views.', 0.45, 84, 31.1048, 77.1734),
('Amritsar', 'India', 'North India', 'Home to the Golden Temple — India''s most serene and spiritual shrine.', 0.35, 87, 31.6340, 74.8723),
('Udaipur', 'India', 'North India', 'City of Lakes — floating palaces, shimmering waters, and the most romantic city in India.', 0.50, 91, 24.5854, 73.7125),

-- South India
('Mumbai', 'India', 'South India', 'The City of Dreams — Bollywood, street food paradise, coastal beauty, and relentless energy.', 0.70, 98, 19.0760, 72.8777),
('Bangalore', 'India', 'South India', 'India''s Silicon Valley — craft breweries, lush gardens, and a thriving tech culture.', 0.65, 85, 12.9716, 77.5946),
('Kochi', 'India', 'South India', 'Gateway to Kerala — Chinese fishing nets, spice markets, and backwater boat rides.', 0.45, 86, 9.9312, 76.2673),
('Mysore', 'India', 'South India', 'The Palace City — royal heritage, sandalwood fragrance, and the magnificent Mysore Palace.', 0.40, 83, 12.2958, 76.6394),
('Pondicherry', 'India', 'South India', 'A slice of France in India — pastel colonial streets, serene beaches, and Auroville.', 0.40, 82, 11.9416, 79.8083),
('Ooty', 'India', 'South India', 'Queen of the Nilgiris — tea plantations, botanical gardens, and misty mountain railways.', 0.35, 80, 11.4102, 76.6950),
('Hampi', 'India', 'South India', 'UNESCO ruins of the Vijayanagara Empire — boulder-strewn landscapes and ancient temples.', 0.25, 84, 15.3350, 76.4600),
('Alleppey', 'India', 'South India', 'Venice of the East — glide through Kerala''s tranquil backwaters on a traditional houseboat.', 0.45, 89, 9.4981, 76.3388),

-- East India
('Kolkata', 'India', 'East India', 'The City of Joy — literary culture, colonial architecture, and legendary Bengali cuisine.', 0.45, 86, 22.5726, 88.3639),
('Darjeeling', 'India', 'East India', 'The tea capital — Himalayan panoramas, toy train rides, and world-famous Darjeeling tea.', 0.35, 85, 27.0360, 88.2627),
('Gangtok', 'India', 'East India', 'Gateway to Sikkim — monasteries, mountain passes, and views of Kanchenjunga.', 0.40, 81, 27.3389, 88.6065),

-- West India
('Goa', 'India', 'West India', 'India''s beach paradise — sun, sand, Portuguese heritage, and legendary nightlife.', 0.55, 96, 15.2993, 74.1240),
('Jaisalmer', 'India', 'West India', 'The Golden City — a sandcastle fortress rising from the Thar Desert.', 0.35, 87, 26.9157, 70.9083),
('Mount Abu', 'India', 'West India', 'Rajasthan''s only hill station — Dilwara Temples carved in exquisite marble.', 0.30, 75, 24.5926, 72.7156),
('Kutch', 'India', 'West India', 'The White Desert — Rann of Kutch''s otherworldly salt marshes under starlit skies.', 0.30, 80, 23.7337, 69.8597),
('Lonavala', 'India', 'West India', 'Mumbai''s misty hill escape — waterfalls, ancient caves, and panoramic valley views.', 0.35, 78, 18.7546, 73.4062),

-- International (Top 8)
('Paris', 'France', 'International', 'The City of Light — iconic for the Eiffel Tower, world-class art, and haute cuisine.', 2.60, 99, 48.8566, 2.3522),
('Bangkok', 'Thailand', 'International', 'A city of contrasts with ornate shrines, street food, and vibrant nightlife.', 0.80, 92, 13.7563, 100.5018),
('Dubai', 'UAE', 'International', 'Ultramodern desert city — luxury shopping, towering skyscrapers, and vibrant nightlife.', 2.80, 93, 25.2048, 55.2708),
('Bali', 'Indonesia', 'International', 'Island paradise — volcanic mountains, rice paddies, beaches and coral reefs.', 0.70, 95, -8.3405, 115.0919),
('Singapore', 'Singapore', 'International', 'Garden city-state — efficient, diverse cuisine, and futuristic architecture.', 2.50, 90, 1.3521, 103.8198),
('Tokyo', 'Japan', 'International', 'Ultra-modern meets traditional — neon-lit streets and ancient temples.', 2.20, 98, 35.6895, 139.6917),
('London', 'UK', 'International', 'Historic and cosmopolitan — Big Ben, the Thames, and world-class museums.', 2.70, 96, 51.5074, -0.1278),
('New York', 'USA', 'International', 'The Big Apple — iconic skyline, Broadway shows, and Central Park.', 2.80, 97, 40.7128, -74.0060)
ON CONFLICT DO NOTHING;

-- ACTIVITIES (India-focused)
INSERT INTO activities (city_id, name, description, category, estimated_cost, duration_hours, rating) VALUES
-- Delhi (id=1)
((SELECT id FROM cities WHERE name='New Delhi'), 'Red Fort Heritage Walk', 'Explore the magnificent Mughal fortress — a UNESCO World Heritage site in Old Delhi.', 'culture', 50, 2.5, 4.8),
((SELECT id FROM cities WHERE name='New Delhi'), 'Old Delhi Street Food Walk', 'Taste legendary paranthas, jalebi, chole bhature, and chaat in the lanes of Chandni Chowk.', 'food', 300, 3.0, 4.9),
((SELECT id FROM cities WHERE name='New Delhi'), 'Humayun''s Tomb & Lotus Temple', 'Visit the grand Mughal tomb and the serene Bahá''í House of Worship shaped like a lotus.', 'sightseeing', 50, 3.0, 4.7),
((SELECT id FROM cities WHERE name='New Delhi'), 'Qutub Minar & Mehrauli Walk', 'Visit India''s tallest minaret and explore the archaeological park at Mehrauli.', 'sightseeing', 40, 2.5, 4.6),

-- Jaipur (id=2)
((SELECT id FROM cities WHERE name='Jaipur'), 'Amber Fort & Elephant Ride', 'Ascend the magnificent hilltop fort with stunning views of Maota Lake below.', 'culture', 500, 3.0, 4.9),
((SELECT id FROM cities WHERE name='Jaipur'), 'Hawa Mahal & City Palace Tour', 'Visit the iconic Palace of Winds and explore the opulent City Palace complex.', 'sightseeing', 200, 3.5, 4.8),
((SELECT id FROM cities WHERE name='Jaipur'), 'Johari Bazaar Shopping', 'Browse precious gemstones, lac bangles, and traditional Rajasthani textiles.', 'shopping', 2000, 2.5, 4.5),

-- Agra (id=3)
((SELECT id FROM cities WHERE name='Agra'), 'Visit Taj Mahal', 'Witness the breathtaking ivory-white marble mausoleum at sunrise — a monument to eternal love.', 'sightseeing', 50, 3.0, 5.0),
((SELECT id FROM cities WHERE name='Agra'), 'Agra Fort Exploration', 'Explore the massive red sandstone fort with views of the Taj Mahal across the Yamuna.', 'culture', 50, 2.0, 4.7),

-- Varanasi (id=4)
((SELECT id FROM cities WHERE name='Varanasi'), 'Ganga Aarti at Dashashwamedh Ghat', 'Experience the mesmerizing evening fire ceremony on the banks of the Ganges.', 'culture', 0, 1.5, 4.9),
((SELECT id FROM cities WHERE name='Varanasi'), 'Sunrise Boat Ride on the Ganges', 'Witness the ancient city awaken from the water as the sun rises over the ghats.', 'sightseeing', 200, 2.0, 4.9),

-- Goa (id=20)
((SELECT id FROM cities WHERE name='Goa'), 'Old Goa Heritage Churches Tour', 'Visit the Basilica of Bom Jesus and Se Cathedral — Portuguese colonial gems.', 'culture', 0, 2.5, 4.6),
((SELECT id FROM cities WHERE name='Goa'), 'Dudhsagar Waterfall Trek', 'Trek through lush forests to one of India''s tallest four-tiered waterfalls.', 'adventure', 800, 6.0, 4.8),
((SELECT id FROM cities WHERE name='Goa'), 'Scuba Diving at Grande Island', 'Dive into the Arabian Sea to explore coral reefs and marine life.', 'adventure', 3500, 4.0, 4.7),

-- Alleppey/Kerala (id=16)
((SELECT id FROM cities WHERE name='Alleppey'), 'Backwater Houseboat Cruise', 'Glide through Kerala''s serene backwaters on a traditional kettuvallam houseboat.', 'sightseeing', 5000, 24.0, 4.9),
((SELECT id FROM cities WHERE name='Alleppey'), 'Kerala Cooking Class', 'Learn to make authentic Kerala dishes — fish curry, appam, and payasam.', 'food', 800, 3.0, 4.7),

-- Mumbai (id=9)
((SELECT id FROM cities WHERE name='Mumbai'), 'Gateway of India & Colaba Walk', 'Explore Mumbai''s iconic waterfront monument and the vibrant Colaba Causeway.', 'sightseeing', 0, 2.5, 4.6),
((SELECT id FROM cities WHERE name='Mumbai'), 'Mumbai Street Food Trail', 'Taste vada pav, pav bhaji, bhel puri, and cutting chai across the city.', 'food', 300, 3.0, 4.9),
((SELECT id FROM cities WHERE name='Mumbai'), 'Bollywood Studio Tour', 'Go behind the scenes of India''s legendary film industry at Film City.', 'culture', 600, 4.0, 4.5),

-- International activities
((SELECT id FROM cities WHERE name='Paris'), 'Eiffel Tower Visit', 'Ascend the iconic iron lady for breathtaking views of Paris.', 'sightseeing', 2500, 2.5, 4.9),
((SELECT id FROM cities WHERE name='Paris'), 'Louvre Museum Tour', 'Explore the world''s largest art museum — home to the Mona Lisa.', 'culture', 1500, 4.0, 4.8),
((SELECT id FROM cities WHERE name='Bangkok'), 'Grand Palace & Wat Phra Kaew', 'Explore Thailand''s most sacred temple complex.', 'culture', 500, 3.0, 4.8),
((SELECT id FROM cities WHERE name='Bangkok'), 'Floating Market & Street Food', 'Boat through markets and taste Bangkok''s legendary pad thai.', 'food', 600, 4.0, 4.7),
((SELECT id FROM cities WHERE name='Dubai'), 'Burj Khalifa Observation Deck', 'View Dubai from the world''s tallest building at 828 meters.', 'sightseeing', 3000, 2.0, 4.8),
((SELECT id FROM cities WHERE name='Bali'), 'Uluwatu Temple Sunset & Kecak Dance', 'Watch the dramatic Kecak fire dance at clifftop temple during sunset.', 'culture', 500, 3.0, 4.9),
((SELECT id FROM cities WHERE name='Tokyo'), 'Senso-ji Temple & Asakusa', 'Explore Tokyo''s oldest temple with iconic Thunder Gate.', 'culture', 0, 2.5, 4.8)
ON CONFLICT DO NOTHING;

-- SAMPLE TRIPS for Arjun (user_id=2)
INSERT INTO trips (user_id, title, description, start_date, end_date, total_budget, spent_amount, status, is_public, share_token) VALUES
(2, 'Rajasthan Royal Trail', 'Exploring the land of kings — forts, palaces, and desert safaris across Rajasthan', '2026-04-15', '2026-04-28', 45000.00, 28500.00, 'ongoing', true, 'arjun-rajasthan-2026'),
(2, 'Kerala Backwaters & Spice Trail', 'Houseboats, hill stations, and the flavors of God''s Own Country', '2026-08-01', '2026-08-12', 35000.00, 0.00, 'upcoming', false, 'arjun-kerala-2026')
ON CONFLICT DO NOTHING;

-- SAMPLE TRIPS for Priya (user_id=3)
INSERT INTO trips (user_id, title, description, start_date, end_date, total_budget, spent_amount, status, is_public, share_token) VALUES
(3, 'North East India Explorer', 'Monasteries, tea gardens, and living root bridges in India''s hidden gem', '2025-10-01', '2025-10-15', 40000.00, 38500.00, 'completed', true, 'priya-northeast-2025'),
(3, 'Goa Beach & Heritage Getaway', 'Sun, sand, Portuguese architecture, and Goan cuisine', '2026-12-20', '2026-12-30', 25000.00, 0.00, 'upcoming', false, 'priya-goa-2026')
ON CONFLICT DO NOTHING;

-- TRIP STOPS for Arjun's Rajasthan Trip
INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, notes)
SELECT t.id, c.id, 1, '2026-04-15', '2026-04-19', 'Stay at heritage haveli near Hawa Mahal'
FROM trips t, cities c WHERE t.share_token = 'arjun-rajasthan-2026' AND c.name = 'Jaipur'
ON CONFLICT DO NOTHING;

INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, notes)
SELECT t.id, c.id, 2, '2026-04-19', '2026-04-23', 'Lake Palace views and sunset at Sajjangarh'
FROM trips t, cities c WHERE t.share_token = 'arjun-rajasthan-2026' AND c.name = 'Udaipur'
ON CONFLICT DO NOTHING;

INSERT INTO trip_stops (trip_id, city_id, stop_order, arrival_date, departure_date, notes)
SELECT t.id, c.id, 3, '2026-04-23', '2026-04-28', 'Desert safari and fort exploration'
FROM trips t, cities c WHERE t.share_token = 'arjun-rajasthan-2026' AND c.name = 'Jaisalmer'
ON CONFLICT DO NOTHING;

-- EXPENSES for Arjun's trip (INR)
INSERT INTO expenses (trip_id, category, description, amount, currency, expense_date)
SELECT t.id, 'hotel', 'Heritage Haveli Jaipur 4 nights', 8000.00, 'INR', '2026-04-15'
FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO expenses (trip_id, category, description, amount, currency, expense_date)
SELECT t.id, 'transport', 'Jaipur to Udaipur AC bus', 1200.00, 'INR', '2026-04-19'
FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO expenses (trip_id, category, description, amount, currency, expense_date)
SELECT t.id, 'food', 'Dal Baati Churma & street food', 1500.00, 'INR', '2026-04-17'
FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO expenses (trip_id, category, description, amount, currency, expense_date)
SELECT t.id, 'activity', 'Amber Fort entry & guide', 800.00, 'INR', '2026-04-16'
FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

-- PACKING ITEMS
INSERT INTO packing_items (trip_id, item_name, category, is_packed)
SELECT t.id, 'Passport & Aadhaar Card', 'documents', true FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO packing_items (trip_id, item_name, category, is_packed)
SELECT t.id, 'Sunscreen SPF 50', 'toiletries', true FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO packing_items (trip_id, item_name, category, is_packed)
SELECT t.id, 'Cotton kurtas x3', 'clothing', false FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO packing_items (trip_id, item_name, category, is_packed)
SELECT t.id, 'Power bank & charger', 'electronics', true FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO packing_items (trip_id, item_name, category, is_packed)
SELECT t.id, 'First aid kit', 'medicine', true FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

-- NOTES
INSERT INTO trip_notes (trip_id, title, content, note_type)
SELECT t.id, 'Jaipur Haveli Booking', 'Booking ref: JPR-2026-8821. Check-in after 1pm. Rooftop restaurant with fort view. AC rooms.', 'hotel'
FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

-- COMMUNITY POSTS
INSERT INTO community_posts (trip_id, user_id, title, description, likes_count, views_count, is_featured)
SELECT t.id, t.user_id, 'Rajasthan Royal Trail — Forts, Palaces & Desert Magic', 'Exploring Jaipur, Udaipur, and Jaisalmer under ₹45,000 — heritage havelis, desert safaris, and unforgettable food!', 67, 412, true
FROM trips t WHERE t.share_token = 'arjun-rajasthan-2026';

INSERT INTO community_posts (trip_id, user_id, title, description, likes_count, views_count, is_featured)
SELECT t.id, t.user_id, 'North East India — Hidden Paradise Beyond Imagination', 'Monasteries in Gangtok, tea gardens in Darjeeling, and living root bridges in Meghalaya — 15 days of pure wonder', 93, 624, true
FROM trips t WHERE t.share_token = 'priya-northeast-2025';
