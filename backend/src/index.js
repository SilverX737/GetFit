const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { PrismaClient } = require("@prisma/client");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const prisma = new PrismaClient();

app.get('/', (req, res) => {
    res.send('Get Fit API is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
