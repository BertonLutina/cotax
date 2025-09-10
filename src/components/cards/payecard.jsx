import { Dialog, DialogPanel } from "@headlessui/react";
import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import moment from "moment";
import { useEffect, useState } from "react";

export default function PayeCard({detail, open, closeModal}) {
  const [formData, setformData] = useState({});
  useEffect(() => {
    setformData(detail);
  }, [detail]);

  return (
    <Dialog open={open} onClose={closeModal} className="relative z-50">
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm bg-white py-4 rounded border shadow-xl overflow-y-auto max-h-[90vh]">
          <div className="lg:col-start-3 lg:row-end-1">
            <h2 className="sr-only">Summary</h2>
            <div className="rounded-lg bg-white shadow-xs outline-1 outline-gray-900/5">
              <dl className="flex flex-wrap">
                {/* Amount */}
                <div className="flex-auto pt-6 pl-6">
                  <dt className="text-sm/6 font-semibold text-gray-900">
                    Amount
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-gray-900">
                    {formData?.amount_dollars}
                  </dd>
                </div>

                {/* Status */}
                <div className="flex-none self-end px-6 pt-4">
                  <dt className="sr-only">Status</dt>
                  <dd
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      formData?.status === "Paid"
                        ? "bg-green-50 text-green-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {formData?.status}
                  </dd>
                </div>

                {/* Client */}
                <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
                  <dt className="flex-none">
                    <span className="sr-only">Client</span>
                    <UserCircleIcon
                      aria-hidden="true"
                      className="h-6 w-5 text-gray-400"
                    />
                  </dt>
                  <dd className="text-sm/6 font-medium text-gray-900">
                    {formData?.client}
                  </dd>
                </div>

                {/* Description / Due date */}
                {formData?.created_at && (
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">Description</span>
                      <CalendarDaysIcon
                        aria-hidden="true"
                        className="h-6 w-5 text-gray-400"
                      />
                    </dt>
                    <dd className="text-sm/6 text-gray-500">
                      {moment(formData?.created_at).format("DD/MM/YYYY")}
                    </dd>
                  </div>
                )}

                {/* Invoice / Payment method */}
                {formData?.invoiceNumber && (
                  <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
                    <dt className="flex-none">
                      <span className="sr-only">Invoice</span>
                      <CreditCardIcon
                        aria-hidden="true"
                        className="h-6 w-5 text-gray-400"
                      />
                    </dt>
                    <dd className="text-sm/6 text-gray-500">
                      Invoice #{formData?.invoiceNumber}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Download link */}
              {/*  <div className="mt-6 border-t border-gray-900/5 px-6 py-6">
          <a
            href={href}
            className="text-sm/6 font-semibold text-gray-900 hover:text-gray-700"
          >
            Download receipt <span aria-hidden="true">&rarr;</span>
          </a>
        </div> */}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 mr-4">
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={()=> closeModal(false)}
              >
                Quiter
              </button>
            </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
