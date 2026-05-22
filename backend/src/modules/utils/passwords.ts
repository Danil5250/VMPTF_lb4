import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string, saltRounds: number): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

export async function validatePassword(plain: string, hashed: string) {
    return await bcrypt.compare(plain, hashed);
}