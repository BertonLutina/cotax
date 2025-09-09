import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// ✅ Validation schema
const schema = yup.object().shape({
  companynumber: yup
    .string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Adresse e-mail invalide") // ✅ email regex
    .required("Adresse e-mail requise"),
  password: yup
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Mot de passe requis"),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("password"), null],
      "Les mots de passe ne correspondent pas"
    )
    .required("Confirmation requise"),
});

export default function Registration({
  setIsAuthenticated,
  setClient,
  setIsRegistration,
  setshowLoader
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [isGov, setIsGov] = useState(true);

  const onSubmit = async (data) => {
    setErrorMsg("");
    setshowLoader(true);

    const email = data.companynumber; // pseudo-email

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password: data.password,
      options: {
        data: { clientType: 2, companynumber: data.companynumber },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Registration successful, auto-login optional
    setIsAuthenticated(true);
    if (isGov) {
      setClient(1);
    } else {
      setClient(2);
    }
    setshowLoader(false)
    Swal.fire({
      icon: "success",
      title: "Connexion réussie 🎉",
      text: "Bienvenue dans votre espace !",
      timer: 2000,
      showConfirmButton: false,
    });
    navigate("/"); // redirect
  };

  return (
    <div className="flex min-h-full w-full h-screen bg-neutral-100 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          alt="Your Company"
          src={require("../../assets/logo/cotaxlogo.png")}
          className="mx-auto h-20 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Créez votre compte
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[540px] shadow-md">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="isSociete"
                className="block text-sm font-medium text-gray-900 mb-2"
              >
                {isGov ? "Gouvernement" : "Societé"}
              </label>

              <button
                type="button"
                role="switch"
                aria-checked={isGov}
                onClick={() => {
                  setIsGov(!isGov);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  isGov ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    isGov ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

            <div>
              <label
                htmlFor="companynumber"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Numéro de société
              </label>
              <input
                id="companynumber"
                type="text"
                {...register("companynumber")}
                className="mt-2 block w-full h-14 text-lg rounded-md border border-gray-300 text-gray-900 px-4 py-3  focus:outline-indigo-600 sm:px-3 sm:py-1.5 "
              />
              {errors.companynumber && (
                <p className="text-red-500 text-sm">
                  {errors.companynumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="mt-2 block w-full h-14 text-lg rounded-md border border-gray-300 text-gray-900 px-4 py-3  focus:outline-indigo-600 sm:px-3 sm:py-1.5 "
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="mt-2 block w-full h-14 text-lg rounded-md border border-gray-300 text-gray-900 px-4 py-3  focus:outline-indigo-600 sm:px-3 sm:py-1.5 "
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-400 px-5 py-3 text-xl font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                S'inscrire
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsRegistration(false)}
                className="text-blue-900 hover:text-indigo-500 font-medium"
              >
                Déjà un compte ? Connectez-vous
              </button>
            </div>
            <div>
              <img
                alt="RDCongo"
                src={require("../../assets/flag.png")}
                className="mx-auto h-5 w-auto rounded-md shadow"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
