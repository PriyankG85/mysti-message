"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useCompletion } from "ai/react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import sample_messages from "@/sample_messages.json";

const prompt =
  "Suggest three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that make's you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

const ProfileLink = () => {
  const pathname = usePathname();
  const username = pathname.split("/u/")[1];

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<string[]>(
    sample_messages.messages.map((m) => m.content)
  );

  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/suggest-messages",
    headers: { "Cache-Control": "no-cache" },
  });

  useEffect(() => {
    if (completion) {
      const parts = completion.split("||");
      setMessages(parts.map((q) => q.trim()).filter((q) => q));
    }
  }, [completion]);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [error]);

  const handleSend = async () => {
    if (textareaRef.current) {
      try {
        const res = await fetch(`/api/send-message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            content: textareaRef.current.value,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          toast.error(data.message);
          return;
        }
        textareaRef.current.value = "";
        toast.success("Message sent!");
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-10 max-w-3xl mx-auto pt-20">
      <h1 className="text-4xl font-bold text-center">Public Profile Link</h1>

      <div className="flex flex-col gap-4">
        <p>Send anonymous message to @{username}</p>
        <textarea
          ref={textareaRef}
          className="border border-accent-200 rounded-md shadow p-2 placeholder:text-muted-foreground text-base text-black focus-visible:outline-none focus-visible:ring-0"
          rows={4}
          maxLength={40}
          placeholder="Type your message here..."
        />
        <Button className="max-w-fit min-w-32 shadow" onClick={handleSend}>
          Send
        </Button>
      </div>

      <div className="flex flex-col gap-4 p-4 border border-accent-200 rounded-md">
        <div className="flex justify-between items-center">
          <h2>Suggested messages</h2>
          <Button
            className="max-w-fit min-w-32 shadow"
            variant="secondary"
            onClick={async () => await complete(prompt)}
            disabled={isLoading}
          >
            {isLoading ? "Suggesting..." : "Suggest messages"}
          </Button>
        </div>

        {messages.map((message, index) => (
          <Button
            key={index}
            onClick={() => (textareaRef.current!.value = message)}
            variant={"secondary"}
            className="text-center p-2 h-fit rounded-md bg-accent-200 text-black border border-accent-200"
          >
            <p className="text-wrap">{message}</p>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProfileLink;
