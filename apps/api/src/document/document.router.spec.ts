// apps/api/src/modules/documents/document.router.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { DocumentRouter } from './document.router';
import { DocumentService } from './document.service';
import { db, documents, eq } from '@obc-app/database';

// Mock du module database
jest.mock('@obc-app/database', () => ({
  db: {
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    }),
  },
  documents: {},
  eq: jest.fn(),
}));

const mockDocumentService = {
  create: jest.fn(),
};

describe('DocumentRouter', () => {
  let router: DocumentRouter;
  let documentService: DocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentRouter,
        { provide: DocumentService, useValue: mockDocumentService },
      ],
    }).compile();

    router = module.get<DocumentRouter>(DocumentRouter);
    documentService = module.get<DocumentService>(DocumentService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call documentService.create with input and return result', async () => {
      const input = { userId: 1, type: 'medical', fileId: 'abc', publicUrl: 'https://example.com', isObligatory: true };
      const mockDoc = { id: 1, ...input, uploadedAt: new Date() };
      mockDocumentService.create.mockResolvedValue(mockDoc);

      const result = await router.create(input);

      expect(documentService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockDoc);
    });
  });

  describe('findByUser', () => {
    it('should call db.select with correct where clause', async () => {
      const input = { userId: 2 };
      const mockDocs = [{ id: 1, userId: 2, type: 'test' }];
      // Modifier le mock pour retourner des données
      const selectMock = {
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockResolvedValue(mockDocs),
        }),
      };
      (db.select as jest.Mock).mockReturnValue(selectMock);

      const result = await router.findByUser(input);

      expect(db.select).toHaveBeenCalled();
      expect(selectMock.from).toHaveBeenCalledWith(documents);
      expect(eq).toHaveBeenCalledWith(documents.userId, 2);
      expect(result).toEqual(mockDocs);
    });
  });
});