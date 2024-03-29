import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', async () => {
    const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        password_hash: await hash('123456', 6)
    }

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: userData.name,
            email: userData.email,
            password_hash: userData.password_hash
        })

        const { user } = await sut.execute({
            email: userData.email,
            password: userData.password
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: userData.email,
                password: userData.password
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        await usersRepository.create({
            name: userData.name,
            email: userData.email,
            password_hash: userData.password_hash
        })

        await expect(() =>
            sut.execute({
                email: userData.email,
                password: 'another_password'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
