import {lectureType} from "../util/lectureUtils";
import moment from "moment";
import React from "react";
import {LectureCard} from "./LectureCard";

interface IProps {
  lectures: lectureType[]
  activeLecture?: lectureType,
  percentage?: string,
  allExpanded: boolean
}

export const LectureSection = (props: IProps) => {

  return (
      <div className={"mt-3 divide-gray-500 divide-y w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto animate__animated animate__bounceInUp"}>
        <span
            className={"text-zinc-200 text-4xl font-light select-none"}>{moment(props.lectures[0].date).locale("de").format("dddd - DD.MM.YYYY")}</span>
        <div className="">

          <div className={"mt-3"}>
            {props.lectures.map(l =>
              <LectureCard key={l.id}
                lecture={l}
                activeLecture={props.activeLecture}
                percentage={props.percentage}
                allExpanded={props.allExpanded}
              />
            )}
          </div>

        </div>
      </div>
  )
}
