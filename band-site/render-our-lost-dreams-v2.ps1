$audio = "C:\Users\Administrator\Downloads\Our Lost Dreams (Unplugged Live).mp3"
$filter = "C:\Users\Administrator\kamdridi-site\band-site\our-lost-dreams-pro-filter.txt"

$variants = @(
    @{ vNum=2; ts='00:00:30'; img='C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784677823598.jpg' },
    @{ vNum=3; ts='00:01:15'; img='C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784677839204.png' },
    @{ vNum=4; ts='00:02:45'; img='C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784677864595.jpg' },
    @{ vNum=5; ts='00:03:30'; img='C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784677918669.jpg' }
)

foreach ($v in $variants) {
    $out = "C:\Users\Administrator\kamdridi-site\band-site\public\videos\our-lost-dreams-v$($v.vNum).mp4"
    Write-Host "Rendering $out at $($v.ts)..."
    ffmpeg -y -loop 1 -framerate 30 -i $v.img -ss $v.ts -t 10 -i $audio -filter_complex_script $filter -map "[out]" -map 1:a -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 192k -shortest $out
}
