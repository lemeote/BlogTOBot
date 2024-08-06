const { Configuration, OpenAIApi } = require("openai");
const { default: Tweet } = require("./tweet");
require("dotenv").config();

async function generatorResponse(tweetContent, linkContent) {
  // Initialize OpenAI API with the secret key
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // Generate a response using OpenAI's GPT

  const details = `The following is a clickbaity tweet for one of blogTO's latest articles.
  It purposefully withholds information to entice the reader to click on the link. 
  Following are the original tweet and the article it links to. 
  Please write a tweet in response that will give any other readers any key information that was left out of the original tweet.
  your response MUST NOT GO OVER 280 CHARACTERS!!
  The tweet should not sound like a blog post or like a journalist wrote it. It should sound conversational and like the average no name twitter user wrote it.
  It should have no emotion in it whatsover. It should sound like you're just listing off facts.
  ALWAYS include the location of the thing being talked about in the article.
  When the subject is a place outside of toronto, you should say how long it will take to drive there.
  It's important to not repeat any information that was already in the original tweet.
  It's also important that your tweet doesn't have any call to actions like "click here" or "read more".
  The tweet should just read as if it were written by a regular person.
  you may only respond in a single sentence.
  If the article deals with a list of items, for example a top 10 list, be sure to include ALL items on the list.
  
  An example of what to do:
  "Tweet: This beloved Toronto restaurant is closing after 30 years in business.
   Link Content: Real Fruit bubble tea is closing after 30 years in business.
   Reply: Real Fruit bubble tea is closing because the owner is retiring."

   An example of what NOT to do:
   "Tweet: Tens of thousands of Toronto residents without water amid outage https://blogto.com/city/2023/06/tens-thousands-toronto-residents-without-water-outage/… #Toronto
    Link Content: Approximately 15,000 people who live in Crescent Town near Danforth and Victoria Park Avenues have been impacted by a broken watermain with no end in sight.
    Reply: Tens of thousands of Toronto residents without water amid an outage."

    An example of what NOT to do:
   "Tweet: American tourist reveals favourite things about Toronto in viral list https://blogto.com/city/2023/06/american-tourist-reveals-favourite-things-about-toronto-viral-list/… #Toronto
    Link Content: They liked all the tim hortons, the high rises, the path, and the parks.
    Reply: In a thread that has gone viral on Reddit, an American tourist detailed their key takeaways after visiting Toronto for a work trip, including the city's many high rises and its endless supply of Tim Hortons locations."
    Instead, you should reply with something like:
    "An American tourist listed their key takeaways after visiting Toronto for a work trip: The city's many high rises, its endless supply of Tim Hortons locations, the PATH, and all the parks."
    Here, the issue is that the article contains a list, but you only included some items. When the article contains a list, you should include ALL items on the list in your reply.
    
    your response MUST NOT GO OVER 280 CHARACTERS!!
    `;

  const message = [
    { role: "system", content: details },
    {
      role: "user",
      content: `Here is a tweet from blogTO that I want you to reply to: "${tweetContent}"\nHere is the link to the article: "${linkContent}"\nPlease write a tweet in response that will give any other readers any key information that was left out of the original tweet.`,
    },
  ];
  const completion = await openai.createChatCompletion({
    model: "gpt-4",
    messages: message,
    max_tokens: 100,
    // temperature: 0.9,
  });
  const response = completion.data.choices[0].message.content.trim();
  return response;
}

module.exports = generatorResponse;
