import React, { useEffect } from 'react'
import { searchMovie } from '../lib/api/search'

function Search() {
    useEffect( () => {
        const fetchSearch = async () => {
            const res = await searchMovie();
            console.log(res)
        }

        fetchSearch()
    })
  return (
    <div>Search</div>
  )
}

export default Search