import type {NextPage} from 'next';
import React, {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import axios from "axios";
import {useRouter} from "next/router";
import classNames from "classnames";
import {CourseGroup, CourseTypeGrouped, nameGroupCourses} from "../util/lectureUtils";
import {SearchIcon} from "@heroicons/react/outline";
import {getRandomAnimal, translateAnimalName} from "../util/animalUtils";
import {ChevronDown} from "tabler-icons-react";
import {expandedClasses} from "../util/cssUtils";

const Home: NextPage = () => {

  const router = useRouter();

  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseList, setCourseList] = useState<{ [key: string]: boolean }>({});

  const [searchString, setSearchString] = useState("");
  const hasQuery = searchString.trim().length > 0;

  const [randomAnimal, setRandomAnimal] = useState(getRandomAnimal());
  const animalName = useMemo(() => randomAnimal ? translateAnimalName(randomAnimal) : "", [randomAnimal]);

  const rand = Math.random();
  const [mosName] = useState(rand > 0.99 ? "Nixlosbach" : "Mosbach");
  const [mghName] = useState(rand > 0.99 ? "Bad Mädelsheim" : "Bad Mergentheim");

  const mosMap = useMemo(() => courses ? nameGroupCourses(courses.filter(c => c.startsWith("MOS"))) : {
    wirtschaft: [],
    technik: []
  }, [courses]);
  const mghMap = useMemo(() => courses ? nameGroupCourses(courses.filter(c => c.startsWith("MGH"))) : {
    wirtschaft: [],
    technik: []
  }, [courses]);

  const filteredList = useMemo(() => {
    if (!hasQuery) return [];
    const filtered = new Set<string>();
    const query = searchString.toLocaleLowerCase();
    courses.filter(c => c.toLowerCase().includes(query)).forEach(c => filtered.add(c));
    mosMap.technik.filter(g => g.name.toLowerCase().toLowerCase().includes(query)).forEach(g => g.keys.forEach(c => filtered.add(c)));
    mosMap.wirtschaft.filter(g => g.name.toLowerCase().includes(query)).forEach(g => g.keys.forEach(c => filtered.add(c)));
    mghMap.technik.filter(g => g.name.toLowerCase().includes(query)).forEach(g => g.keys.forEach(c => filtered.add(c)));
    mghMap.wirtschaft.filter(g => g.name.toLowerCase().includes(query)).forEach(g => g.keys.forEach(c => filtered.add(c)));
    if (filtered.size === 0 && Math.random() > 0.97) setRandomAnimal(getRandomAnimal());
    return Array.from(filtered);
  }, [courses, searchString, mosMap, mghMap]);

  useEffect(() => {
    if (router.isReady) {
      axios.get<string[]>(`${process.env.NEXT_PUBLIC_API_BASE}/rapla/courses`).then(res => {
        setCourses(res.data);
        setLoading(false);
      }).catch(err => {
        console.log(err);
      });
      try {
        const raw = localStorage.getItem("openedCourses");
        let courseList = JSON.parse(raw ? raw : "{}");
        setCourseList(courseList);
      } catch (e) {
        console.log("Failed to read openedCourses");
        console.log(e);
      }
    }
  }, [router.isReady]);

  const CourseCard = (props: { name: string }) => {

    const nameParts = props.name.split("-");
    nameParts.shift();

    return (
      <Link href={`/${props.name}`}>
        <div
          className={classNames("bg-zinc-700 bg-opacity-85 rounded-xl p-2 cursor-pointer hover:bg-opacity-20 hover:bg-slate-500 select-none",
            courseList[props.name] && "border border-sky-300", "transform transition ease-in-out duration-200")}>
          <span className="text-md text-zinc-200">{nameParts.join("-")}</span>
        </div>
      </Link>
    )
  }

  const CourseSection = (props: { group: CourseGroup }) => {

    return (
      <div className={"divide-zinc-500 w-full divide-y"}>
        <div className={"text-zinc-200 text-xl font-light truncate"}>{props.group.name}</div>
        <div>
          <div className="border-l-4 border-slate-200 mt-2">
            <div className={"mt-3"}>
              <div
                className={"px-2 gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}>
                {props.group.keys.map(course => <CourseCard key={course} name={course}/>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const mosQuery = useMemo(() => filteredList.filter(c => c.startsWith("MOS")), [filteredList]);
  const mghQuery = useMemo(() => filteredList.filter(c => c.startsWith("MGH")), [filteredList]);

  const CourseExpandable = (props: { className?: string, name: string, courses: CourseTypeGrouped }) => {

    const [expanded, setExpanded] = useState(true);
    const [tExpanded, setTExpanded] = useState(true);
    const [wExpanded, setWExpanded] = useState(true);

    return (
      <div className={classNames(props.className, "divide-zinc-300 w-full divide-y md:w-3/4 px-2 md:px-0 mt-3")}>
        <div className="flex group cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <span className={"text-zinc-200 text-4xl font-light"}>{props.name}</span>
          <div className="flex flex-grow justify-end">
            <div className={"rounded-xl group-hover:bg-zinc-200 group-hover:bg-opacity-20"}>
              <ChevronDown
                className={classNames(expanded && "rotate-180", "transform select-none duration-500 ease-in-out", "h-10 w-10 text-zinc-200")}/>
            </div>
          </div>
        </div>
        <div
          className={expandedClasses(expanded)}>
          <div className="border-l-4 border-slate-600 mt-2">
            <div>
              <div className={"ml-2 pr-2 divide-y divide-zinc-300"}>
                <div className="flex group cursor-pointer" onClick={() => setTExpanded(!tExpanded)}>
                  <span className={"text-zinc-200 text-3xl font-light"}>Technik</span>
                  <div className="flex flex-grow justify-end">
                    <div className={"rounded-xl group-hover:bg-zinc-200 group-hover:bg-opacity-20"}>
                      <ChevronDown
                        className={classNames(tExpanded && "rotate-180", "transform select-none duration-500 ease-in-out", "h-10 w-10 text-zinc-200")}/>
                    </div>
                  </div>
                </div>
                <div className={expandedClasses(tExpanded)}>
                  <div className="border-l-4 border-slate-400 mt-2">
                    <div className={"gap-2 grid grid-cols-1 px-2"}>
                      {/*courses.filter(c => c.startsWith("MOS")).map(course => <CourseCard key={course} name={course}/>)*/}
                      {props.courses.technik.map((g, i) => <CourseSection key={i} group={g}/>)}
                    </div>
                  </div>
                </div>
              </div>
              <div className={"ml-2 pr-2 divide-y divide-zinc-300 mt-5"}>
                <div className="flex group cursor-pointer" onClick={() => setWExpanded(!wExpanded)}>
                  <span className={"text-zinc-200 text-3xl font-light"}>Wirtschaft</span>
                  <div className="flex flex-grow justify-end">
                    <div className={"rounded-xl group-hover:bg-gray-200 group-hover:bg-opacity-20"}>
                      <ChevronDown
                        className={classNames(wExpanded && "rotate-180", "transform select-none duration-500 ease-in-out", "h-10 w-10 text-gray-200")}/>
                    </div>
                  </div>
                </div>
                <div
                  className={expandedClasses(wExpanded)}>
                  <div className="border-l-4 border-slate-400 mt-2">
                    <div className={"gap-2 grid grid-cols-1 px-2"}>
                      {/*courses.filter(c => c.startsWith("MOS")).map(course => <CourseCard key={course} name={course}/>)*/}
                      {props.courses.wirtschaft.map((g, i) => <CourseSection key={i} group={g}/>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }

  return (
    <Layout>

      <div className={"flex flex-grow justify-center items-center h-screen overflow-y-scroll"}>
        {loading && <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"/>}

        {!loading &&
            <div className="flex flex-col flex-grow items-center" style={{height: "100%"}}>

                <div className="w-full md:w-3/4 px-2 md:px-0">
                    <div className="relative flex w-full flex-wrap items-stretch my-3">
                        <input
                            type="text"
                            placeholder="Suche"
                            className="px-3 py-3 placeholder-slate-300 text-slate-200 relative bg-gray-700 bg-opacity-50 rounded text-base border-0 shadow outline-none focus:outline-none focus:ring w-full pr-10"
                            value={searchString}
                            onChange={e => setSearchString(e.target.value)}
                        />
                        <span
                            className={classNames("", "z-10 h-full leading-snug font-normal absolute text-center text-slate-300 absolute bg-transparent rounded text-lg items-center justify-center w-8 right-0 pr-3 py-3")}>
                      <SearchIcon/>
                    </span>
                    </div>
                </div>

              {(hasQuery && mosQuery.length > 0) &&
                  <div className={"divide-gray-300 w-full divide-y md:w-3/4 px-2 md:px-0 mt-3"}>
                      <span className={"text-gray-200 text-4xl font-light pb-3"}>{mosName}</span>
                      <div className="pt-2">
                          <div className={"gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}>
                            {mosQuery.map(c => <CourseCard key={c} name={c}/>)}
                          </div>
                      </div>
                  </div>
              }

              {(hasQuery && mghQuery.length > 0) &&
                  <div className={"divide-gray-300 w-full divide-y md:w-3/4 px-2 md:px-0 mt-3"}>
                      <span className={"text-gray-200 text-4xl font-light pb-3"}>{mghName}</span>
                      <div className="pt-2">
                          <div className={"gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}>
                            {mghQuery.map(c => <CourseCard key={c} name={c}/>)}
                          </div>
                      </div>
                  </div>
              }

              {!hasQuery && <CourseExpandable name={mosName} courses={mosMap}/>}
              {!hasQuery && <CourseExpandable name={mghName} courses={mghMap} className={"pb-10"}/>}

              {(hasQuery && filteredList.length === 0) &&
                  <div className="flex flex-col items-center justify-center h-full">
                      <div className="select-none">
                          <div className="flex flex-col items-center justify-center">
                              <img className={"w-4/5"} alt={`Hier sollte ein Bild von '${animalName} sein.'`}
                                   src={`/animals/${randomAnimal}.svg`}/>
                          </div>
                          <div className={"text-gray-400 text-xl text-center"}>Wir konnten keinen Kurs finden, <br/> aber hier ist
                              ein {animalName}.
                          </div>
                      </div>
                  </div>
              }
            </div>
        }
      </div>

    </Layout>
  )
}

export default Home
