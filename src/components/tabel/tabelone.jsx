import moment from "moment";
import { status_approv } from "../../utilities/fakedata";
import { useEffect, useState } from "react";
import { classNames } from "../../utilities/cssfunction";
import DeclarationDetail from "../../views/client/DeclarationDetail";

export default function TabelOne({
  declarations,
  title = "Les déclarations ayant été approuvées par le DGRK et la Banque",
}) {
  const [openModal, setopenModal] = useState(false);
  const [detail, setdetail] = useState({});

  useEffect(() => {
    if (Object.keys(detail).length > 0) setopenModal(true);
  }, [detail]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-11/12 bg-white border rounded shadow-sm ">
      <div className="sm:flex sm:items-center mt-8">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">L'IRL</h1>
          <p className="mt-2 text-sm text-gray-700">{title}</p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="relative min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Nom
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Titre
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status du Payment
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status Approvement
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  ></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {declarations.map((person) => (
                  <tr key={person.id}>
                    <td className="py-5 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-0">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {person?.nomSociete}
                          </div>
                          <div className="mt-1 text-gray-500">
                            {person?.prenom} {person?.nom}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                      <div className="text-gray-900">{`Declaration de l'IRL ${moment(
                        person?.created_at
                      ).format("DD/MM/YYYY")}`}</div>
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                      <span
                        className={`inline-flex items-center rounded-md ${
                          person?.transactions[0].status === "Payée"
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                        } px-2 py-1 text-xs font-medium  ring-1  ring-inset`}
                      >
                        {person?.transactions[0].status}
                      </span>
                      <div className="mt-1 text-gray-500">
                        {person?.transactions[0].type_payment}
                      </div>
                    </td>
                    <td className="px-3 py-5 text-sm whitespace-nowrap text-gray-500">
                      {status_approv[person?.isapproved]}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={classNames(
                          "bg-blue-600 text-white",
                          "rounded-md p-2 py-1 text-sm font-medium ring-1 ring-inset"
                        )}
                        onClick={() => setdetail(person)}
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <DeclarationDetail
        open={openModal}
        closeModal={setopenModal}
        detail={detail}
      />
    </div>
  );
}
