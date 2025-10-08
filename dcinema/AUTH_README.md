# DCinema Authentication System

Hệ thống xác thực cơ bản cho ứng dụng DCinema được xây dựng theo mô hình MVC (Model-View-Controller).

## Cấu trúc thư mục

```
src/
├── models/           # Model layer
│   └── User.ts      # User model với các phương thức xác thực
├── views/           # View layer  
│   ├── LoginForm.tsx    # Form đăng nhập
│   └── RegisterForm.tsx # Form đăng ký
├── controllers/     # Controller layer
│   └── AuthController.ts # Controller xử lý logic xác thực
├── middleware/      # Middleware
│   └── auth.ts     # Middleware xác thực JWT
├── lib/            # Utilities
│   └── AuthContext.tsx # React Context cho authentication
└── app/
    ├── api/auth/   # API routes
    │   ├── login/route.ts
    │   ├── register/route.ts
    │   ├── me/route.ts
    │   └── logout/route.ts
    ├── login/      # Trang đăng nhập
    ├── register/   # Trang đăng ký
    └── page.tsx    # Trang chủ với thông tin user
```

## Tính năng đã triển khai

### 1. Đăng ký tài khoản
- Form đăng ký với validation
- Mã hóa mật khẩu bằng bcrypt
- Kiểm tra email đã tồn tại
- Tạo JWT token sau khi đăng ký thành công

### 2. Đăng nhập
- Form đăng nhập
- Xác thực email và mật khẩu
- Tạo JWT token sau khi đăng nhập thành công

### 3. Quản lý phiên đăng nhập
- Sử dụng JWT token
- Lưu trữ token trong localStorage
- Tự động xác thực token khi tải trang
- Đăng xuất và xóa token

### 4. Bảo mật
- Mã hóa mật khẩu với bcrypt
- JWT token với thời hạn 7 ngày
- Middleware xác thực cho các API protected
- Validation đầu vào

## Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install bcryptjs jsonwebtoken next-auth @types/bcryptjs @types/jsonwebtoken
```

### 2. Tạo file .env.local
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Chạy ứng dụng
```bash
npm run dev
```

### 4. Truy cập các trang
- Trang chủ: `http://localhost:3000`
- Đăng ký: `http://localhost:3000/register`
- Đăng nhập: `http://localhost:3000/login`

## API Endpoints

### POST /api/auth/register
Đăng ký tài khoản mới
```json
{
  "name": "Tên người dùng",
  "email": "user@example.com",
  "password": "password123"
}
```

### POST /api/auth/login
Đăng nhập
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### GET /api/auth/me
Lấy thông tin user hiện tại (cần token)
```
Authorization: Bearer <jwt_token>
```

### POST /api/auth/logout
Đăng xuất (cần token)
```
Authorization: Bearer <jwt_token>
```

## Sử dụng trong components

```tsx
import { useAuth } from '../lib/AuthContext';

function MyComponent() {
  const { user, login, register, logout, loading } = useAuth();
  
  // Sử dụng các function authentication
}
```

## Lưu ý

- Hệ thống hiện tại sử dụng in-memory storage cho demo
- Trong production, cần thay thế bằng database thật (PostgreSQL, MongoDB, etc.)
- Cần thay đổi JWT_SECRET trong production
- Có thể thêm các tính năng như refresh token, email verification, etc.

## Mở rộng

Để mở rộng hệ thống, bạn có thể:
1. Thêm các role và permission
2. Tích hợp với database thật
3. Thêm email verification
4. Thêm 2FA (Two-Factor Authentication)
5. Thêm social login (Google, Facebook, etc.)
