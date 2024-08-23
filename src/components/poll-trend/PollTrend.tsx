"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import moment from "moment";

export type VoteData = {
  id: number;
  name: string;
  voting_choice: boolean;
  casted_at: string;
};

type Props = {
  votes: VoteData[];
};

const timeFormatter = (date: string) => {
  return moment(date).utcOffset("+05:30").format("DD-MM-YYYY");
};

const PollTrend: React.FC<Props> = ({ votes }) => {
  // Process data for charts
  const processDataForLineChart = () => {
    const dateCounts: Record<
      string,
      { date: string; true: number; false: number; undecided: number }
    > = {};
    votes &&
      votes.forEach((vote) => {
        if (!dateCounts[timeFormatter(vote.casted_at)]) {
          dateCounts[timeFormatter(vote.casted_at)] = {
            date: timeFormatter(vote.casted_at),
            true: 0,
            false: 0,
            undecided: 0,
          };
        }
        if (vote.voting_choice === true) {
          dateCounts[timeFormatter(vote.casted_at)].true++;
        } else if (vote.voting_choice === false) {
          dateCounts[timeFormatter(vote.casted_at)].false++;
        } else {
          dateCounts[timeFormatter(vote.casted_at)].undecided++;
        }
      });
    return Object.values(dateCounts);
  };

  const processDataForBarChart = () => {
    const counts =
      votes &&
      votes.reduce(
        (acc, vote) => {
          if (vote.voting_choice === true) {
            acc.true++;
          } else if (vote.voting_choice === false) {
            acc.false++;
          }
          return acc;
        },
        { true: 0, false: 0 } as Record<string, number>,
      );
    return [
      { name: "True", votes: counts?.true },
      { name: "False", votes: counts?.false },
    ];
  };

  const lineChartData = processDataForLineChart();
  const barChartData = processDataForBarChart();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Voting Trends</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Votes Cast</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Choice</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {votes &&
                votes.map((vote) => (
                  <TableRow key={vote.id}>
                    <TableCell>{vote.id}</TableCell>
                    <TableCell>{vote.name}</TableCell>
                    <TableCell>
                      {vote.voting_choice === true
                        ? "True"
                        : vote.voting_choice === false
                          ? "False"
                          : "Undecided"}
                    </TableCell>

                    <TableCell>{timeFormatter(vote.casted_at)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Voting Trend Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="true"
                stroke="#8884d8"
                name="True"
              />
              <Line
                type="monotone"
                dataKey="false"
                stroke="#82ca9d"
                name="False"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Overall Voting Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default PollTrend;
