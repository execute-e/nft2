import { createContext, type Dispatch, type SetStateAction } from "react";

type BurgerMenuContextType = {
    active: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const BurgerMenuContext = createContext<BurgerMenuContextType>({active: false, setActive: () => {}});