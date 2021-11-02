import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {DetailedUpdateInfo, getUpdateInfo, Lecture, UpdatedLecture} from "../../util/syncUtils";
import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import Layout from "../../components/Layout";
import classNames from "classnames";
import moment from "moment";
import {getLectureColor} from "../../util/lectureUtils";
import {
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  ViewGridIcon,
  ViewListIcon
} from "@heroicons/react/outline";
import {getRandomAnimal} from "../../util/animalUtils";

const UpdateInfoPage = () => {

  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updateId, setUpdateId] = useState("X");
  const [updateInfo, setUpdateInfo] = useState<DetailedUpdateInfo>();

  const [randomAnimal, setRandomAnimal] = useState(getRandomAnimal());

  useEffect(() => {
    if (router.isReady) {
      const updateId = router.query.updateId as string;
      setUpdateId(updateId);
      const updateIdNum = parseInt(updateId);
      if (isNaN(updateIdNum)) {
        setLoading(false);
        return;
      }
      getUpdateInfo(updateIdNum).then(res => {
        setUpdateInfo(res);
        setLoading(false);
      });
    }
  }, [router.isReady]);

  const TableRow = (props: { left: React.ReactNode, right: React.ReactNode }) => {
    return (
      <>
        <div className={"md:hidden"}/>
        <div className={"text-xl text-gray-500 flex flex-row"}>
          {props.left}
          <div className={"ml-1 md:block hidden text-gray-100"}>
            {props.right}
          </div>
        </div>
        <div className={"md:hidden"}/>
        <div className={"text-xl md:hidden text-gray-100"}>{props.right}</div>
        <div className={"md:hidden"}/>
      </>
    )
  }

  const LectureInfo = (props : { lecture: Lecture, status: "NEW" | "REMOVED" }) => {
    return (
      <div className={classNames("rounded-xl shadow-2xl py-2 px-4 mt-4 bg-opacity-85",
        getLectureColor(props.lecture), props.status === "REMOVED" ? "border border-red-300" : "border border-green-300",
        "transform transition ease-in-out duration-200"
      )}>

        <div className={"divide-y divide-gray-500"}>
          <div className="flex flex-grow">
            <span className={"text-xl text-gray-300 select-none truncate"}>{props.lecture.name}</span>
          </div>
          <div className={classNames("pt-2 grid gap-2 grid-cols-1 select-none")}>

            {props.lecture.lecturer?.length > 0 &&
            <div className="flex gap-2 inline-block align-middle">
                <UserGroupIcon className={"text-gray-300 h-5 w-5 flex-none align-bottom bg-"}/>
                <span className={"flex-grow text-gray-300 truncate"}>{props.lecture.course}</span>
            </div>
            }

            <div className="flex gap-2">
              <CalendarIcon className={"text-gray-300 h-5 w-5 flex-none"}/>
              <span className={"flex-grow text-gray-300 truncate"}>{moment(props.lecture.date).format("DD.MM.YYYY")}
                <span className={"text-gray-400"}>
                  {""} {moment(props.lecture.startTime).format("kk.mm")} - {moment(props.lecture.endTime).format("kk.mm")}
                </span>
              </span>
            </div>

            {props.lecture.lecturer?.length > 0 &&
            <div className="flex gap-2 inline-block align-middle">
                <UserIcon className={"text-gray-300 h-5 w-5 flex-none align-bottom bg-"}/>
                <span className={"flex-grow text-gray-300 truncate"}>{props.lecture.lecturer}</span>
            </div>
            }

            {props.lecture.rooms.length > 0 &&
              props.lecture.rooms.map(r => (
                <div className="flex gap-2 inline-block align-middle" key={r}>
                  <HomeIcon className={"text-gray-300 h-5 w-5 flex-none"}/>
                  <span className={"flex-grow text-gray-300 truncate"}>{r}</span>
                </div>
              ))
            }

          </div>
        </div>

      </div>
    )
  }

  const ChangedLecture = (props : { lecture: UpdatedLecture}) => {

    const hasChange = (...key : (keyof Lecture)[]) : boolean => {
      return !!props.lecture.changeInfos.find(ci => key.indexOf(ci.fieldName) !== -1);
    }

    const getChangeInfo = (key : keyof Lecture) => {
      return props.lecture.changeInfos.find(ci => ci.fieldName === key);
    }

    const hasLecturerChange = hasChange("lecturer");
    const hasDateChange = hasChange("date", "startTime", "endTime");

    const RenderDateTime = () => {
      if (hasDateChange) {
        const startTimeChange = getChangeInfo("startTime");
        const startTime = moment(startTimeChange ? startTimeChange.value : props.lecture.lecture.startTime);
        const endTimeChange = getChangeInfo("endTime");
        const endTime = moment(endTimeChange ? endTimeChange.value : props.lecture.lecture.endTime);

        return (
          <>
            {
              <div className="flex gap-2">
                <CalendarIcon className={classNames("text-gray-300 h-5 w-5 flex-none","text-red-300")}/>
                <span className={"flex-grow text-gray-300 truncate"}>{moment(props.lecture.lecture.date).format("DD.MM.YYYY")}
                  <span className={"text-gray-400"}>
                  {""} {moment(props.lecture.lecture.startTime).format("kk.mm")} - {moment(props.lecture.lecture.endTime).format("kk.mm")}
                </span>
              </span>
              </div>
            }
            {
              <div className="flex gap-2">
                <CalendarIcon className={classNames("text-gray-300 h-5 w-5 flex-none", "text-green-300")}/>
                <span className={"flex-grow text-gray-300 truncate"}>{moment(startTime).format("DD.MM.YYYY")}
                  <span className={"text-gray-400"}>
                  {""} {moment(startTime).format("kk.mm")} - {moment(endTime).format("kk.mm")}
                </span>
              </span>
              </div>
            }
          </>
        )

      }

      return (
        <div className="flex gap-2">
          <CalendarIcon className={classNames("text-gray-300 h-5 w-5 flex-none")}/>
          <span className={"flex-grow text-gray-300 truncate"}>{moment(props.lecture.lecture.date).format("DD.MM.YYYY")}
            <span className={"text-gray-400"}>
                  {""} {moment(props.lecture.lecture.startTime).format("kk.mm")} - {moment(props.lecture.lecture.endTime).format("kk.mm")}
                </span>
              </span>
        </div>
      )
    }

    const RenderRooms = () => {
      const roomChange = getChangeInfo("rooms");
      if (roomChange) {
        const prvVal = roomChange.previousValue.split(",");
        const newVal = roomChange.value.split(",");

        const remRoom : string[] = [];
        const oldRoom : string[] = [];
        const newRoom : string[] = [];

        prvVal.forEach(pr => {
          if (newVal.indexOf(pr) === -1) remRoom.push(pr);
          else oldRoom.push(pr);
        })

        newVal.forEach(pr => {
          if (prvVal.indexOf(pr) === -1) newRoom.push(pr);
          else if (oldRoom.indexOf(pr) === -1) oldRoom.push(pr);
        })

        return (
         <>
           {
             remRoom.filter(r => r.trim().length > 0).map(r =>
               <div className="flex gap-2 inline-block align-middle" key={r}>
                 <HomeIcon className={classNames("text-gray-300 h-5 w-5 flex-none", "text-red-300")}/>
                 <span className={"flex-grow text-gray-300 truncate"}>{r}</span>
               </div>
             )
           }
           {
             oldRoom.filter(r => r.trim().length > 0).map(r =>
               <div className="flex gap-2 inline-block align-middle" key={r}>
                 <HomeIcon className={classNames("text-gray-300 h-5 w-5 flex-none", "text-gray-300")}/>
                 <span className={"flex-grow text-gray-300 truncate"}>{r}</span>
               </div>
             )
           }
           {
             newRoom.filter(r => r.trim().length > 0).map(r =>
               <div className="flex gap-2 inline-block align-middle" key={r}>
                 <HomeIcon className={classNames("text-gray-300 h-5 w-5 flex-none", "text-green-300")}/>
                 <span className={"flex-grow text-gray-300 truncate"}>{r}</span>
               </div>
             )
           }
         </>
        )

      }

      return (
        <>
          {
            props.lecture.lecture.rooms.map(r => (
              <div className="flex gap-2 inline-block align-middle" key={r}>
                <HomeIcon className={classNames("text-gray-300 h-5 w-5 flex-none")}/>
                <span className={"flex-grow text-gray-300 truncate"}>{r}</span>
              </div>
            ))
          }
        </>
      )
    }

    return (
      <div className={classNames("rounded-xl shadow-2xl py-2 px-4 mt-4 bg-opacity-85",
        getLectureColor(props.lecture.lecture), "transform transition ease-in-out duration-200"
      )}>

        <div className={"divide-y divide-gray-500"}>
          <div className="flex flex-grow">
            <span className={"text-xl text-gray-300 select-none truncate"}>{props.lecture.lecture.name}</span>
          </div>
          <div className={classNames("pt-2 grid gap-2 grid-cols-1 select-none")}>

            {props.lecture.lecture.course &&
            <div className="flex gap-2 inline-block align-middle">
                <UserGroupIcon className={"text-gray-300 h-5 w-5 flex-none"}/>
                <span className={"flex-grow text-gray-300 truncate"}>{props.lecture.lecture.course}</span>
            </div>
            }

            <RenderDateTime />

            {props.lecture.lecture.lecturer?.length > 0 &&
              <div className="flex gap-2 inline-block align-middle">
                <UserIcon className={classNames("text-gray-300 h-5 w-5 flex-none", hasLecturerChange && "text-red-300")}/>
                <span className={"flex-grow text-gray-300 truncate"}>{props.lecture.lecture.lecturer}</span>
              </div>
            }

            {props.lecture.lecture.lecturer?.length > 0 && hasLecturerChange &&
              <div className="flex gap-2 inline-block align-middle">
                <UserIcon className={classNames("text-gray-300 h-5 w-5 flex-none", "text-green-300")}/>
                <span className={"flex-grow text-gray-300 truncate"}>{getChangeInfo("lecturer")?.value}</span>
              </div>
            }

            <RenderRooms />

          </div>
        </div>

      </div>
    )
  }

  const hasChanges = updateInfo && (updateInfo.newLectures.length > 0 || updateInfo.updatedLectures.length > 0 || updateInfo.removedLectures.length > 0);
  const animalName = randomAnimal ? randomAnimal.split("-").join(" ") : "";

  return (
    <Layout title={`Update ${updateId}`}>

      <div
        className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="flex flex-grow justify-center">
            <div
              className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-gray-900 pt-2 pb-3 px-8 rounded-xl">
              <span className={"text-gray-200 text-2xl font-semibold select-none"}>{`Update ${updateId}`}</span>
            </div>
          </div>
        </div>

        <Link href={"/updates"}>
          <div
            className={"flex ml-2 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200"}>
            <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"}/>
            <span className={"text-xl text-gray-200 hidden lg:block"}>Back</span>
          </div>
        </Link>

      </div>

      {loading &&
      <div className={"flex flex-col flex-grow justify-center items-center min-h-screen"}>
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"/>
      </div>
      }

      {(!loading && updateInfo) &&
      <div
          className="w-full overflow-y-scroll scroll-hidden bg-gradient-to-b from-gray-900 to-blueGray-900"
          style={{height: "calc(100vh - 52px)"}}
      >

          <div className=" mx-auto">
              <div className={"flex flex-col items-center"}>

                  <div className={"w-11/12 w-full mx-auto select-none"}>
                      <div
                          className={classNames("rounded-xl py-2 px-4 mt-4 ", "transform transition ease-in-out duration-200")}>
                          <div className="grid grid-cols-5 md:grid-cols-5">
                            <div className="md:block hidden"/>
                            <TableRow left={"Datum:"} right={moment(updateInfo.startTime).format("DD.MM.YYYY")}/>
                            <TableRow left={"Start:"} right={moment(updateInfo.startTime).format("HH:mm:ss")}/>
                            <TableRow left={"Ende:"} right={moment(updateInfo.endTime).format("HH:mm:ss")}/>
                            <TableRow left={"Dauer:"} right={`${moment(updateInfo.endTime).diff(moment(updateInfo.startTime), "seconds")}s`}/>
                          </div>
                      </div>
                  </div>

              </div>
          </div>

        {hasChanges && <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mx-2">

          <div className={"mt-3 divide-gray-500 divide-y"}>
            <span className={"text-gray-200 text-4xl font-light select-none"}>Neu <span
              className={"text-gray-400"}>({updateInfo.newLectures.length})</span>:</span>
            <div className={"mt-3"}>
              {updateInfo.newLectures.map((l, i) => <LectureInfo key={`nl-${i}`} lecture={l} status={"NEW"}/>)}
            </div>
          </div>


          <div className={"mt-3 divide-gray-500 divide-y"}>
            <span className={"text-gray-200 text-4xl font-light select-none"}>Verändert <span
              className={"text-gray-400"}>({updateInfo.updatedLectures.length})</span>:</span>
            <div className={"mt-3"}>
              {updateInfo.updatedLectures.map((l, i) => <ChangedLecture key={`nl-${i}`} lecture={l}/>)}
            </div>
          </div>

          <div className={"mt-3 divide-gray-500 divide-y"}>
            <span className={"text-gray-200 text-4xl font-light select-none"}>Entfernt <span
              className={"text-gray-400"}>({updateInfo.removedLectures.length})</span>:</span>
            <div className={"mt-3"}>
              {updateInfo.removedLectures.map((l, i) => <LectureInfo key={`nl-${i}`} lecture={l} status={"REMOVED"}/>)}
            </div>
          </div>

        </div>}

        {!hasChanges &&
        <div style={{height: "calc(100vh - 52px - 60px)"}} className="flex flex-col items-center justify-center">
          <div className="select-none">
              <div className="flex flex-col items-center justify-center">
                  <img className={"w-3/5"} alt={`Hier sollte ein Bild von '${animalName} sein.'`} src={`/animals/${randomAnimal}.svg`} />
              </div>
              <span className={"text-gray-400 text-xl"}>Es gibt hier keine Veränderungen, aber hier ist ein {animalName}</span>
          </div>
        </div>
        }

      </div>
      }

    </Layout>
  );
};

export default UpdateInfoPage;
