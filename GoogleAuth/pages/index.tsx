import { useSession, signIn, signOut } from "next-auth/react";
import Image from 'next/image'

export default function Home() {

  const { data: session } = useSession()


  if(session){
    return(
      <div>
        <h2>Hello, {session.user?.name}</h2>
        <div> <Image alt="profile" width="100" height="100" src={session.user?.image!}></Image>  </div>
        <hr />
        <button onClick={() => signOut()}>LogOut</button>
      </div>
    )
  }
  return (
    <div>
      <h2>Log in with Google</h2>
      <hr />
      <button onClick={() => signIn('google')}>Google</button>
    </div>
);
}
