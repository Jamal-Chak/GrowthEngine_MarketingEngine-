# Complete Onboarding Flow Test
# Tests registration → onboarding → mission creation with MongoDB Atlas

Write-Host "=== GrowthEngine Complete Flow Test ===" -ForegroundColor Cyan
Write-Host ""

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "flowtest$timestamp@example.com"
$testPassword = "TestPass123!"
$testOrgName = "Test Organization $timestamp"

$allPassed = $true

# ============================================
# TEST 1: User Registration
# ============================================
Write-Host "TEST 1: User Registration" -ForegroundColor Yellow
Write-Host "Email: $testEmail" -ForegroundColor Gray

try {
    $registerBody = @{
        email = $testEmail
        password = $testPassword
        orgName = $testOrgName
    } | ConvertTo-Json

    $registerResponse = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/auth/register' `
        -Method POST `
        -Body $registerBody `
        -ContentType 'application/json' `
        -ErrorAction Stop

    $userData = $registerResponse.Content | ConvertFrom-Json
    
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "  User ID: $($userData._id)" -ForegroundColor Gray
    Write-Host "  Token: $($userData.token.Substring(0,20))..." -ForegroundColor Gray
    
    $userId = $userData._id
    $token = $userData.token
    
} catch {
    Write-Host "✗ Registration FAILED!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
    $allPassed = $false
    exit 1
}

Write-Host ""

# ============================================
# TEST 2: Onboarding Completion
# ============================================
Write-Host "TEST 2: Onboarding Completion" -ForegroundColor Yellow

try {
    $onboardingBody = @{
        businessType = "SaaS"
        goal = "Revenue Growth"
        channel = "Web"
    } | ConvertTo-Json

    $headers = @{
        'Authorization' = "Bearer $token"
        'Content-Type' = 'application/json'
    }

    $onboardingResponse = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/onboarding/complete' `
        -Method POST `
        -Headers $headers `
        -Body $onboardingBody `
        -ErrorAction Stop

    $onboardingData = $onboardingResponse.Content | ConvertFrom-Json
    
    Write-Host "✓ Onboarding completed!" -ForegroundColor Green
    
    if ($onboardingData.mission) {
        Write-Host "✓ Mission created!" -ForegroundColor Green
        Write-Host "  Mission ID: $($onboardingData.mission.id)" -ForegroundColor Gray
        Write-Host "  Title: $($onboardingData.mission.title)" -ForegroundColor Gray
        
        $missionId = $onboardingData.mission.id
    } else {
        Write-Host "✗ No mission in response!" -ForegroundColor Red
        $allPassed = $false
    }
    
} catch {
    Write-Host "✗ Onboarding FAILED!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "  Response: $responseBody" -ForegroundColor Red
    }
    $allPassed = $false
}

Write-Host ""

# ============================================
# TEST 3: Fetch User Missions
# ============================================
Write-Host "TEST 3: Fetch User Missions" -ForegroundColor Yellow

try {
    $missionsResponse = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/missions' `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop

    $missions = $missionsResponse.Content | ConvertFrom-Json
    
    Write-Host "✓ Missions retrieved!" -ForegroundColor Green
    Write-Host "  Total missions: $($missions.Count)" -ForegroundColor Gray
    
    if ($missions.Count -gt 0) {
        foreach ($mission in $missions) {
            Write-Host "  - [$($mission.status)] $($mission.title)" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠ No missions found!" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "✗ Mission fetch FAILED!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""

# ============================================
# TEST 4: Login Test
# ============================================
Write-Host "TEST 4: Login Test" -ForegroundColor Yellow

try {
    $loginBody = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/auth/login' `
        -Method POST `
        -Body $loginBody `
        -ContentType 'application/json' `
        -ErrorAction Stop

    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  User ID: $($loginData._id)" -ForegroundColor Gray
    
} catch {
    Write-Host "✗ Login FAILED!" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

if ($allPassed) {
    Write-Host "✓ ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host ""
    Write-Host "MongoDB Atlas Integration: ✓ WORKING" -ForegroundColor Green
    Write-Host "Onboarding Flow: ✓ WORKING" -ForegroundColor Green
    Write-Host "Data Persistence: ✓ WORKING" -ForegroundColor Green
} else {
    Write-Host "✗ SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "Check the errors above for details" -ForegroundColor Yellow
}

Write-Host ""
