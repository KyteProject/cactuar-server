import React from 'react';

export const Store = React.createContext();

const initialState = {
    episodes: [],
    favourites: []
  },
  reducer = ( state, action ) => {
    switch ( action.type ) {
      case 'FETCH_DATA':
        return { ...state, episodes: action.payload };
      default:
        return state;
    }
  };

export const StoreProvider = ( props ) => {
  const [ state, dispatch ] = React.useReducer( reducer, initialState ),
    value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
