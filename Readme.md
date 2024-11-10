NODE: 20.9.0 NPM: 10.1.0 database: sqlite3

npm install

npm run dev or npm run dev:electron:win

make .pfx, remove line space before run this in powerShell by administrative

$password = ConvertTo-SecureString -String "Qwerty@12345" -Force -AsPlainText;

New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=MDBKN" -CertStoreLocation Cert:\CurrentUser\My |

Export-PfxCertificate -FilePath "C:\certificate.pfx" -Password $password

## npm run build

## npm run transpile-electron

## npm run build:electron
