import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {

    const initialState = {
        search_input : ""
    }
    const [searchInput, setSearchInput] = useState(initialState)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name,value} = e.target
        setSearchInput((...oldValues) => ({...oldValues, [name]: value}))
    }

    const onSubmit = (e) => {
        if(searchInput.input === "") {
            return
        }
        navigate(`/search`, {replace: true})
    }

    return (
        <>
            <div className="search-bar-box">
                <form onSubmit={onSubmit}>
                    <input
                    type="text"
                    placeholder="Search here"
                    onChange={handleChange}
                    className="search-bar"
                    name="search_input"
                    value={searchInput.input} />
                </form>
            </div>
        </>
    )

}

export default SearchBar