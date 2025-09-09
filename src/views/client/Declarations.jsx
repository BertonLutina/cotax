
import React, { useEffect, useState } from "react";
import TabelOne from "../../components/tabel/tabelone";
import { supabase } from "../../supabaseClient";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const Declarations = () => {
  const [declarations, setdeclarations] = useState([]);

  const fetchDeclarations = async () => {
    try {
      // ✅ Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(userError);
        return;
      }

      // ✅ Fetch profile data
      const { data, error } = await supabase
        .from("declarations")
        .select(`*,transactions(*)`)
        .order("created_at", { ascending: false });

        console.log('data', data)

      setdeclarations(data);
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
    fetchDeclarations();
  }, [fetchDeclarations]);

  return (
    <div className="w-full flex-col flex items-center">
      <div className="w-11/12 flex">
        <h2 className="mb-8 text-2xl font-semibold">
        Déclarations de l’IRL Approuvées
        </h2>
      </div>
      {declarations.length > 0 ? (
        <TabelOne
          declarations={declarations}
          title="Toutes les déclarations qui ont été validées par le DGRK et la Banque."
        />
      ) : (
        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <InformationCircleIcon
                aria-hidden="true"
                className="size-5 text-gray-400"
              />
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-gray-700">
                Aucun déclaration en attente de validation
              </p>
              <p className="mt-3 text-sm md:mt-0 md:ml-6"></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Declarations