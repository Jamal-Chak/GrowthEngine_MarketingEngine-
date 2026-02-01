import http.client
import json
import time

# Generate unique email
timestamp = str(int(time.time()))
test_email = f"apitest{timestamp}@example.com"

print("=== Testing Complete Flow ===\n")

# Step 1: Register
print("1. Testing Registration...")
conn = http.client.HTTPConnection("localhost", 5000)
headers = {'Content-Type': 'application/json'}
reg_data = json.dumps({
    "email": test_email,
    "password": "TestPass123!",
    "orgName": "Test Organization"
})

conn.request("POST", "/api/auth/register", reg_data, headers)
res = conn.getresponse()
reg_response = json.loads(res.read().decode())

if res.status == 201:
    print(f"   ✓ Registration successful!")
    print(f"   User ID: {reg_response['_id']}")
    token = reg_response['token']
else:
    print(f"   ✗ Registration failed: {reg_response}")
    exit(1)

# Step 2: Onboarding
print("\n2. Testing Onboarding...")
onboard_headers = {
    'Content-Type': 'application/json',
    'Authorization': f"Bearer {token}"
}
onboard_data = json.dumps({
    "businessType": "SaaS",
    "goal": "Revenue Growth",
    "channel": "Web"
})

conn.request("POST", "/api/onboarding/complete", onboard_data, onboard_headers)
res = conn.getresponse()
onboard_response = json.loads(res.read().decode())

if res.status == 200:
    print(f"   ✓ Onboarding successful!")
    if 'mission' in onboard_response:
        print(f"   ✓ Mission created: {onboard_response['mission']['title']}")
    else:
        print(f"   ⚠ No mission in response")
else:
    print(f"   ✗ Onboarding failed: {onboard_response}")

# Step 3: Get Missions
print("\n3. Testing Mission Retrieval...")
conn.request("GET", "/api/missions", "", onboard_headers)
res = conn.getresponse()
missions_response = json.loads(res.read().decode())

if res.status == 200:
    print(f"   ✓ Missions retrieved: {len(missions_response)} found")
    for mission in missions_response:
        print(f"     - [{mission['status']}] {mission['title']}")
else:
    print(f"   ✗ Mission retrieval failed")

print("\n=== All Tests Complete ===")
conn.close()
