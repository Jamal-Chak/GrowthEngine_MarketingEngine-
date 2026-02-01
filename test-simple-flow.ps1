$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "complete$timestamp@example.com"

Write-Host "=== Complete Onboarding Flow Test ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register
Write-Host "Step 1: Registration..." -ForegroundColor Yellow
$regBody = @{email=$testEmail; password="TestPass123!"; orgName="Test Org"} | ConvertTo-Json

try {
    $regResp = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' -Method POST -Body $regBody -ContentType 'application/json'
    $regData = $regResp.Content | ConvertFrom-Json
    Write-Host "  ✓ User registered: $($regData._id)" -ForegroundColor Green
    $token = $regData.token
} catch {
    Write-Host "  ✗ Registration failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Onboarding
Write-Host "Step 2: Onboarding..." -ForegroundColor Yellow
$onboardBody = @{businessType="SaaS"; goal="Revenue Growth"; channel="Web"} | ConvertTo-Json
$headers = @{'Authorization'="Bearer $token"; 'Content-Type'='application/json'}

try {
    $onboardResp = Invoke-WebRequest -Uri 'http://localhost:5000/api/onboarding/complete' -Method POST -Headers $headers -Body $onboardBody
    $onboardData = $onboardResp.Content | ConvertFrom-Json
    Write-Host "  ✓ Onboarding complete!" -ForegroundColor Green
    if ($onboardData.mission) {
        Write-Host "  ✓ Mission created: $($onboardData.mission.title)" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Onboarding failed!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 3: Get missions
Write-Host "Step 3: Fetching missions..." -ForegroundColor Yellow
try {
    $missionsResp = Invoke-WebRequest -Uri 'http://localhost:5000/api/missions' -Method GET -Headers $headers
    $missions = $missionsResp.Content | ConvertFrom-Json
    Write-Host "  ✓ Found $($missions.Count) mission(s)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Failed to fetch missions" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
