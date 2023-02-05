import Layout from "../components/Layout";
import React, {useEffect, useState} from "react";
import {
  IconAppWindow,
  IconBeer,
  IconBrandDiscord,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconCalendar,
  IconCalendarEvent, IconTicket,
  IconVaccine
} from "@tabler/icons";
import {FooterLinks} from "../components/FooterLinks";
import moment from "moment";
import {GetStaticProps} from "next";
import {HoverAnimation} from "../components/HoverAnimation";

export const ErstisPage = () => {


  return (
      <Layout title={"Nett Hier!"}>
        <div className={"flex flex-col flex-grow min-h-screen overflow-y-scroll items-center"}>
          <div className="max-w-lg flex-grow">

            <HoverAnimation >
              <div className="flex flex-grow justify-center max-h-52 mt-10 ">
                <img className={"flex-grow"} src={"/logos/nett_hier.svg"} />
              </div>
            </HoverAnimation>

            <div className="container mx-auto text-center pt-5">
              <h1 className={"text-gray-50 font-light text-5xl"}><span className={"font-bold"}>Nett Hier!</span></h1>
              <h1 className={"text-gray-50 font-light text-5xl"}>Aber kennen Sie schon die StuV Mosbach?</h1>
              <h2 className={"text-gray-50 font-light text-2xl mt-5"}>
                Wenn du einen Sticker gefunden hast, poste gerne ein Bild von Ihm in der Whatsapp Gruppe und/oder auf Instagramm und Markiere uns!
              </h2>

              <div className={"mt-10 flex flex-col px-2 gap-4"}>

                <a href={"https://chat.whatsapp.com/GdwrsmRKIfvDVxejz8uL4f"} target={"_blank"} className={"p-3 border border-2 border-[#25D366] hover:bg-[#25D366] hover:bg-opacity-30 cursor-pointer rounded-lg flex items-center gap-4"}>
                  <IconBrandWhatsapp className={"h-10 w-10 text-white flex-grow-0"} />
                  <div className={"text-2xl text-gray-50 flex-grow"}>Nett Hier Whatsapp Gruppe</div>
                </a>

                <a href={"https://stuv-mosbach.de"} target={"_blank"} className={"p-3 border border-2 border-red-500 hover:bg-red-500 hover:bg-opacity-30 cursor-pointer rounded-lg flex items-center gap-4"}>
                  <IconAppWindow className={"h-10 w-10 text-white flex-grow-0"} />
                  <div className={"text-2xl text-gray-50 flex-grow"}>StuV Webseite</div>
                </a>

                <a href={"https://www.instagram.com/stuv.mos.mgh.dhbw/"} target={"_blank"} className={"p-3 border border-2 border-[#833AB4] hover:bg-[#833AB4] hover:bg-opacity-30 cursor-pointer rounded-lg flex items-center gap-4"}>
                  <IconBrandInstagram className={"h-10 w-10 text-white flex-grow-0"} />
                  <div className={"text-2xl text-gray-50 flex-grow"}>StuV Instagramm</div>
                </a>

              </div>

            </div>
          </div>

          <FooterLinks />

        </div>
      </Layout>
  )

}

export const getStaticProps : GetStaticProps = (context) =>  {
  return {
    props: {},
    revalidate: 10_000
  }
}

export default ErstisPage;
