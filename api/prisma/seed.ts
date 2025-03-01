import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john@example.com',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
      },
      {
        name: 'Bob Brown',
        email: 'bob@example.com',
      },
      {
        name: 'Charlie White',
        email: 'charlie@example.com',
      },
    ],
  })

  // Create Books
  const books = await prisma.book.createMany({
    data: [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
      },
      {
        title: '1984',
        author: 'George Orwell',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
      },
      {
        title: 'Moby-Dick',
        author: 'Herman Melville',
      },
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
      },
      {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
      },
      {
        title: 'Brave New World',
        author: 'Aldous Huxley',
      },
      {
        title: 'War and Peace',
        author: 'Leo Tolstoy',
      },
      {
        title: 'Crime and Punishment',
        author: 'Fyodor Dostoevsky',
      },
    ],
  })

  console.log('Users created:', users)
  console.log('Books created:', books)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
