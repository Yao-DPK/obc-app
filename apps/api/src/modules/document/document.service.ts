// apps/api/src/modules/documents/documents.service.ts
import { Injectable } from '@nestjs/common';
import { db, documents } from '../../database/config/db.config';
import type  { CreateDocumentSchema } from './dto/create-document.dto';
import { z } from 'zod';

@Injectable()
export class DocumentService {
  async create(input: z.infer<typeof CreateDocumentSchema>) {
    const [doc] = await db.insert(documents).values(input).returning();
    return doc;
  }
}