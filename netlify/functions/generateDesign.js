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
    const { prompt, quality = "low" } = JSON.parse(event.body);

    // Basic validation
    if (!prompt || typeof prompt !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing prompt" })
      };
    }

    const apiKey = process.env.OPENAI_API_KEY_SERVER;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "OpenAI API key not configured" })
      };
    }

    // Call the Images endpoint (GPT-Image-1 or DALL·E 3)
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        quality: quality === "hd" ? "high" : "medium",
        size: "1024x1024",
        n: 1
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `OpenAI error: ${response.status}` })
      };
    }

    const data = await response.json();
    
    // Handle base64 response from gpt-image-1
    if (data.data && data.data[0] && data.data[0].b64_json && !data.data[0].url) {
      // Convert base64 to data URL
      data.data[0].url = `data:image/png;base64,${data.data[0].b64_json}`;
      // Remove the large base64 data to reduce response size
      delete data.data[0].b64_json;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `OpenAI error: ${err.message || "unknown"}` })
    };
  }
};