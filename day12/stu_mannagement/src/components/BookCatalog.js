import React, { useState } from 'react';
import { Card, Input, Table, Tag, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

function BookCatalog({ books, onOpenBorrowModal }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter books in real-time by searching Title or Author
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: 'Book Title', dataIndex: 'title', key: 'title', render: (text) => <strong>{text}</strong> },
    { title: 'Author', dataIndex: 'author', key: 'author' },
    {
      title: 'Status',
      dataIndex: 'available',
      key: 'available',
      render: (available) => (
        <Tag color={available ? 'green' : 'orange'}>
          {available ? 'Available' : 'Issued'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          disabled={!record.available} 
          onClick={() => onOpenBorrowModal(record)}
        >
          Borrow
        </Button>
      )
    }
  ];

  return (
    <Card 
      title="📚 Library Catalog" 
      extra={
        <Input
          placeholder="Search by Title or Author..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 220 }}
          allowClear
        />
      }
    >
      <Table 
        dataSource={filteredBooks} 
        columns={columns} 
        rowKey="id" 
        pagination={{ pageSize: 5 }} 
      />
    </Card>
  );
}

export default BookCatalog;