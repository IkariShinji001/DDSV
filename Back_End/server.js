const app = require('./app');
const startServer = async () => {
  try {
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (error) {
    process.exit();
  }
};

startServer();
