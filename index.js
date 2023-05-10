// TODO: replace with OpenAI key https://platform.openai.com/account/api-keys
const API_KEY = "fake-key";

// NOTE: the list only has 3 words to avoid rate limiting while testing
const words = [
  "vitriolic",
  "vituperation",
  "vivacious",
];

const finalWordData = [];

function fetchDataForWord(word) {
    return new Promise((resolve) => {
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
            temperature: 0.7,g
            messages: [{ role: "user", content}],
          }),
        })
        .then(data => data.json())
        .then(data => resolve(data))
    });
}

function fetchDataForList() {
    let wordRequests = [];

    words.forEach((word) => {
        wordRequests.push(fetchDataForWord(word));
    });

    Promise.all(wordRequests).then((allWordData) => {
        console.log(allWordData);

        allWordData.forEach((wordData) => {
          if ("error" in wordData) {
            console.log(`\nerror: ${wordData.error.message}\n`);
          } else {
            finalWordData.push(JSON.parse(wordData.choices[0].message.content));
          }
        });

        console.log(JSON.stringify(finalWordData, null, 2));
    });
}

fetchDataForList();
