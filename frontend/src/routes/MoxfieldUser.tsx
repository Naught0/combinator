import { Loading } from "@/Loading";
import { getMoxfieldUserData } from "@/services";
import { UserDecksContainer } from "@/UserDeck";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router";

export function MoxfieldUser() {
  const { userName } = useParams<{ userName: string }>();
  let navigate = useNavigate();
  if (!userName) {
    navigate("/404");
    return null;
  }
  const { data, isLoading } = useQuery<Deck[], AxiosError>({
    queryKey: ["moxfield-decks", userName],
    queryFn: () => getMoxfieldUserData({ userName }),
  });

  if (isLoading) return <Loading message="Loading decks" />;

  return data && <UserDecksContainer decks={data} />;
}
