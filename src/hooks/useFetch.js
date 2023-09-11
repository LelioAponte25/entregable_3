import axios from "axios"
import { useState } from "react"


const useFetch = (url) => {

    const [infoApi, setInfoApi] = useState()
    const [hasError, setHasError] = useState()
    const [isLoading, setIsLoading] = useState()

        const getApi = () => {
            console.log(infoApi)
            setIsLoading(true)
            axios.get(url)
                .then(res => {
                    setInfoApi(res.data)
                    setHasError(false)
                })
                .catch(err => {
                    console.log(err)
                    setHasError(true)
                })
                .finally(() => setIsLoading(false))
        }

            return [infoApi, getApi, hasError, isLoading]


}


export default useFetch