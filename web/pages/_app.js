import "tailwindcss/tailwind.css"

import Link from "next/link";
import { useState } from "react";

function NavButton(props) {
  return (
    <Link href={props.href}>
      <a className="md:inline-flex md:w-auto w-full px-3 py-2 rounded items-center justify-center bg-gray-50 hover:bg-gray-100 transition duration-150">
        {props.children}
      </a>
    </Link>
  );
}

function SearchBox() {
  return (
    <form className="flex flex-row bg-white rounded border">
      <input required className="p-2 rounded-tl rounded-bl" type="text" placeholder="Search" />
      <input className="p-2 rounded-tr rounded-br bg-gray-50 hover:bg-gray-100 transition duration-150" type="submit" value="→" />
    </form>
  );
}

function NavBar() {
  const [active, setActive] = useState(false);

  return (
    <nav className="fixed z-20 w-full flex items-center bg-gray-50 p-2 flex-wrap shadow">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/material-design-icons/3.0.1/iconfont/material-icons.min.css" integrity="sha256-x8PYmLKD83R9T/sYmJn1j3is/chhJdySyhet/JuHnfY=" crossorigin="anonymous" />
      <div className="p-2 mr-4 inline-flex items-center">
          <div className="flex flex-cols h-8 space-x-2">
            <Link href="/">
              <a className="text-xl font-bold">
                <h1>blog.stimsina.com</h1>
              </a>
            </Link>
          </div>
      </div>
      <button onClick={() => setActive(!active)} className="inline-flex p-3 hover:bg-gray-100 rounded md:hidden ml-auto outline-none transition duration-150">
        <i className="material-icons">menu</i>
      </button>
      <div className={`${ active ? "" : "hidden" } w-full md:inline-flex md:flex-grow md:w-auto transition duration-150`}>
        <div className="md:inline-flex md:flex-row md:ml-auto md:w-auto w-full md:items-center items-start flex flex-col md:h-auto">
          <NavButton href="/">Home</NavButton>
          <NavButton newtab={true} href="https://paypal.me/05st">Donate</NavButton>
          <div className="pl-2">
            <SearchBox />
          </div>
        </div>
      </div>
    </nav>
  );
}


export default function App({ Component, pageProps }) {
  return (
    <>
      <NavBar/>
      <Component {...pageProps}/>
    </>
  );
}

