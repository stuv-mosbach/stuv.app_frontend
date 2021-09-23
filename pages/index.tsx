import type { NextPage } from 'next';
import React from "react";
import Link from "next/link";
import Layout from "../components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/router";
import classNames from "classnames";

const Home: NextPage = () => {

  const router = useRouter();

  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseList, setCourseList] = useState<{[key : string]: boolean}>({});

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
      }  catch (e) {
        console.log("Failed to read openedCourses");
        console.log(e);
      }
    }
  }, [router.isReady]);

  const CourseCard = (props : {name : string}) => {

    const nameParts = props.name.split("-");
    nameParts.shift();

    console.log(courseList);

    return (
        <Link href={`/${props.name}`}>
          <div className={classNames("bg-gray-700 bg-opacity-85 rounded-xl p-2 cursor-pointer hover:bg-blueGray-500", courseList[props.name] && "border border-sky-300")}>
            <span className="text-xl text-gray-200">{nameParts.join("-")}</span>
          </div>
        </Link>
    )
  }

  return (
      <Layout>

        <div className={"flex flex-col flex-grow justify-center items-center min-h-screen"}>
          {loading &&  <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"/>}

          {!loading &&
          <div className={"mt-3 divide-gray-500 w-full divide-y md:w-3/4 w-2/4"}>
            <span className={"text-gray-200 text-4xl font-light"}>Mosbach</span>
            <div className="">

              <div className={"mt-3"}>
                <div className={"gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}>
                  {courses.filter(c => c.startsWith("MOS")).map(course => <CourseCard key={course} name={course} /> )}
                </div>
              </div>

            </div>
          </div>
          }

          {!loading &&
          <div className={"mt-3 divide-gray-500 w-full divide-y md:w-3/4 w-2/4"}>
            <span className={"text-gray-200 text-4xl font-light"}>Bad Mergentheim</span>
            <div className="">

              <div className={"mt-3"}>
                <div className={"gap-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"}>
                  {courses.filter(c => c.startsWith("MGH")).map(course => <CourseCard key={course} name={course} /> )}
                </div>
              </div>

            </div>
          </div>
          }

        </div>

      </Layout>
  )
}

export default Home
