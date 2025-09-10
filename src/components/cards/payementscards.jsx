import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Swal from "sweetalert2";
import { supabase } from "../../supabaseClient";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Yup validation schema
const paymentSchema = yup.object().shape({
  selectItemName: yup.string().nullable(),
  cardHolder: yup.string().when("selectItemName", {
    is: (val) => ["Visa", "Mastercard"].includes(val),
    then: () => yup.string().required("Nom du titulaire est requis"),
    otherwise: () => yup.string().nullable(),
  }),
  cardNumber: yup.string().when("selectItemName", {
    is: (val) => ["Visa", "Mastercard"].includes(val),
    then: () =>
      yup
        .string()
        .matches(/^\d{16}$/, "Numéro de carte invalide")
        .required("Numéro de carte est requis"),
    otherwise: () => yup.string().nullable().notRequired(),
  }),
  expiry: yup.string().when("selectItemName", {
    is: (val) => ["Visa", "Mastercard"].includes(val),
    then: () =>
      yup
        .string()
        .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format MM/AA")
        .required("Date d'expiration est requise"),
    otherwise: () => yup.string().nullable().notRequired(),
  }),
  cvv: yup.string().when("selectItemName", {
    is: (val) => ["Visa", "Mastercard"].includes(val),
    then: () =>
      yup
        .string()
        .matches(/^\d{3,4}$/, "CVV invalide")
        .required("CVV est requis"),
    otherwise: () => yup.string().nullable().notRequired(),
  }),
  chequeNumber: yup.string().when("selectItemName", {
    is: (val) => ["Cheque", "Orange Money", "M-Pesa"].includes(val),
    then: () =>
      yup.string().required("Numéro du chèque ou paiement est requis"),
    otherwise: () => yup.string().nullable().notRequired(),
  }),
});

function PaymentCards({
  payments = [],
  declaration,
  amount,
  reset,
  openModal,
  setOpenModal,
}) {
  const [selectItem, setSelectItem] = useState(null);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(paymentSchema),
    defaultValues: {
      cardHolder: "",
      cardNumber: "",
      cvv: "",
      expiry: "",
      selectItemName: selectItem?.name || "",
    },
  });

  useEffect(() => {
    setValue("selectItemName", selectItem?.name || "");
  }, [selectItem,setValue]);

  const closeModal = () => {
    setOpenModal(false);
    setSelectItem(null);
    resetForm();
    reset();
  };

  const onSubmit = async (formValues) => {
    try {
      console.log(declaration)
      // 1️⃣ Get declaration count
      const { count } = await supabase
        .from("declarations")
        .select("*", { count: "exact" });

        delete declaration?.nom_societe;
      // 2️⃣ Insert declaration
      const { data: insertedDeclaration, error: declError } = await supabase
        .from("declarations")
        .insert([declaration])
        .select();

      if (declError) {
        Swal.fire({
          icon: "error",
          title: "Erreur déclaration",
          text: declError.message,
        });
        return;
      }

      const declarationId = insertedDeclaration[0]?.id;

      // 3️⃣ Insert transaction
      const transaction = {
        user_id: declaration?.user_id,
        invoice_number: `COTAX${count}`,
        href: `dashboard/detail/COTAX${count}`,
        amount: amount?.amount,
        currency: "USD",
        status: ["M-Pesa", "Orange Money", "Visa", "Mastercard"].includes(
          selectItem?.name
        ) ? "Payée"  : "Non Payée",
        client: declaration?.nomSociete,
        description: declaration?.description,
        created_at: new Date().toISOString(),
        declaration_id: declarationId,
        number_societe: declaration?.number_societe,
        currency_cdf: amount?.currency_cdf,
        amount_dollars: amount?.amount_dollars,
        amount_cdf: amount?.amount_cdf,
        type_payment: selectItem?.name ,
        cardNumber: formValues.cardNumber,
        cardHolder: formValues.cardHolder,
        expiry: formValues.expiry,
        cvv: formValues.cvv,
      };

      const { error: transError } = await supabase
        .from("transactions")
        .insert([transaction]);

      if (transError) {
        Swal.fire({
          icon: "error",
          title: "Erreur transaction",
          text: transError.message,
        });
      } else {
        Swal.fire({ icon: "success", title: "Paiement enregistré ✅" });
        closeModal();
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Erreur inattendue",
        text: err.message,
      });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Méthodes de paiement
      </h2>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {payments.map((payment) => (
          <button
            key={payment.name}
            type="submit"
            onClick={() => setSelectItem(payment)}
            className="flex-shrink-0 w-36 bg-white rounded-xl p-4 shadow-md flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 transition"
          >
            <div className="mb-2">{payment.icon}</div>
            <span className="text-center font-medium text-gray-800">
              {payment.name}
            </span>
          </button>
        ))}
      </div>

      {/* Modal */}
      {/* Modal */}
      <Dialog
        open={openModal && !!selectItem}
        onClose={closeModal}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex flex-col mb-4 items-center">
              <div className="mb-2">{selectItem?.icon}</div>
              <h3 className="text-sm font-semibold mb-4">{selectItem?.name}</h3>
            </div>

            {(selectItem?.name === "Visa" ||
              selectItem?.name === "Mastercard") && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <input
                  type="text"
                  placeholder="Nom du titulaire"
                  {...register("cardHolder")}
                  className="w-full border rounded px-4 py-2"
                />
                {errors.cardHolder && (
                  <p className="text-red-500 text-sm">
                    {errors.cardHolder.message}
                  </p>
                )}

                <input
                  type="text"
                  placeholder="Numéro de carte"
                  {...register("cardNumber")}
                  className="w-full border rounded px-4 py-2"
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.cardNumber.message}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    {...register("expiry")}
                    className="w-full border rounded px-4 py-2"
                  />
                  {errors.expiry && (
                    <p className="text-red-500 text-sm">
                      {errors.expiry.message}
                    </p>
                  )}

                  <input
                    type="text"
                    placeholder="CVV"
                    {...register("cvv")}
                    className="w-full border rounded px-4 py-2"
                  />
                  {errors.cvv && (
                    <p className="text-red-500 text-sm">{errors.cvv.message}</p>
                  )}
                </div>

                <div className="flex">
                  <input
                    type="text"
                    placeholder="Montant USD Dollars $"
                    disabled
                    value={amount?.amount_dollars}
                    className="w-full border rounded-r px-4 py-2"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Valider le paiement
                </button>
              </form>
            )}

            {["M-Pesa", "Orange Money", "Cheque", "Espèce"].includes(
              selectItem?.name
            ) && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {selectItem?.name !== "Espèce" && (
                  <input
                    type="text"
                    {...register("chequeNumber")}
                    placeholder={`Numéro ${selectItem?.name}`}
                    className="w-full border rounded px-4 py-2"
                  />
                )}
                {errors.chequeNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.chequeNumber.message}
                  </p>
                )}
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Montant USD Dollars $"
                    value={amount?.amount_dollars}
                    disabled
                    className="w-full border rounded-r px-4 py-2"
                  />
                </div>

                {(selectItem?.name === "Cheque" ||
                  selectItem?.name === "Espèce") && (
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Montant Franc Congolais"
                      value={amount?.amount_cdf}
                      disabled
                      className="w-full border rounded px-4 py-2"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Valider
                </button>
              </form>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded border">
                Annuler
              </button>
            </div>
            <input
              type="hidden"
              placeholder="Numéro de carte"
              {...register("selectItemName")}
              className="w-full border rounded px-4 py-2"
            />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}

export default PaymentCards;
