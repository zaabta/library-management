import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchUserThunk } from '../../../redux/slice'
import { AppDispatch } from 'redux/store'
import moment from 'moment'
import { Table, Button, Space, type TableColumnsType } from 'antd'
import { type TUser } from '../index'
import { DownCircleOutlined, RollbackOutlined } from '@ant-design/icons';
import { BorrowBookModal, ReturnBookModal } from '../../../components'
import './style.scss'

export type TBook = {
  id: number
  title: string
  author: string
}

export type TBorrowedBook = {
  id: number
  userId: number
  bookId: number
  borrowedAt: string
  returnedAt: string | null
}

export type TUserDetails = TUser & {
  past: Array<TBorrowedBook & TBook>
  present: Array<TBorrowedBook & TBook>
}

const columns: TableColumnsType<TBorrowedBook & TBook> = [
  {
    title: 'Book ID',
    dataIndex: 'bookId',
  },
  {
    title: 'Book Name',
    dataIndex: 'book',
    render: (book) => book.title || 'N/A',
  },
  {
    title: 'Borrowed Date',
    dataIndex: 'borrowedAt',
    render: (borrowedAt) => moment(borrowedAt).format('MMMM D, YYYY h:mm A'),
  },
  {
    title: 'Returned Date',
    dataIndex: 'returnedAt',
    render: (returnedAt) =>
      returnedAt ? moment(returnedAt).format('MMMM D, YYYY h:mm A') : 'Not returned',
  },
]

const UserDetails = () => {
  const [isOpenBorrowBookModal, setIsOpenBorrowBookModal] = useState<boolean>(false)
  const [isOpenReturnBookModal, setIsOpenReturnBookModal] = useState<boolean>(false)
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: any) => state.library) as {
    user: TUserDetails | null
    loading: boolean
  }

  useEffect(() => {
    if (id) dispatch(fetchUserThunk(Number(id)))
  }, [dispatch, id])

  return (
    <div className="user-detail">
      <h1>User Details</h1>
      <div className="detail">
        <p>
          <label>ID:</label> {user?.id}
        </p>
        <p>
          <label>Name:</label> {user?.name}
        </p>
        <p>
          <label>Email:</label> {user?.email}
        </p>
      </div>
      <div className="history">
        <h1>User History</h1>
        <Space>
          <Button type="primary" icon={<DownCircleOutlined />} size={'large'} style={{
            backgroundColor: 'var(--vivid-indigo)'
          }} onClick={() => setIsOpenBorrowBookModal(true)}>
            Borrow Book  
          </Button>
          <Button type="primary" icon={<RollbackOutlined />} size={'large'} style={{
            backgroundColor: 'var(--vivid-indigo)'
          }}
          onClick={() => setIsOpenReturnBookModal(true)}
          >
            Return Book  
          </Button>
        </Space>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={[...(user?.past || []), ...(user?.present || [])]}
          loading={loading}
          pagination={{
            pageSize: 5
          }}
        />
      </div>
      <BorrowBookModal visible={isOpenBorrowBookModal} userId={user?.id as number} onCancel={() => setIsOpenBorrowBookModal(false)} />
      <ReturnBookModal visible={isOpenReturnBookModal} userId={user?.id as number} onCancel={() => setIsOpenReturnBookModal(false)} />
    </div>
  )
}

export default UserDetails
