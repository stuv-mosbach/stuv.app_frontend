import type { NextPage } from 'next'
import {useRouter} from "next/router";
import React, {Fragment, useEffect, useRef, useState} from "react";
import axios from "axios";
import {
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon, FilterIcon,
  HomeIcon,
  ShareIcon, TemplateIcon,
  UserIcon, ViewGridIcon,
  ViewListIcon
} from "@heroicons/react/outline";
import moment from "moment";
import 'moment/locale/de'
import Layout from "../../components/Layout";
import classNames from "classnames";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import Link from 'next/link';
import { Transition } from '@headlessui/react'
import {filterType, formatCourseName, getLectureType, groupLectures, lectureType} from "../../util/lectureUtils";
import InfiniteScroll from "react-infinite-scroll-component";
import {LectureSection} from "../../components/LectureSection";
import {getNextNElements} from "../../util/arrayUtils";

const CoursePage: NextPage = () => {

  const router = useRouter();

  moment.locale("de");

  const [course, setCourse] = useState<string | undefined>(undefined);
  const [originalLectures, setOriginalLectures] = useState<lectureType[][]>([]);
  const [filteredLectures, setFilteredLectures] = useState<lectureType[][]>([]);
  const [visibleLectures, setVisibleLectures] = useState<lectureType[][]>([]);
  const [loading, setLoading] = useState(true);
  const [allExpanded, setAllExpanded] = useState(false);

  const [activeLecture, setActiveLecture] = useState<lectureType | undefined>();
  const [percentage, setPercentage] = useState<string>();

  const filterRef = React.useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<filterType>({});
  const toggleFilter = (key : keyof filterType) => {
    if (filter[key] === true) {
      setFilter({...filter, [key]: undefined});
    } else {
      setFilter({...filter, [key]: true});
    }
  }
  const getFilter = (key : keyof  filterType) => {
    return filter[key] ?? false;
  }
  const getFilteredTypes = () => {
    const types : (keyof filterType)[] = [];
    if (getFilter("normal")) types.push("normal");
    if (getFilter("online")) types.push("online");
    if (getFilter("test")) types.push("test");
    if (getFilter("free")) types.push("free");
    return types;
  }

  const updateFilter = (lectures? : lectureType[][]) => {
    if (!lectures) {
      lectures = originalLectures;
    }
    if (lectures) {
      const filter = getFilteredTypes();
      if (filter.length === 0) {
        setFilteredLectures(lectures);
        setVisibleLectures(getNextNElements(5, lectures, [...visibleLectures]));
        return;
      }
      const filtered = lectures.map(subl => subl.filter(l => {
        return filter.indexOf(getLectureType(l)) !== -1;
      })).filter(l => l.length > 0);
      setFilteredLectures(filtered);
      setVisibleLectures(getNextNElements(5, lectures, [...visibleLectures]));
    }
  }

  const nextScrollLectures = () => {
    setVisibleLectures(getNextNElements(15, filteredLectures, [...visibleLectures]));
  }

  const hasMoreToScroll = () => filteredLectures.length > visibleLectures.length;

  useEffect(() => {
    updateFilter();
  }, [filter, originalLectures]);

  const toggleAll = () => {
    setAllExpanded(!allExpanded);
  }

  useEffect(() => {
    // Detect a click outside the SideMenu
    const listener = (event: Event) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilter(false);
      }
    };
    document.addEventListener("click", listener, true);
    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  useEffect(() => {
    try {
      if (router.isReady) {
        const course = router.query.course as string;
        setCourse(course);
        const raw = localStorage.getItem("openedCourses");
        let courseList = JSON.parse(raw ? raw : "{}");
        courseList[course] = true;
        localStorage.setItem("openedCourses", JSON.stringify(courseList));
      }
    } catch (e) {
      console.log("Failed to set openedCourses");
      console.log(e);
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
        setOriginalLectures(groupedLectures);
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

      if (originalLectures && originalLectures.length > 0) updateActiveLecture(originalLectures);

    }, 5 * 1000);

    return () => {
      clearInterval(interval);
    }
  }, [originalLectures, activeLecture]);

  const openFilter = () => {
    setShowFilter(true);
  }

  const share = () => {
    try {
      window.navigator.share({
        title: `${course} | Vorlesungsplan`,
        url: window.location.href,
        text: `Öffne diesen Link um die Vorlesung des Kurses '${course}' zu sehen.`
      });
    } catch (e) {
      console.log(e);
    }
  }

  const getLectureColor = (lecture : lectureType) => {
    if (lecture.name.toLowerCase().includes("klausur") || lecture.name.toLowerCase().includes("prüfung")) {
      return "bg-red-800";
    } else if (lecture.type === "ONLINE" || lecture.type === "HYBRID") {
      return "bg-sky-800";
    } else if (lecture.rooms.length === 0 && (lecture.lecturer === undefined || lecture.lecturer.length === 0)) {
      return "bg-green-900";
    }

    return "bg-gray-700";
  }

  const getLectureType = (lecture : lectureType) : keyof filterType => {
    if (lecture.name.toLowerCase().includes("klausur") || lecture.name.toLowerCase().includes("prüfung")) {
      return "test";
    } else if (lecture.type === "ONLINE" || lecture.type === "HYBRID") {
      return "online";
    } else if (lecture.rooms.length === 0 && (lecture.lecturer === undefined || lecture.lecturer.length === 0)) {
      return "free";
    }

    return "normal";
  }


  const MenuItem = (props: { checked: boolean, content: React.ReactNode, onClick?: () => void, rounded?: string }) => (
    <div onClick={() => {if (props.onClick) props.onClick();}}
        //dark:hover:bg-gray-600 hover:bg-gray-200 transition duration-200 ease-in-out transform cursor-pointer
         className={classNames(
             "block text-sm dark:text-white text-gray-700 cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-200 transition duration-200 ease-in-out transform",
             props.rounded,
         )}>
      <label className="inline-flex items-center h-full w-full cursor-pointer">
        <div className="px-4 py-2">
          <input type="checkbox" checked={props.checked} className="form-checkbox rounded-sm text-blue-600 cursor-pointer bg-gray-400" onChange={() => {}} />
          <span className="ml-2">{props.content}</span>
        </div>
      </label>
    </div>
  );

  return (
      <Layout title={course}>

        <div className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

          <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="flex flex-grow justify-center">
              <div className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-gray-900    pt-2 pb-3 px-8 rounded-xl">
                <span className={"text-gray-200 text-2xl font-semibold select-none"}>DOZ: {course}</span>
              </div>
            </div>
          </div>

          <Link href={"/"}>
            <div className={"flex ml-2 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200"}>
              <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"} />
              <span className={"text-xl text-gray-200 hidden lg:block"}>Back</span>
            </div>
          </Link>

          <div className={"flex flex-grow justify-end"}>

            <div onClick={openFilter} className="flex px-2 py-1 mr-2 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200" >
              <FilterIcon className={"mt-1 h-5 w-5 text-gray-200"} />
              <span className={"text-xl text-gray-200 hidden lg:block"}>Filter</span>

              <div ref={filterRef} className={"origin-top-right absolute mt-8 -ml-28 w-48 rounded-md bg-white dark:bg-gray-700 focus:outline-none z-50"}>
                <Transition
                    show={showFilter}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                  <div className="">
                    <MenuItem checked={getFilter("normal")} content={"Vorlesungen"} rounded={"rounded-t-md"}  onClick={() => {
                      toggleFilter("normal");
                    }} />
                    <MenuItem checked={getFilter("online")}  content={"Online-Vorlesungen"}  onClick={() => {
                      toggleFilter("online");
                    }} />
                    <MenuItem checked={getFilter("test")}  content={"Prüfungen"}  onClick={() => {
                      toggleFilter("test");
                    }} />
                    <MenuItem checked={getFilter("free")}  content={"Freie Tage"} onClick={() => {
                      toggleFilter("free");
                    }} rounded={"rounded-b-md"} />
                  </div>
                </Transition>
              </div>

            </div>

            <div onClick={toggleAll} className="flex h-9 px-2 py-1 mr-2 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200" >
              {!allExpanded && <ViewListIcon className={"mt-1 h-5 w-5 text-gray-200"} />}
              {allExpanded && <ViewGridIcon className={"mt-1 h-5 w-5 text-gray-200"} />}
              <span className={"text-xl text-gray-200 hidden lg:block"}>{allExpanded ? "Collapse" : "Expand"}</span>
            </div>

            <div onClick={share} className="flex h-9 px-2 py-1 mr-2 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200" >
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
            id={"scrollableDiv"}
            className="w-full overflow-y-scroll scroll-hidden bg-gradient-to-b from-gray-900 to-blueGray-900"
            style={{height: "calc(100vh - 52px)"}}
        >

          <div className="container mx-auto">

            <div className={"flex flex-col pb-7 items-center"}>

              {/*{filteredLectures.map(g => {
                const l0 = g[0];
                const key = `${l0.date}-${l0.startTime}`;
                return <LectureSection key={key ?? "upsi"} lectures={g} activeLecture={activeLecture} allExpanded={allExpanded} percentage={percentage} />;
              })}*/}

              <InfiniteScroll
                  className={"flex-grow"}
                  style={{width: "100vw"}}
                  dataLength={visibleLectures.length}
                  next={nextScrollLectures}
                  hasMore={hasMoreToScroll()}
                  loader={<div className={"flex w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto py-3 mt-3 bg-blue-300 rounded-xl bg-opacity-30 shadow-2xl"}>
                    <span className={"w-full text-center text-gray-200"}>Lade weitere Vorlesungen</span>
                  </div>}
                  endMessage={
                    <div className={"w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto py-3 mt-3 bg-red-300 rounded-xl bg-opacity-30 shadow-2xl flex"}>
                      <span className={"w-full text-center text-gray-200"}>Keine weiteren Vorlesungen Verfügbar</span>
                    </div>
                  }
                  scrollableTarget={"scrollableDiv"}
              >
                {visibleLectures.map(g => {
                  const l0 = g[0];
                  const key = `${l0.date}-${l0.startTime}`;
                  return <LectureSection key={key ?? "upsi"} lectures={g} activeLecture={activeLecture} allExpanded={allExpanded} percentage={percentage} />;
                })}
              </InfiniteScroll>

            </div>
          </div>

        </div>

      </Layout>
  )
}

export default CoursePage
