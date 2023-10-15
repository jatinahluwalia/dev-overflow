import { z } from "zod";

export const questionsSchema = z.object({
  title: z.string().min(5).max(130),
  explaination: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export type QuestionsSchema = z.infer<typeof questionsSchema>;
