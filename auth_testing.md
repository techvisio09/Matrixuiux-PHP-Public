# Auth Testing Playbook

## JWT Email/Password Auth
Step 1: MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
db.users.findOne({role: "admin"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, indexes exist on users.email (unique), login_attempts.identifier.

Step 2: API Testing
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"<ADMIN_EMAIL>","password":"<ADMIN_PASSWORD>"}'
cat cookies.txt
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login should return the user object and set `access_token` + `refresh_token` cookies. The `/me` call should return the same user using those cookies.

## Emergent Google Auth (session_token)
Step 1: Create Test User & Session
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({user_id: userId, email: 'test.user.' + Date.now() + '@example.com', name: 'Test User', picture: '', created_at: new Date()});
db.user_sessions.insertOne({user_id: userId, session_token: sessionToken, expires_at: new Date(Date.now() + 7*24*60*60*1000), created_at: new Date()});
print('Session token: ' + sessionToken);
"
```
Step 2: Test Backend API
```
curl -X GET "<BASE_URL>/api/auth/me" -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```
Step 3: Browser Testing — set `session_token` cookie (httpOnly, secure, sameSite None) then load the app; protected pages must render without redirect.

Success: /api/auth/me returns user data; account page loads. Failure: 401s, redirect to login.
