const axios = require('axios');
require('dotenv').config();

async function generateResponse(input) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${openaiApiKey}`,
  };

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: input }],
    },
    { headers }
  );

  return response.data.choices[0].message.content;
}

module.exports = generateResponse;
