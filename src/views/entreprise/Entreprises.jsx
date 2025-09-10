import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import ListProiles from "../client/listprofile";
import ListProfiles from "../client/listprofile";

const Entreprises = () => {
  const [profiles, setProfiles] = useState([]);

  const fetchProfiles = async () => {
    try {

      // ✅ Fetch profile data
      const { data, error } = await supabase
        .from("profile")
        .select(`*`)
        .order("created_at", { ascending: false });

      setProfiles(data);
      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        // ✅ Reset the form with fetched data
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);


  return (<div className="h-screen p-10">
   {profiles?.length > 0 ? <ListProfiles people={profiles}/> : <div className="bg-gray-50 p-4 rounded ">Aucunne donnée retrouvée</div>}
  </div>);
};

export default Entreprises;
