-- ============================================================
--  TRAVELOOP SEED DATA  (idempotent – safe to re-run)
-- ============================================================

-- CITIES (32 destinations with real Unsplash image URLs)
INSERT INTO cities (name, country, region, description, image_url, cost_index, popularity_score, latitude, longitude)
VALUES
  ('Paris',      'France',       'International', 'The city of love, light and world-class cuisine. Home to the Eiffel Tower and Louvre.',                    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', 2.5, 99, 48.8566, 2.3522),
  ('Mumbai',     'India',        'South India',   'India''s financial capital—Bollywood, street food, colonial architecture and the Arabian Sea.',               'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800', 0.8, 98, 19.0760, 72.8777),
  ('Tokyo',      'Japan',        'International', 'Hyper-modern metropolis blending neon-lit skyscrapers with ancient shrines and sushi culture.',              'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', 2.8, 97, 35.6762, 139.6503),
  ('New Delhi',  'India',        'North India',   'India''s sprawling capital city with Mughal forts, spice markets and the iconic India Gate.',                 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800', 0.6, 96, 28.6139, 77.2090),
  ('Dubai',      'UAE',          'International', 'Futuristic skyline, gold souks, desert safaris and the world''s tallest building.',                           'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', 3.0, 95, 25.2048, 55.2708),
  ('Bali',       'Indonesia',    'International', 'Tropical paradise of rice terraces, Hindu temples, surf beaches and vibrant nightlife.',                     'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', 0.9, 94, -8.3405, 115.0920),
  ('Rome',       'Italy',        'International', 'The Eternal City—Colosseum, Vatican, gelato and a living museum of Western civilisation.',                   'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', 2.4, 93, 41.9028, 12.4964),
  ('Goa',        'India',        'South India',   'India''s beach capital—golden sands, Portuguese heritage, cashew feni and electronic music festivals.',       'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', 0.7, 92, 15.2993, 74.1240),
  ('Jaipur',     'India',        'North India',   'The Pink City—Amber Fort, Hawa Mahal and the royal bazaars of Rajasthan.',                                   'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800', 0.5, 91, 26.9124, 75.7873),
  ('New York',   'USA',          'International', 'The city that never sleeps—Times Square, Central Park, world-class museums and food from every nation.',      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', 3.2, 90, 40.7128, -74.0060),
  ('Bangkok',    'Thailand',     'International', 'Street food heaven, golden temples, rooftop bars and floating markets along the Chao Phraya.',               'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', 0.8, 89, 13.7563, 100.5018),
  ('Udaipur',    'India',        'North India',   'The City of Lakes—marble palaces reflected in serene waters, Rajput heritage at its finest.',                'https://images.unsplash.com/photo-1604867280140-f9eb42665756?w=800', 0.6, 88, 24.5854, 73.7125),
  ('Singapore',  'Singapore',    'International', 'Gleaming Gardens by the Bay, hawker centres, Marina Bay Sands and multicultural heritage.',                  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', 2.9, 87, 1.3521, 103.8198),
  ('Varanasi',   'India',        'North India',   'The spiritual heart of India—ancient ghats, evening aartis on the Ganges and millennia of tradition.',       'https://images.unsplash.com/photo-1561361058-c24e72e4aaa1?w=800', 0.4, 86, 25.3176, 82.9739),
  ('Barcelona',  'Spain',        'International', 'Gaudí masterpieces, La Rambla, tapas bars and world-famous FC Barcelona culture.',                            'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', 2.3, 85, 41.3851, 2.1734),
  ('Manali',     'India',        'North India',   'Himalayan gateway—snow-capped peaks, adventure sports and the Rohtang Pass.',                                 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 0.5, 84, 32.2432, 77.1892),
  ('Sydney',     'Australia',    'International', 'Iconic Opera House, Bondi Beach, harbour walks and the laid-back Australian way of life.',                   'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800', 3.1, 83, -33.8688, 151.2093),
  ('Kolkata',    'India',        'East India',    'The cultural capital of India—Victoria Memorial, Durga Puja, Rabindra Sangeet and hand-pulled rickshaws.',   'https://images.unsplash.com/photo-1558431382-27e303142255?w=800', 0.4, 82, 22.5726, 88.3639),
  ('Amsterdam',  'Netherlands',  'International', 'Canal rings, cycling culture, Van Gogh Museum, tulip fields and Dutch architecture.',                        'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', 2.6, 81, 52.3676, 4.9041),
  ('Coorg',      'India',        'South India',   'Scotland of India—misty coffee plantations, waterfalls and Kodava culture in the Western Ghats.',            'https://images.unsplash.com/photo-1622471185460-aa10f8a38c0b?w=800', 0.6, 80, 12.3375, 75.8069),
  ('Istanbul',   'Turkey',       'International', 'Where East meets West—Hagia Sophia, the Grand Bazaar, Bosphorus cruises and Turkish delight.',              'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', 1.5, 79, 41.0082, 28.9784),
  ('Darjeeling', 'India',        'East India',    'The Queen of the Hills—Himalayan views, world-famous tea gardens and the toy train to Ghum.',               'https://images.unsplash.com/photo-1567494772-1e3f3f3f3f3f?w=800', 0.4, 78, 27.0360, 88.2627),
  ('London',     'UK',           'International', 'Big Ben, Buckingham Palace, the Thames, world-class theatre and the British Museum.',                        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800', 3.3, 77, 51.5074, -0.1278),
  ('Pondicherry','India',        'South India',   'French Quarter cafés, pristine beaches, Sri Aurobindo Ashram and a unique Franco-Tamil culture.',            'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800', 0.5, 76, 11.9416, 79.8083),
  ('Kyoto',      'Japan',        'International', 'Japan''s former imperial capital—geisha districts, bamboo groves and a thousand Buddhist temples.',           'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', 2.6, 75, 35.0116, 135.7681),
  ('Chennai',    'India',        'South India',   'Gateway to South India—Marina Beach, Kapaleeshwarar Temple, classical Carnatic music and filter coffee.',    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800', 0.5, 74, 13.0827, 80.2707),
  ('Maldives',   'Maldives',     'International', 'Crystal-clear lagoons, overwater bungalows, coral reefs and breathtaking sunsets in the Indian Ocean.',     'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', 3.5, 73, 3.2028, 73.2207),
  ('Amritsar',   'India',        'North India',   'Home of the awe-inspiring Golden Temple, Wagah Border ceremony and rich Punjabi culture.',                   'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800', 0.4, 72, 31.6340, 74.8723),
  ('Lisbon',     'Portugal',     'International', 'Fado music, tram rides, Pastéis de Belém and pastel-coloured hillside neighbourhoods.',                      'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800', 2.0, 71, 38.7169, -9.1395),
  ('Leh',        'India',        'North India',   'High-altitude desert kingdom—monasteries, the Pangong Lake, stargazing and extreme adventure.',              'https://images.unsplash.com/photo-1591018119544-a5e7d4009a81?w=800', 0.6, 70, 34.1526, 77.5771),
  ('Agra',       'India',        'North India',   'The timeless Taj Mahal, Agra Fort and Fatehpur Sikri—heart of Mughal splendour.',                            'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800', 0.5, 69, 27.1767, 78.0081),
  ('Hyderabad',  'India',        'South India',   'City of Nizams—Charminar, biryani, Golconda Fort and a booming IT corridor.',                                'https://images.unsplash.com/photo-1598977123118-4e30ba3a4f6d?w=800', 0.5, 68, 17.3850, 78.4867)
ON CONFLICT DO NOTHING;

-- ACTIVITIES per city (sample for top 5 cities)
INSERT INTO activities (city_id, name, description, category, estimated_cost, duration_hours, rating)
SELECT c.id, a.name, a.description, a.category, a.cost, a.duration, a.rating
FROM (VALUES
  ('Paris', 'Eiffel Tower Visit',       'Ascend the iconic iron lattice tower for panoramic views of Paris.',          'activity',   28,  3.0, 4.9),
  ('Paris', 'Louvre Museum Tour',       'Explore over 35,000 artworks including the Mona Lisa and Venus de Milo.',   'activity',   20,  4.0, 4.8),
  ('Paris', 'Seine River Cruise',       'Glide past Notre-Dame, Musée d''Orsay and the bridges of Paris.',            'activity',   15,  1.5, 4.7),
  ('Paris', 'Le Jules Verne Dinner',    'Michelin-starred dining inside the Eiffel Tower.',                           'meal',      250,  2.5, 4.9),
  ('Tokyo', 'Shibuya Crossing Walk',   'Experience the world''s busiest pedestrian scramble crossing.',              'activity',    0,  1.0, 4.6),
  ('Tokyo', 'Tsukiji Outer Market',    'Fresh sushi, sashimi and Japanese street food at the famous fish market.',   'meal',       25,  2.0, 4.7),
  ('Tokyo', 'teamLab Borderless',      'Immersive digital art museum with ever-changing light installations.',       'activity',   32,  3.0, 4.9),
  ('Tokyo', 'Shinkansen to Kyoto',     'Ride Japan''s famous bullet train—330 km/h through Mount Fuji views.',       'transport',  80,  2.5, 4.8),
  ('Dubai', 'Burj Khalifa At the Top', 'Visit floor 124/125 of the world''s tallest building.',                     'activity',   40,  2.0, 4.8),
  ('Dubai', 'Desert Safari',           'Dune bashing, camel ride and Bedouin dinner under the stars.',               'activity',   75,  6.0, 4.9),
  ('Dubai', 'Dubai Mall & Aquarium',   'World''s largest mall, indoor aquarium and ice rink.',                       'activity',   25,  4.0, 4.6),
  ('Jaipur','Amber Fort Tour',         'Explore the 16th-century hilltop fortress with elephant ride option.',       'activity',   15,  3.0, 4.8),
  ('Jaipur','Hawa Mahal Visit',        'The iconic Palace of Winds with its 953 small windows.',                    'activity',    3,  1.5, 4.5),
  ('Jaipur','Jaipur Walled City Walk', 'Guided walk through bazaars, temples and the vibrant old city.',            'activity',   10,  2.5, 4.7),
  ('Goa',  'Anjuna Flea Market',       'Famous Saturday market for handicrafts, jewellery and Goan snacks.',        'activity',    0,  3.0, 4.4),
  ('Goa',  'Dudhsagar Falls Hike',     'Trek to one of India''s tallest waterfalls through the Goa forest.',        'activity',   20,  5.0, 4.7),
  ('Goa',  'Spice Plantation Tour',    'Guided tour of a working spice farm with a Goan lunch.',                    'activity',   18,  3.5, 4.5)
) AS a(city, name, description, category, cost, duration, rating)
JOIN cities c ON c.name = a.city
ON CONFLICT DO NOTHING;
