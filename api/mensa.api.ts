import axios from "axios";

export interface MensaDayMenu {
  id:          number;
  date:        Date;
  starters:    MensaMenuItem[];
  mainCourses: MensaMenuItem[];
  desserts:    MensaMenuItem[];
}

export interface MensaMenuItem {
  id:    number;
  name:  string;
  type:  "starter" | "main" | "dessert";
  image: string;
}

export const getMensaPlan = async () => {
  try {
    return (await axios.get<MensaDayMenu[]>(`${process.env.NEXT_PUBLIC_API_BASE}/mensa/`)).data;
  } catch (e) {
    return [];
  }
}
