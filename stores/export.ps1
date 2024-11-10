
# Define the path to the SQLite database
$DBPath = ".data/db.sqlite3"

# Define the backup directory
$BackupDir = "C:\"

# Create the backup directory if it doesn't exist
if (!(Test-Path -Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

# Get the current timestamp
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Define the backup file name with timestamp
$BackupFile = "$BackupDir\db_date_backup_$Timestamp.sqlite"

# Copy the database to the backup directory with the timestamp in the filename
Copy-Item -Path $DBPath -Destination $BackupFile -ErrorAction Stop

# Confirm the backup
Write-Output "Backup successful: $BackupFile"
