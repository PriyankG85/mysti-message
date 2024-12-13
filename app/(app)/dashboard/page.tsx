"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [areMessagesLoading, setAreMessagesLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(true);

  const { data: session } = useSession();

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const res = await fetch(`/api/accept-messages`);
      const data = await res.json();
      setValue("acceptMessages", data.isAcceptingMessages);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Failed to fetch message settings");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setAreMessagesLoading(true);
    try {
      const response = await fetch("/api/get_messages");
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        toast.error("Failed to fetch messages");
      }

      if (refresh) {
        toast("Messages Refreshed", {
          description: "Showing latest messages",
        });
      }
    } catch (error) {
      toast("Failed to fetch messages", {
        className: "bg-red-500 text-white",
      });
    } finally {
      setAreMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;

    fetchAcceptMessage();
    fetchMessages();
  }, [fetchAcceptMessage, fetchMessages, session]);

  const handleSwitchChange = async () => {
    try {
      const res = await fetch(`/api/accept-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ acceptMessages: !acceptMessages }),
      });

      const data = await res.json();

      if (data.success) {
        setValue("acceptMessages", !acceptMessages);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update message settings");
    }
  };

  if (!session || !session.user) {
    return <div className="text-center flex-1">Not authenticated</div>;
  }

  const uniqueLink = `${window?.location?.protocol}//${window?.location?.host}/u/${session?.user?.username}`;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl lg:text-3xl">Dashboard</h1>

      <div className="flex flex-col gap-2">
        <h2 className="ml-1 text-base">Copy Your Unique Link</h2>

        <div className="flex items-center gap-2 bg-accent-200 text-accent-foreground border border-primary-300 rounded-md">
          <Input
            readOnly
            value={uniqueLink}
            className="flex-1 p-2 bg-transparent border-none focus-visible:ring-offset-0 focus-visible:ring-0"
          />
          <Button
            onClick={() => {
              navigator.clipboard.writeText(uniqueLink);
              toast.success("Link copied to clipboard!");
            }}
            className="bg-text-200 text-accent-foreground hover:bg-[#ced4da] duration-100"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Switch
            {...register("acceptMessages")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span>Accept Messages: {acceptMessages ? "On" : "Off"}</span>
        </div>
      </div>

      <div className="flex flex-col gap-5 pt-5 border-t border-primary-300/50">
        <div className="flex items-center gap-4">
          <h2 className="ml-1 text-xl">Messages</h2>
          <button onClick={() => fetchMessages(true)}>
            {areMessagesLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-5">
          {areMessagesLoading && (
            <>
              <div className="flex flex-1 flex-col w-[30rem] gap-3 p-2">
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-3/4 h-[20px] rounded-full" />
              </div>
              <div className="flex flex-1 flex-col w-[30rem] gap-3 p-2">
                <Skeleton className="w-full h-[20px] rounded-full" />
                <Skeleton className="w-3/4 h-[20px] rounded-full" />
              </div>
            </>
          )}

          {!areMessagesLoading &&
            (messages.length === 0 ? (
              <p>No messages found</p>
            ) : (
              messages.map((message: Message, index) => (
                <MessageCard
                  key={index}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
