import './App.css'

"use client"

import { useState, useMemo } from "react"
import { Plus, Save } from "lucide-react"

interface IncomeItem {
  id: number
  concept: string
  amount: number
  paymentMethod: "Efectivo" | "Yape" | "Deuda"
  isMovement: boolean
}

interface ExpenseItem {
  id: number
  detail: string
  amount: number
  paymentMethod: "Efectivo" | "Yape" | "Deuda"
  isMovement: boolean
}

interface DeudaItem {
  id: number
  clientName: string
  pendingAmount: number
  paymentMethod: "Efectivo" | "Yape" | "Deuda"
  isMovement: boolean
}

const PAYMENT_METHODS = ["Efectivo", "Yape", "Deuda"] as const

export default function DailyEfectivoRegister() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [initialEfectivo, setInitialEfectivo] = useState({
    Efectivo: 0,
    Yape: 0,
    Deuda: 0,
  })
  const [income, setIncome] = useState<IncomeItem[]>([
    { id: 1, concept: "", amount: 0, paymentMethod: "Efectivo", isMovement: false },
  ])
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: 1, detail: "", amount: 0, paymentMethod: "Efectivo", isMovement: false },
  ])
  const [Deudas, setDeudas] = useState<DeudaItem[]>([
    { id: 1, clientName: "", pendingAmount: 0, paymentMethod: "Efectivo", isMovement: false },
  ])

  // Calculate totals by payment method and movements
  const calculations = useMemo(() => {
    // Income by payment method (excluding movements)
    const incomeByMethod = {
      Efectivo: income
        .filter((item) => item.paymentMethod === "Efectivo" && !item.isMovement)
        .reduce((sum, item) => sum + (item.amount || 0), 0),
      Yape: income
        .filter((item) => item.paymentMethod === "Yape" && !item.isMovement)
        .reduce((sum, item) => sum + (item.amount || 0), 0),
      Deuda: income
        .filter((item) => item.paymentMethod === "Deuda" && !item.isMovement)
        .reduce((sum, item) => sum + (item.amount || 0), 0),
    }

    // Expenses by payment method (excluding movements)
    const expensesByMethod = {
      Efectivo: expenses
        .filter((item) => item.paymentMethod === "Efectivo" && !item.isMovement)
        .reduce((sum, item) => sum + (item.amount || 0), 0),
      Yape: expenses
        .filter((item) => item.paymentMethod === "Yape" && !item.isMovement)
        .reduce((sum, item) => sum + (item.amount || 0), 0),
      Deuda: expenses
        .filter((item) => item.paymentMethod === "Deuda" && !item.isMovement)
        .reduce((sum, item) => sum + (item.amount || 0), 0),
    }

    // Movements calculation
    const movements = [
      ...income.filter((item) => item.isMovement),
      ...expenses.filter((item) => item.isMovement),
      ...Deudas.filter((item) => item.isMovement),
    ].reduce((sum, item) => {
      if ("amount" in item) return sum + (item.amount || 0)
      if ("pendingAmount" in item) return sum + (item.pendingAmount || 0)
      return sum
    }, 0)

    // Total Deudas (from Deudas table, excluding movements)
    const totalDeudas = Deudas
      .filter((item) => !item.isMovement)
      .reduce((sum, item) => sum + (item.pendingAmount || 0), 0)

    // Total income and expenses
    const totalIncome = incomeByMethod.Efectivo + incomeByMethod.Yape + incomeByMethod.Deuda
    const totalExpenses = expensesByMethod.Efectivo + expensesByMethod.Yape + expensesByMethod.Deuda

    // Final balance by payment method
    const finalBalanceByMethod = {
      Efectivo: initialEfectivo.Efectivo + incomeByMethod.Efectivo - expensesByMethod.Efectivo,
      Yape: initialEfectivo.Yape + incomeByMethod.Yape - expensesByMethod.Yape,
      Deuda: initialEfectivo.Deuda + incomeByMethod.Deuda - expensesByMethod.Deuda,
    }

    // Total starting money
    const totalStartingMoney = initialEfectivo.Efectivo + initialEfectivo.Yape + initialEfectivo.Deuda

    const totalFinalBalance = finalBalanceByMethod.Efectivo + finalBalanceByMethod.Yape + finalBalanceByMethod.Deuda

    return {
      incomeByMethod,
      expensesByMethod,
      movements,
      totalDeudas,
      totalIncome,
      totalExpenses,
      finalBalanceByMethod,
      totalFinalBalance,
      totalStartingMoney,
    }
  }, [income, expenses, Deudas, initialEfectivo])

  // Income handlers
  const addIncomeRow = () => {
    const newId = Math.max(...income.map((item) => item.id), 0) + 1
    setIncome([...income, { id: newId, concept: "", amount: 0, paymentMethod: "Efectivo", isMovement: false }])
  }

  const updateIncome = (id: number, field: keyof IncomeItem, value: string | number | boolean) => {
    setIncome(income.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const removeIncomeRow = (id: number) => {
    if (income.length > 1) {
      setIncome(income.filter((item) => item.id !== id))
      setDeudas([
    { id: 1, clientName: "", pendingAmount: 0, paymentMethod: "Efectivo", isMovement: false },
  ])
    }
  }

  // Expense handlers
  const addExpenseRow = () => {
    const newId = Math.max(...expenses.map((item) => item.id), 0) + 1
    setExpenses([...expenses, { id: newId, detail: "", amount: 0, paymentMethod: "Efectivo", isMovement: false }])
  }

  const updateExpense = (id: number, field: keyof ExpenseItem, value: string | number | boolean) => {
    setExpenses(expenses.map((item) => (item.id === id ? { ...item, [field] :  value  } : item)))
  }

  const removeExpenseRow = (id: number) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter((item) => item.id !== id))
    }
  }

  // Deuda handlers
  // const addDeudaRow = () => {
  //   const newId = Math.max(...Deudas.map((item) => item.id), 0) + 1
  //   setDeudas([...Deudas, { id: newId, clientName: "", pendingAmount: 0, paymentMethod: "Efectivo", isMovement: false }])
  // }

  // const updateDeuda = (id: number, field: keyof DeudaItem, value: string | number | boolean) => {
  //   setDeudas(Deudas.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  // }

  // const removeDeudaRow = (id: number) => {
  //   if (Deudas.length > 1) {
  //     setDeudas(Deudas.filter((item) => item.id !== id))
  //   }
  // }

  const handleSaveDay = () => {
    alert("¡Día guardado con éxito! (Función por implementar)")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* General Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4 z-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Registro Diario de Dinero</h1>

          {/* Summary Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="">
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Método de Pago</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Dinero Inicial</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Ingresos</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Egresos</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Deudas</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Movimientos</th>
                  <th className="text-left py-2 px-3 font-semibold text-gray-700">Balance Final</th>
                </tr>
              </thead>
              <tbody>
                {/* Efectivo Row */}
                <tr className="">
                  <td className="py-2 px-3 font-medium text-sky-600">Efectivo</td>
                  <td className="py-2 px-3 text-gray-600">S/{initialEfectivo.Efectivo.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-600">S/{calculations.incomeByMethod.Efectivo.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-600">S/{calculations.expensesByMethod.Efectivo.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-500">-</td>
                  <td className="py-2 px-3 text-gray-600">{calculations.movements.toFixed(2) === '0.00' ? '-' : calculations.movements.toFixed(2) }</td>
                  <td
                    className={`py-2 px-3 font-semibold ${calculations.finalBalanceByMethod.Efectivo >= 0 ? "text-gray-600" : "text-red-600"}`}
                  >
                    S/{calculations.finalBalanceByMethod.Efectivo.toFixed(2)}
                  </td>
                </tr>

                {/* Yape Row */}
                <tr className="" >
                  <td className="py-2 px-3 font-medium text-purple-600">Yape</td>
                  <td className="py-2 px-3 text-gray-600">S/{initialEfectivo.Yape.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-600">S/{calculations.incomeByMethod.Yape.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-600">S/{calculations.expensesByMethod.Yape.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-500">-</td>
                  <td className="py-2 px-3 text-gray-500">-</td>
                  <td
                    className={`py-2 px-3 font-semibold ${calculations.finalBalanceByMethod.Yape >= 0 ? "text-gray-600" : "text-red-600"}`}
                  >
                    S/{calculations.finalBalanceByMethod.Yape.toFixed(2)}
                  </td>
                </tr>

                {/* Deuda Row */}
                <tr className="">
                  <td className="py-2 px-3 font-medium text-red-600">Deuda</td>
                  <td className="py-2 px-3 text-gray-600">{initialEfectivo.Deuda.toFixed(2) === '0.00' ? '-' : initialEfectivo.Deuda.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-600">{calculations.incomeByMethod.Deuda.toFixed(2) === '0.00' ? '-' : calculations.incomeByMethod.Deuda.toFixed(2)}</td>
                  <td className="py-2 px-3 text-gray-500">-</td>
                  <td className="py-2 px-3 text-gray-600">{calculations.totalDeudas.toFixed(2) === '0.00' ? '-' : calculations.totalDeudas.toFixed(2) }</td>
                  <td className="py-2 px-3 text-gray-500">-</td>
                  <td
                    className={`py-2 px-3 font-semibold ${calculations.finalBalanceByMethod.Deuda >= 0 ? "text-gray-600" : "text-red-600"}`}
                  >
                    S/{calculations.finalBalanceByMethod.Deuda.toFixed(2)}
                  </td>
                </tr>

                {/* Total Row */}
                <tr className="">
                  <td className="py-2 px-3 font-bold text-gray-800">TOTAL</td>
                  <td className="py-2 px-3 font-bold text-gray-600">S/{calculations.totalStartingMoney.toFixed(2)}</td>
                  <td className="py-2 px-3 font-bold text-gray-600">S/{calculations.totalIncome.toFixed(2)}</td>
                  <td className="py-2 px-3 font-bold text-gray-600">S/{calculations.totalExpenses.toFixed(2)}</td>
                  <td className="py-2 px-3 font-bold text-gray-600">S/{calculations.totalDeudas.toFixed(2)}</td>
                  <td className="py-2 px-3 font-bold text-gray-600">S/{calculations.movements.toFixed(2)}</td>
                  <td
                    className={`py-2 px-3 font-bold text-lg ${calculations.totalFinalBalance >= 0 ? "text-gray-600" : "text-red-600"}`}
                  >
                    S/{calculations.totalFinalBalance.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Date Selection and Initial Efectivo */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Efectivo Inicial</label>
              <input
                type="number"
                step="0.1"
                value={initialEfectivo.Efectivo === 0 ? '' : initialEfectivo.Efectivo}
                onChange={(e) => setInitialEfectivo((prev) => ({ ...prev, Efectivo: Number.parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Yape Inicial</label>
              <input
                type="number"
                step="0.1"
                value={initialEfectivo.Yape === 0 ? '' : initialEfectivo.Yape}
                onChange={(e) => setInitialEfectivo((prev) => ({ ...prev, Yape: Number.parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deuda Inicial</label>
              <input
                type="number"
                step="0.1"
                value={initialEfectivo.Deuda === 0 ? '' : initialEfectivo.Deuda }
                onChange={(e) => setInitialEfectivo((prev) => ({ ...prev, Deuda: Number.parseFloat(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Income Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Ingresos</h2>
            <button
              onClick={addIncomeRow}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              Ingreso
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead >
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Detalle</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Monto</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Método de Pago</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Movimiento</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {income.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.concept}
                        onChange={(e) => updateIncome(item.id, "concept", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Detalle del ingreso"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.5"
                        value={item.amount === 0 ? '' : item.amount}
                        onChange={(e) => updateIncome(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={item.paymentMethod}
                        onChange={(e) =>
                          updateIncome(item.id, "paymentMethod", e.target.value as "Efectivo" | "Yape" | "Deuda")
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.isMovement}
                        onChange={(e) => updateIncome(item.id, "isMovement", e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeIncomeRow(item.id)}
                        disabled={income.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Egresos</h2>
            <button
              onClick={addExpenseRow}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Plus size={16} />
            Egreso
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Detalle</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Monto</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Método de Pago</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Movimiento</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.detail}
                        onChange={(e) => updateExpense(item.id, "detail", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Detalle del Gasto"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.5"
                        value={item.amount === 0 ? '' : item.amount}
                        onChange={(e) => updateExpense(item.id, "amount", Number.parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={item.paymentMethod}
                        onChange={(e) =>
                          updateExpense(item.id, "paymentMethod", e.target.value as "Efectivo" | "Yape" | "Deuda")
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.isMovement}
                        onChange={(e) => updateExpense(item.id, "isMovement", e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeExpenseRow(item.id)}
                        disabled={expenses.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deudas Table */}
        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Deudas</h2>
            <button
              onClick={addDeudaRow}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
            >
              <Plus size={16} />
            Deuda
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Cliente</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Monto pagado</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Método de Pago</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Movimiento</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Acción</th>
                </tr>
              </thead>
              <tbody>
                {Deudas.map((item) => (
                  <tr key={item.id} className="border-b border-gray-300">
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={item.clientName}
                        onChange={(e) => updateDeuda(item.id, "clientName", e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Cliente"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step="0.1"
                        value={item.pendingAmount}
                        onChange={(e) => updateDeuda(item.id, "pendingAmount", Number.parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <select
                        value={item.paymentMethod}
                        onChange={(e) =>
                          updateDeuda(item.id, "paymentMethod", e.target.value as "Efectivo" | "Yape" | "Deuda")
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.isMovement}
                        onChange={(e) => updateDeuda(item.id, "isMovement", e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => removeDeudaRow(item.id)}
                        disabled={Deudas.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

        {/* Save Button */}
        <div className="text-center pb-8">
          <button
            onClick={handleSaveDay}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto text-lg font-semibold"
          >
            <Save size={20} />
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}
