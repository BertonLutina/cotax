import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import { setUser } from "../../redux/userSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { getStorage } from "../../utilities/cssfunction";

// ✅ Validation Schema
const schema = yup.object().shape({
  is_societe: yup.boolean(),
  nom: yup.string().nullable(),
  prenom: yup.string().nullable(),
  nom_societe: yup.string().required("Nom de la societe requis"),
  numero_societe: yup.string().nullable(),
  rue: yup.string().required("Rue requise"),
  numero: yup.string().required("Numéro requis"),
  boite: yup.string().nullable(),
  nom_societe_bailleur: yup.string().nullable(),
  numero_societe_bailleur: yup.string().nullable(),
  rue_bailleur: yup.string().required("Rue requise"),
  numero_bailleur: yup.string().required("Numéro requis"),
  boite_bailleur: yup.string().nullable(),
  commune: yup.string().required("Commune requis"),
  codepostal: yup.string().required("Codepostal requis"),
  commune_bailleur: yup.string().required("Commune requis"),
  codepostal_bailleur: yup.string().required("Codepostal requis"),
});

// ✅ Upload helper
const uploadImage = async (bucket, file) => {
  if (!file) return null;

  const fileName = `${Date.now()}-${file.name}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("Upload failed:", error.message);
    return null;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
};

export default function ProfileModal({ open, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,      // <-- add reset
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
          is_societe: true,
          nom: "",
          prenom: "",
          nom_societe: "",
          numero_societe: "",
          rue: "",
          numero: "",
          boite: "",
          nom_societe_bailleur: "",
          numero_societe_bailleur: "",
          rue_bailleur: "",
          numero_bailleur: "",
          boite_bailleur: "",
          commune: "",
          codepostal: "",
          commune_bailleur: "",
          codepostal_bailleur: "",
        },
      });

  const [logoPreview, setLogoPreview] = useState(null);
  const [logoBailleurPreview, setLogoBailleurPreview] = useState(null);

  const [is_societe, setis_societe] = useState(true);

  const dispatch = useDispatch();

  const [user, setuser] = useState({})


  const fetchProfile = async () => {
    try {
      // ✅ Get logged-in user
      const user = getStorage("user","json");
      const access_token = getStorage("access_token","string");
  
      setuser(user);
  
      // ✅ Fetch profile data
      const { data, error } = await supabase
        .from("profile") // or "profile" depending on which table
        .select("*")
        .eq("user_id", user?.user_id||user.id)
        .order("created_at", { ascending: false })
        .single(); // get one record
  
      if (error) {
        console.error(error);
        return;
      }
  
      if (data) {
        // ✅ Reset the form with fetched data
        reset({
          ...data,
          is_societe: data.is_societe ?? true, // default true if null
        });
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (data) => {
    
    try {
      // Safely cast numbers (empty string → null)
      data.numero = data.numero ? Number(data.numero) : null;
      data.numero_bailleur = data.numero_bailleur
        ? Number(data.numero_bailleur)
        : null;
  
      // ✅ Get logged-in user
      const user = getStorage("user","json");
      const access_token = getStorage("access_token","string");
  
  
      const profileData = {
        ...data,
        user_id: (user?.user_id||user.id),
      };
  
      // ✅ Check if profile already exists
      const { data: existing, error: fetchError } = await supabase
        .from("profile")
        .select("id")
        .eq("user_id", user?.user_id || user?.id)
        .maybeSingle(); // better than single() → avoids throwing if no row
  
      if (fetchError) throw fetchError;
  
      let error;
      if (existing) {
        // ✅ Update
        ({ error } = await supabase
          .from("profile")
          .update(profileData)
          .eq("user_id", user?.user_id || user?.id));
        console.log("Profile updated:", profileData);
      } else {
        // ✅ Insert
        ({ error } = await supabase.from("profile").insert([profileData]));
        console.log("Profile inserted:", profileData);
      }
  
      if (error) throw error;
  
      // ✅ Update Redux state
      dispatch(setUser(profileData));
  
      Swal.fire({
        icon: "success",
        title: "Profil enregistré ✅",
        timer: 2000,
        showConfirmButton: false,
      });
  
      onClose(false); // close modal
    } catch (err) {
      console.error("Save error:", err);
      alert("Erreur lors de l’enregistrement");
    }
  };
  
  

  const inputClass =
    "mt-2 block w-full h-14 text-lg rounded-md border border-gray-300 text-gray-900 px-4 py-3  focus:outline-indigo-600 sm:px-3 sm:py-1.5 ";

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl overflow-y-auto max-h-[90vh]">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Société ou particulier */}
            <h2 className="text-lg font-semibold text-gray-900">
              Identification de votre societé
            </h2>
            <div className="sm:col-span-6">
              <label
                htmlFor="is_societe"
                className="block text-sm font-medium text-gray-900"
              >
                Est-ce une société ?
              </label>

              <button
                type="button"
                role="switch"
                aria-checked={is_societe}
                onClick={() => {
                  setis_societe(!is_societe);
                  setValue("is_societe", !is_societe);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  is_societe ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    is_societe ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <input
                type="hidden"
                {...register("is_societe")}
                value={is_societe}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium">Logo</label>
              <input
                type="file"
                accept="image/*"
               // {...register("logo")}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setLogoPreview(URL.createObjectURL(file));
                }}
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mt-2 h-20 w-20 rounded-full object-cover border"
                />
              )}
            </div>

            {/* Nom / prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  {...register("nom")}
                  className={inputClass}
                />
                {errors.nom && (
                  <p className="text-red-500 text-sm">{errors.nom.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Prénom</label>
                <input
                  type="text"
                  {...register("prenom")}
                  className={inputClass}
                />
              </div>
            </div>
            {is_societe && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Nom Société
                  </label>
                  <input
                    type="text"
                    {...register("nom_societe")}
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Numéros société */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Numéro Société
                </label>
                <input
                  type="text"
                  {...register("numero_societe")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Adresse locataire */}
            <div>
              <h3 className="font-semibold">Adresse Locataire</h3>
              <div className="grid grid-cols-6 gap-4">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Codepostal"
                    {...register("codepostal")}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Commune"
                    {...register("commune")}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-4">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Rue"
                    {...register("rue")}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    placeholder="Numéro"
                    {...register("numero")}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    placeholder="Boîte"
                    {...register("boite")}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Logo Bailleur Upload */}
            {/*   <div>
              {logoBailleurPreview && (
                <img
                  src={logoBailleurPreview}
                  alt="Logo Bailleur Preview"
                  className="mt-2 h-20 w-20 rounded-full object-cover border"
                />
              )}
              <label className="block text-sm font-medium">Logo Bailleur</label>
              <input
                type="file"
                accept="image/*"
                {...register("logo_bailleur")}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setLogoBailleurPreview(URL.createObjectURL(file));
                }}
              />
            </div> */}

            <h2 className="text-lg font-semibold text-gray-900">
              Identification Bailleur
            </h2>
            {/* Nom bailleur société */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Nom Société Bailleur
                </label>
                <input
                  type="text"
                  {...register("nom_societe_bailleur")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Numéros société */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Numéro Société Bailleur
                </label>
                <input
                  type="text"
                  {...register("numero_societe_bailleur")}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Adresse bailleur */}
            <div>
              <h3 className="font-semibold">Adresse Bailleur</h3>
              <div className="grid grid-cols-6 gap-4">
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Codepostal"
                    {...register("codepostal_bailleur")}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Commune"
                    {...register("commune_bailleur")}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-6 gap-4">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Rue"
                    {...register("rue_bailleur")}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    placeholder="Numéro"
                    {...register("numero_bailleur")}
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-1">
                  <input
                    type="text"
                    placeholder="Boîte"
                    {...register("boite_bailleur")}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Nom bailleur */}
            {/*  <div>
              <label className="block text-sm font-medium">Nom Bailleur</label>
              <input
                type="text"
                {...register("nom_bailleur")}
                className={inputClass}
              />
            </div> */}

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={onClose}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-400 text-white"
              >
                Sauvegarder
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
