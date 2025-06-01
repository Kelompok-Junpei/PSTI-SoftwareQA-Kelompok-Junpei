import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OrderHistory from '../../scode/OrderHistory';
import { orderAPI } from '../../services/api';

jest.mock('../../services/api');
jest.mock('../../components/common/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});
jest.mock('../../components/modal/ReviewModal', () => {
  return function MockReviewModal({ isOpen, onClose }) {
    return isOpen ? <div data-testid="review-modal" onClick={onClose}>Review Modal</div> : null;
  };
});

const mockSwal = {
  fire: jest.fn()
};
global.Swal = mockSwal;

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    status: 'delivered',
    date: '2024-01-15T10:30:00Z',
    total: 250000,
    paymentMethod: 'midtrans',
    trackingNumber: 'TRK123456',
    canCancel: false,
    canMarkDelivered: false,
    items: [
      {
        id: 'item1',
        productId: 'prod1',
        name: 'Gaming Mouse',
        price: 150000,
        quantity: 1,
        image: '/images/mouse.jpg'
      },
      {
        id: 'item2', 
        productId: 'prod2',
        name: 'Gaming Keyboard',
        price: 100000,
        quantity: 1,
        image: '/images/keyboard.jpg'
      }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      phoneNumber: '081234567890',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '12345'
    },
    shippingMethod: 'jne_reg'
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    status: 'processing',
    date: '2024-01-20T14:15:00Z',
    total: 500000,
    paymentMethod: 'midtrans',
    canCancel: true,
    canMarkDelivered: false,
    items: [
      {
        id: 'item3',
        productId: 'prod3',
        name: 'Gaming Headset',
        price: 500000,
        quantity: 1,
        image: '/images/headset.jpg'
      }
    ],
    shippingAddress: {
      fullName: 'Jane Smith',
      phoneNumber: '087654321098',
      address: 'Jl. Thamrin No. 456',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      postalCode: '54321'
    },
    shippingMethod: 'pos_nextday'
  }
];

