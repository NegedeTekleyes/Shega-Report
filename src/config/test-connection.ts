import { testConnection } from './database';

const testDB = async () => {
  console.log('Testing database connection...');
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log(' Database connection successful!');
    process.exit(0);
  } else {
    console.log(' Database connection failed!');
    process.exit(1);
  }
};

testDB();