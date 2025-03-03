import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchBookThunk } from '../../../redux/slice'
import { AppDispatch } from 'redux/store'
import './style.scss'
import moment from 'moment'
import { Table, type TableColumnsType } from 'antd'
import { type TUser } from '../../users'
import { type TBook } from '../index'


export type THistory = {
  user: TUser
  borrowedAt: Date
  returnedAt: Date | null
}

export type TBookDetails = TBook & {
  score: number
  available: boolean
  currentUserBorrowing: TUser
  history: THistory[]
}

const columns: TableColumnsType<{id: number, name: string, email: string, available: boolean, borrowedAt: Date, returnedAt: Date | null}> = [
  {
    title: 'User ID',
    dataIndex: 'id',
  },
  {
    title: 'User Name',
    dataIndex: 'name',
  },
  {
    title: 'Borrowed Date',
    dataIndex: 'borrowedAt',
    render: (borrowedAt) => moment(borrowedAt).format('MMMM D, YYYY h:mm A')
  },
  {
    title: 'Returned Date',
    dataIndex: 'returnedAt',
    render: (returnedAt) => returnedAt ? moment(returnedAt).format('MMMM D, YYYY h:mm A') : 'Not returned',
  },
  {
    title: 'Status',
    dataIndex: 'available',
    render: (available) =>
      available ? 'Available' : 'UnAvailable',
  },
]

const BookDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { book, loading } = useSelector((state: any) => state.library) as {
    book: TBookDetails | null
    loading: boolean
  }

  useEffect(() => {
    if (id) dispatch(fetchBookThunk(Number(id)))
  }, [dispatch, id])

  return (
    <div className="user-detail">
      <h1>Book Details</h1>
      <div className="detail">
        <p>
          <label>ID:</label> {book?.id}
        </p>
        <p>
          <label>Title:</label> {book?.title}
        </p>
        <p>
          <label>Author:</label> {book?.author}
        </p>
        <p>
          <label>Score:</label> {book?.score}
        </p>
      </div>
      <div className="history">
        <h1>Book History</h1>
        <Table
          rowKey={'id'}
          columns={columns}
          dataSource={book?.history?.map((item) => {
            const { user, ...rest } = item
            return {
              ...user,
              ...rest,
              available: book.available,
            }
          }) || []}
          loading={loading}
          pagination={false}
        />
      </div>
    </div>
  )
}

export default BookDetails
