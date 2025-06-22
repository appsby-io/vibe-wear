const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { type, payload } = JSON.parse(event.body);

    const apiKey = process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "OpenAI API key not configured" })
      };
    }

    // Call OpenAI Chat Completions API directly
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `OpenAI API error: ${response.status}` })
      };
    }

    const data = await response.json();
    
    // Return the analysis result based on type
    let result = {};
    const content = data.choices[0]?.message?.content;
    
    switch (type) {
      case 'single':
        result = { analysis: content };
        break;
      case 'compare':
        result = { comparison: content };
        break;
      case 'suggest':
        result = { suggestions: content };
        break;
      default:
        result = { content };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        data: {
          ...result,
          usage: data.usage
        }
      })
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Internal server error" })
    };
  }
};