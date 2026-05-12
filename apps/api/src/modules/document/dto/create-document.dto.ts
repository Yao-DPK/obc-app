// apps/api/src/modules/documents/dto/create-document.dto.ts
import { z } from 'zod';
export const CreateDocumentSchema = z.object({
  userId: z.number(),
  type: z.string(),
  fileId: z.string(),
  publicUrl: z.string().url(),
  isObligatory: z.boolean().optional(),
});
export type CreateDocumentDto = z.infer<typeof CreateDocumentSchema>;