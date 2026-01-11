import React, { useState } from 'react';

// A simple component to render the recipe with proper formatting
const RecipeDisplay = ({ recipe, image }) => {
  if (!recipe) return null;

  // Split the recipe text into sections based on headings like "Ingredients:"
  const sections = recipe.split(/(\*\*.*?\*\*)/).filter(Boolean);

  return (
    <div className="mt-10 bg-[#fff9f2] p-8 rounded-3xl shadow-2xl border-8 border-pink-400 prose lg:prose-xl">
      {image && (
        <img 
          src={image} 
          alt="Generated dish" 
          className="w-full rounded-2xl mb-6 shadow-lg"
          onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
        />
      )}
      {sections.map((section, index) => {
        if (section.startsWith('**') && section.endsWith('**')) {
          return <h2 key={index} className="text-pink-600 !mt-6 !mb-2">{section.replace(/\*\*/g, '')}</h2>;
        }
        // Split by newline to create paragraphs and list items
        return section.trim().split('\n').map((line, lineIndex) => {
          line = line.trim();
          if (line.startsWith('* ') || line.startsWith('- ')) {
            return <li key={`${index}-${lineIndex}`} className="!my-1">{line.substring(2)}</li>;
          }
          if (line) {
             return <p key={`${index}-${lineIndex}`} className="!my-2">{line}</p>;
          }
          return null;
        });
      })}
    </div>
  );
};


function App() {
  // State variables with Indian vegetarian defaults
  const [ingredients, setIngredients] = useState('paneer, onion, tomatoes, capsicum');
  const [diet, setDiet] = useState('Vegetarian');
  const [cuisine, setCuisine] = useState('Indian');

  // State for the generated recipe content
  const [recipe, setRecipe] = useState('');
  const [image, setImage] = useState('');
  
  // State to handle loading and errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe('');
    setImage('');

    try {
      const response = await fetch('http://localhost:5001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, diet, cuisine }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecipe(data.recipe);
      setImage(data.imageUrl);

    } catch (err) {
      setError('Failed to generate recipe. Please check your API key and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-200 via-purple-300 to-pink-200 min-h-screen text-[#5b2c24] font-['Nunito'] flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-2xl">
        
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white text-shadow-[0_4px_0_rgba(217,70,239,0.5)]">
            Culinary AI ✨
          </h1>
        </header>

        <div className="bg-[#fff9f2] p-8 rounded-3xl shadow-2xl border-8 border-pink-400">
          <form onSubmit={handleSubmit} className="space-y-6">
             {/* Form inputs are the same as before */}
            <div>
              <label htmlFor="ingredients" className="block text-lg font-bold text-pink-900/80 mb-2">
                What ingredients do you have?
              </label>
              <textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g., paneer, onion, tomatoes"
                className="w-full bg-white border-2 border-pink-200 rounded-2xl p-3 focus:ring-4 focus:ring-pink-400 focus:outline-none transition duration-200 text-lg"
                rows="3"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="diet" className="block text-lg font-bold text-pink-900/80 mb-2">
                  Dietary Preference
                </label>
                <input
                  type="text"
                  id="diet"
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-white border-2 border-pink-200 rounded-full p-3 px-5 focus:ring-4 focus:ring-pink-400 focus:outline-none transition duration-200 text-lg"
                />
              </div>
              <div>
                <label htmlFor="cuisine" className="block text-lg font-bold text-pink-900/80 mb-2">
                  Cuisine Type
                </label>
                <input
                  type="text"
                  id="cuisine"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  placeholder="e.g., Indian"
                  className="w-full bg-white border-2 border-pink-200 rounded-full p-3 px-5 focus:ring-4 focus:ring-pink-400 focus:outline-none transition duration-200 text-lg"
                />
              </div>
            </div>
            {/* --- End of form inputs --- */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-500 text-white font-bold text-xl py-4 px-4 rounded-full transition duration-200 ease-in-out transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed border-b-8 border-lime-700 active:border-b-2 active:mt-2"
            >
              {loading ? 'Thinking of something yummy...' : 'Generate Recipe'}
            </button>
          </form>
        </div>

        {error && (
          <div className="mt-6 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-center">
            <strong>Oops!</strong> {error}
          </div>
        )}

        <RecipeDisplay recipe={recipe} image={image} />

      </div>
    </div>
  );
}

export default App;

