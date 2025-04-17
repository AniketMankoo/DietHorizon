import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginAsUser = () => setUser({ name: "Regular User", role: "user" });
  const loginAsTrainer = () => setUser({ name: "Trainer", role: "trainer" });
  const loginAsAdmin = () => setUser({ name: "Admin", role: "admin" });
  const logout = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, loginAsUser, loginAsTrainer, loginAsAdmin, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
