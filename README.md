# Community-Forum-Application

## Installation
1. **Clone the repository**:https://github.com/Marc-J-L/Community-Forum-Application.git
    ```
    git clone 
    ```

3. **Setup Firebase**:

    - Go to **Firebase Console** and create a new project.
    - Enable **Authentication** with email/password.
    - Enable **Firestore Database** and **Storage**.

3. **Setup Environment Variables**:
   - **Frontend**: In the `frontend` folder, copy the `.env.example` file and configure the variables in the new `.env` file:
     ```
     cp frontend/.env.example frontend/.env
     ```
     
   - **Backend**: In the `backend` folder, copy the `.env.example` file and configure the variables in the new `.env` file:
     ```
     cp backend/.env.example backend/.env
     ```
     
4. **Install Frontend Dependencies**:
   
   ```
   cd frontend
   npm install
   ```

5. **Run the Application**:
   - Start the backend server:
     ```
     cd backend
     dotnet run
     ```
     
   - Start the frontend:
     ```
     cd frontend
     npm run dev
     ```
