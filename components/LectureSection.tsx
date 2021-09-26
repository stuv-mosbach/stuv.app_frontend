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
      <div className={"mt-3 divide-gray-500 divide-y w-full"}>
        <span
            className={"text-gray-200 text-4xl font-light select-none"}>{moment(props.lectures[0].date).locale("de").format("dddd - DD.MM.YYYY")}</span>
        <div className="">

          <div className={"mt-3"}>
            {props.lectures.map(l => <LectureCard key={l.id}
                                                  lecture={l}
                                                  activeLecture={props.activeLecture}
                                                  percentage={props.percentage}
                                                  allExpanded={props.allExpanded}
            />)}
          </div>

        </div>
      </div>
  )
}
