$testEmail = "debug@example.com"

try {
    $body = @{
        email = $testEmail
        password = "Test123!"
        orgName = "Test Org"
    } | ConvertTo-Json

    Write-Host "Request Body:" -ForegroundColor Yellow
    Write-Host $body
    Write-Host ""

    $response = Invoke-WebRequest `
        -Uri 'http://localhost:5000/api/auth/register' `
        -Method POST `
        -Body $body `
        -ContentType 'application/json'

    Write-Host "Success!" -ForegroundColor Green
    Write-Host $response.Content
    
} catch {
    Write-Host "Error Details:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Error Response:" -ForegroundColor Yellow
        Write-Host $responseBody
    }
}
