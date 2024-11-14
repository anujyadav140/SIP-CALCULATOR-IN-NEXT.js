"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const formatIndianNumber = (num: number) => {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num);

  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  return formatted;
};

const COLORS = ["#2563eb", "#22c55e"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="text-sm">{`${payload[0].name}: ₹${formatIndianNumber(
          payload[0].value
        )}`}</p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Home() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [stepUpPercentage, setStepUpPercentage] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  // Input validation to ensure values are within acceptable ranges
  const handleMonthlyInvestmentChange = (value: number) => {
    if (value < 0) return;
    setMonthlyInvestment(value);
  };

  const handleStepUpPercentageChange = (value: number) => {
    if (value < 0 || value > 100) return;
    setStepUpPercentage(value);
  };

  const handleExpectedReturnChange = (value: number) => {
    if (value < 0 || value > 100) return;
    setExpectedReturn(value);
  };

  const handleTimePeriodChange = (value: number) => {
    if (value < 1 || value > 50) return;
    setTimePeriod(value);
  };

  const calculateStepUpSIP = useMemo(() => {
    const monthlyRate = expectedReturn / (12 * 100);
    let futureValue = 0;
    let totalInvestment = 0;
    let investmentPerYear = [];
    let currentInvestment = monthlyInvestment;

    for (let year = 1; year <= timePeriod; year++) {
      let yearInvestment = 0;
      for (let month = 0; month < 12; month++) {
        futureValue = (futureValue + currentInvestment) * (1 + monthlyRate);
        totalInvestment += currentInvestment;
        yearInvestment += currentInvestment;
      }
      investmentPerYear.push({
        year: year,
        monthlyInvestment: Math.round(currentInvestment),
        yearlyInvestment: Math.round(yearInvestment),
        futureValue: Math.round(futureValue),
      });
      // Increase the monthly investment at the start of each year
      currentInvestment += (currentInvestment * stepUpPercentage) / 100;
    }

    const estimatedReturns = futureValue - totalInvestment;

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      investmentPerYear,
    };
  }, [monthlyInvestment, stepUpPercentage, expectedReturn, timePeriod]);

  const chartData = useMemo(
    () => [
      { name: "Total Investment", value: calculateStepUpSIP.totalInvestment },
      { name: "Estimated Returns", value: calculateStepUpSIP.estimatedReturns },
    ],
    [calculateStepUpSIP.totalInvestment, calculateStepUpSIP.estimatedReturns]
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center">
            <Calculator className="w-10 h-10 text-primary mr-3" aria-hidden="true" />
            Step-Up SIP Calculator
          </h1>
          <p className="text-muted-foreground">
            Plan your financial future with our Step-Up Systematic Investment Plan
            calculator
          </p>
        </div>
        <div className="grid lg:grid-rows-2">
          {/* Main Grid: Inputs, Breakdown, Results */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Inputs Section */}
            <Card className="p-6 shadow-lg">
              <div className="space-y-6">
                {/* Monthly Investment */}
                <div className="space-y-2">
                  <Label htmlFor="monthly-investment">
                    Monthly Investment (₹)
                  </Label>
                  <div className="flex flex-col">
                    <Input
                      id="monthly-investment"
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) =>
                        handleMonthlyInvestmentChange(Number(e.target.value))
                      }
                      className="text-lg"
                      aria-label="Monthly Investment in Rupees"
                      min={0}
                      max={100000}
                    />
                    <Slider
                      value={[monthlyInvestment]}
                      onValueChange={([value]) => handleMonthlyInvestmentChange(value)}
                      max={100000}
                      step={500}
                      className="mt-3"
                      aria-label="Monthly Investment Slider"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatIndianNumber(monthlyInvestment)} per month
                  </p>
                </div>

                {/* Annual Step-Up */}
                <div className="space-y-2">
                  <Label htmlFor="step-up">Annual Step-Up (%)</Label>
                  <div className="flex flex-col">
                    <Input
                      id="step-up"
                      type="number"
                      value={stepUpPercentage}
                      onChange={(e) =>
                        handleStepUpPercentageChange(Number(e.target.value))
                      }
                      className="text-lg"
                      aria-label="Annual Step-Up Percentage"
                      min={0}
                      max={100}
                    />
                    <Slider
                      value={[stepUpPercentage]}
                      onValueChange={([value]) => handleStepUpPercentageChange(value)}
                      max={50}
                      step={1}
                      className="mt-3"
                      aria-label="Annual Step-Up Slider"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your investment will increase by {stepUpPercentage}% every
                    year
                  </p>
                </div>

                {/* Expected Return */}
                <div className="space-y-2">
                  <Label htmlFor="expected-return">
                    Expected Annual Return (%)
                  </Label>
                  <div className="flex flex-col">
                    <Input
                      id="expected-return"
                      type="number"
                      value={expectedReturn}
                      onChange={(e) =>
                        handleExpectedReturnChange(Number(e.target.value))
                      }
                      className="text-lg"
                      aria-label="Expected Annual Return Percentage"
                      min={0}
                      max={100}
                      step={0.1}
                    />
                    <Slider
                      value={[expectedReturn]}
                      onValueChange={([value]) => handleExpectedReturnChange(value)}
                      max={30}
                      step={0.5}
                      className="mt-3"
                      aria-label="Expected Annual Return Slider"
                    />
                  </div>
                </div>

                {/* Time Period */}
                <div className="space-y-2">
                  <Label htmlFor="time-period">Time Period (Years)</Label>
                  <div className="flex flex-col">
                    <Input
                      id="time-period"
                      type="number"
                      value={timePeriod}
                      onChange={(e) => handleTimePeriodChange(Number(e.target.value))}
                      className="text-lg"
                      aria-label="Time Period in Years"
                      min={1}
                      max={50}
                    />
                    <Slider
                      value={[timePeriod]}
                      onValueChange={([value]) => handleTimePeriodChange(value)}
                      max={50}
                      step={1}
                      className="mt-3"
                      aria-label="Time Period Slider"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Total Investment */}
              <Card className="p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Wallet className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <h3 className="font-semibold text-blue-600">
                    Total Investment
                  </h3>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{formatIndianNumber(calculateStepUpSIP.totalInvestment)}
                </p>
              </Card>

              {/* Estimated Returns */}
              <Card className="p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" aria-hidden="true" />
                  <h3 className="font-semibold text-green-600">
                    Estimated Returns
                  </h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ₹{formatIndianNumber(calculateStepUpSIP.estimatedReturns)}
                </p>
              </Card>

              {/* Future Value */}
              <Card className="p-4 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg">₹</h2>
                  <h3 className="font-semibold">Future Value</h3>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ₹{formatIndianNumber(calculateStepUpSIP.futureValue)}
                </p>
              </Card>

              {/* Investment Breakdown Chart */}
              <Card className="p-6 shadow-lg">
                <h3 className="font-semibold mb-4 text-center">
                  Investment Breakdown
                </h3>
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        key={`${calculateStepUpSIP.totalInvestment}-${calculateStepUpSIP.estimatedReturns}`}
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span className="text-sm">{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {/* Investment Breakdown Detailed Section */}
          <Card className="p-6 shadow-lg">
            <div className="max-w-full">
              {/* View Toggle Buttons */}
              <div className="flex justify-end mb-4 space-x-2">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-2 rounded ${
                    viewMode === "table"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  } transition-colors duration-200`}
                  aria-pressed={viewMode === "table"}
                  aria-label="Table View"
                >
                  Table View
                </button>
                <button
                  onClick={() => setViewMode("chart")}
                  className={`px-4 py-2 rounded ${
                    viewMode === "chart"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  } transition-colors duration-200`}
                  aria-pressed={viewMode === "chart"}
                  aria-label="Chart View"
                >
                  Chart View
                </button>
              </div>

              {/* Investment Breakdown */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg max-h-96 overflow-y-auto">
                <h3 className="font-semibold mb-4">
                  Yearly Investment Breakdown
                </h3>
                {viewMode === "table" ? (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="border-b py-2">Year</th>
                        <th className="border-b py-2">
                          Monthly Investment (₹)
                        </th>
                        <th className="border-b py-2">Yearly Investment (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculateStepUpSIP.investmentPerYear.map((yearData) => (
                        <tr key={yearData.year}>
                          <td className="py-2">{yearData.year}</td>
                          <td className="py-2">
                            ₹{formatIndianNumber(yearData.monthlyInvestment)}
                          </td>
                          <td className="py-2">
                            ₹{formatIndianNumber(yearData.yearlyInvestment)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={calculateStepUpSIP.investmentPerYear}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis
                          tickFormatter={(value) => formatIndianNumber(value)}
                        />
                        <Tooltip
                          formatter={(value: number) =>
                            `₹${formatIndianNumber(value)}`
                          }
                        />
                        <Legend />
                        <Bar
                          dataKey="futureValue"
                          fill="#8884d8"
                          name="Future Value"
                        />
                        <Bar
                          dataKey="yearlyInvestment"
                          fill="#82ca9d"
                          name="Yearly Investment"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
