// apps/api/src/modules/documents/documents.router.ts
import { Router, Query, Mutation, Input } from 'nestjs-trpc-v2';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { DocumentService } from './document.service';
import { db, documents, eq } from '@obc-app/database';
import { CreateDocumentSchema, DocumentSchema } from './document.schema';


const FindByUserSchema = z.object({ userId: z.number() });

@Router({ alias: 'document' })
export class DocumentRouter {
  constructor(private readonly documentsService: DocumentService) {}

  // Mutation pour créer un document
  @Mutation({
    input: CreateDocumentSchema,
    output: DocumentSchema,
  })
  async create(@Input() input: z.infer<typeof CreateDocumentSchema>) {
    return this.documentsService.create(input);
  }

  // Query pour récupérer par utilisateur
  @Query({ 
    input: FindByUserSchema,
    output: z.array(DocumentSchema)
   })
  async findByUser(@Input() input: z.infer<typeof FindByUserSchema>) {
    return db.select().from(documents).where(eq(documents.userId, input.userId));
  }

}