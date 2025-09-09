// src/redux/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  nom: null,
  prenom: null,
  nomSociete: null,
  nomSocietebailleur: null,
  number_societe: null,
  number_societe_bailleur: null,
  rue: "",
  numero: "",
  boite: "",
  rue_bailleur: "",
  numero_bailleur: "",
  boite_bailleur: "",
  nom_bailleur: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    updateUserall: (state, action) => {
        state = action.payload;
      },
    resetUser: () => initialState,
  },
});

export const { setUser, updateUserField,updateUserall, resetUser } = userSlice.actions;
export default userSlice.reducer;
