import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { payments } from "../../utilities/fakedata";
import PaymentCards from "../../components/cards/payementscards";
import { supabase } from "../../supabaseClient";
import { classNames, formatCDF, formatUSD } from "../../utilities/cssfunction";

// ✅ Validation schema
const schema = yup.object().shape({
  is_societe: yup.boolean(),
  nom: yup.string().when("is_societe", {
    is: false,
    then: (s) => s.required("Nom requis"),
  }),
  number_societe: yup.string().when("is_societe", {
    is: false,
    then: (s) => s.required("numero de societe requis"),
  }),
  number_societe_bailleur: yup.string().when("is_societe", {
    is: false,
    then: (s) => s.required("numero de societe requis"),
  }),
  prenom: yup.string().when("is_societe", {
    is: false,
    then: (s) => s.required("Prénom requis"),
  }),
  nomSociete: yup.string().when("is_societe", {
    is: true,
    then: (s) => s.required("Nom de société requis"),
  }),
  versement:yup.string().required("moet ingevuld zijn"),
  startDate: yup.date().required("Date de début requise"),
  endDate: yup.date().required("Date de fin requise"),
  denominations: yup.string().nullable(),
  rue: yup.string().required("Rue requise"),
  numero: yup.string().required("numero de l'adresse requise"),
  boite: yup.string().required("boite requise"),
  rue_bailleur: yup.string().required("Rue requise"),
  numero_bailleur: yup.number().required("numero de l'adresse requise"),
  boite_bailleur: yup.string().required("boite requise"),
  nom_bailleur: yup.string().required("Nom bailleur requis"),
  tel: yup.string().required("Téléphone requis"),
  tel_bailleur: yup.string().required("Téléphone requis"),
  ets_rue: yup.string().nullable(),
  ets_numero: yup.string().nullable(),
  ets_boite: yup.string().nullable(),
  ets_rue_bailleur: yup.string().nullable(),
  ets_numero_bailleur: yup.string().nullable(),
  ets_boite_bailleur: yup.string().nullable(),
  description: yup.string().required("Description requise"),
  loyers: yup.number().required("Montant requis"),
  irl: yup.string().required("IRL requis"),
  declaration_date: yup.date().required("Date requise"),
  echeance: yup.date().required("Échéance requise"),
  commune: yup.string().required("Commune requis"),
  codepostal: yup.string().required("Codepostal requis"),
  commune_bailleur: yup.string().required("Commune requis"),
  codepostal_bailleur: yup.string().required("Codepostal requis"),
  ets_commune: yup.string().nullable(),
  ets_codepostal: yup.string().nullable(),
  ets_commune_bailleur: yup.string().nullable(),
  ets_codepostal_bailleur: yup.string().nullable(),
  isapproved: yup.string(),
});

