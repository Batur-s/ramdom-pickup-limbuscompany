import 'dotenv/config'; 
import app from './app';
import prisma from './lib/prisma';

const PORT = process.env.PORT || 4000; 

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully via Prisma');

    app.listen(PORT, () => {
      console.log(`
🚀 Server is running!
📡 Network: http://localhost:${PORT}
📅 Time: ${new Date().toLocaleString()}
      `);
    });
  } catch (error) {
    console.error('❌ Unable to start the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

startServer();