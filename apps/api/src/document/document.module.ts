import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentRouter } from './document.router';

@Module({
  controllers: [],
  providers: [DocumentService, DocumentRouter],
})
export class DocumentModule {}
