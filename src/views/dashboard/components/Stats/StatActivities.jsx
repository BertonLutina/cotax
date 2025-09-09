import React, { Fragment, useEffect, useState } from 'react'
import { days, statuses } from '../../../../utilities/fakedata'
import { classNames, groupTransactionsByDay } from '../../../../utilities/cssfunction'
import { supabase } from '../../../../supabaseClient'

const StatActivities = () => {
  const [jours, setJours] = useState([])

  const fetchTransactions = async () => {
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
        .from("transactions")
        .select(`*`)
        .order("created_at", { ascending: false });
        const dayz = groupTransactionsByDay(data);
        console.log('trans ==> ', dayz)

        setJours(dayz);
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
    fetchTransactions();
  }, [fetchTransactions]);


  return (
    <div className='my-16 border rounded-lg'>
    <div className="mx-auto max-w-7xl mt-6 px-4 sm:px-6 lg:px-8">
      <h2 className="mx-auto max-w-2xl text-base font-semibold text-gray-900 lg:mx-0 lg:max-w-none">
        Les Transactions
      </h2>
    </div>
    <div className="mt-6 overflow-hidden border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <table className="w-full text-left">
            <thead className="sr-only">
              <tr>
                <th>Amount</th>
                <th className="hidden sm:table-cell">Client</th>
                <th>More details</th>
              </tr>
            </thead>
            <tbody>
              {jours?.length > 0 && jours?.map((day) => (
                <Fragment key={day.dateTime}>
                  <tr className="text-sm/6 text-gray-900">
                    <th scope="colgroup" colSpan={3} className="relative isolate py-2 font-semibold">
                      <time dateTime={day.dateTime}>{day.date}</time>
                      <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                      <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                    </th>
                  </tr>
                  {day.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="relative py-5 pr-6">
                        <div className="flex gap-x-6">
                          <transaction.icon
                            aria-hidden="true"
                            className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                          />
                          <div className="flex-auto">
                            <div className="flex items-start gap-x-3">
                              <div className="text-sm/6 font-medium text-gray-900">{transaction.amount}</div>
                              <div
                                className={classNames(
                                  statuses[transaction.status],
                                  'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                )}
                              >
                                {transaction.status}
                              </div>
                            </div>
                            {transaction.tax ? (
                              <div className="mt-1 text-xs/5 text-gray-500">{transaction.tax} tax</div>
                            ) : null}
                          </div>
                        </div>
                        <div className="absolute right-full bottom-0 h-px w-screen bg-gray-100" />
                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                      </td>
                      <td className="hidden py-5 pr-6 sm:table-cell">
                        <div className="text-sm/6 text-gray-900">{transaction.client}</div>
                        <div className="mt-1 text-xs/5 text-gray-500">{transaction.description}</div>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex justify-end">
                          <a
                            href={transaction.href}
                            className="text-sm/6 font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View<span className="hidden sm:inline"> transaction</span>
                            <span className="sr-only">
                              , invoice #{transaction.invoiceNumber}, {transaction.client}
                            </span>
                          </a>
                        </div>
                        <div className="mt-1 text-xs/5 text-gray-500">
                          Invoice <span className="text-gray-900">#{transaction.invoiceNumber}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  )
}

export default StatActivities