import React, {useEffect, useState} from "react";
import classNames from "classnames";
import {CalendarIcon, ClockIcon, HomeIcon, UserIcon, ViewGridIcon, ViewListIcon} from "@heroicons/react/outline";
import moment from "moment";
import {getLectureColor, lectureType} from "../util/lectureUtils";

interface IProps {
  lecture: lectureType,
  activeLecture?: lectureType,
  percentage?: string,
  allExpanded: boolean
}

export const LectureCard = (props: IProps) => {
  const {lecture} = props;

  const [expanded, setExpanded] = useState(false);

  const running = props.activeLecture ? props.activeLecture.id === props.lecture.id : false;

  const expand = () => {
    setExpanded(!expanded);
  }

  useEffect(() => {
    setExpanded(props.allExpanded);
  }, [props.allExpanded]);

  return (
      <div className={classNames("rounded-xl shadow-2xl py-2 px-4 mt-4 bg-opacity-85",
          getLectureColor(lecture),
          running && props.percentage && "border border-sky-300",
          "transform transition ease-in-out duration-200"
      )}
           onClick={expand}
      >

        <div className={"divide-y divide-zinc-500"}>
          <div className="flex flex-grow">
            <span className={"text-xl text-zinc-300 select-none"}>{lecture.name}</span>
            <div className="flex flex-grow justify-end">
              <div onClick={expand}
                   className="hover:bg-zinc-700 hover:bg-opacity-40 rounded-md text-zinc-300 cursor-pointer p-1">
                {/*<ChevronDownIcon
                  className={classNames("w-7 h-7 transform transition ease-in-out duration-200", expanded && "rotate-180")}/>*/}
                {!expanded && <ViewListIcon className={"w-5 h-5"}/>}
                {expanded && <ViewGridIcon className={"w-5 h-5"}/>}
              </div>
            </div>
          </div>
          <div className={classNames("pt-2 grid gap-2", expanded ? "grid-cols-1" : "grid-cols-2", "select-none")}>

            <div className="flex gap-2">
              <CalendarIcon className={"text-zinc-300 h-5 w-5 flex-none"}/>
              <span className={"flex-grow text-zinc-300 truncate"}>{moment(lecture.date).format("DD.MM.YYYY")}</span>
            </div>

            {lecture.lecturer?.length > 0 &&
            <div className="flex gap-2 inline-block align-middle">
              <UserIcon className={"text-zinc-300 h-5 w-5 flex-none align-bottom bg-"}/>
              <span className={"flex-grow text-zinc-300 truncate"}>{lecture.lecturer}</span>
            </div>
            }

            <div className="flex gap-2 inline-block align-middle">
              <ClockIcon className={"text-zinc-300 h-5 w-5 flex-none"}/>
              <span
                  className={"flex-grow text-zinc-300 truncate"}>{moment(lecture.startTime).format("kk.mm")} - {moment(lecture.endTime).format("kk.mm")} {running && props.percentage &&
              <span className={"text-zinc-500"}>{props.percentage + " %"}</span>}</span>
            </div>

            {lecture.rooms.length > 0 && !expanded &&
            <div className="flex gap-2 inline-block align-middle">
              <HomeIcon className={"text-zinc-300 h-5 w-5 flex-none"}/>
              <span className={"flex-grow text-zinc-300 truncate"}>{lecture.rooms.join(", ")}</span>
            </div>
            }

            {lecture.rooms.length > 0 && expanded &&
            lecture.rooms.map(r => (
                <div className="flex gap-2 inline-block align-middle" key={r}>
                  <HomeIcon className={"text-zinc-300 h-5 w-5 flex-none"}/>
                  <span className={"flex-grow text-zinc-300 truncate"}>{r}</span>
                </div>
            ))
            }

          </div>
        </div>

      </div>
  )
}
