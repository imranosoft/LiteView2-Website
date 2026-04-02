$realId = "G-19C759YR5X"
$folder = "E:\OneDrive\C++\LiteView2\Docs\Documentation\HTML Style Marketing Litrature"
$files  = @("index.htm","landing.html","iliteview2ctrl.html","ibrowserpool.html","events.html","enums.html")

foreach ($f in $files) {
    $path    = Join-Path $folder $f
    $content = Get-Content $path -Raw -Encoding UTF8
    $updated = $content -replace "G-XXXXXXXXXX", $realId
    Set-Content $path $updated -Encoding UTF8
    Write-Host "Updated: $f"
}

Write-Host "`nDone! All files updated with $realId"
