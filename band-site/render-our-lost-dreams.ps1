Remove-Item -Path 'C:\Users\Administrator\kamdridi-site\band-site\public\videos\our-lost-dreams-v1.mp4' -Force -ErrorAction SilentlyContinue
Rename-Item -Path 'C:\Users\Administrator\kamdridi-site\band-site\public\videos\our-lost-dreams-v2.mp4' -NewName 'our-lost-dreams-v1.mp4' -Force

$audio = "C:\Users\Administrator\Downloads\Our Lost Dreams (Unplugged Live).mp3"
$image = "C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784635178900.jpg"
$filter = "C:\Users\Administrator\kamdridi-site\band-site\our-lost-dreams-pro-filter.txt"

$timestamps = @('00:00:30', '00:01:15', '00:02:45', '00:03:30')

for ($i = 0; $i -lt $timestamps.Length; $i++) {
    $vNum = $i + 2
    $ts = $timestamps[$i]
    $out = "C:\Users\Administrator\kamdridi-site\band-site\public\videos\our-lost-dreams-v$vNum.mp4"
    
    Write-Host "Rendering $out at $ts..."
    ffmpeg -y -loop 1 -framerate 30 -i $image -ss $ts -t 10 -i $audio -filter_complex_script $filter -map "[out]" -map 1:a -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k -shortest $out
}
