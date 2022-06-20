import Layout from "../components/Layout";
import {HoverAnimation} from "../components/HoverAnimation";
import {formatCourseName} from "../util/lectureUtils";
import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import {FilterIcon, ShareIcon, ViewGridIcon, ViewListIcon} from "@heroicons/react/outline";
import {Transition} from "@headlessui/react";
import React, {Fragment} from "react";


export const ImpressumPage = () => {

  return (
      <Layout title={"Impressum"}>

        <div className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

          <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="flex flex-grow justify-center">
              <div className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-zinc-900    pt-2 pb-3 px-8 rounded-xl">
                <HoverAnimation><span className={"text-zinc-200 text-2xl font-semibold select-none"}>Impressum</span></HoverAnimation>
              </div>
            </div>
          </div>

          <Link href={"/"}>
            <div className={"flex ml-2 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200"}>
              <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"} />
              <span className={"text-xl text-gray-200 hidden lg:block"}>Back</span>
            </div>
          </Link>

        </div>

        <div className={"min-h-screen container mx-auto pt-5 text-gray-200"}>

          <div className={"mt-5"}>
            Max Hardtke <br/>
            An der Loreley 37 <br/>
            56329 St. Goar <br/>
          </div>

          <div className="mt-5"><span className={"font-bold"}>Email:</span> dhbw@hardtke.io</div>

          <p className={"mt-5"}>
            Die Informationen auf dieser Seite werden regelmäßig überprüft. Trotz aller Sorgfalt können sich ggf. Daten
            in der Zwischenzeit geändert haben. Eine Haftung oder Garantie für die Richtigkeit, Aktualität und
            Vollständigkeit der zur Verfügung gestellten Informationen kann daher nicht übernommen werden. Dies gilt
            auch für alle anderen Webseiten, auf die mittels Hyperlink verwiesen wird. Für den Inhalt der Webseiten, die
            aufgrund einer solchen Verbindung erreicht werden, sind wir nicht verantwortlich. Falls Sie durch eine
            Hyperlink auf eine rechtswidrige Seite gelangen sollten, bitten wir Sie uns darüber zu informieren:
            dhbw@hardtke.io. Wir werden nach erfolgter Überprüfung den Link sofort entfernen.
          </p>

          <p className={"mt-5"}>
            Inhalt und Gestaltung der Internet-Seiten sind urheberrechtlich geschützt. Eine Vervielfältigung der Seiten
            oder ihrer Inhalte bedarf der vorherigen schriftlichen Zustimmung von Max Hardtke, soweit die
            Vervielfältigung nicht ohnehin gesetzlich gestattet ist.
          </p>

        </div>

      </Layout>
  )
}

export default ImpressumPage;
