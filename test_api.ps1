$body = Get-Content "test_submission.json" -Raw
$response = Invoke-RestMethod -Method POST -Uri "http://localhost:3000/api/submissions" -ContentType "application/json" -Body $body
$response | ConvertTo-Json
