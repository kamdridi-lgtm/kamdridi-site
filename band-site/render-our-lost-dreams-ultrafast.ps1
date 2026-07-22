$audio = "C:\Users\Administrator\Downloads\Our Lost Dreams (Unplugged Live).mp3"

$variants = @(
    @{ vNum=3; ts='00:01:15'; img='C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784677839204.png' },
    @{ vNum=4; ts='00:02:45'; img='C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784677864595.jpg' },
    @{ vNum=5; ts='00:03:30'; img='C:\Users\Administrator\.gemini\antigravity\brain\0fa9401b-5e93-48ac-a7e7-11bfcf1770b3\.user_uploaded\media__1784677918669.jpg' }
)

foreach ($v in $variants) {
    $out = "C:\Users\Administrator\kamdridi-site\band-site\public\videos\our-lost-dreams-v$($v.vNum).mp4"
    Write-Host "Rendering $out at $($v.ts)..."
    
    $filter = "
[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=40:40[bg];
[0:v]scale=900:-1,drawtext=fontfile='C\:/Windows/Fonts/arial.ttf':text='hear the song on kamdridi.com':fontcolor=white:fontsize=35:x=w-text_w-20:y=h-text_h-20:box=1:boxcolor=black@0.6:boxborderw=8[fg];
[bg][fg]overlay=(W-w)/2:(H-h)/2[base]
"
    $filter = $filter -replace "\r?\n", ""
    
    ffmpeg -y -loop 1 -framerate 30 -i $v.img -ss $v.ts -t 10 -i $audio -filter_complex $filter -map "[base]" -map 1:a -c:v libx264 -preset ultrafast -crf 23 -c:a aac -b:a 192k -shortest $out
}
