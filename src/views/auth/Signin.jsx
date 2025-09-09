import { useContext, useLayoutEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setUser, updateUserField } from "../../redux/userSlice";
import { AuthContext } from "../../context/AuthContext";
import { setStorage } from "../../utilities/cssfunction";

export default function Signin({}) {
  const [companynumber, setCompanynumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isGov, setIsGov] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { login } = useContext(AuthContext); // Get the login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    // Transform companynumber to pseudo-email for Supabase
    const email = companynumber;

    const {
      data: { user, session },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(error);
      return;
    }

    // ✅ Fetch profile data
    const { data: profileData, error: errorProfile } = await supabase
      .from("profile") // or "profile" depending on which table
      .select("*")
      .eq("user_id", user.id)
      .limit(1)
      .order("created_at", { ascending: false })
      .single();

    if (errorProfile) {
      console.error(errorProfile);
      return;
    }

    console.log("profileData ==>", profileData);

    login(session.access_token);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // Determine client type from user metadata
    const clientType = user?.user_metadata;

    if (isGov) {
      setStorage("client", 1);
    } else {
      setStorage("client", 2);
    }

    if (user) {
      if (profileData) {
        dispatch(setUser(profileData));
      } else {
        const userPorfiler = {
          "nomSociete":clientType?.companynumber,
          "is_societe": isGov
        }
        dispatch(setUser(userPorfiler));
      }
    }
    
    Swal.fire({
      icon: "success",
      title: "Connexion réussie",
      text: `Bienvenue dans votre espace ${clientType?.companynumber}!`,
      timer: 2000,
      showConfirmButton: false,
    });
    const route = isGov ? "/" : "/declaration";
    
    navigate(route); // redirect after login
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
          Connectez-vous à votre compte
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[540px] shadow-md">
        <div className="bg-white px-6 py-12 shadow-sm sm:rounded-lg sm:px-12">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                type="email"
                required
                value={companynumber}
                onChange={(e) => setCompanynumber(e.target.value)}
                className="mt-2 block w-full h-14 text-lg rounded-md border border-gray-300 text-gray-900 px-4 py-3  focus:outline-indigo-600 sm:px-3 sm:py-1.5 "
              />
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
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 block w-full h-14 text-lg rounded-md border border-gray-300 text-gray-900 px-4 py-3  focus:outline-indigo-600 sm:px-3 sm:py-1.5 "
              />
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-400 px-5 py-3 text-xl font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Connectez-vous
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="text-blue-900  hover:text-indigo-500 font-medium"
              >
                Pas encore de compte ? Inscrivez-vous
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
