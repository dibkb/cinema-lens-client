import { openai } from "@/openai";
import { useState, useEffect } from "react";

const MessageRenderer = () => {
  const [message, setMessage] = useState<string>("Hello");

  useEffect(() => {
    async function streamResponse() {
      //   setLoading(true);
      setMessage("");
      try {
        const stream = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: "Say 'double bubble bath' ten times fast.",
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
  }, []);

  return (
    <div className="px-4 py-1 text-sm mt-4">
      <div className="whitespace-pre-wrap">{message}</div>
    </div>
  );
};

export default MessageRenderer;
