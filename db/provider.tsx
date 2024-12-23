import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { SQLJsDatabase } from "drizzle-orm/sql-js";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { initialize } from "./drizzle";
import { useMigrationHelper } from "./drizzle";

type ContextType = { db: SQLJsDatabase | ExpoSQLiteDatabase | null };

export const DatabaseContext = React.createContext<ContextType>({ db: null });

export const useDatabase = () => useContext(DatabaseContext);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLJsDatabase | ExpoSQLiteDatabase | null>(null);
  const { success, error } = useMigrationHelper();

  useEffect(() => {
    if (db) return;
    initialize().then((newDb) => {
      console.log("newDb", newDb);
      setDb(newDb);
    });
  }, []);

  return (
    // <>{children}</>
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}
