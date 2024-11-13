"use client";

import { useState } from "react";
import { Calculator, DollarSign, TrendingUp, Wallet } from "lucide-react";
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
} from "recharts";
import Image from "next/image";

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

  const calculateStepUpSIP = () => {
    const monthlyRate = expectedReturn / (12 * 100);
    const months = timePeriod * 12;
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
        totalInvestment: Math.round(yearInvestment),
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
  };

  const results = calculateStepUpSIP();

  const chartData = [
    { name: "Total Investment", value: results.totalInvestment },
    { name: "Estimated Returns", value: results.estimatedReturns },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center">
            <Calculator className="w-10 h-10 text-primary mr-3" />
            Step-Up SIP Calculator
          </h1>
          <p className="text-muted-foreground">
            Plan your financial future with our Step-Up Systematic Investment
            Plan calculator
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="p-6 shadow-lg lg:col-span-2">
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
                      setMonthlyInvestment(Number(e.target.value))
                    }
                    className="text-lg"
                  />
                  <Slider
                    value={[monthlyInvestment]}
                    onValueChange={([value]) => setMonthlyInvestment(value)}
                    max={100000}
                    step={500}
                    className="mt-3"
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
                      setStepUpPercentage(Number(e.target.value))
                    }
                    className="text-lg"
                  />
                  <Slider
                    value={[stepUpPercentage]}
                    onValueChange={([value]) => setStepUpPercentage(value)}
                    max={50}
                    step={1}
                    className="mt-3"
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
                      setExpectedReturn(Number(e.target.value))
                    }
                    className="text-lg"
                  />
                  <Slider
                    value={[expectedReturn]}
                    onValueChange={([value]) => setExpectedReturn(value)}
                    max={30}
                    step={0.5}
                    className="mt-3"
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
                    onChange={(e) => setTimePeriod(Number(e.target.value))}
                    className="text-lg"
                  />
                  <Slider
                    value={[timePeriod]}
                    onValueChange={([value]) => setTimePeriod(value)}
                    max={30}
                    step={1}
                    className="mt-3"
                  />
                </div>
              </div>

              {/* Investment Breakdown Table */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-4">
                  Yearly Investment Breakdown
                </h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b py-2">Year</th>
                      <th className="border-b py-2">Monthly Investment (₹)</th>
                      <th className="border-b py-2">Yearly Investment (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.investmentPerYear.map((yearData, index) => (
                      <tr key={index}>
                        <td className="py-2">{yearData.year}</td>
                        <td className="py-2">
                          ₹{formatIndianNumber(yearData.monthlyInvestment)}
                        </td>
                        <td className="py-2">
                          ₹{formatIndianNumber(yearData.totalInvestment)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* Result Cards */}
          <div className="space-y-6">
            <Card className="p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Wallet className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Total Investment</h3>
              </div>
              <p className="text-2xl font-bold text-primary">
                ₹{formatIndianNumber(results.totalInvestment)}
              </p>
            </Card>

            <Card className="p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Estimated Returns</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">
                ₹{formatIndianNumber(results.estimatedReturns)}
              </p>
            </Card>

            <Card className="p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <h3 className="font-semibold">Future Value</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-500">
                ₹{formatIndianNumber(results.futureValue)}
              </p>
            </Card>

            {/* Investment Breakdown Chart */}
            <Card className="p-4 shadow-lg">
              <h3 className="font-semibold mb-4 text-center">
                Investment Breakdown
              </h3>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={CustomLabel}
                      outerRadius={80}
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

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Note: This calculator provides estimated values based on your inputs.
            The step-up percentage is applied annually to increase your monthly
            investment. Actual returns may vary depending on market conditions.
          </p>
        </div>
      </div>
    </main>
  );
}
