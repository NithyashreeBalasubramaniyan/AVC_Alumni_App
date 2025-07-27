## Student Verification Backend API

### Setup Instructions:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup PostgreSQL Database:**
   - Create a PostgreSQL database named `student_verification`
   - Run the SQL commands from `database/schema.sql`

3. **Configure Environment:**
   - Copy `.env` file and update with your database credentials
   - Set a strong JWT_SECRET

4. **Run the Server:**
   ```bash
   npm run dev  # For development
   npm start    # For production
   ```

### API Endpoints:

#### 1. Register Student
**POST** `/api/auth/register`
```json
{
  "name": "Vimal Dharshan",
  "register_number": "820322104059",
  "phone_number": "9842764239",
  "date_of_birth": "2005-01-02",
  "password": "securepassword"
}
```

#### 2. Login Student
**POST** `/api/auth/login`
```json
{
  "register_number": "820322104059",
  "password": "securepassword"
}
```

#### 3. Verify Student (Main Verification Form)
**POST** `/api/auth/verify`
```json
{
  "name": "Vimal Dharshan",
  "register_number": "820322104059",
  "phone_number": "9842764239",
  "date_of_birth": "2005-01-02",
  "password": "securepassword"
}
```

#### 4. Get Profile (Protected Route)
**GET** `/api/auth/profile`
Headers: `Authorization: Bearer <jwt_token>`

### Frontend Integration Example:

```javascript
// Verify student function
const verifyStudent = async (formData) => {
  try {
    const response = await fetch('http://localhost:3000/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('Verification successful!');
      // Store JWT token
      localStorage.setItem('token', data.data.token);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Verification failed');
  }
};
```

### Database Schema:
- **students** table with fields: id, name, register_number, phone_number, date_of_birth, password, is_verified, created_at, updated_at
- Unique constraints on register_number
- Indexes for performance
- Password hashing with bcrypt
- JWT authentication with configurable expiration. 