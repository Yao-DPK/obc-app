import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.string(),  
  userId: z.number(),
  type: z.string(),
  fileId: z.string(),
  publicUrl: z.string().url(),
  isObligatory: z.boolean().optional(),
  createdAt: z.string(),  
});

export const CreateDocumentSchema = DocumentSchema.omit({
  id: true,  
  createdAt: true,  
});
  


export type Document = z.infer<typeof DocumentSchema>
export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;