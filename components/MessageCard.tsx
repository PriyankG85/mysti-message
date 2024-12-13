import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { Message } from "@/models/User";
import { toast } from "sonner";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const createdAt = new Date(message.createdAt);

  const handleDeleteConfirm = async () => {
    const res = await fetch(`/api/delete-message/${message._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    onMessageDelete(message._id as string);
    toast(data.message);
  };

  return (
    <Card className="relative bg-accent-200 min-w-[30rem] max-w-xl flex-1 shadow-md hover:scale-105 duration-75 ease-in overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl">{message.content}</CardTitle>
        <CardDescription>
          {createdAt.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </CardDescription>
      </CardHeader>

      <AlertDialog>
        <AlertDialogTrigger className="bg-destructive text-destructive-foreground p-1 absolute top-0 right-0">
          <X className="h-5 w-5" />
        </AlertDialogTrigger>
        <AlertDialogContent className="text-black">
          <AlertDialogHeader>
            <AlertDialogTitle>Sure want to delete?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MessageCard;
