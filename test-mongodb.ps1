$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "mongotest$timestamp@example.com"

Write-Host "Testing MongoDB Connection via Registration..." -ForegroundColor Cyan

try {
    # Test user registration
    $registerBody = @{
        email = $testEmail
        password = "TestPass123!"
        orgName = "Test Org"
    } | ConvertTo-Json

    Write-Host "Attempting registration for: $testEmail" -ForegroundColor Yellow
    
    $response = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/auth/register' `
        -Method POST `
        -Body $registerBody `
        -ContentType 'application/json' `
        -ErrorAction Stop

    $data = $response.Content | ConvertFrom-Json
    
    Write-Host "`n✓ SUCCESS! MongoDB is connected and working!" -ForegroundColor Green
    Write-Host "User created with ID: $($data._id)" -ForegroundColor Green
    Write-Host "`nMongoDB Atlas connection verified!" -ForegroundColor Green
    
} catch {
    Write-Host "`n✗ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Yellow
    }
}
