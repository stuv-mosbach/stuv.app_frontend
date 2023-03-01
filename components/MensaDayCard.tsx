import {MensaDayMenu, MensaMenuItem} from "../api/mensa.api";
import {HoverAnimation} from "./HoverAnimation";

interface IProps {
  menuItem: MensaMenuItem
  expanded: boolean
}

const translateType = (type : string) => {
  switch (type) {
    case "starter":
      return "Vorspeise"
    case "main":
      return "Hauptspeise"
    case "dessert":
      return "Dessert"
    default:
      return "Unbekannt"
  }
}

export const MensaDayCard = (props : IProps) => {
  
  return (
    <HoverAnimation>
      <div className={"h-24 w-full rounded-lg bg-gray-200 bg-opacity-10 flex gap-2 shadow-2xl **hover:scale-[101%] duration-75 ease-in-out"}>
        <img src={props.menuItem.image} alt="Bild" className={"rounded-l-lg flex-grow-0"}/>
        <div className="-auto">
          <div className={"text-md sm:text-xl text-gray-400 font-light flex-grow"}>{translateType(props.menuItem.type)}</div>
          <div className={"text-lg sm:text-2xl text-gray-200 font-light flex-grow"}>{props.menuItem.name}</div>
        </div>
      </div>
    </HoverAnimation>
  )
  
}