export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');

  // Create table
  await db.sql`DROP TABLE IF EXISTS room_category`;
  await db.sql`CREATE TABLE IF NOT EXISTS room_category (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT,
                  max_occupancy INTEGER,
                  description TEXT,
                  normalRent INTEGER,
                  patientRent INTEGER
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                  );`;

  await db.sql`DROP TABLE IF EXISTS rooms`;
  await db.sql`CREATE TABLE IF NOT EXISTS rooms (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    floorNumber INTEGER,
                    roomNumber INTEGER,
                    roomCategory INTEGER,
                    amenities TEXT,
                    guestCapacity INTEGER,
                    roomStatus TEXT,
                    remarks TEXT
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (roomCategory) REFERENCES categories(id)
                  );`;

  await db.sql`DROP TABLE IF EXISTS records`;

  await db.sql`DROP TABLE IF EXISTS bookings`;
  //   // Create table if it doesn't exist
  await db.sql`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientType TEXT,
      bookingType TEXT,
      checkInTime TEXT,
      checkOutTime TEXT,
      category TEXT,
      room INTEGER,
      payment TEXT,
      mobile TEXT,
      guestName TEXT,
      patientGuestRelation TEXT,
      document TEXT,
      gender TEXT,
      caste TEXT,
      age INTEGER,
      state TEXT,
      city TEXT,
      tehsil TEXT,
      village TEXT,
      patientName TEXT,
      hospital TEXT,
      wardNo TEXT,
      guestFName TEXT,
      hospitalRoomNumber TEXT,
      hospitalBedNumber TEXT,
      doctorName TEXT,
      remark TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room) REFERENCES rooms(id)
    );`;
  return { success: true };
});
