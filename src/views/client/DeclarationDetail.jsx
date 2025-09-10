import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Swal from "sweetalert2";
import moment from "moment";

export default function DeclarationDetail({ detail, open, closeModal }) {
  const [formData, setformData] = useState({});

  useEffect(() => {
    setformData(detail);
  }, [detail]);

  async function updateStatus(id, newStatus) {
    const { data, error } = await supabase
      .from("declarations")
      .update({ isapproved: newStatus }) // fields you want to update
      .eq("id", id); // condition

      if(newStatus == 1){
        Swal.fire({
          icon: "success",
          title: `Vous avez approuvé la déclaration de l’IRL du client  ${formData?.nomSociete}, en date du ${moment(formData?.created_at).format("DD/MM/YYYY")}`,
          timer: 2000,
          showConfirmButton: false,
        });
      }else{
        Swal.fire({
          icon: "error",
          title: `Vous avez refusées la déclaration de l’IRL du client  ${formData?.nomSociete}, en date du ${moment(formData?.created_at).format("DD/MM/YYYY")}`,
          timer: 2000,
          showConfirmButton: false,
        });
      }

    if (error) {
      console.error("Error updating:", error);
    } else {
      console.log("Updated row(s):", data);

      closeModal(false);
    }
  }
  return (
    <Dialog open={open} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-6xl bg-white p-20 rounded border shadow-xl overflow-y-auto max-h-[90vh]">
          <div className="px-4 sm:px-0 mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Déclaration de l'impôt sur le revenu locatif
            </h3>
          </div>
          <div className="rounded border">
            <div className=" border-gray-100">
              <dl className="divide-y divide-gray-100">
                {/* 1a. Locataire */}
                <h4 className="px-4 py-2 font-semibold text-gray-800">
                  1a. Identification Locataire
                </h4>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className=" px-6 text-sm font-medium text-gray-900">
                    Date de début
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.startDate || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Date de fin
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.endDate || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Déclarant est une société
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.is_societe ? "Oui" : "Non"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Nom de la société
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.nomSociete || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Nom
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.prenom || "-"} {formData?.nom || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Nr. de la société
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.number_societe || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Adresse
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.rue} {formData?.numero} {formData?.boite},{" "}
                    {formData?.commune} {formData?.codepostal}
                  </dd>
                </div>

                {(formData?.ets_rue ||
                  formData?.ets_numero ||
                  formData?.ets_boite ||
                  formData?.ets_commune ||
                  formData?.ets_codepostal) && (
                  <>
                    <h5 className="px-4 py-2 font-semibold text-gray-700">
                      Ets secondaires
                    </h5>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="px-6 text-sm font-medium text-gray-900">
                        Adresse
                      </dt>
                      <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                        {formData?.ets_rue || ""} {formData?.ets_numero || ""}{" "}
                        {formData?.ets_boite || ""},{" "}
                        {formData?.ets_commune || ""}{" "}
                        {formData?.ets_codepostal || ""}
                      </dd>
                    </div>
                  </>
                )}

                {/* 1b. Bailleur */}
                <h4 className="px-4 py-2 font-semibold text-gray-800 mt-4">
                  1b. Identification Bailleur
                </h4>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Nom de la société / Bailleur
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.nom_bailleur || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Nr. de la société
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.number_societe_bailleur || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Adresse
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.rue_bailleur} {formData?.numero_bailleur}{" "}
                    {formData?.boite_bailleur}, {formData?.commune_bailleur}{" "}
                    {formData?.codepostal_bailleur}
                  </dd>
                </div>
                {/* Bailleur secondary addresses */}

                {(formData?.ets_rue_bailleur ||
                  formData?.ets_numero_bailleur ||
                  formData?.ets_boite_bailleur ||
                  formData?.ets_commune_bailleur ||
                  formData?.ets_codepostal_bailleur) && (
                  <>
                    <h5 className="px-4 py-2 font-semibold text-gray-700 mt-4">
                      Bailleur Ets secondaires
                    </h5>
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="px-6 text-sm font-medium text-gray-900">
                        Adresse
                      </dt>
                      <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                        {formData?.ets_rue_bailleur || ""}{" "}
                        {formData?.ets_numero_bailleur || ""}{" "}
                        {formData?.ets_boite_bailleur || ""},{" "}
                        {formData?.ets_commune_bailleur || ""}{" "}
                        {formData?.ets_codepostal_bailleur || ""}
                      </dd>
                    </div>
                  </>
                )}

                {/* 2. Liquidation */}
                <h4 className="px-4 py-2 font-semibold text-gray-800 mt-6">
                  2. Liquidation
                </h4>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Description de l'objet imposable
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.description || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Montant des loyers
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.loyers || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Montant IRL (22%)
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.irl || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Date déclaration / paiement
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.declaration_date || "-"}
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Échéance de paiement
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.echeance || "-"}
                  </dd>
                </div>

                {/* 3. Paiement */}
                <h4 className="px-4 py-2 font-semibold text-gray-800 mt-6">
                  3. Paiement
                </h4>

                <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="px-6 text-sm font-medium text-gray-900">
                    Montant du versement
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {formData?.versement || "-"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

         
            <div className="flex w-full justify-between">
            {formData?.isapproved == 0 && ( <div className="flex justify-start gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-500 text-blue-100 rounded"
                  onClick={() => updateStatus(formData?.id, 1)}
                >
                  Approuver
                </button>
              </div>)}
              <div className="flex justify-end gap-3 mt-6">
              {formData?.isapproved == 0 && ( <button
                  type="button"
                  className="px-4 py-2 bg-red-100 text-red-700 rounded"
                  onClick={() => updateStatus(formData?.id, 2)}
                >
                  Refusées
                </button>)}
                <button
                  type="button"
                  className="px-4 py-2 rounded border"
                  onClick={() => closeModal(false)}
                >
                  Quiter
                </button>
              </div>
            </div>
        
        </DialogPanel>
      </div>
    </Dialog>
  );
}
