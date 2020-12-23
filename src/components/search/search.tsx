import * as React from 'react';
import './search.css';
import {FormEvent} from "react";
import {useDispatch} from "react-redux";
import { setSearchValue } from "@store";

export const Search = () => {
  const dispatch = useDispatch();
  const setSearch = (evt: FormEvent) => {
    const target = evt.target as HTMLFormElement;
    dispatch(setSearchValue(target.value));
  }

  return <div className='search'>
    <h3>Search</h3>
    <input type="text" onInput={setSearch} />
  </div>
}
