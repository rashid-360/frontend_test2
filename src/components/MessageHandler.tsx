import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

type MessageType = "success" | "error" | "warning";

interface Message {
  type: MessageType;
  text: string;
}

const messages: Record<string, Message> = {
  "1": { type: "success", text: "registration successfull" },
  "2": { type: "error", text: "your session expired ,please login again " },
  "3": { type: "success", text: "Logged out suucesfully" }
};

const MessageHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const msgKey = searchParams.get("msg");

  useEffect(() => {
    if (msgKey && messages[msgKey]) {
      const { type, text } = messages[msgKey];
      toast[type](text); // toast.success(), toast.error(), toast.warning()
    }
  }, [msgKey]);

  return null; // No UI needed, just triggers toast messages
};

export default MessageHandler;
