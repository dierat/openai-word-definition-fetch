// TODO: replace with OpenAI key https://platform.openai.com/account/api-keys
const API_KEY = 'fake-key';

const fullList = [
  'abase',
  'abash',
  'abate',
  'abdicate',
  'abecedarian',
  'aberrant',
  'aberration',
  'abet',
  'abeyance',
  'abhorrent',
];

let listIndex = 3;

const finalWordData = [];
// Ideally we would have some logic that would automatically run these again,
// but for now we'll just track them and manually rerun them.
const missedWords = [];

function fetchDataForWord(word) {
  return new Promise((resolve) => {
    const content = `Give me the definition, synonyms, and 5 example sentences for the word "${word}". Your response should be in JSON using the following structure:
        {
          word: ${word},
          definition: definition,
          synonyms: [synonyms],
          exampleSentences: [example sentences],
        }`;

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        max_tokens: 2048,
        temperature: 0.7,
        messages: [{ role: 'user', content }],
      }),
    })
      .then((data) => {
        if (!data.ok) {
          missedWords.push(word);
        }
        return data.json();
      })
      .then((data) => resolve(data));
  });
}

function fetchDataForList(words) {
  let wordRequests = [];

  words.forEach((word) => {
    wordRequests.push(fetchDataForWord(word));
  });

  Promise.all(wordRequests).then((allWordData) => {
    console.log(allWordData);

    allWordData.forEach((wordData) => {
      if ('error' in wordData) {
        console.log(`\nerror: ${wordData.error.message}\n`);
      } else {
        try {
          finalWordData.push(
            JSON.parse(wordData.choices[0].message.content)
          );
        } catch (error) {
          finalWordData.push(wordData.choices[0].message.content);
        }
      }
    });

    try {
      console.log(JSON.stringify(finalWordData, null, 2));
    } catch (error) {
      console.log(
        'missed words (you need to run these again): ',
        missedWords
      );
      console.log(finalWordData);
    }
  });
}

// Kick off one fetch right away
fetchDataForList(fullList.slice(0, 3));

// Set up recurring fetches, 3 every 90 seconds, moving down the list by 3 each fetch.
// This recurring feature is necessary because the API rate limits you to 3 calls per minute.
const timerId = setInterval(async () => {
  await fetchDataForList(fullList.slice(listIndex, listIndex + 3));
  listIndex += 3;

  if (listIndex >= fullList.length) {
    window.clearTimeout(timerId);
  }
}, 90000);
