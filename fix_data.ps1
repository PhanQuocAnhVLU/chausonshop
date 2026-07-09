$c = Get-Content 'js/data.js' -Raw -Encoding UTF8
$c = $c -replace '0843\.323\.550', '0987.153.876'
$c = $c -replace 'chausonshop@gmail\.com', 'nhutu5556@gmail.com'
$c = $c -replace 'address1: "[^"]*"', 'address1: "Da Nang: 194 Le Am, Hoa Xuan"'
$c = $c -replace 'address2: "[^"]*"', 'address2: "TP.HCM: 126A Tay Son, Phuong Phu Tho Hoa, Quan Tan Phu"'
Set-Content 'js/data.js' $c -Encoding UTF8
Write-Host "Done"
