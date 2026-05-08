const app = require("./app");

const PORT = process.env.PORT || 5000;

const cors = require('cors');

app.use(cors({
  origin: ['https://citysushi-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
