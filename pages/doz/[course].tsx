import type { NextPage } from 'next'
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  HomeIcon,
  ShareIcon, TemplateIcon, UserGroupIcon,
  UserIcon, ViewGridIcon,
  ViewListIcon
} from "@heroicons/react/outline";
import moment from "moment";
import 'moment/locale/de'
import Layout from "../../components/Layout";
import classNames from "classnames";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import Link from 'next/link';

interface lectureType {
  id?: number,
  date: Date,
  startTime: Date,
  endTime: Date,
  name: string,
  type: "PRESENCE" | "ONLINE" | "HYBRID",
  lecturer: string,
  rooms: string[],
  course: string,
  used?: boolean,
}

const groupLectures = (lectures : lectureType[]) => {
  const grouped : lectureType[][] = [];
  if (lectures.length === 0) return [];
  let date = lectures[0].date;
  let list : lectureType[] = [];
  lectures.forEach(l => {
    if (date.valueOf() === l.date.valueOf()) {
      list.push(l);
    } else {
      grouped.push(list);
      list = [l];
      date = l.date;
    }
  })
  grouped.push(list);
  return grouped;
}

const CoursePage: NextPage = () => {

  const router = useRouter();

  moment.locale("de");

  const [course, setCourse] = useState<string | undefined>(undefined);
  const [lectures, setLectures] = useState<lectureType[][]>([]);
  const [loading, setLoading] = useState(true);
  const [allExpanded, setAllExpanded] = useState(false);

  const [activeLecture, setActiveLecture] = useState<lectureType | undefined>();
  const [percentage, setPercentage] = useState<string>();

  const toggleAll = () => {
    setAllExpanded(!allExpanded);
  }

  useEffect(() => {
    if (router.isReady) {
      setCourse(router.query.course as string);
    }
  }, [router.isReady]);

  const updateActiveLecture = (lectures : lectureType[][]) => {
    const lactiveLecture = lectures.flatMap(l => l).find(l => moment().isBetween(l.startTime, l.endTime));

    if (lactiveLecture) {
      setActiveLecture(lactiveLecture);

      const duration = moment.duration(moment(lactiveLecture.startTime).diff(lactiveLecture.endTime)).asSeconds();
      const currentDuration = moment.duration(moment().diff(lactiveLecture.endTime)).asSeconds();
      const newPercentage = (100 - currentDuration / duration * 100).toFixed(2);
      if (newPercentage !== percentage) setPercentage(newPercentage);

    } else {
      setActiveLecture(undefined);
      setPercentage(undefined);
    }
  }

  useEffect(() => {
    if (course) {
      axios.get<lectureType[]>(`${process.env.NEXT_PUBLIC_API_BASE}/rapla/lecturer/${course}`).then(res => {
        const groupedLectures = groupLectures(res.data);
        setLectures(groupedLectures);
        updateActiveLecture(groupedLectures);
        setLoading(false);
      }).catch(err => {
        console.log(err);
        router.push("/");
      });
    }
  }, [course]);

  useEffect(() => {

    const interval = setInterval(() => {

      if (lectures && lectures.length > 0) updateActiveLecture(lectures);

    }, 5 * 1000);

    return () => {
      clearInterval(interval);
    }
  }, [lectures, activeLecture]);

  const share = () => {
    window.navigator.share({
      title: `${course} | Vorlesungsplan`,
      url: window.location.href,
      text: `Öffne diesen Link um die Vorlesung des Kurses '${course}' zu sehen.`
    });
  }

  const getColor = (lecture : lectureType) => {
    if (lecture.name.toLowerCase().includes("klausur") || lecture.name.toLowerCase().includes("prüfung")) {
      return "bg-red-800";
    } else if (lecture.type === "ONLINE" || lecture.type === "HYBRID") {
      return "bg-sky-800";
    } else if (lecture.rooms.length === 0 && (lecture.lecturer === undefined || lecture.lecturer.length === 0)) {
      return "bg-green-900";
    }

    return "bg-gray-700";
  }

  const LectureCard = (props : {lecture : lectureType}) => {
    const {lecture} = props;

    const [expanded, setExpanded] = useState(false);

    const running = activeLecture ? activeLecture.id === props.lecture.id : false;

    const expand = () => {
      setExpanded(!expanded);
    }

    useEffect(() => {
      setExpanded(allExpanded);
    }, [allExpanded]);

    return (
      <div className={classNames("rounded-xl shadow-2xl py-2 px-4 mt-4 bg-opacity-85",
        getColor(lecture),
        running && percentage && "border border-sky-300",
        "transform transition ease-in-out duration-200"
      )}>

        <div className={"divide-y divide-gray-500"}>
          <div className="flex flex-grow">
            <span className={"text-xl text-gray-100"}>{lecture.name}</span>
            <div className="flex flex-grow justify-end">
              <div onClick={expand} className="hover:bg-gray-400 hover:bg-opacity-40 rounded-md text-gray-300 cursor-pointer p-1">
                {/*<ChevronDownIcon
                  className={classNames("w-7 h-7 transform transition ease-in-out duration-200", expanded && "rotate-180")}/>*/}
                {!expanded && <ViewListIcon className={"w-5 h-5"} />}
                {expanded && <ViewGridIcon className={"w-5 h-5"} />}
              </div>
            </div>
          </div>
          <div className={classNames("pt-2 grid gap-2", expanded ? "grid-cols-1" : "grid-cols-2")}>

            <div className="flex gap-2">
              <UserGroupIcon className={"text-gray-200 h-5 w-5 flex-none"} />
              <span className={"flex-grow text-gray-200 truncate"}>{lecture.course}</span>
            </div>

            { lecture.lecturer?.length > 0 && lecture.rooms.length > 0 &&
              <div className="flex gap-2 inline-block align-middle">
                <UserIcon className={"text-gray-200 h-5 w-5 flex-none align-bottom"}/>
                <span className={"flex-grow text-gray-200 truncate"}>{lecture.lecturer}</span>
              </div>
            }

            <div className="flex gap-2 inline-block align-middle">
              <ClockIcon className={"text-gray-200 h-5 w-5 flex-none"} />
              <span className={"flex-grow text-gray-200 truncate"}>{moment(lecture.startTime).format("kk.mm")} - {moment(lecture.endTime).format("kk.mm")} {running && percentage && <span className={"text-gray-500"}>{percentage + " %"}</span>}</span>
            </div>

            { lecture.lecturer?.length > 0 && lecture.rooms.length > 0 &&
            <div className="flex gap-2 inline-block align-middle">
                <HomeIcon className={"text-gray-200 h-5 w-5 flex-none"}/>
                <span className={"flex-grow text-gray-200 truncate"}>{lecture.rooms.join(", ")}</span>
            </div>
            }

          </div>
        </div>

      </div>
    )
  }

  const LectureSection = (props : {lectures : lectureType[]}) => {

    return (
      <div className={"mt-3 divide-gray-500 divide-y w-full lg:w-3/4 xl:w-2/4"}>
        <span className={"text-gray-200 text-4xl font-light"}>{moment(props.lectures[0].date).locale("de").format("dddd - DD.MM.YYYY")}</span>
        <div className="">

          <div className={"mt-3"}>
            {props.lectures.map(l => <LectureCard key={l.id} lecture={l} />)}
          </div>

        </div>
      </div>
    )
  }

  return (
      <Layout title={course}>

        <div className={"h-7 mb-2 ml-2 pt-3 flex"}>

          <Link href={"/"}>
            <div className={"flex h-9 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-gray-700 select-none"}>
              <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"} />
              <span className={"text-xl text-gray-200 hidden md:block"}>Back</span>
            </div>
          </Link>

          <div className={"flex flex-grow justify-end"}>
            <div onClick={toggleAll} className="flex h-9 px-2 py-1 mr-2 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-gray-700 select-none" >
              {!allExpanded && <ViewListIcon className={"mt-1 h-5 w-5 text-gray-200"} />}
              {allExpanded && <ViewGridIcon className={"mt-1 h-5 w-5 text-gray-200"} />}
              <span className={"text-xl text-gray-200 hidden md:block"}>{allExpanded ? "Collapse" : "Expand"}</span>
            </div>

            <div onClick={share} className="flex h-9 px-2 py-1 mr-2 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-gray-700 select-none" >
              <ShareIcon className={"mt-1 h-5 w-5 text-gray-200"} />
              <span className={"text-xl text-gray-200 hidden md:block"}>Share</span>
            </div>
          </div>

        </div>

        {loading &&
          <div className={"flex flex-col flex-grow justify-center items-center min-h-screen"}>
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"/>
          </div>
        }

          <div className="container mx-auto">

          <div className={"w-full min-h-screen pb-7 flex flex-col items-center"}>

            {lectures.map(g => {
              const l0 = g[0];
              const key = `${l0.date}-${l0.startTime}`;
              return <LectureSection key={key ?? "upsi"} lectures={g} />;
            })}

          </div>
        </div>
      </Layout>
  )
}

export default CoursePage