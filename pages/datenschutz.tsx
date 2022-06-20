import Layout from "../components/Layout";
import {HoverAnimation} from "../components/HoverAnimation";
import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/solid";
import React from "react";


export const DatenschutzPage = () => {

  return (
      <Layout title={"Datenschutz"}>

        <div
            className={"py-2 flex sticky top-0 z-40 bg-gradient-to-r from-teal-600 via-indigo-600 to-teal-500 rounded-b-xl"}>

          <div className="absolute z-50 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <div className="flex flex-grow justify-center">
              <div
                  className="{/*bg-gradient-to-b to-teal-600 from-indigo-600*/} bg-opacity-30 bg-zinc-900    pt-2 pb-3 px-8 rounded-xl">
                <HoverAnimation><span className={"text-zinc-200 text-2xl font-semibold select-none"}>Datenschutz</span></HoverAnimation>
              </div>
            </div>
          </div>

          <Link href={"/"}>
            <div
                className={"flex ml-2 px-2 py-1 gap-2 bg-opacity-50 rounded-md cursor-pointer hover:bg-teal-300 hover:bg-opacity-30 select-none transition transform duration-200"}>
              <ArrowLeftIcon className={"mt-1 h-5 w-5 text-gray-200"}/>
              <span className={"text-xl text-gray-200 hidden lg:block"}>Back</span>
            </div>
          </Link>

        </div>

        <div className={"min-h-screen container mx-auto pt-5 text-gray-200"}>

          <h2>Datenschutzerklärung</h2> <p>Personenbezogene Daten (nachfolgend zumeist nur „Daten“ genannt) werden von
          uns nur im Rahmen der Erforderlichkeit sowie zum Zwecke der Bereitstellung eines funktionsfähigen und
          nutzerfreundlichen Internetauftritts, inklusive seiner Inhalte und der dort angebotenen Leistungen,
          verarbeitet.</p> <p>Gemäß Art. 4 Ziffer 1. der Verordnung (EU) 2016/679, also der Datenschutz-Grundverordnung
          (nachfolgend nur „DSGVO“ genannt), gilt als „Verarbeitung“ jeder mit oder ohne Hilfe automatisierter Verfahren
          ausgeführter Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten, wie das
          Erheben, das Erfassen, die Organisation, das Ordnen, die Speicherung, die Anpassung oder Veränderung, das
          Auslesen, das Abfragen, die Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder eine andere Form
          der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die
          Vernichtung.</p> <p>Mit der nachfolgenden Datenschutzerklärung informieren wir Sie insbesondere über Art,
          Umfang, Zweck, Dauer und Rechtsgrundlage der Verarbeitung personenbezogener Daten, soweit wir entweder allein
          oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung entscheiden. Zudem informieren wir Sie
          nachfolgend über die von uns zu Optimierungszwecken sowie zur Steigerung der Nutzungsqualität eingesetzten
          Fremdkomponenten, soweit hierdurch Dritte Daten in wiederum eigener Verantwortung verarbeiten.</p> <p>Unsere
          Datenschutzerklärung ist wie folgt gegliedert:</p> <p>I. Informationen über uns als Verantwortliche<br/>II.
          Rechte der Nutzer und Betroffenen<br/>III. Informationen zur Datenverarbeitung</p> <h3>I. Informationen über
          uns als Verantwortliche</h3> <p>Verantwortlicher Anbieter dieses Internetauftritts im datenschutzrechtlichen
          Sinne ist:</p> Max Hardtke<br/>An der Loreley 37<br/>56329 St. Goar <p>E-Mail: dhbw@hardtke.io</p>
          <h3>II. Rechte der Nutzer und
          Betroffenen</h3> <p>Mit Blick auf die nachfolgend noch näher beschriebene Datenverarbeitung haben die
          Nutzer und Betroffenen das Recht</p>
          <ul>
            <li>auf Bestätigung, ob sie betreffende Daten verarbeitet werden, auf Auskunft über die verarbeiteten
              Daten, auf weitere Informationen über die Datenverarbeitung sowie auf Kopien der Daten (vgl. auch Art.
              15 DSGVO);
            </li>
            <li>auf Berichtigung oder Vervollständigung unrichtiger bzw. unvollständiger Daten (vgl. auch Art. 16
              DSGVO);
            </li>
            <li>auf unverzügliche Löschung der sie betreffenden Daten (vgl. auch Art. 17 DSGVO), oder, alternativ,
              soweit eine weitere Verarbeitung gemäß Art. 17 Abs. 3 DSGVO erforderlich ist, auf Einschränkung der
              Verarbeitung nach Maßgabe von Art. 18 DSGVO;
            </li>
            <li>auf Erhalt der sie betreffenden und von ihnen bereitgestellten Daten und auf Übermittlung dieser
              Daten an andere Anbieter/Verantwortliche (vgl. auch Art. 20 DSGVO);
            </li>
            <li>auf Beschwerde gegenüber der Aufsichtsbehörde, sofern sie der Ansicht sind, dass die sie
              betreffenden Daten durch den Anbieter unter Verstoß gegen datenschutzrechtliche Bestimmungen
              verarbeitet werden (vgl. auch Art. 77 DSGVO).
            </li>
          </ul>
          <p>Darüber hinaus ist der Anbieter dazu verpflichtet, alle Empfänger, denen gegenüber Daten durch den
            Anbieter offengelegt worden sind, über jedwede Berichtigung oder Löschung von Daten oder die
            Einschränkung der Verarbeitung, die aufgrund der Artikel 16, 17 Abs. 1, 18 DSGVO erfolgt, zu
            unterrichten. Diese Verpflichtung besteht jedoch nicht, soweit diese Mitteilung unmöglich oder mit einem
            unverhältnismäßigen Aufwand verbunden ist. Unbeschadet dessen hat der Nutzer ein Recht auf Auskunft über
            diese Empfänger.</p> <p><strong>Ebenfalls haben die Nutzer und Betroffenen nach Art. 21 DSGVO das Recht
          auf Widerspruch gegen die künftige Verarbeitung der sie betreffenden Daten, sofern die Daten durch den
          Anbieter nach Maßgabe von Art. 6 Abs. 1 lit. f) DSGVO verarbeitet werden. Insbesondere ist ein
          Widerspruch gegen die Datenverarbeitung zum Zwecke der Direktwerbung statthaft.</strong></p> <h3>III.
          Informationen zur Datenverarbeitung</h3> <p>Ihre bei Nutzung unseres Internetauftritts verarbeiteten
          Daten werden gelöscht oder gesperrt, sobald der Zweck der Speicherung entfällt, der Löschung der Daten
          keine gesetzlichen Aufbewahrungspflichten entgegenstehen und nachfolgend keine anderslautenden Angaben
          zu einzelnen Verarbeitungsverfahren gemacht werden.</p> <h4
            className="jet-listing-dynamic-field__content">Serverdaten</h4><p>Aus technischen Gründen,
          insbesondere zur Gewährleistung eines sicheren und stabilen Internetauftritts, werden Daten durch Ihren
          Internet-Browser an uns bzw. an unseren Webspace-Provider übermittelt. Mit diesen sog. Server-Logfiles
          werden u.a. Typ und Version Ihres Internetbrowsers, das Betriebssystem, die Website, von der aus Sie auf
          unseren Internetauftritt gewechselt haben (Referrer URL), die Website(s) unseres Internetauftritts, die
          Sie besuchen, Datum und Uhrzeit des jeweiligen Zugriffs sowie die IP-Adresse des Internetanschlusses,
          von dem aus die Nutzung unseres Internetauftritts erfolgt, erhoben.</p> <p>Diese so erhobenen Daten
          werden vorrübergehend gespeichert, dies jedoch nicht gemeinsam mit anderen Daten von Ihnen.</p> <p>Diese
          Speicherung erfolgt auf der Rechtsgrundlage von Art. 6 Abs. 1 lit. f) DSGVO. Unser berechtigtes
          Interesse liegt in der Verbesserung, Stabilität, Funktionalität und Sicherheit unseres
          Internetauftritts.</p> <p>Die Daten werden spätestens nach sieben Tage wieder gelöscht, soweit keine
          weitere Aufbewahrung zu Beweiszwecken erforderlich ist. Andernfalls sind die Daten bis zur endgültigen
          Klärung eines Vorfalls ganz oder teilweise von der Löschung ausgenommen.</p> <h4
            className="jet-listing-dynamic-field__content">Nutzerbeiträge, Kommentare und Bewertungen</h4><p>Wir
          bieten Ihnen an, auf unseren Internetseiten Fragen, Antworten, Meinungen oder Bewertungen, nachfolgend
          nur „Beiträge genannt, zu veröffentlichen. Sofern Sie dieses Angebot in Anspruch nehmen, verarbeiten und
          veröffentlichen wir Ihren Beitrag, Datum und Uhrzeit der Einreichung sowie das von Ihnen ggf. genutzte
          Pseudonym.</p> <p>Rechtsgrundlage hierbei ist Art. 6 Abs. 1 lit. a) DSGVO. Die Einwilligung können Sie
          gemäß Art. 7 Abs. 3 DSGVO jederzeit mit Wirkung für die Zukunft widerrufen. Hierzu müssen Sie uns
          lediglich über Ihren Widerruf in Kenntnis setzen.</p> <p>Darüber hinaus verarbeiten wir auch Ihre IP-
          und E-Mail-Adresse. Die IP-Adresse wird verarbeitet, weil wir ein berechtigtes Interesse daran haben,
          weitere Schritte einzuleiten oder zu unterstützen, sofern Ihr Beitrag in Rechte Dritter eingreift
          und/oder er sonst wie rechtswidrig erfolgt.</p> <p>Rechtsgrundlage ist in diesem Fall Art. 6 Abs. 1 lit.
          f) DSGVO. Unser berechtigtes Interesse liegt in der ggf. notwendigen Rechtsverteidigung.</p> <h4
            className="jet-listing-dynamic-field__content">Matomo (vormals: PIWIK)</h4><p>In unserem
          Internetauftritt setzen wir Matomo (ehemals: „PIWIK“) ein. Hierbei handelt es sich um eine
          Open-Source-Software, mit der wir die Benutzung unseres Internetauftritts analysieren können. Hierbei
          werden Ihre IP-Adresse, die Website(s) unseres Internetauftritts, die Sie besuchen, die Website, von der
          aus Sie auf unseren Internetauftritt gewechselt haben (Referrer URL), Ihre Verweildauer auf unserem
          Internetauftritt sowie die Häufigkeit des Aufrufs einer unserer Websites verarbeitet.</p> <p>Zur
          Erfassung dieser Daten speichert Matomo über Ihren Internet-Browser ein Cookie auf Ihrem Endgerät.
          Dieses Cookie ist eine Woche lang gültig.</p> <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f) DSGVO. Unser
          berechtigtes Interesse liegt in der Analyse und Optimierung unseres Internetauftritts.</p> <p>Allerdings
          nutzen wir Matomo mit der Anonymisierungsfunktion „Automatically Anonymize Visitor IPs“. Diese
          Anonymisierungsfunktion kürzt Ihre IP-Adresse um zwei Bytes, sodass eine Zuordnung zu Ihnen bzw. zu dem
          von Ihnen genutzten Internetanschluss unmöglich ist.</p> <p>Falls Sie mit dieser Verarbeitung nicht
          einverstanden sind, haben Sie die Möglichkeit, die Speicherung des Cookies durch eine Einstellung in
          Ihrem Internet-Browsers zu verhindern. Nähere Informationen hierzu finden Sie vorstehend unter
          „Cookies“.</p> <p>Darüber hinaus haben Sie die Möglichkeit, die Analyse Ihres Nutzungsverhaltens im Wege
          des sog. Opt-outs zu beenden. Mit dem Bestätigen des Links</p>
          <p>
            <iframe
                style={{border: 0, height: "200px", width: "600px"}}
                src="https://matomo.hardtke.tools/index.php?module=CoreAdminHome&action=optOut&language=de&fontColor=696969"
            ></iframe>

          </p>
          <p>wird über Ihren Internet-Browser ein Cookie auf Ihrem Endgerät gespeichert, das die weitere
            Analyse verhindert. Bitte beachten Sie aber, dass Sie den obigen Link erneut betätigen müssen, sofern
            Sie die auf Ihrem Endgerät gespeicherten Cookies löschen.</p>  <p><a
            href="https://www.generator-datenschutzerklärung.de" target="_blank"
            rel="noopener">Muster-Datenschutzerklärung</a> der <a
            href="https://www.ratgeberrecht.eu/datenschutz/datenschutzerklaerung-generator-dsgvo.html"
            target="_blank" rel="noopener">Anwaltskanzlei Weiß &amp; Partner</a></p>

        </div>

      </Layout>
  )
}

export default DatenschutzPage;
