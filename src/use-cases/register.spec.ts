import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
    const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
    }

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should to register', async () => {
        const { user } = await sut.execute(userData)

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hash user password upon registration', async () => {
        const { user } = await sut.execute(userData)

        const isPasswordCorrectlyHashed = await compare(userData.password, user.password_hash)

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async () => {
        await sut.execute(userData)

        await expect(() => sut.execute(userData)).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
