import { paginator } from "../../../utils/paginator";
import { type TPaginationSchema, type TPaginationArgs} from "../../../utils/paginator";
import { prisma } from "../../../prisma";
import { type TCreateUser, type TBorrowBook, TReturnBorrowedBook } from "../validations";


export const getUsers = (paginationSchema: TPaginationSchema) => {
    const paginatorQuery = async ({ skip, take }: TPaginationArgs) => {
        return {
            total: await prisma.user.count(),
            data: await prisma.user.findMany({ skip, take, select: { id: true, name: true, email: true } }),
        };
    };
    return paginator(paginatorQuery, paginationSchema);
}

export const getUserOrThrow = async (id: number) => {
    const foundUser = await prisma.user.findFirstOrThrow({
        where: { id },
            include: {
                borrowedBooks: {
                    include: {
                        book: true, 
                    },
                }
            }
        })
    const { borrowedBooks, ...rest } = foundUser
    const filterBooks = (status: boolean) => borrowedBooks.filter(borrowedBook => 
        status ? borrowedBook.returnedAt === null : borrowedBook.returnedAt !== null
    );
    return {
        ...rest,
        past: filterBooks(false),
        present: filterBooks(true)
          
    }
}

export const createUser = async (input: TCreateUser) => {
    return await prisma.user.create({
        data: input
    });
}

export const borrowBook = async ({ userId, bookId }: TBorrowBook) => {
    const existingBorrow = await getBorrowedBook(bookId, userId);
    if(existingBorrow && !existingBorrow?.returnedAt)
        throw new Error('Book is already borrowed and not returned');
    return await prisma.borrowedBook.create({
        data: {
            userId,
            bookId,
            returnedAt: null
        }
    })
}

export const getBorrowedBook = async (bookId: number, userId: number) => {
    return await prisma.borrowedBook.findFirst({
        where: {
            bookId,
            userId,
            returnedAt: null,
        }
    })   
}

export const returnBook = async ({ userId, bookId, score, comment }: TReturnBorrowedBook) => {
    const existingBorrow = await getBorrowedBook(bookId, userId)
    console.log({existingBorrow})
    if (!existingBorrow) throw new Error('Book has not been borrowed.')
    if (existingBorrow.userId !== userId) throw new Error('Book was borrowed by a different user.')
    if (existingBorrow.returnedAt) throw new Error('Book has already been returned.')
    return await prisma.$transaction([
        prisma.borrowedBook.update({
          where: { id: existingBorrow.id },
          data: { returnedAt: new Date() },
        }),
        prisma.rating.create({
          data: { userId, bookId, rating: score, comment },
        }),
    ])
}