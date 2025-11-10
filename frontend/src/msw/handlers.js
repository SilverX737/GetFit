import { http, HttpResponse } from 'msw';

// Simple in-memory mock state for dev
let MOCK_TOKEN = 'fake.jwt.token';
const MOCK_USER = { id: 1, email: 'demo@x.com', profile: { path: 'Weightlifting', current_program_id: null, current_program_day: 0, pushup_step: 0, pullup_step: 0, squat_step: 0, goal: 'Build Muscle', experience: 'Beginner (0-1 year)' } };

export const handlers = [
  http.post('http://localhost:3000/api/auth/register', async ({ request }) => {
    const { email, password, goal, experience, path } = await request.json();
    // Simulate duplicate email check
    if (email === 'demo@x.com') {
      return new HttpResponse(JSON.stringify({ error: { message: 'Email already exists' } }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }
    // Update mock user state for the new registration
    MOCK_USER.id = 2;
    MOCK_USER.email = email;
    MOCK_USER.profile.goal = goal;
    MOCK_USER.profile.experience = experience;
    MOCK_USER.profile.path = path;
    // Return created user (without password_hash)
    return HttpResponse.json({ id: 2, email, created_at: new Date().toISOString(), profile: { goal, experience, path } }, { status: 201 });
  }),

  http.post('http://localhost:3000/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json();
    // Accept demo credentials or the currently registered user's email (any password for mocks)
    if (email === 'demo@x.com' && password === 'demo') {
      return HttpResponse.json({ token: MOCK_TOKEN, user: { id: 1, email: 'demo@x.com' } });
    }
    if (email === MOCK_USER.email) {
      return HttpResponse.json({ token: MOCK_TOKEN, user: { id: MOCK_USER.id, email: MOCK_USER.email } });
    }
    return new HttpResponse(JSON.stringify({ error: { message: 'Invalid credentials' } }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }),

  http.get('http://localhost:3000/api/me', async ({ request }) => {
    const auth = request.headers.get('authorization') || '';
    if (!auth.includes('Bearer')) {
      return new HttpResponse(JSON.stringify({ error: { message: 'Unauthorized' } }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    return HttpResponse.json(MOCK_USER);
  }),

  http.get('http://localhost:3000/api/programs', () => {
    return HttpResponse.json([
      { id: 1, name: 'Beginner Linear Progression (3-Day)', path: 'Weightlifting', description: 'Simple 3-day LP.' },
      { id: 2, name: 'Bodyweight Fundamentals', path: 'Calisthenics', description: 'Intro calisthenics.' },
    ]);
  }),

  http.post('http://localhost:3000/api/profile/program', async ({ request }) => {
    const { program_id } = await request.json();
    // Update mock user's current_program_id
    MOCK_USER.profile.current_program_id = program_id;
    MOCK_USER.profile.current_program_day = 0;
    return HttpResponse.json({ current_program_id: program_id, current_program_day: 0 });
  }),
];
