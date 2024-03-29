import type {NextPage} from 'next'
import {useRouter} from "next/router";
import React, {Fragment, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {FilterIcon, ShareIcon, ViewGridIcon, ViewListIcon} from "@heroicons/react/outline";
import moment from "moment";
import 'moment/locale/de'
import Layout from "../components/Layout";
import classNames from "classnames";
import {ArrowLeftIcon, CogIcon} from "@heroicons/react/solid";
import Link from 'next/link';
import {Transition} from '@headlessui/react'
import {filterType, formatCourseName, getLectureType, groupLectures, lectureType} from "../util/lectureUtils";
import {LectureSection} from "../components/LectureSection";
import InfiniteScroll from "react-infinite-scroll-component";
import {getNextNElements} from "../util/arrayUtils";
import {getRandomAnimal, translateAnimalName} from "../util/animalUtils";
import {HoverAnimation} from "../components/HoverAnimation";
import {FooterLinks} from "../components/FooterLinks";
import {useSpring, animated} from "@react-spring/web";
import {useDrag} from "@use-gesture/react";

const CoursePage: NextPage = () => {

  const router = useRouter();

  moment.locale("de");

  const [course, setCourse] = useState<string | undefined>(undefined);
  const [originalLectures, setOriginalLectures] = useState<lectureType[][]>([]);
  const [filteredLectures, setFilteredLectures] = useState<lectureType[][]>([]);
  const [visibleLectures, setVisibleLectures] = useState<lectureType[][]>([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [allExpanded, setAllExpanded] = useState(false);
  const [noLecturesFound, setNoLecturesFound] = useState(false);

  const [randomAnimal, setRandomAnimal] = useState(getRandomAnimal());
  const animalName = useMemo(() => randomAnimal ? translateAnimalName(randomAnimal) : "", [randomAnimal]);

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
        setVisibleLectures(lectures);
        return;
      }
      const filtered = lectures.map(subl => subl.filter(l => {
        return filter.indexOf(getLectureType(l)) !== -1;
      })).filter(l => l.length > 0);
      setFilteredLectures(filtered);
      setVisibleLectures(filtered);
      //setVisibleLectures(getNextNElements(5, lectures, [...visibleLectures]));
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

  //Save Course Modal
  const [aboutToShowSave, setAboutToShowSave] = useState(false);
  const [showSave, setShowSave] = useState<boolean>();
  const [hasSavedCourse, setHasSavedCourse] = useState<string | undefined>();
  const [hasNoSaveInterest, setHasNoSaveInterest] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedCourseNotInterested");
      const savedCourse = localStorage.getItem("savedCourse");
      if (!raw) {
        if (!savedCourse) setAboutToShowSave(true);
      } else {
        setHasNoSaveInterest(true);
      }
    } catch (e) {
      console.log("Failed to fetch savedCourseNotInterested");
      console.log(e);
    }

    try {
      const savedCourse = localStorage.getItem("savedCourse");
      setHasSavedCourse(savedCourse ? savedCourse : undefined);
    } catch (e) {
      console.log("Failed to fetch savedCourseNotInterested");
      console.log(e);
    }
  }, []);

  useEffect(() => {
    if (router.isReady && aboutToShowSave && !loading && !showSave) {
      setAboutToShowSave(false);
      setTimeout(() => {
        setShowSave(true);
      }, 2000)
    }
  }, [router.isReady, aboutToShowSave, loading]);


  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }))
  const bind = useDrag(({ down, movement: [mx, my] }) => {
    if (Math.abs(mx) > 50 || Math.abs(my) > 50) {
      api.start({x: down ? mx : 0, y: down ? my : 0, immediate: down})
      if (Math.abs(mx) > 200 || Math.abs(my) > 200) dismissSaveCourse();
    }
  });

  const saveCourse = () => {
    try {
      localStorage.setItem("savedCourse", course as string);
      setShowSave(false);
      setHasSavedCourse(course as string);
    } catch (e) {
      console.log("Failed to set savedCourse");
      console.log(e);
    }
  }

  const deleteSavedCourse = () => {
    try {
      setHasSavedCourse(undefined);
      localStorage.removeItem("savedCourse");
    } catch (e) {
      console.log("Failed to delete savedCourse");
      console.log(e);
    }
  }

  const resetNoInterest = () => {
    try {
      setShowSave(true);
      setHasNoSaveInterest(false);
      localStorage.removeItem("savedCourseNotInterested");
    } catch (e) {
      console.log("Failed to delete savedCourseNotInterested");
      console.log(e);
    }
  }

  const dismissSaveCourse = () => {
    setShowSave(false);
  }

  const noInterestSaveCourse = () => {
    setShowSave(false);
    setHasNoSaveInterest(true);
    try {
      localStorage.setItem("savedCourseNotInterested", "true");
    } catch (e) {
      console.log("Failed to set savedCourseNotInterested");
      console.log(e);
    }
  }


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
      axios.get<lectureType[]>(`${process.env.NEXT_PUBLIC_API_BASE}/rapla/lectures/${course}`, {withCredentials: true}).then(res => {
        const groupedLectures = groupLectures(res.data);
        setOriginalLectures(groupedLectures);
        updateActiveLecture(groupedLectures);
        setLoading(false);
        setFirstLoad(false);
        setNoLecturesFound(res.data.length === 0);
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
   } catch (e) {}
  }

  const MenuItem = (props: { checked: boolean, content: React.ReactNode, onClick?: () => void, rounded?: string }) => (
    <div onClick={() => {if (props.onClick) props.onClick();}}
         //dark:hover:bg-zinc-600 hover:bg-zinc-200 transition duration-200 ease-in-out transform cursor-pointer
      className={classNames(
        "block text-sm dark:text-white text-zinc-700 cursor-pointer dark:hover:bg-zinc-200 dark:hover:bg-opacity-30 hover:bg-zinc-200 transition duration-200 ease-in-out transform",
        props.rounded,
        )}>
      <label className="inline-flex items-center h-full w-full cursor-pointer">
        <div className="px-4 py-2">
          <input type="checkbox" checked={props.checked} className="form-checkbox rounded-sm text-blue-600 cursor-pointer bg-zinc-400 mb-1" onChange={() => {}} />
          <span className="ml-2">{props.content}</span>
        </div>
      </label>
    </div>
  );

  const MenuItemNoCheckbox = (props: { content: React.ReactNode, onClick?: () => void, rounded?: string }) => (
      <div onClick={() => {if (props.onClick) props.onClick();}}
          //dark:hover:bg-zinc-600 hover:bg-zinc-200 transition duration-200 ease-in-out transform cursor-pointer
           className={classNames(
               "block text-sm dark:text-white text-zinc-700 cursor-pointer dark:hover:bg-zinc-200 dark:hover:bg-opacity-30 hover:bg-zinc-200 transition duration-200 ease-in-out transform",
               props.rounded,
           )}>
        <label className="inline-flex items-center h-full w-full cursor-pointer">
          <div className="px-4 py-2">
            <span className="">{props.content}</span>
          </div>
        </label>
      </div>
  );

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
            <div className={"flex ml-2 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200"}>
              <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"} />
              <span className={"text-xl text-gray-200 hidden lg:block"}>Back</span>
            </div>
          </Link>

          <div className={"flex flex-grow justify-end"}>

            <div onClick={openFilter} className="flex px-2 py-1 -mx-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200" >
              <CogIcon className={"mt-1 h-5 w-5 text-gray-200"} />
              <span className={"text-xl text-gray-200 hidden lg:block"}>Settings</span>

              <div ref={filterRef} className={"origin-top-right absolute mt-10 -ml-28 w-48 rounded-md bg-white dark:bg-gray-700 focus:outline-none z-50"}>
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
                    <div className="">
                      <h1 className={"text-xl ml-4 mt-2 text-gray-50"} >Filter:</h1>
                      <MenuItem checked={getFilter("normal")} content={"Vorlesungen"} rounded={""}  onClick={() => {
                        toggleFilter("normal");
                      }} />
                      <MenuItem checked={getFilter("online")}  content={"Online-Vorlesungen"}  onClick={() => {
                        toggleFilter("online");
                      }} />
                      <MenuItem checked={getFilter("test")}  content={"Prüfungen"}  onClick={() => {
                        toggleFilter("test");
                      }} />
                      <MenuItem checked={getFilter("free")}  content={"Freie Tage"} rounded={""} onClick={() => {
                        toggleFilter("free");
                      }} />
                    </div>

                    <div className="">
                      <h1 className={"text-xl ml-4 mt-2 text-gray-50"}>Course save:</h1>

                      {hasNoSaveInterest && <MenuItemNoCheckbox
                        content={<span className={""}>Reset no interest</span>} rounded={""} onClick={resetNoInterest}/>}
                      {hasSavedCourse && <MenuItemNoCheckbox content={<span className={"text-red-700"}>Delete saved course</span>} rounded={"rounded-b-md"} onClick={deleteSavedCourse}/>}
                      {!hasSavedCourse && <MenuItemNoCheckbox
                        content={<span className={""}>Save this course</span>} rounded={"rounded-b-md"} onClick={saveCourse}/>}

                    </div>
                  </div>
                </Transition>
              </div>

            </div>

            <div onClick={toggleAll} className="flex h-9 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200" >
              {!allExpanded && <ViewListIcon className={"mt-1 h-5 w-5 text-gray-200"} />}
              {allExpanded && <ViewGridIcon className={"mt-1 h-5 w-5 text-gray-200"} />}
              <span className={"text-xl text-gray-200 hidden lg:block"}>{allExpanded ? "Collapse" : "Expand"}</span>
            </div>

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
           id={"scrollableDiv"}
           className="w-full overflow-y-scroll scroll-hidden bg-gradient-to-b from-gray-900 to-slate-900"
           style={{height: "calc(100vh - 52px)"}}
        >

          <div className="container mx-auto">

            {!noLecturesFound && <div className={"flex flex-col pb-7 items-center"}>

              {/*{filteredLectures.map(g => {
                const l0 = g[0];
                const key = `${l0.date}-${l0.startTime}`;
                return <LectureSection key={key ?? "upsi"} lectures={g} activeLecture={activeLecture} allExpanded={allExpanded} percentage={percentage} />;
              })}*/}

              <InfiniteScroll
                className={"flex-grow animate__animated animate__slideInUp"}
                style={{width: "100vw"}}
                dataLength={visibleLectures.length}
                next={nextScrollLectures}
                hasMore={hasMoreToScroll()}
                loader={<div
                  className={"flex w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto py-3 mt-3 bg-blue-300 rounded-xl bg-opacity-30 shadow-2xl"}>
                  <span className={"w-full text-center text-gray-200"}>Lade weitere Vorlesungen</span>
                </div>}
                endMessage={
                  <div
                    className={"w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto py-3 mt-3 bg-red-300 rounded-xl bg-opacity-30 shadow-2xl flex"}>
                    <span className={"w-full text-center text-gray-200"}>Keine weiteren Vorlesungen Verfügbar</span>
                  </div>
                }
                scrollableTarget={"scrollableDiv"}
              >
                {visibleLectures.map(g => {
                  const l0 = g[0];
                  const key = `${l0.date}-${l0.startTime}`;
                  return <LectureSection key={key ?? "upsi"} lectures={g} activeLecture={activeLecture}
                                         allExpanded={allExpanded} percentage={percentage}/>;
                })}
              </InfiniteScroll>

            </div>}

            {noLecturesFound &&
              <div style={{height: "calc(100vh - 52px - 60px)"}} className="flex flex-col items-center justify-center">
                  <div className="select-none">
                      <div className="flex flex-col items-center justify-center">
                          <img className={"w-4/5"} alt={`Hier sollte ein Bild von '${animalName} sein.'`} src={`/animals/${randomAnimal}.svg`} />
                      </div>
                      <div className={"text-gray-400 text-xl text-center"}>Wir konnten keine Vorlesungen finden, <br /> aber hier ist ein {animalName}.</div>
                  </div>
              </div>
            }

          </div>

          <animated.div {...bind()} style={{ x, y, touchAction: "none" }}
                        className={classNames(
                            "absolute bottom-2 right-2 ml-2 max-w-lg select-none animate__animated animate__bounceIn",
                            (loading || showSave === undefined) && "hidden",
                            !showSave && "animate__animated animate__fadeOutDown hidden", //FIXME hidden hides the element immediately
                            //aboutToShowSave && "animate__animated animate__bounceIn"
                        )}>
            <div className="px-3 py-3 bg-sky-900 bg-opacity-95 rounded-lg">
              <h2 className={"text-xl text-gray-50"}>Kurs speichern ?</h2>
              <p className={"text-gray-300 mt-2"}>Wenn du diesen Kurs speicherst, öffnet sich beim nächsten Öffnen der Webseite direkt dieser Kurs.</p>

              <div className="mt-3 flex flex-row gap-3 text-gray-50">
                <div
                    className="p-2 grow rounded-lg border-2 border-gray-500 bg-gray-500 hover:bg-opacity-50 text-center text-lg cursor-pointer"
                    onClick={noInterestSaveCourse}
                >
                  Nicht erneut fragen
                </div>
                <div
                    className="p-2 grow rounded-lg border-2 border-gray-500 hover:bg-gray-500 hover:bg-opacity-50 text-center text-lg cursor-pointer"
                    onClick={dismissSaveCourse}
                >
                  Nein
                </div>
                <div
                    className="p-2 grow rounded-lg border-2 border-blue-500 hover:bg-blue-500 hover:bg-opacity-50 text-center text-lg cursor-pointer"
                    onClick={saveCourse}
                >
                  Ja
                </div>
              </div>
            </div>
          </animated.div>

          <FooterLinks />

        </div>

      </Layout>
  )
}

export default CoursePage
