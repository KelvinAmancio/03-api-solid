import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findById(id: string) {
        const gym = this.items.find(item => item.id === id)

        return gym ?? null
    }
}
