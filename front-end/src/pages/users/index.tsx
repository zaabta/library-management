import './style.scss'
import { Table } from 'antd'
import type { TableColumnsType } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsersThunk } from '../../redux/slice'
import { AppDispatch } from '../../redux/store'
import { useNavigate } from 'react-router-dom'
import './style.scss'

export type TUser = {
  id: number
  name: string
  email: string
}

const columns: TableColumnsType<TUser> = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name ',
    dataIndex: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
]

const Users = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading } = useSelector((state: any) => state.library)
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
    },
  })

  useEffect(() => {
    dispatch(
      fetchUsersThunk({
        page: tableParams.pagination.current,
        perPage: tableParams.pagination.pageSize,
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

  const pagination = {
    current: tableParams.pagination.current,
    pageSize: tableParams.pagination.pageSize,
    total: users?.meta?.total || 0,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20'],
  }

  return (
    <div className="books">
      <h1>Users List</h1>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={users?.data || []}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        onRow={(record) => ({
          onClick: () => navigate(`/users/${record.id}`),
        })}
      />
    </div>
  )
}

export default Users
