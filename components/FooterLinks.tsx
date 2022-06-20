import Link from "next/link";

export const FooterLinks = () => {

  return (
      <div className={"flex gap-2 pb-4"}>
        <div className="flex gap-2 mx-auto">
          <Link href={"/impressum"}>
            <a className={"text-gray-500 hover:text-blue-400 text-lg"}>Impressum</a>
          </Link>

          <Link href={"/datenschutz"}>
            <a className={"text-gray-500 hover:text-blue-400 text-lg"}>Datenschutz</a>
          </Link>
        </div>

      </div>
  )

}
