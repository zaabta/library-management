import { useEffect, useState } from 'react'
import { Modal, Button, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooksThunk, borrowBookThunk, fetchUserThunk } from '../../redux/slice'
import { AppDispatch } from 'redux/store'

export type TBorrowBookModalProps = {
  visible: boolean
  userId: number
  onCancel: () => void
}

export const BorrowBookModal = ({
  visible,
  userId,
  onCancel,
}: TBorrowBookModalProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [page, setPage] = useState<number>(1)
  const dispatch = useDispatch<AppDispatch>()
  const { books, loading } = useSelector((state: any) => state.library)

  useEffect(() => {
    if (visible) {
      dispatch(fetchBooksThunk({ page, perPage: 5, available: true }))
    }
  }, [visible, dispatch, page])

  const handleBorrow = () => {
    if (selectedRowKeys.length > 0) {
      dispatch(borrowBookThunk({ userId, bookId: selectedRowKeys[0] }))
      dispatch(fetchUserThunk(userId))
      onCancel()
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
  ]

  return (
    <>
      <Modal
        title="Available Books"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleBorrow}
            disabled={selectedRowKeys.length === 0}
          >
            Submit
          </Button>,
        ]}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={books.data}
          loading={loading}
          pagination={{ current: page, pageSize: 5, total: books?.meta?.lastPage * books?.meta?.perPage || 0, }}
          onChange={({current}) => current && setPage(current)}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[]),
          }}
        />
      </Modal>
    </>
  )
}
