import './style.scss'
import { Switch, Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooksThunk } from '../../redux/slice'
import { AppDispatch } from '../../redux/store'
import { useNavigate } from 'react-router-dom'

export type TBook = {
  id: string
  title: string
  author: string
}

const columns: TableColumnsType<TBook> = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Title',
    dataIndex: 'title',
  },
  {
    title: 'Author',
    dataIndex: 'author',
  },
]

const Books = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const { books, loading } = useSelector((state: any) => state.library)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
    available: false,
  })

  useEffect(() => {
    dispatch(
      fetchBooksThunk({
        page: tableParams.pagination.current,
        perPage: tableParams.pagination.pageSize,
        available: tableParams.available,
      }),
    )
  }, [dispatch, tableParams])

  const handleTableChange = (pagination: any) => {
    setTableParams({
      ...tableParams,
      pagination: {
        ...pagination,
      },
    })
  }

  const handleAvailableChange = () => {
    setTableParams((prev) => ({
      ...tableParams,
      pagination: {
        ...pagination,
      },
      available: !prev.available,
    }))
  }

  const pagination = {
    current: tableParams.pagination.current,
    pageSize: tableParams.pagination.pageSize,
    total: books?.meta?.total || 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20'],
  }

  return (
    <div className="books">
      <h1>Books List</h1>
      <div className="available">
        <p>Show Available Books</p>
        <Switch onChange={handleAvailableChange} />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={books?.data || []}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`/books/${record.id}`),
        })}
      />
    </div>
  )
}

export default Books
