import {getPotentialMatches} from "@/lib/actions/matches";
import {useEffect, useState} from "react";
import {UserProfile} from "../profile/page";

export default function MatchesPage() {
  const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const potentialMatches = await getPotentialMatches();
        setPotentialMatches(potentialMatches);
      } catch (error) {
        console.error("Error loading potential matches:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  return (
    <div>
      <h1>Your Matches</h1>
      {/* Render matched profiles here */}
    </div>
  );
}
