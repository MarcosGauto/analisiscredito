import { auth0 } from "@/lib/auth0"
import UserSession from "@/components/userSession.jsx"
import { CuitForm } from "@/components/cuit-form"

export default async function Home() {
  const session = await auth0.getSession()

  if (!session) {
    return (
      <main>
        <a href="/auth/login?screen_hint=signup">Sign up</a>
        <a href="/auth/login">Log in</a>
      </main>
    )
  }

  return (
    <main>
      <UserSession>
        <CuitForm/>
      </UserSession>
      </main>
  )
}