export const Declaration = () => {
  const [formData, setFormData] = useState({}); // ✅ keep track of values manually
  const [is_societe, setis_societe] = useState(true);
  const [ets, setets] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState({
    amount:0,
    amount_dollars:"$0",
    currency:"USD",
    amount_cdf:"$0",
    currency_cdf:"CDF",
  
  })
  const [ets_b, setetsb] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    formState: { errors,isValid },

  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_societe: true,
      nom: "",
      number_societe: "",
      number_societe_bailleur: "",
      prenom: "",
      nomSociete: "",
      startDate: null,
      endDate: null,
      denominations: "",
      rue: "",
      numero: "",
      boite: "",
      rue_bailleur: "",
      numero_bailleur: "",
      boite_bailleur: "",
      nom_bailleur: "",
      tel: "",
      tel_bailleur: "",
      ets_rue: "",
      ets_numero: "",
      ets_boite: "",
      ets_rue_bailleur: "",
      ets_numero_bailleur: "",
      ets_boite_bailleur: "",
      description: "",
      loyers: 0,
      irl: "",
      declaration_date: null,
      echeance: null,
      versement: "",
      commune: "",
      codepostal: "",
      commune_bailleur: "",
      codepostal_bailleur: "",
      ets_commune: "",
      ets_codepostal: "",
      ets_commune_bailleur: "",
      ets_codepostal_bailleur: "",
      isapproved: 0,
    },
  });

  function calculate22Percent(value) {
    const val = parseFloat((value * 0.22).toFixed(2)); 
    return val;
  }

  // ✅ Handler to update state alongside react-hook-form
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name == "loyers") {
      const per22 = calculate22Percent(value);
      const money = formatUSD(per22);
      setValue("irl",money)
      const money_cdf = formatCDF(per22);
      setAmount(prev => ({...prev,amount_cdf:money_cdf,amount_dollars:money,amount:per22}))
      setFormData((prev) => ({ ...prev, ["irl"]: money }));
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const calcul = formData?.irl || '$0';//loyers + irl;
    setValue("versement",calcul)
    setFormData((prev) => ({ ...prev, versement: calcul }));
  }, [formData?.loyers, formData?.irl]);

  // ✅ Shared classes
  const inputClass =
    "mt-2 block w-full h-14 text-lg rounded-md border border-gray-300 text-gray-900 px-4 py-3 focus:outline-indigo-600 sm:px-3 sm:py-1.5 ";

  const inputHighClass = "mt-2 text-3xl";
  const textareaClass =
    "mt-2 block w-full rounded-md border border-gray-300 text-gray-900 px-4 py-3 text-lg focus:outline-indigo-600 sm:px-3 sm:py-2";

    const fetchProfile = async () => {
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
          .from("profile") // or "profile" depending on which table
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .single(); // get one record
    
        if (error) {
          console.error(error);
          return;
        }
    
        if (data) {
          // ✅ Reset the form with fetched data
          
          reset({
            user_id:data?.user_id,
            nom:data?.nom,
            prenom:data?.prenom,
            rue: data?.rue,
            numero: data?.numero,
            boite: data?.boite,
            rue_bailleur: data?.rue_bailleur,
            numero_bailleur: data?.numero_bailleur,
            boite_bailleur: data?.boite_bailleur,
            commune: data?.commune,
            codepostal: data?.codepostal,
            commune_bailleur: data?.commune_bailleur,
            codepostal_bailleur: data?.codepostal_bailleur,
            nomSociete : data.nom_societe,
            nom_bailleur:data.nom_societe_bailleur,
            number_societe:data.numero_societe,
            number_societe_bailleur:data.numero_societe_bailleur,
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

  // Create or Update
  const onSubmit = async (data) => {
    setOpenModal(true);
  };

  return (
    <div className="flex justify-center">
      <form className="w-full xl:w-1/2 lg:w-5/6 md:w-5/6 sm:w-5/6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div>
            {" "}
            <label className="text-3xl">
              Déclaration de l'impôt sur le revenu locatif{" "}
            </label>{" "}
          </div>

          {/* Titre 1a Identification */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">
              1a. Identification Locataire
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              {/* Dates */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-900"
                >
                  Date de début
                </label>
                <input
                  type="date"
                  value={formData?.startDate}
                  id="startDate"
                  {...register("startDate")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-900"
                >
                  Date de fin
                </label>
                <input
                  type="date"
                  value={formData?.endDate}
                  id="endDate"
                  {...register("endDate")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="is_societe"
                  className="block text-sm font-medium text-gray-900"
                >
                  Déclarant est une société
                </label>

                <button
                  type="button"
                  role="switch"
                  aria-checked={is_societe}
                  {...register("is_societe")}
                  onClick={() => {
                    setis_societe(!is_societe);
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
              </div>
              <div className="sm:col-span-6">
                  <label
                    htmlFor="number_societe"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Nr. de la société
                  </label>
                  <input
                    id="number_societe"
                    value={formData?.number_societe}
                    {...register("number_societe")}
                    disabled
                    className={inputClass}
                  />
                  {errors.number_societe && (
                    <p className="text-red-500 text-sm">
                      {errors.number_societe.message}
                    </p>
                  )}
                </div>
              {/* Conditionally show fields */}
              {!is_societe ? (
                <>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="nom"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Nom
                    </label>
                    <input
                      id="nom"
                      value={formData?.nom}
                      {...register("nom")}
                      className={inputClass}
                    />
                    {errors.nom && (
                      <p className="text-red-500 text-sm">
                        {errors.nom.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="prenom"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Prénom
                    </label>
                    <input
                      id="prenom"
                      value={formData?.prenom}
                      {...register("prenom")}
                      className={inputClass}
                    />
                    {errors.prenom && (
                      <p className="text-red-500 text-sm">
                        {errors.prenom.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="sm:col-span-6">
                  <label
                    htmlFor="nomSociete"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Nom de la société
                  </label>
                  <input
                    id="nomSociete"
                    value={formData?.nomSociete}
                    {...register("nomSociete")}
                    className={inputClass}
                  />
                  {errors.nomSociete && (
                    <p className="text-red-500 text-sm">
                      {errors.nomSociete.message}
                    </p>
                  )}
                </div>
              )}

              {/* Autres infos */}
              <div className="sm:col-span-6">
                <label
                  htmlFor="denominations"
                  className="block text-sm font-medium text-gray-900"
                >
                  Autres dénominations / Enseigne commerciale
                </label>
                <input
                  type="text"
                  value={formData?.denominations}
                  id="denominations"
                  {...register("denominations")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.denominations && (
                  <p className="text-red-500 text-sm">
                    {errors.denominations.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-6 mt-6">
                <label
                  htmlFor="adresse"
                  className=" text-md font-medium text-gray-900"
                >
                  Adresse Siège B.P (Ajouter adresse Ets secondaire?)
                </label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={ets}
                  onClick={() => {
                    setets(!ets);
                  }}
                  className={`ml-2 relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    ets ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      ets ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Codepostal"
                  value={formData?.codepostal}
                  id="codepostal"
                  {...register("codepostal")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.codepostal && (
                  <p className="text-red-500 text-sm">
                    {errors.codepostal.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Commune"
                  value={formData?.commune}
                  id="commune"
                  {...register("commune")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.commune && (
                  <p className="text-red-500 text-sm">
                    {errors.commune.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Rue"
                  value={formData?.rue}
                  id="rue"
                  {...register("rue")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.rue && (
                  <p className="text-red-500 text-sm">{errors.rue.message}</p>
                )}
              </div>

              <div className="sm:col-span-1">
                <input
                  type="number"
                  placeholder="Nr."
                  value={formData?.numero}
                  id="numero"
                  {...register("numero")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.numero && (
                  <p className="text-red-500 text-sm">
                    {errors.numero.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Boite"
                  value={formData?.boite}
                  id="boite"
                  {...register("boite")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.boite && (
                  <p className="text-red-500 text-sm">{errors.boite.message}</p>
                )}
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="tel"
                  className="block text-sm font-medium text-gray-900"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData?.tel}
                  id="tel"
                  {...register("tel")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.tel && (
                  <p className="text-red-500 text-sm">{errors.tel.message}</p>
                )}
              </div>

              {ets ? (
                <>
                  <div className="sm:col-span-6 mt-6">
                    <label
                      htmlFor="ets"
                      className="block text-md font-medium text-gray-900"
                    >
                      Ets secondaires B.P
                    </label>
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Codepostal"
                      value={formData?.ets_codepostal}
                      id="ets_codepostal"
                      {...register("ets_codepostal")}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                    {errors.ets_codepostal && (
                      <p className="text-red-500 text-sm">
                        {errors.ets_codepostal.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Commune"
                      value={formData?.ets_commune}
                      id="ets_commune"
                      {...register("ets_commune")}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                    {errors.ets_commune && (
                      <p className="text-red-500 text-sm">
                        {errors.ets_commune.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Rue"
                      value={formData?.ets_rue}
                      id="ets_rue"
                      {...register("ets_rue")}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                    {errors.ets_rue && (
                      <p className="text-red-500 text-sm">
                        {errors.ets_rue.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      placeholder="Nr."
                      value={formData?.ets_numero}
                      id="ets_numero"
                      {...register("ets_numero")}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                    {errors.ets_numero && (
                      <p className="text-red-500 text-sm">
                        {errors.ets_numero.message}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="text"
                      placeholder="Boite"
                      value={formData?.ets_boite}
                      id="ets_boite"
                      {...register("ets_boite")}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                    {errors.ets_boite && (
                      <p className="text-red-500 text-sm">
                        {errors.ets_boite.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <></>
              )}
       
              {/*    <div className="sm:col-span-6">
                <label
                  htmlFor="etsTel"
                  className="block text-sm font-medium text-gray-900"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData?.etsTel}
                  id="etsTel"
                  {...register("etsTel")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.etsTel && (
                  <p className="text-red-500 text-sm">
                    {errors.etsTel.message}
                  </p>
                )}
              </div> */}
            </div>
          </div>

          {/* Titre 1b Identification Bailleur */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">
              1b. Identification Bailleur
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              {/* Nom, Prenom */}
              <div className="sm:col-span-6">
                  <label
                    htmlFor="number_societe_bailleur"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Nr. de la société
                  </label>
                  <input
                    id="number_societe_bailleur"
                    value={formData?.number_societe_bailleur}
                    {...register("number_societe_bailleur")}
                    disabled
                    className={inputClass}
                  />
                  {errors.number_societe_bailleur && (
                    <p className="text-red-500 text-sm">
                      {errors.number_societe_bailleur.message}
                    </p>
                  )}
                </div>
              <div className="sm:col-span-6">
                  <label
                    htmlFor="nom_bailleur"
                    className="block text-sm font-medium text-gray-900"
                  >
                    Nom de la société
                  </label>
                  <input
                    id="nom_bailleur"
                    value={formData?.nom_bailleur}
                    {...register("nom_bailleur")}
                    className={inputClass}
                  />
                  {errors.nom_bailleur && (
                    <p className="text-red-500 text-sm">
                      {errors.nom_bailleur.message}
                    </p>
                  )}
                </div>
              <div className="sm:col-span-6 mt-6">
                <label
                  htmlFor="adresse"
                  className="text-md font-medium text-gray-900"
                >
                  Adresse Siège B.P (Ets secondaires B.P)
                </label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={ets_b}
                  onClick={() => {
                    setetsb(!ets_b);
                  }}
                  className={`ml-2 relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    ets_b ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      ets_b ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Codepostal"
                  value={formData?.codepostal_bailleur}
                  id="codepostal_bailleur"
                  {...register("codepostal_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.codepostal_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.codepostal_bailleur.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Commune"
                  value={formData?.commune_bailleur}
                  id="commune_bailleur"
                  {...register("commune_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.commune_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.commune_bailleur.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Rue"
                  value={formData?.rue_bailleur}
                  id="rue_bailleur"
                  {...register("rue_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.rue_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.rue_bailleur.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-1">
                <input
                  type="number"
                  placeholder="Nr."
                  value={formData?.numero_bailleur}
                  id="numero_bailleur"
                  {...register("numero_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.numero_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.numero_bailleur.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Boite"
                  value={formData?.boite_bailleur}
                  id="boite_bailleur"
                  {...register("boite_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.boite_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.boite_bailleur.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="tel_bailleur"
                  className="block text-sm font-medium text-gray-900"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData?.tel_bailleur}
                  id="tel_bailleur"
                  {...register("tel_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.tel_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.tel_bailleur.message}
                  </p>
                )}
              </div>
              {ets_b ? (
               <>
                 <div className="sm:col-span-6 mt-6">
                <label
                  htmlFor="ets"
                  className="block text-md font-medium text-gray-900"
                >
                  Ets secondaires B.P
                </label>
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Codepostal"
                  value={formData?.ets_codepostal_bailleur}
                  id="ets_codepostal_bailleur"
                  {...register("ets_codepostal_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.ets_codepostal_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.ets_codepostal_bailleur.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Commune"
                  value={formData?.ets_commune_bailleur}
                  id="ets_commune_bailleur"
                  {...register("ets_commune_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.ets_commune_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.ets_commune_bailleur.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Rue"
                  value={formData?.ets_rue_bailleur}
                  id="ets_rue_bailleur"
                  {...register("ets_rue_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.ets_rue_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.ets_rue_bailleur.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-1">
                <input
                  type="number"
                  placeholder="Nr."
                  value={formData?.ets_numero_bailleur}
                  id="ets_numero_bailleur"
                  {...register("ets_numero_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.ets_numero_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.ets_numero_bailleur.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-1">
                <input
                  type="text"
                  placeholder="Boite"
                  value={formData?.ets_boite_bailleur}
                  id="ets_boite_bailleur"
                  {...register("ets_boite_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.ets_boite_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.ets_boite_bailleur.message}
                  </p>
                )}
              </div>
               </>
              ) : (
                <></>
              )}

             {/*  <div className="sm:col-span-6">
                <label
                  htmlFor="etsTel_bailleur"
                  className="block text-sm font-medium text-gray-900"
                >
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="etsTel_bailleur"
                  value={formData?.etsTel_bailleur}
                  {...register("etsTel_bailleur")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.ets_boite_bailleur && (
                  <p className="text-red-500 text-sm">
                    {errors.ets_boite_bailleur.message}
                  </p>
                )}
              </div> */}
            </div>
          </div>
          {/* Titre 2 Liquidation */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">
              2. Liquidation
            </h2>
            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900"
                >
                  Description de l'objet imposable
                </label>
                <textarea
                  id="description"
                  value={formData?.description}
                  {...register("description")}
                  onChange={handleInputChange}
                  rows={5}
                  className={textareaClass}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Montant des loyers
                </label>
                <input
                  type="number"
                  value={formData?.loyers}
                  {...register("loyers")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.loyers && (
                  <p className="text-red-500 text-sm">
                    {errors.loyers.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Montant de l'IRL (22%)
                </label>
                <input
                  type="text"
                  value={formData?.irl}
                  disabled
                  {...register("irl")}
                  className={inputClass}
                />

                {errors.irl && (
                  <p className="text-red-500 text-sm">{errors.irl.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Date de la déclaration / paiement
                </label>
                <input
                  type="date"
                  value={formData?.declaration_date}
                  {...register("declaration_date")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.declaration_date && (
                  <p className="text-red-500 text-sm">
                    {errors.declaration_date.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Échéance de paiement
                </label>
                <input
                  type="date"
                  value={formData?.echeance}
                  {...register("echeance")}
                  onChange={handleInputChange}
                  className={inputClass}
                />
                {errors.echeance && (
                  <p className="text-red-500 text-sm">
                    {errors.echeance.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Titre 3 Paiement */}
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-lg font-semibold text-gray-900">3. Paiement</h2>
            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="versement"
                  className="block text-sm font-medium text-gray-900"
                >
                  Montant du versement
                </label>
                <div
                  className={classNames(
                    formData?.versement
                      ? " border-green-500 bg-green-100"
                      : " border-gray-500 bg-gray-100",
                    "p-4 rounded-lg border"
                  )}
                >
                  <span className={inputHighClass}>{formData?.versement}</span>
                  <input
                  type="hidden"
                  {...register("versement")}
                  className={inputClass}
                />
                </div>
              </div>

              {/* Checkbox Options */}
              { formData?.versement ? <div className="space-y-4">
                <PaymentCards openModal={openModal} setOpenModal={setOpenModal} payments={payments} declaration={getValues()} errors reset={reset} amount={amount} />
                {/*  <div className="flex items-center gap-3">
                  <input
                    id="espece"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="espece"
                    className="text-sm font-medium text-gray-900"
                  >
                    Espèce
                  </label>
                  <input type="text" className={inputClass + " ml-4 flex-1"} />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="cheque"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label
                    htmlFor="cheque"
                    className="text-sm font-medium text-gray-900"
                  >
                    Chèque
                  </label>
                  <input type="text" className={inputClass + " ml-4 flex-1"} />
                </div> */}
              </div> : <></>}
            </div>
          </div>
        </div>

        {/* Buttons */}
       {/*  <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold text-gray-900">
            Annuler
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sauvegarder
          </button>
        </div>  */}
      </form>
    </div>
  );
};
