import Logo from '../components/imgs/biglogo.png'
import Image from 'next/image'
import { IoIosMoon } from "react-icons/io";
export default function Navbarcomp(){

    return(
        <nav className='relative py-2'>
            <Image src={Logo} alt="Logo" width={70} height={100} className="absolute top-0 left-0 m-4" />
            <IoIosMoon className="absolute top-2 right-0 m-4 " size={20} />
            <div className=' opacity-0'>invisible element</div>
        </nav>
    )



}