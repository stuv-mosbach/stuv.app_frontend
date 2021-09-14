import type { NextPage } from 'next'
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {CalendarIcon, ClockIcon, HomeIcon, UserIcon} from "@heroicons/react/outline";
import moment from "moment";
import 'moment/locale/de'
import Layout from "../components/Layout";
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

  useEffect(() => {
    if (router.isReady) {
      setCourse(router.query.course as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (course) {
      axios.get<lectureType[]>(`${process.env.NEXT_PUBLIC_API_BASE}/rapla/lectures/${course}`).then(res => {
        setLectures(groupLectures(res.data));
        setLoading(false);

      }).catch(err => {
        console.log(err);
        router.push("/");
      });
    }
  }, [course]);

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
    return (
      <div className={classNames("rounded-xl shadow-2xl py-2 px-4 mt-4 bg-opacity-85", getColor(lecture))}>

        <div className={"divide-y divide-gray-500"}>
          <span className={"text-xl text-gray-100 "}>{lecture.name}</span>
          <div className="pt-2 grid grid-cols-2 gap-2">

            <div className="flex gap-2">
              <CalendarIcon className={"text-gray-200 h-5 w-5"} />
              <span className={"text-gray-200 h-5"}>{moment(lecture.date).format("DD.MM.YYYY")}</span>
            </div>

            <div className="flex gap-2 inline-block align-middle">
              <UserIcon className={"text-gray-200 h-5 w-5"} />
              <span className={"text-gray-200 h-5"}>{lecture.lecturer}</span>
            </div>

            <div className="flex gap-2 inline-block align-middle">
              <ClockIcon className={"text-gray-200 h-5 w-5"} />
              <span className={"text-gray-200 h-5"}>{moment(lecture.startTime).format("kk.mm")} - {moment(lecture.endTime).format("kk.mm")}</span>
            </div>

            <div className="flex gap-2 inline-block align-middle">
              <HomeIcon className={"text-gray-200 h-5 w-5"} />
              <span className={"text-gray-200 h-5 truncate"}>{lecture.rooms.join(", ")}</span>
            </div>

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

        <div className={"h-7 mb-2 ml-2 pt-3"}>

          <Link href={"/"}>
            <div className={"flex flex-grow-0 w-24 pl-4 p-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-gray-700"}>
              <ArrowLeftIcon className={"h-5 w-5 mt-1 text-gray-200"} />
              <div className={""}>
                <span className={"text-xl text-gray-200"}>Back</span>
              </div>
            </div>
          </Link>

        </div>

        {loading &&
          <div className={"flex flex-col flex-grow justify-center items-center min-h-screen"}>
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"/>
          </div>
        }

          <div className="container mx-auto">

          <div className={"w-full min-h-screen pb-7 flex flex-col items-center"}>

            {lectures.map(g => <LectureSection key={g[0]?.date?.valueOf() ?? "upsi"} lectures={g} />)}

          </div>
        </div>
      </Layout>
  )
}

export default CoursePage
