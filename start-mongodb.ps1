$dataPath = Join-Path $PSScriptRoot "data"
Write-Host "Starting MongoDB with data path: $dataPath"
mongod --dbpath $dataPath --port 27017
