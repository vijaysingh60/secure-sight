-- Seed Cameras
INSERT INTO cameras (name, location) VALUES
  ('Shop Floor A', 'Manufacturing Area - Zone A'),
  ('Vault', 'Secure Vault - Level B2'),
  ('Entrance', 'Building Main Entry');

-- Seed Incidents (12+ across 3 types, 24-hour span)
INSERT INTO incidents (camera_id, type, ts_start, ts_end, thumbnail_url, resolved) VALUES
  ((SELECT id FROM cameras WHERE name = 'Entrance'), 'Unauthorised Access', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '59 minutes', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=face&w=400&q=80', false),
  ((SELECT id FROM cameras WHERE name = 'Vault'), 'Gun Threat', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 58 minutes', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=face&w=400&q=80', false),
  ((SELECT id FROM cameras WHERE name = 'Shop Floor A'), 'Face Recognised', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 59 minutes', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=face&w=400&q=80', false),
  ((SELECT id FROM cameras WHERE name = 'Entrance'), 'Gun Threat', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours 58 minutes', 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=face&w=400&q=80', true),
  ((SELECT id FROM cameras WHERE name = 'Vault'), 'Unauthorised Access', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours 59 minutes', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=face&w=400&q=80', false),
  ((SELECT id FROM cameras WHERE name = 'Shop Floor A'), 'Gun Threat', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 58 minutes', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=face&w=400&q=80', true),
  ((SELECT id FROM cameras WHERE name = 'Entrance'), 'Face Recognised', NOW() - INTERVAL '7 hours', NOW() - INTERVAL '6 hours 59 minutes', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=face&w=400&q=80', false),
  ((SELECT id FROM cameras WHERE name = 'Vault'), 'Face Recognised', NOW() - INTERVAL '8 hours', NOW() - INTERVAL '7 hours 58 minutes', 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=face&w=400&q=80', true),
  ((SELECT id FROM cameras WHERE name = 'Shop Floor A'), 'Unauthorised Access', NOW() - INTERVAL '9 hours', NOW() - INTERVAL '8 hours 59 minutes', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=face&w=400&q=80', false),
  ((SELECT id FROM cameras WHERE name = 'Entrance'), 'Gun Threat', NOW() - INTERVAL '10 hours', NOW() - INTERVAL '9 hours 58 minutes', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=face&w=400&q=80', true),
  ((SELECT id FROM cameras WHERE name = 'Vault'), 'Gun Threat', NOW() - INTERVAL '11 hours', NOW() - INTERVAL '10 hours 59 minutes', 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=face&w=400&q=80', false),
  ((SELECT id FROM cameras WHERE name = 'Shop Floor A'), 'Face Recognised', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '11 hours 58 minutes', 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=face&w=400&q=80', true); 