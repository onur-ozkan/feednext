import { Test, TestingModule } from '@nestjs/testing'
import { EntryService } from './entry.service'

describe('EntryService', () => {
    let service: EntryService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [EntryService],
        }).compile()

        service = module.get<EntryService>(EntryService)
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })
})
