import { useEffect, useState } from 'react';
import { Modal, Button, Table, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { returnBookThunk, fetchUserThunk } from '../../redux/slice';
import { AppDispatch } from 'redux/store';
import { TBook } from '../../pages/books';

export type TReturnBookModalProps = {
  visible: boolean;
  userId: number;
  onCancel: () => void;
};

export const ReturnBookModal = ({ visible, userId, onCancel }: TReturnBookModalProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: any) => state.library);

  useEffect(() => {
    if (visible) {
      dispatch(fetchUserThunk(userId));
    }
  }, [visible, dispatch, userId]);

  const handleReturn = () => {
    if (selectedRowKeys.length > 0) {
      dispatch(returnBookThunk({ userId, bookId: selectedRowKeys[0], score: score ?? 0 }));
      dispatch(fetchUserThunk(userId));
      onCancel();
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Author', dataIndex: 'author', key: 'author' },
  ];

  return (
    <>
      <Modal
        title="Return Book"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleReturn}
            disabled={selectedRowKeys.length === 0}
          >
            Submit
          </Button>,
        ]}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={user.present?.map(({ book }: { book: TBook}) => book)}
          loading={loading}
          pagination={false}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[]),
          }}
        />
        {selectedRowKeys.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <label>Give a score (1-10):</label>
            <InputNumber
              min={1}
              max={10}
              value={score ?? undefined}
              onChange={(value) => setScore(value)}
              style={{ marginLeft: 10 }}
            />
          </div>
        )}
      </Modal>
    </>
  );
};