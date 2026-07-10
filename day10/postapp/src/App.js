import logo from './logo.svg';
import './App.css';
import UserList from './UserList';
import { QueryClient, QueryClientProvider, queryOptions } from '@tanstack/react-query';
const queryClient = new QueryClient();
function App() {
  return (
 <>
 <QueryClientProvider client={queryClient}>
   <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <UserList />
        </div>
 </QueryClientProvider>
 

 </>
  );
}

export default App;
