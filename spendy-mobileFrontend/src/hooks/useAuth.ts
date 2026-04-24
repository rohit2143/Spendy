import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/src/store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);
  return {
    ...auth,
    isAuthenticated: Boolean(auth.token && auth.user)
  };
}
