import { Test, TestingModule } from '@nestjs/testing'
import { EntryController } from './entry.controller'

describe('Entry Controller', () => {
    let controller: EntryController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [EntryController],
        }).compile()

        controller = module.get<EntryController>(EntryController)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
