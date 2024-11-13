"use client";

import { useState } from "react";
import { Calculator, DollarSign, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const formatIndianNumber = (num: number) => {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(num);
  
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  return formatted;
};

const COLORS = ['#2563eb', '#22c55e'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow-sm">
        <p className="text-sm">{`${payload[0].name}: ₹${formatIndianNumber(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
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
    let currentInvestment = monthlyInvestment;
    let totalInvestment = 0;

    for (let year = 0; year < timePeriod; year++) {
      for (let month = 0; month < 12; month++) {
        futureValue = (futureValue + currentInvestment) * (1 + monthlyRate);
        totalInvestment += currentInvestment;
      }
      // Increase the monthly investment at the start of each year
      currentInvestment += (currentInvestment * stepUpPercentage) / 100;
    }

    const estimatedReturns = futureValue - totalInvestment;

    return {
      futureValue: Math.round(futureValue),
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
    };
  };

  const results = calculateStepUpSIP();

  const chartData = [
    { name: 'Total Investment', value: results.totalInvestment },
    { name: 'Estimated Returns', value: results.estimatedReturns }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <span className="inline-block mr-3">
              <Calculator className="inline-block w-10 h-10 text-primary" />
            </span>
            Step-Up SIP Calculator
          </h1>
          <p className="text-muted-foreground">
            Plan your financial future with our Step-Up Systematic Investment Plan calculator
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="p-6 shadow-lg lg:col-span-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="monthly-investment">Monthly Investment (₹)</Label>
                <div className="flex gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="step-up">Annual Step-Up (%)</Label>
                <div className="flex gap-4">
                  <Input
                    id="step-up"
                    type="number"
                    value={stepUpPercentage}
                    onChange={(e) => setStepUpPercentage(Number(e.target.value))}
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
                  Your investment will increase by {stepUpPercentage}% every year
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-return">
                  Expected Annual Return (%)
                </Label>
                <div className="flex gap-4">
                  <Input
                    id="expected-return"
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
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

              <div className="space-y-2">
                <Label htmlFor="time-period">Time Period (Years)</Label>
                <div className="flex gap-4">
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

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">Your Final Monthly Investment</h3>
                <p className="text-lg">
                  ₹{formatIndianNumber(monthlyInvestment * Math.pow(1 + stepUpPercentage / 100, timePeriod))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This will be your monthly investment amount in the final year
                </p>
              </div>
            </div>
          </Card>

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
                <DollarSign className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Future Value</h3>
              </div>
              <p className="text-2xl font-bold text-primary">
                ₹{formatIndianNumber(results.futureValue)}
              </p>
            </Card>

            <Card className="p-4 shadow-lg">
              <h3 className="font-semibold mb-4 text-center">Investment Breakdown</h3>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry: any) => (
                        <span className="text-sm">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Note: This calculator provides estimated values based on your inputs.
            The step-up percentage is applied annually to increase your monthly investment.
            Actual returns may vary depending on market conditions.
          </p>
        </div>
      </div>
    </main>
  );
}