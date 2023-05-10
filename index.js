// TODO: replace with OpenAI key https://platform.openai.com/account/api-keys
const API_KEY = "fake-key";

const word = "recalcitrant";

const content = `Give me the definition, synonyms, and 5 example sentences for the word "${word}". Your response should be in JSON using the following structure:
{
  word: ${word},
  definition: definition,
  synonyms: [synonyms],
  exampleSentences: [example sentences],
}`;

fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-3.5-turbo",
    max_tokens: 2048,
    temperature: 0.7,
    messages: [{ role: "user", content}],
  }),
})
.then(data => data.json())
.then(result => console.log(result.choices[0].message.content))
.catch(error => console.log(error));
