const express = require('express');
const cors = require('cors');
const retrieveSummaryFromNeo4j = require('./components/dataRetrieval');
const generateResponse = require('./components/openAI');
const app = express();
app.use(express.json());
app.use(cors());
require('dotenv').config();


app.post('/chat', async (req, res) => {
  try {
    console.log('Received chat request:', req.body);
    const question = req.body.question;

    const summary = await retrieveSummaryFromNeo4j();
    console.log('Retrieved summary:', summary);

    const input = `Generate an answer to find: ${question}.using Summary: ${summary}.`;
    console.log('Combined input:', input);

    const response = await generateResponse(input);
    console.log('Generated response:', response);

    res.status(200).json({ message: response });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});