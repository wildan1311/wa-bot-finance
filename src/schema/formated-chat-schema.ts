import { z } from "zod";

export const formatedChatSchema =
  z.object({
    date: z.string(),          // atau pakai .refine jika ingin validasi ISO
    contact: z.string(),
    description: z.string(),
    category: z.string(),
    nominal: z.number(),
  });

export const formatedChatArraySchema = z.object({
  data: z.array(formatedChatSchema)
});

export type FormatedChat = z.infer<typeof formatedChatSchema>;
export type FormatedChatArray = z.infer<typeof formatedChatArraySchema>;