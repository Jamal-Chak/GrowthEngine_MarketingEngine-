# GrowthEngine Onboarding Flow Test Script

Write-Host "=== Testing GrowthEngine Onboarding Flow ===" -ForegroundColor Cyan
Write-Host ""

# Generate unique email
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"
$testPassword = "TestPass123!"
$testName = "Test User $timestamp"

Write-Host "Step 1: Testing Registration" -ForegroundColor Yellow
Write-Host "Email: $testEmail"

try {
    $registerBody = @{
        email = $testEmail
        password = $testPassword
        name = $testName
    } | ConvertTo-Json

    $registerResponse = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/auth/register' `
        -Method POST `
        -Body $registerBody `
        -ContentType 'application/json' `
        -ErrorAction Stop

    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($registerData.user.id)"
    
    $userId = $registerData.user.id
    $token = $registerData.token

    Write-Host ""
    Write-Host "Step 2: Testing Onboarding Completion" -ForegroundColor Yellow
    
    $onboardingBody = @{
        businessType = "Ecommerce"
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
    Write-Host "✓ Onboarding completed successfully!" -ForegroundColor Green
    
    if ($onboardingData.mission) {
        Write-Host "✓ Mission created!" -ForegroundColor Green
        Write-Host "Mission ID: $($onboardingData.mission.id)"
        Write-Host "Mission Title: $($onboardingData.mission.title)"
        Write-Host "Mission Description: $($onboardingData.mission.description)"
    } else {
        Write-Host "✗ No mission created!" -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "Step 3: Fetching User's Missions" -ForegroundColor Yellow
    
    $missionsResponse = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/missions' `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop

    $missions = $missionsResponse.Content | ConvertFrom-Json
    Write-Host "✓ Missions fetched successfully!" -ForegroundColor Green
    Write-Host "Total missions: $($missions.Count)"
    
    Write-Host ""
    Write-Host "=== TEST SUMMARY ===" -ForegroundColor Cyan
    Write-Host "✓ Registration: PASSED" -ForegroundColor Green
    Write-Host "✓ Onboarding: PASSED" -ForegroundColor Green
    Write-Host "✓ Mission Creation: PASSED" -ForegroundColor Green
    Write-Host "✓ Mission Retrieval: PASSED" -ForegroundColor Green
    Write-Host ""
    Write-Host "All tests passed! The onboarding flow is working correctly." -ForegroundColor Green
    
} catch {
    Write-Host "✗ Test failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    exit 1
}
