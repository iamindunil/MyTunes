import { Home, Search } from "lucide-react"
import Link from "next/link"

export default function MobileMenu(): JSX.Element {
  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 flex items-center justify-center">
      <div className="flex bg-primary justify-center w-fit gap-2 items-center p-2 h-fit mb-2 rounded-full">
        <Link
          href="/"
          className="rounded-full h-[30px] w-[42px] flex items-center justify-center bg-background text-foreground text-sm"
        >
          <Home className="w-4 h-4" />
        </Link>

        <Link
          href="/search/latest"
          className="rounded-full h-[30px] w-[42px] flex items-center justify-center bg-background text-foreground text-sm"
        >
          <Search className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
