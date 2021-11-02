import React, {useState} from 'react';
import classNames from "classnames";
import {CalendarIcon, HomeIcon, UserIcon, ViewGridIcon, ViewListIcon} from "@heroicons/react/outline";
import moment from "moment";
import 'moment/locale/de'
import {UpdateInfo} from "../util/syncUtils";
import {CalendarMinus, CalendarPlus, Clock, ExternalLink, Replace} from "tabler-icons-react";
import {useRouter} from "next/router";
import {leadingZeros} from "../util/numberUtils";

interface IProps {
  updateInfo: UpdateInfo
}

const UpdateInfoCard = (props: IProps) => {

  moment.locale("de");

  const router = useRouter();

  const expand = (e : React.MouseEvent<HTMLDivElement>) => {
    if (e.shiftKey) {
      window.open(`/updates/${props.updateInfo.id}`, "popup")
    } else {
      router.push(`/updates/${props.updateInfo.id}`);
    }
  }

  return (
    <div className={"w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto select-none"}>
      <div className={classNames("rounded-xl shadow-2xl py-2 px-4 mt-4 bg-opacity-85 bg-gray-900", "transform transition ease-in-out duration-200")}>

        <div className={"divide-y divide-gray-500"}>
          <div className="flex flex-grow">
            <span
              className={"text-xl text-gray-300 select-none"}>
              <span className={"text-gray-500"}>#{leadingZeros(props.updateInfo.id, 4)} </span>
              {moment(props.updateInfo.startTime).locale("de").format("dd - DD.MM.YYYY HH:mm")}
            </span>
            <div className="flex flex-grow justify-end">
              <div onClick={expand}
                   className="hover:bg-gray-700 hover:bg-opacity-40 rounded-md text-gray-300 cursor-pointer p-1">
                <ExternalLink className={"w-5 h-5"}/>
              </div>
            </div>
          </div>
          <div className={classNames("pt-2 grid gap-2 grid-cols-4")}>

            <div className="flex gap-2">
              <Clock className={"text-gray-300 h-5 w-5 flex-none"}/>
              <span className={"flex-grow text-gray-300 truncate"}>{moment(props.updateInfo.endTime).diff(moment(props.updateInfo.startTime), "seconds")}s</span>
            </div>

            <div className="flex gap-2">
              <CalendarPlus className={"text-green-300 h-5 w-5 flex-none"}/>
              <span className={"flex-grow text-gray-300 truncate"}>{props.updateInfo.newCount}</span>
            </div>

            <div className="flex gap-2 inline-block align-middle">
              <Replace className={"text-gray-300 h-5 w-5 flex-none align-bottom bg-"}/>
              <span className={"flex-grow text-gray-300 truncate"}>{props.updateInfo.updatedCount}</span>
            </div>

            <div className="flex gap-2 inline-block align-middle">
              <CalendarMinus className={"text-red-300 h-5 w-5 flex-none"}/>
              <span className={"flex-grow text-gray-300 truncate"}>{props.updateInfo.removedCount}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default UpdateInfoCard;
