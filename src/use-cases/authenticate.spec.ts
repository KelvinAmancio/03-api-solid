import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { hash } from 'bcryptjs'
import { expect, describe, it } from 'vitest'

describe('Authenticate Use Case', async () => {
    const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
        password_hash: await hash('123456', 6)
    }

    it('should be able to authenticate', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

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
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        expect(() =>
            sut.execute({
                email: userData.email,
                password: userData.password
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong password', async () => {
        const usersRepository = new InMemoryUsersRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: userData.name,
            email: userData.email,
            password_hash: userData.password_hash
        })

        expect(() =>
            sut.execute({
                email: userData.email,
                password: 'another_password'
            })
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
