import { Chat, Contact, Message } from "whatsapp-web.js";
import CUSTOMERS from "../const/customers.ts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { systemPrompt } from "../const/prompt.ts";
import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { writeSheetTool } from "../agent-tools/write-sheet-tool.ts";
import { HumanMessage } from "@langchain/core/messages";

const financeTrack = async (message:Message) => {
    const mentions = await message.getMentions();
    const contact = await message.getContact();
    const chat = await message.getChat();

    const isPassed = isAvailableGroupChatId(chat, chat.id.user);

    if(isPassed) {
        console.log(new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }));
        console.log('Group chat detected');
        for (let user of mentions) {
            if(user.isMe) {
                await chat.sendStateTyping();
                console.log(`Message body: ${message.body}`);

                const output = await agentResponse(message.body, contact);

                chat.sendMessage(output || "Mohon maaf, untuk saat ini service belum bisa berjalan dengan baik.");
            }
        }
    }
}

const isGroupChat = (chat: Chat): boolean => chat.isGroup;


const isAvailableGroupChatId = (chat: Chat, groupId: string): boolean => {
    const isAlreadyGroup = isGroupChat(chat);
    const isAvailableGroupId = CUSTOMERS.some(customer => customer.chatId === groupId);
    return isAlreadyGroup && isAvailableGroupId;
}

const agentResponse = async (message: string, contact: Contact) => {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0.5,
      apiKey: process.env.GEMINI_API_KEY,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      ["placeholder", "{chat_history}"],
      ["human", "saya {name}, {input}"],
      ["placeholder", "{agent_scratchpad}"],
    ]);

    const agent = createToolCallingAgent({
      llm: llm,
      tools: [writeSheetTool],
      prompt
    });

    const agentExecutor = new AgentExecutor({agent: agent, tools: [writeSheetTool]});
    const responseAgent = await agentExecutor.invoke({
      input: message,
      name: contact.pushname || contact.name,
      chat_history: [new HumanMessage(message)],
    });

    return responseAgent.output || "Tidak ada respon dari agen.";
}

export { financeTrack }