import PollTrend from "@/components/poll-trend/PollTrend";

async function getVotes() {
  try {
    const res = await fetch("http://localhost:3000/api/user", {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch votes");
    }
    const data = await res.json();
    return data.messages[0].users;
  } catch (error) {
    console.error("Failed to fetch voting data:", error);
    return [];
  }
}

export default async function VotingTrendsPageWrapper() {
  const votes = await getVotes();
  return <PollTrend votes={votes} />;
}
