import { openai } from "@/openai";
import useHistoryStore from "@/store/history";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
const MessageRenderer = () => {
  const { entities, reddit_movies, similar_movies, related_movies, title } =
    useHistoryStore();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    async function streamResponse() {
      //   setLoading(true);
      setMessage("");
      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a friendly and knowledgeable movie recommendation engine. Your task is to explain why specific movies were recommended based on the user's query and various data sources. Be enthusiastic, conversational, and clear in your response.`,
            },
            {
              role: "user",
              content: `The user asked: "${title}"
        
              A language model analyzed this query and extracted key entities: ${JSON.stringify(
                entities
              )}
        
              - **Movies with similar plots** (based on cosine similarity of plot summaries): ${JSON.stringify(
                similar_movies
              )}
              - **Movies related in our graph database** (connections based on extracted entities): ${JSON.stringify(
                related_movies
              )}
              - **Movies trending in discussions** (sourced from Reddit and Letterboxd): ${JSON.stringify(
                reddit_movies
              )}
        
              Explain why these movies were recommended. Highlight specific connections when possible. If a category is empty, omit it. Keep it concise (600-700 characters) and guide users on how to navigate these recommendations. Use **bold** headers and *italics* for emphasis.`,
            },
          ],
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          setMessage((prev) => prev + content);
        }
      } catch (error) {
        console.error("Error streaming response:", error);
        setMessage("Sorry, there was an error generating the response.");
      } finally {
        // setLoading(false);
      }
    }
    streamResponse();
  }, [entities, reddit_movies, similar_movies, related_movies, title]);

  return (
    <div className="px-4 py-2 text-sm mt-4 bg-blue-100 rounded-lg text-blue-800 font-medium">
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  );
};

export default MessageRenderer;
