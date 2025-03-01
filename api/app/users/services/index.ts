import { paginator } from "../../../utils/paginator";
import { type TPaginationSchema, type TPaginationArgs} from "../../../utils/paginator";
import { prisma } from "../../../prisma";
import { type ICreateUserSchema } from "../validations";


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

export const createUser = async (input: ICreateUserSchema) => {
    return await prisma.user.create({
        data: input
    });
}