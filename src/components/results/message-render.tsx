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
              content: `You are a friendly and knowledgeable movie recommendation engine. Your job is to explain why specific movies were recommended based on the user's query and various data sources. Be enthusiastic and conversational in your response.`,
            },
            {
              role: "user",
              content: `The user asked: "${title}"

              Entities identified in their query: ${JSON.stringify(entities)}

              Movies recommended from Reddit discussions: ${JSON.stringify(
                reddit_movies
              )}

              Movies with similar plot elements: ${JSON.stringify(
                similar_movies
              )}

              Movies related through connections in our movie graph: ${JSON.stringify(
                related_movies
              )}

              Explain why these movies were recommended based on the user's query. Mention specific connections when possible. If any of these lists are empty, you can skip mentioning them. Keep your response concise but informative.`,
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
