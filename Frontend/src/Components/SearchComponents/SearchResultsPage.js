import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom"
import { useSearchParams } from "react-router-dom";
import TopicSearchResult from "./TopicSearchResult";
import PostSearchResult from "./PostSearchResults";

const SearchResultsPage = () => {
    
    const initialState = {
        topics: [],
        posts: [],
        comments: []
    }
    const [searchResults, setSearchResults] = useState(initialState)
    const [searchParams, setSearchParams ]= useSearchParams("search_input")
    const [searchError, setSearchError] = useState(false)

    useEffect(() => {
        let search_input = searchParams.getAll("search_input")[0]
        fetch(`/api/search/search?search_input=${search_input}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then((res) => 
            {
                if (!res.ok) {
                    setSearchError(true)
                    return
                }
            return res.json()
            }
        )
        .then((data) => {
            setSearchResults({
                topics: data.topics,
                posts: data.posts,
            })
            console.log(searchResults)
        })
    },[])

    return searchResults.topics.length == 0 && searchResults.posts.length == 0  ? (
        <>
            <div className='search-results-page'>
                <div className='search-results-header'>
                    <h1 className='search-results-title'>Search Results</h1>
                    <div className="sort-search-results">
                        <ul className='results-categories-list'>
                            <li className='search-category'>Topics</li>
                            <li className='search-category'>Posts</li>
                            <li className='serach-category'>Comments</li>
                        </ul>
                    </div>
                </div>
                <div className='search-results-body'>
                    <h1>No Items Found</h1>
                </div>
            </div>
        </>
     ) : (
        <>
            <div className='search-results-page'>
                <div className='search-results-header'>
                    <h1 className='search-results-title'>Search Results</h1>
                    <div className="sort-search-results">
                        <ul className='results-categories-list'>
                            <li className='category'>Topics</li>
                            <li className='category'>Posts</li>
                            <li className='category'>Comments</li>
                        </ul>
                    </div>
                </div>
                <div className='search-results-body'>
                    {searchResults.topics.length == 0 ? "" : searchResults.topics.map(topic => (
                        <TopicSearchResult topic={topic} key={topic._id} />
                    ))}
                    {searchResults.posts.length == 0 ? "" : searchResults.posts.map(post => (
                        <PostSearchResult post={post} key={post._id} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default SearchResultsPage