import React, {Fragment, useEffect, useState} from 'react';
import Layout from "../../components/Layout";
import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import {getUpdateInfos, UpdateInfo} from "../../util/syncUtils";
import InfiniteScroll from "react-infinite-scroll-component";
import UpdateInfoCard from "../../components/UpdateInfoCard";
import axios from "axios";
import moment from "moment";
import {FilterIcon, ShareIcon, ViewGridIcon, ViewListIcon} from "@heroicons/react/outline";
import {Transition} from "@headlessui/react";
import classNames from "classnames";

export const UpdatePage = () => {

  moment.locale("de");

  const [loading, setLoading] = useState(true);

  const [updateInfos, setUpdateInfos] = useState<UpdateInfo[]>([]);
  const [visibleUpdateInfos, setVisibleUpdateInfos] = useState<UpdateInfo[]>([]);

  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getUpdateInfos().then(res => {
      setLoading(false);
      if (res) setUpdateInfos(res);
    })
  }, []);

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

  const loadNextInfos = () => {
    //console.log("Should load new Lectures");
    getUpdateInfos(20, updateInfos?.length).then(res => {
      //console.log("Loaded", res);
      if (res.length === 0) setHasMore(false);
      setUpdateInfos(prevState => [...prevState, ...res]);
    });
  }

  const filterRef = React.useRef<HTMLDivElement>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showOnlyWithChanges, setShowOnlyWithChanges] = useState(false);

  const updateFilter = (updates : UpdateInfo[] = updateInfos, showOnlyWithChange = showOnlyWithChanges) => {
    setVisibleUpdateInfos(updates.filter(u => showOnlyWithChange ? u.hasChanges : true));
  }

  useEffect(() => {
    updateFilter();
  }, [updateInfos, showOnlyWithChanges]);

  const openFilter = () => {
    setShowFilter(true);
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
    <Layout title={"Updates"}>

      <div className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="flex flex-grow justify-center">
            <div className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-gray-900 pt-2 pb-3 px-8 rounded-xl">
              <span className={"text-gray-200 text-2xl font-semibold select-none"}>Updates</span>
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
                  <MenuItem checked={showOnlyWithChanges} content={"Nur mit Änderungen"} rounded={"rounded-md"}  onClick={() => {
                    setShowOnlyWithChanges(!showOnlyWithChanges);
                  }} />
                </div>
              </Transition>
            </div>

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

            <InfiniteScroll
              className={"flex-grow"}
              style={{width: "100vw"}}
              dataLength={visibleUpdateInfos.length}
              next={loadNextInfos}
              hasMore={hasMore}
              loader={<div className={"flex w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto py-3 mt-3 bg-blue-300 rounded-xl bg-opacity-30 shadow-2xl"}>
                <span className={"w-full text-center text-gray-200"}>Lade weitere update infos</span>
              </div>}
              endMessage={
                <div className={"w-11/12 sm:w-5/6 md:w-3/4 lg:w-3/6 mx-auto py-3 mt-3 bg-red-300 rounded-xl bg-opacity-30 shadow-2xl flex"}>
                  <span className={"w-full text-center text-gray-200"}>Keine weiteren update infos Verfügbar</span>
                </div>
              }
              scrollableTarget={"scrollableDiv"}
            >
              {updateInfos && visibleUpdateInfos.map((u, i) => {
                return <UpdateInfoCard key={i ?? "upsi"} updateInfo={u} />;
              })}
            </InfiniteScroll>

          </div>
        </div>

      </div>

    </Layout>
  );
};

export default UpdatePage;
