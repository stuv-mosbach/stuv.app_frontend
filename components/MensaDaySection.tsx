import {lectureType} from "../util/lectureUtils";
import moment from "moment";
import React from "react";
import {LectureCard} from "./LectureCard";
import {MensaDayMenu} from "../api/mensa.api";
import {MensaDayCard} from "./MensaDayCard";

interface IProps {
  mensaDay: MensaDayMenu
  allExpanded: boolean
}

export const MensaDaySection = (props: IProps) => {

  return (
    <div className={"mt-3 divide-gray-500 divide-y w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto"}>
      <span className={"text-zinc-200 text-3xl sm:text-4xl font-light select-none"}>{moment(props.mensaDay.date).locale("de").format("dddd - DD.MM.YYYY")}</span>
      <div className="">

        <div className={"mt-3 grid grid-cols-1 gap-5"}>
          {[...props.mensaDay.starters, ...props.mensaDay.mainCourses, ...props.mensaDay.desserts].map(m => <MensaDayCard key={m.id} menuItem={m} expanded={props.allExpanded} />)}
        </div>

      </div>
    </div>
  )
}
