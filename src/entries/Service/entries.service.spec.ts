import { Test, TestingModule } from '@nestjs/testing';
import { EntriesService } from './entries.service';

describe('EntriesService', () => {
  let service: EntriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntriesService],
    }).compile();

    service = module.get<EntriesService>(EntriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
