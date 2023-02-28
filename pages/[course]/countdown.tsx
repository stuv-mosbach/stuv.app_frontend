import type {NextPage} from 'next'
import {useRouter} from "next/router";
import React, {Fragment, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {FilterIcon, ShareIcon, ViewGridIcon, ViewListIcon} from "@heroicons/react/outline";
import moment from "moment";
import 'moment/locale/de'
import classNames from "classnames";
import {ArrowLeftIcon, CogIcon} from "@heroicons/react/solid";
import Link from 'next/link';
import {Transition} from '@headlessui/react'
import {getRandomAnimal, translateAnimalName} from "../../util/animalUtils";
import {FooterLinks} from "../../components/FooterLinks";
import {formatCourseName, lectureType} from "../../util/lectureUtils";
import {HoverAnimation} from "../../components/HoverAnimation";
import Layout from "../../components/Layout";
import FlipNumbers from 'react-flip-numbers';

const CoursePage: NextPage = () => {

  const router = useRouter();

  moment.locale("de");

  const [course, setCourse] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(true);
  const [noLecturesFound, setNoLecturesFound] = useState(false);
  const [lectures, setLectures] = useState<lectureType[]>([]);

  const [activeLecture, setActiveLecture] = useState<lectureType | undefined>();
  const [percentage, setPercentage] = useState<string>();
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    if (router.isReady) {
      const course = router.query.course as string;
      setCourse(course);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (course) {
      axios.get<lectureType[]>(`${process.env.NEXT_PUBLIC_API_BASE}/rapla/lectures/${course}`).then(res => {
        setLectures(res.data);
        setLoading(false);
        setNoLecturesFound(res.data.length === 0);
      }).catch(err => {
        console.log(err);
        router.push("/");
      });

    }
  }, [course]);

  useEffect(() => {

    const interval = setInterval(() => {

      console.log("pieeep")
      console.log(activeLecture);

      if (lectures && lectures.length > 0) updateActiveLecture(lectures);

    }, 100);

    return () => {
      clearInterval(interval);
    }
  }, [lectures, activeLecture]);

  const updateActiveLecture = (lectures : lectureType[]) => {
    console.log("Updating active lectures!");
    let lactiveLecture = lectures.find(l => moment().isBetween(l.startTime, l.endTime));
    if (!lactiveLecture) {
      const nextLectures = lectures.filter(l => moment().isBefore(l.startTime))
      if (nextLectures.length > 0)
      lactiveLecture = nextLectures[0];
    }

    if (lactiveLecture) {
      setActiveLecture(lactiveLecture);

      const duration = moment.duration(moment(lactiveLecture.startTime).diff(lactiveLecture.endTime)).asSeconds();
      const currentDuration = moment.duration(moment().diff(lactiveLecture.endTime)).asSeconds();
      const newPercentage = (100 - currentDuration / duration * 100).toFixed(3);
      if (newPercentage !== percentage) setPercentage(newPercentage);

      let totalSeconds = moment.duration(moment().diff(moment().isBefore(lactiveLecture.startTime) ? lactiveLecture.startTime : lactiveLecture.endTime)).asSeconds();
      totalSeconds = Math.abs(totalSeconds);

      const seconds = Math.floor(totalSeconds % 60);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const hours = Math.floor(totalSeconds / 3600);

      const sb : string[] = [];

      if (hours > 0) {
        sb.push(`${hours.toString().padStart(2,"0")}h`);
      }

      if (minutes > 0 || hours > 0) {
        sb.push(`${minutes.toString().padStart(2,"0")}m`);
      }

      sb.push(`${seconds.toString().padStart(2,"0")}s`);

      setRemainingTime(sb.join(" "));

    } else {
      setActiveLecture(undefined);
      setPercentage(undefined);
    }
  }

  const share = () => {
    try {
      window.navigator.share({
        title: `${course} | Countdown`,
        url: window.location.href,
        text: `Öffne diesen Link um den Countdown des Kurses '${course}' zu sehen.`
      });
    } catch (e) {}
  }

  console.log(activeLecture);
  console.log(remainingTime);

  return (
    <Layout title={course}>

      <div className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="flex flex-grow justify-center">
            <div className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-zinc-900    pt-2 pb-3 px-8 rounded-xl">
              <HoverAnimation><span className={"text-zinc-200 text-2xl font-semibold select-none"}>{formatCourseName(course ?? "")}</span></HoverAnimation>
            </div>
          </div>
        </div>

        <Link href={"/"}>
          <div className={"flex ml-2 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform remainingTime-200"}>
            <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"} />
            <span className={"text-xl text-gray-200 hidden lg:block"}>Back</span>
          </div>
        </Link>

        <div className={"flex flex-grow justify-end"}>

          <div onClick={share} className="flex h-9 px-2 -ml-1 py-1 mr-2 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200" >
            <ShareIcon className={"mt-1 h-5 w-5 text-gray-200"} />
            <span className={"text-xl text-gray-200 hidden lg:block"}>Share</span>
          </div>
        </div>

      </div>

      {loading &&
          <div className={"flex flex-col flex-grow justify-center items-center min-h-screen"}>
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"/>
          </div>
      }

      <div
        className="w-full bg-gradient-to-b from-gray-900 to-slate-900 flex flex-col"
        style={{height: "calc(100vh - 52px)"}}
      >

        <div className="flex flex-grow">

          <FlipNumbers
            height={100}
            width={100}
            color="white"
            //background="white"
            play
            //perspective={10}
            numberStyles={{padding: "1em"}}
            numbers={remainingTime}
          />

        </div>

        <FooterLinks />

      </div>

    </Layout>
  )
}

export default CoursePage