describe('Manajemen Pesanan - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    orderAPI.getMyOrders.mockResolvedValue({
      data: {
        data: mockOrders,
        pagination: {
          totalPages: 1,
          currentPage: 1,
          totalItems: 2
        }
      }
    });
  });

  describe('Requirement 1: Melihat daftar pesanan', () => {
    
    test('Menampilkan daftar pesanan dengan informasi dasar', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      expect(screen.getByText('ORD-001')).toBeInTheDocument();
      expect(screen.getByText('Gaming Mouse')).toBeInTheDocument();
      expect(screen.getByText('Rp 250.000')).toBeInTheDocument();
      
      expect(screen.getByText('ORD-002')).toBeInTheDocument();
      expect(screen.getByText('Gaming Headset')).toBeInTheDocument();
      expect(screen.getByText('Rp 500.000')).toBeInTheDocument();
      
      expect(screen.getByText('DELIVERED')).toBeInTheDocument();
      expect(screen.getByText('PROCESSING')).toBeInTheDocument();
    });

    test('Menampilkan informasi jumlah item di pesanan', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Gaming Mouse +1 more item')).toBeInTheDocument();
      expect(screen.getByText('2 item(s)')).toBeInTheDocument();
      
      expect(screen.getByText('Gaming Headset')).toBeInTheDocument();
      expect(screen.getByText('1 item(s)')).toBeInTheDocument();
    });

    test('Filter pesanan berdasarkan status', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const statusFilter = screen.getByDisplayValue('All Orders');
      fireEvent.change(statusFilter, { target: { value: 'processing' } });
      
      expect(orderAPI.getMyOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'processing'
        })
      );
    });

    test('Pencarian pesanan berdasarkan order number', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText('Search by order ID or product name...');
      fireEvent.change(searchInput, { target: { value: 'ORD-001' } });
      
      await waitFor(() => {
        expect(screen.getByText('matching "ORD-001"')).toBeInTheDocument();
      });
    });

    test('Pencarian pesanan berdasarkan nama produk', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const searchInput = screen.getByPlaceholderText('Search by order ID or product name...');
      fireEvent.change(searchInput, { target: { value: 'Gaming Mouse' } });
      
      await waitFor(() => {
        expect(screen.getByText('matching "Gaming Mouse"')).toBeInTheDocument();
      });
    });

    test('Menampilkan pagination controls', async () => {
      orderAPI.getMyOrders.mockResolvedValue({
        data: {
          data: mockOrders,
          pagination: {
            totalPages: 3,
            currentPage: 1,
            totalItems: 15
          }
        }
      });
      
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      expect(screen.getByText(/Showing.*of.*orders/)).toBeInTheDocument();
    });

    test('Menampilkan pesan ketika tidak ada pesanan', async () => {
      orderAPI.getMyOrders.mockResolvedValue({
        data: {
          data: [],
          pagination: {
            totalPages: 0,
            currentPage: 1,
            totalItems: 0
          }
        }
      });
      
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('No Orders Found')).toBeInTheDocument();
        expect(screen.getByText("You don't have any orders yet.")).toBeInTheDocument();
        expect(screen.getByText('Shop Now')).toBeInTheDocument();
      });
    });

    test('Filter berdasarkan tanggal', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const dateFilter = screen.getByDisplayValue('All Time');
      fireEvent.change(dateFilter, { target: { value: '7days' } });
      
      expect(orderAPI.getMyOrders).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String)
        })
      );
    });
  });


  describe('Requirement 2: Melihat detail pesanan tertentu', () => {
    
    test('Membuka detail pesanan saat tombol view details diklik', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByTitle(/View Details/);
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Order Items')).toBeInTheDocument();
        expect(screen.getByText('Shipping Information')).toBeInTheDocument();
      });
    });

    test('Menampilkan semua item dalam pesanan di detail view', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByTitle(/View Details/);
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Gaming Mouse')).toBeInTheDocument();
        expect(screen.getByText('Gaming Keyboard')).toBeInTheDocument();
        
        expect(screen.getByText('1 x Rp 150.000')).toBeInTheDocument();
        expect(screen.getByText('1 x Rp 100.000')).toBeInTheDocument();
      });
    });

    test('Menampilkan informasi pengiriman di detail pesanan', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByTitle(/View Details/);
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Shipping Information')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('081234567890')).toBeInTheDocument();
        expect(screen.getByText(/Jl\. Sudirman No\. 123/)).toBeInTheDocument();
        expect(screen.getByText('JNE REG')).toBeInTheDocument();
      });
    });

    test('Menampilkan tracking number jika ada', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByTitle(/View Details/);
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Tracking Number:')).toBeInTheDocument();
        expect(screen.getByText('TRK123456')).toBeInTheDocument();
      });
    });

    test('Menampilkan order timeline untuk pesanan', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByTitle(/View Details/);
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Order Timeline')).toBeInTheDocument();
        expect(screen.getByText('Order Placed')).toBeInTheDocument();
        expect(screen.getByText('Processing')).toBeInTheDocument();
        expect(screen.getByText('Delivered')).toBeInTheDocument();
      });
    });

    test('Menampilkan link ke product detail', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByTitle(/View Details/);
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        const productLinks = screen.getAllByText('View Full Product Details');
        expect(productLinks).toHaveLength(2); 
      });
    });

    test('Menyembunyikan detail pesanan saat tombol diklik lagi', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const viewButtons = screen.getAllByTitle(/View Details/);
      fireEvent.click(viewButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText('Order Items')).toBeInTheDocument();
      });
      
      const hideButton = screen.getByTitle('Hide Details');
      fireEvent.click(hideButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Order Items')).not.toBeInTheDocument();
      });
    });

    test('Menampilkan tombol action sesuai status pesanan', async () => {
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('My Order History')).toBeInTheDocument();
      });
      
      const cancelButtons = screen.getAllByTitle('Cancel Order');
      expect(cancelButtons).toHaveLength(1); 
      
      const printButtons = screen.getAllByTitle('Download Invoice');
      expect(printButtons).toHaveLength(2);
    });
  });


  describe('Error Handling', () => {
    
    test('Menampilkan error message ketika gagal fetch pesanan', async () => {
      orderAPI.getMyOrders.mockRejectedValue(new Error('Network error'));
      
      renderWithRouter(<OrderHistory />);
      
      await waitFor(() => {
        expect(screen.getByText(/Network error/)).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
      });
    });

    test('Menampilkan loading state saat fetch pesanan', () => {
      orderAPI.getMyOrders.mockImplementation(() => new Promise(() => {}));
      
      renderWithRouter(<OrderHistory />);
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });
}); 