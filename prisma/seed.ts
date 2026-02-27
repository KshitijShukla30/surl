import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.link.create({
        data: {
            url: 'https://example.com/expired-test',
            shortCode: 'exp123',
            expiresAt: yesterday,
            clicks: 0
        }
    });

    console.log('Successfully created an expired link with code: exp123');
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
