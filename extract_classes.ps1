$files = Get-ChildItem -Recurse -Path 'app\dashboard','app\components' -Include *.tsx
$rx = [regex]'(?:hover:|focus:|active:|group-hover:)?(?:bg|text|border|divide|ring|from|to|via|placeholder|fill|stroke)-(?:slate|gray|zinc|neutral|stone|white|black)(?:-\d{2,3})?(?:/\d{1,3})?'
$set = @{}
foreach ($f in $files) {
  $content = Get-Content $f.FullName -Raw
  foreach ($m in $rx.Matches($content)) { $set[$m.Value] = 1 }
}
$set.Keys | Sort-Object
