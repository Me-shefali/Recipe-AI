const express = require('express');
// const fetch = require('node-fetch');
const router = express.Router();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error('GEMINI_API_KEY not loaded');
}
const GENERATE_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;


router.post('/generate', async (req, res) => {
  try {
    const { ingredients, diet, cuisine } = req.body;
    
    let prompt = `Generate a creative recipe. I have these ingredients: ${ingredients}. `;
    if (diet) {
      prompt += `The recipe should be ${diet}. `;
    }
    if (cuisine) {
      prompt += `The cuisine style should be ${cuisine}. `;
    }
    prompt += "The recipe should have a catchy title, a short description, a list of ingredients, and step-by-step instructions. Format the response using markdown. The title should be a main heading (e.g., # My Dish), the description should be plain text, and the ingredients and instructions should be bulleted lists.";

    const recipeResponse = await fetch(GENERATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!recipeResponse.ok) {
      const errorData = await recipeResponse.text();
      console.error("Error from Gemini API (Recipe):", errorData);
      throw new Error(`Gemini API (Recipe) failed with status: ${recipeResponse.status}`);
    }

    const recipeData = await recipeResponse.json();
    // Add safety checks for the response structure
    if (!recipeData.candidates || !recipeData.candidates[0].content || !recipeData.candidates[0].content.parts[0].text) {
        console.error("Unexpected response structure from Gemini API:", recipeData);
        throw new Error("Failed to parse recipe from Gemini API response.");
    }
    const recipeText = recipeData.candidates[0].content.parts[0].text;
    
    // Create a placeholder image URL based on the recipe title
    const dishTitleMatch = recipeText.match(/#\s*(.*)/);
    const dishTitle = dishTitleMatch ? dishTitleMatch[1] : "Generated Dish";
    const imageUrl = `https://placehold.co/600x400/f87171/ffffff?text=${encodeURIComponent(dishTitle)}`;


    res.json({ recipe: recipeText, imageUrl: imageUrl });

  } catch (error) {
    console.error('Error in /generate endpoint:', error);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
});

module.exports = router;

