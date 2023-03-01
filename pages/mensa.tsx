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
import {getMensaPlan, MensaDayMenu} from "../api/mensa.api";
import {MensaDaySection} from "../components/MensaDaySection";

const CoursePage: NextPage = () => {

  const router = useRouter();

  moment.locale("de");

  const [mensaMenu, setMensaMenu] = useState<MensaDayMenu[]>([]);

  //const [course, setCourse] = useState<string | undefined>("Mensa");
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [allExpanded, setAllExpanded] = useState(false);
  const [noLecturesFound, setNoLecturesFound] = useState(false);

  const [randomAnimal, setRandomAnimal] = useState(getRandomAnimal());
  const animalName = useMemo(() => randomAnimal ? translateAnimalName(randomAnimal) : "", [randomAnimal]);

  const toggleAll = () => {
    setAllExpanded(!allExpanded);
  }

  useEffect(() => {
      getMensaPlan().then(res => {
        console.log(res);
        setMensaMenu(res);
        setLoading(false);
        setFirstLoad(false);
        setNoLecturesFound(res.length === 0);
      }).catch(err => {
        console.log(err);
        router.push("/");
      });
  }, []);

  const share = () => {
   try {
     window.navigator.share({
       title: `DHBW Mosbach | MensaPlan`,
       url: window.location.href,
       text: `Öffne diesen Link um die den Essensplan der Mensa an der DHBW Mosbach zu sehen.`
     });
   } catch (e) {}
  }

  return (
      <Layout title={"Mensa"}>

        <div className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

          <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="flex flex-grow justify-center">
              <div className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-zinc-900    pt-2 pb-3 px-8 rounded-xl">
                <HoverAnimation><span className={"text-zinc-200 text-2xl font-semibold select-none"}>{"Mensa"}</span></HoverAnimation>
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

            {!noLecturesFound && <div className={"flex flex-col pb-7 items-center min-h-screen"}>

              <div className="flex-grow animate__animated animate__slideInUp w-screen">
                {mensaMenu.map(m => <MensaDaySection key={m.id} mensaDay={m} allExpanded={allExpanded} />)}
              </div>

              <div className="text-gray-400">
                  Die gezeigten Bilder wurden mit hilfe von <a className={"text-teal-600"} href={"https://openai.com/product/dall-e-2"}>DALL·E 2</a> erstellt.
                  Und Somit spiegel sie das tatsächliche Essen nicht wieder.
              </div>

            </div>}

            {noLecturesFound &&
              <div style={{height: "calc(100vh - 52px - 60px)"}} className="flex flex-col items-center justify-center">
                  <div className="select-none">
                      <div className="flex flex-col items-center justify-center">
                          <img className={"w-4/5"} alt={`Hier sollte ein Bild von '${animalName} sein.'`} src={`/animals/${randomAnimal}.svg`} />
                      </div>
                      <div className={"text-gray-400 text-xl text-center"}>Wir konnten keinen Mensaplan finden, <br /> aber hier ist ein {animalName}.</div>
                  </div>
              </div>
            }

          </div>

          <FooterLinks />

        </div>

      </Layout>
  )
}

export default CoursePage
