import React, {useState} from 'react';
import Layout from "../../components/Layout";
import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/solid";

export const UpdatePage = () => {

  const [loading, setLoading] = useState(false);

  return (
    <Layout title={"Updates"}>

      <div className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="flex flex-grow justify-center">
            <div className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-gray-900    pt-2 pb-3 px-8 rounded-xl">
              <span className={"text-gray-200 text-2xl font-semibold select-none"}>Updates</span>
            </div>
          </div>
        </div>

        <Link href={"/"}>
          <div className={"flex ml-2 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-gray-700 hover:bg-opacity-70 select-none transition transform duration-200"}>
            <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"} />
            <span className={"text-xl text-gray-200 hidden lg:block"}>Back</span>
          </div>
        </Link>

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

            {/*<InfiniteScroll
              className={"flex-grow"}
              style={{width: "100vw"}}
              dataLength={10}
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
            </InfiniteScroll>*/}

          </div>
        </div>

      </div>

    </Layout>
  );
};

export default UpdatePage;
