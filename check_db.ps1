$collections = @('submissions', 'residents', 'logs', 'tasks', 'videos', 'campaigns', 'mous', 'publications', 'templates', 'archives', 'events', 'warga', 'admins')

foreach ($col in $collections) {
    try {
        $url = "http://localhost:3000/api/check/$col"
        $response = Invoke-RestMethod -Uri $url -Method GET -ErrorAction Stop
        Write-Host "$col : $($response.count) dokumen" -ForegroundColor Green
    } catch {
        Write-Host "$col : endpoint belum ada" -ForegroundColor Yellow
    }
}
