import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type LabelAttachment = {
  name: string;
  type: string;
  size: number;
  url?: string;
};

export type LabelMessage = {
  id: string;
  conversationId: string;
  fromEmail: string;
  toEmail: string;
  body: string;
  attachments: LabelAttachment[];
  readAt?: string;
  createdAt: string;
};

export type LabelConversation = {
  id: string;
  artistId: string;
  artistEmail: string;
  adminEmail: string;
  updatedAt: string;
};

async function readConversations() {
  return readLabelJson<LabelConversation[]>("conversations.json", []);
}

async function readMessages() {
  return readLabelJson<LabelMessage[]>("messages.json", []);
}

export async function getOrCreateConversation(input: { artistId: string; artistEmail: string; adminEmail: string }) {
  const conversations = await readConversations();
  const existing = conversations.find((conversation) => conversation.artistId === input.artistId);
  if (existing) return existing;
  const conversation: LabelConversation = {
    id: `conv_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    artistId: input.artistId,
    artistEmail: input.artistEmail,
    adminEmail: input.adminEmail,
    updatedAt: new Date().toISOString()
  };
  conversations.unshift(conversation);
  await writeLabelJson("conversations.json", conversations);
  return conversation;
}

export async function sendInternalMessage(input: {
  conversationId: string;
  fromEmail: string;
  toEmail: string;
  body: string;
  attachments?: LabelAttachment[];
}) {
  if (!input.body.trim() && !input.attachments?.length) throw new Error("Message body or attachment required.");
  const messages = await readMessages();
  const message: LabelMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    conversationId: input.conversationId,
    fromEmail: input.fromEmail,
    toEmail: input.toEmail,
    body: input.body.trim(),
    attachments: input.attachments || [],
    createdAt: new Date().toISOString()
  };
  messages.unshift(message);
  await writeLabelJson("messages.json", messages);
  return message;
}

export async function listConversationMessages(conversationId: string) {
  const messages = await readMessages();
  return messages.filter((message) => message.conversationId === conversationId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function markConversationRead(conversationId: string, readerEmail: string) {
  const messages = await readMessages();
  const readAt = new Date().toISOString();
  const next = messages.map((message) =>
    message.conversationId === conversationId && message.toEmail.toLowerCase() === readerEmail.toLowerCase()
      ? { ...message, readAt: message.readAt || readAt }
      : message
  );
  await writeLabelJson("messages.json", next);
  return next.filter((message) => message.conversationId === conversationId);
}

export async function listConversationsForEmail(email: string) {
  const conversations = await readConversations();
  const messages = await readMessages();
  const normalized = email.toLowerCase();
  return conversations
    .filter((conversation) => [conversation.artistEmail, conversation.adminEmail].map((item) => item.toLowerCase()).includes(normalized))
    .map((conversation) => ({
      ...conversation,
      unread: messages.filter((message) => message.conversationId === conversation.id && message.toEmail.toLowerCase() === normalized && !message.readAt).length
    }));
}
