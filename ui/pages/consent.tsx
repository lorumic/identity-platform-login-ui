import type { NextPage } from "next"
import { AxiosError } from "axios"
import get from "axios"
import { useEffect } from "react"
import { useRouter } from "next/router"


const Consent: NextPage = () => {
  const router = useRouter()
  const { consent_challenge } = router.query;

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    get("./api/consent?consent_challenge=" + consent_challenge)
    .then(({ data : body}) => {
      window.location.href = body.redirect_to
    })
    .catch((err: AxiosError) => {
      switch (err.response?.status) {
        case 403:
          // This is a legacy error code thrown. See code 422 for
          // more details.
          return router.push("./login?aal=aal2")
        case 422:
          // This status code is returned when we are trying to
          // validate a session which has not yet completed
          // its second factor
          return router.push("./login?aal=aal2")
        case 401:
          // do nothing, the user is not logged in
          return
      }

      // Something else happened!
      return Promise.reject(err)
    })
    }, [router, consent_challenge])

    return (<></>)
}

export default Consent
